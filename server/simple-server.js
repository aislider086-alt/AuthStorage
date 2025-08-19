import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, '../dist/public')));

// Mock API endpoints for development
app.get('/api/auth/user', (req, res) => {
  res.json({
    id: 'dev-user-123',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    role: 'admin'
  });
});

// Projects API
app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Sample Project',
      description: 'A sample project for development',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]);
});

app.post('/api/projects', (req, res) => {
  const { name, description, industry, objectives, targetAudience, startDate, deadline } = req.body;
  
  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  // Create mock project
  const newProject = {
    id: Date.now().toString(),
    name,
    description: description || '',
    industry: industry || '',
    objectives: objectives || '',
    targetAudience: targetAudience || '',
    startDate: startDate || new Date().toISOString(),
    deadline: deadline || null,
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'dev-user-123'
  };

  console.log('Created project:', newProject);
  res.status(201).json(newProject);
});

app.get('/api/projects/:id', (req, res) => {
  const project = {
    id: req.params.id,
    name: 'Sample Project',
    description: 'A sample project for development',
    status: 'active',
    progress: 75,
    createdAt: new Date().toISOString()
  };
  res.json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const updatedProject = {
    id: req.params.id,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(updatedProject);
});

app.delete('/api/projects/:id', (req, res) => {
  res.json({ message: 'Project deleted successfully' });
});

// Analytics API
app.get('/api/analytics/stats', (req, res) => {
  res.json({
    totalProjects: 5,
    activeProjects: 3,
    completedProjects: 2,
    totalUsers: 10
  });
});

// Contact API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const submission = {
    id: Date.now().toString(),
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  console.log('Contact submission:', submission);
  res.status(201).json({ message: 'Contact form submitted successfully', id: submission.id });
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AuthStorage server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
