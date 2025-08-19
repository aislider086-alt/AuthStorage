import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // "user", "admin"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status").default("planning"), // "planning", "active", "review", "completed", "archived"
  progress: integer("progress").default(0), // 0-100
  brandName: varchar("brand_name", { length: 255 }),
  brandDescription: text("brand_description"),
  industry: varchar("industry", { length: 100 }),
  objectives: text("objectives"),
  targetAudience: text("target_audience"),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project assets table
export const projectAssets = pgTable("project_assets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: 'cascade' }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size"),
  fileType: varchar("file_type", { length: 50 }),
  filePath: varchar("file_path", { length: 500 }),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Project team members
export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  role: varchar("role").default("member"), // "owner", "admin", "member"
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  subject: varchar("subject", { length: 100 }).notNull(),
  message: text("message").notNull(),
  newsletter: boolean("newsletter").default(false),
  status: varchar("status").default("new"), // "new", "replied", "closed"
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics events
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id),
  eventType: varchar("event_type", { length: 100 }).notNull(), // "project_created", "project_completed", "asset_uploaded", etc.
  eventData: jsonb("event_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  projectMemberships: many(projectMembers),
  uploadedAssets: many(projectAssets),
  analyticsEvents: many(analyticsEvents),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  assets: many(projectAssets),
  members: many(projectMembers),
  analyticsEvents: many(analyticsEvents),
}));

export const projectAssetsRelations = relations(projectAssets, ({ one }) => ({
  project: one(projects, {
    fields: [projectAssets.projectId],
    references: [projects.id],
  }),
  uploader: one(users, {
    fields: [projectAssets.uploadedBy],
    references: [users.id],
  }),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  user: one(users, {
    fields: [analyticsEvents.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [analyticsEvents.projectId],
    references: [projects.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Project name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
});

export const insertProjectAssetSchema = createInsertSchema(projectAssets).omit({
  id: true,
  uploadedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProjectAsset = z.infer<typeof insertProjectAssetSchema>;
export type ProjectAsset = typeof projectAssets.$inferSelect;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
