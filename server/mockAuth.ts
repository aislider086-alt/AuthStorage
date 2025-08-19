import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function setupAuth(app: Express) {
  // Use memory store for development
  const sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

  app.use(session({
    secret: 'dev-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow HTTP in development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Mock authentication routes for development
  app.get("/api/login", (req, res) => {
    // Mock user session
    (req.session as any).user = {
      claims: {
        sub: "dev-user-123",
        email: "dev@example.com",
        first_name: "Dev",
        last_name: "User"
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // Mock isAuthenticated check
  app.use((req: any, res, next) => {
    req.isAuthenticated = () => !!(req.session as any)?.user;
    req.user = (req.session as any)?.user;
    next();
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (!req.isAuthenticated() || !req.user?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
