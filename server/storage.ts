import {
  users,
  projects,
  projectAssets,
  projectMembers,
  contactSubmissions,
  analyticsEvents,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type ProjectAsset,
  type InsertProjectAsset,
  type ProjectMember,
  type ContactSubmission,
  type InsertContactSubmission,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, avg, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getUserProjects(userId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Project asset operations
  createProjectAsset(asset: InsertProjectAsset): Promise<ProjectAsset>;
  getProjectAssets(projectId: string): Promise<ProjectAsset[]>;
  deleteProjectAsset(id: string): Promise<void>;
  
  // Project member operations
  addProjectMember(projectId: string, userId: string, role?: string): Promise<ProjectMember>;
  getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]>;
  removeProjectMember(projectId: string, userId: string): Promise<void>;
  
  // Contact form operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  updateContactSubmissionStatus(id: string, status: string): Promise<void>;
  
  // Analytics operations
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(userId?: string, projectId?: string): Promise<AnalyticsEvent[]>;
  getProjectStats(userId?: string): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    avgCompletionTime: number;
  }>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    
    // Add creator as project owner
    if (project.createdBy) {
      await this.addProjectMember(newProject.id, project.createdBy, "owner");
    }
    
    // Create analytics event
    await this.createAnalyticsEvent({
      userId: project.createdBy,
      projectId: newProject.id,
      eventType: "project_created",
      eventData: { projectName: project.name },
    });
    
    return newProject;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        progress: projects.progress,
        brandName: projects.brandName,
        brandDescription: projects.brandDescription,
        industry: projects.industry,
        objectives: projects.objectives,
        targetAudience: projects.targetAudience,
        startDate: projects.startDate,
        deadline: projects.deadline,
        createdBy: projects.createdBy,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
      .where(eq(projectMembers.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Project asset operations
  async createProjectAsset(asset: InsertProjectAsset): Promise<ProjectAsset> {
    const [newAsset] = await db
      .insert(projectAssets)
      .values(asset)
      .returning();
    
    // Create analytics event
    await this.createAnalyticsEvent({
      userId: asset.uploadedBy,
      projectId: asset.projectId,
      eventType: "asset_uploaded",
      eventData: { fileName: asset.fileName, fileType: asset.fileType },
    });
    
    return newAsset;
  }

  async getProjectAssets(projectId: string): Promise<ProjectAsset[]> {
    return await db
      .select()
      .from(projectAssets)
      .where(eq(projectAssets.projectId, projectId))
      .orderBy(desc(projectAssets.uploadedAt));
  }

  async deleteProjectAsset(id: string): Promise<void> {
    await db.delete(projectAssets).where(eq(projectAssets.id, id));
  }

  // Project member operations
  async addProjectMember(projectId: string, userId: string, role: string = "member"): Promise<ProjectMember> {
    const [member] = await db
      .insert(projectMembers)
      .values({ projectId, userId, role })
      .returning();
    return member;
  }

  async getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]> {
    return await db
      .select({
        id: projectMembers.id,
        projectId: projectMembers.projectId,
        userId: projectMembers.userId,
        role: projectMembers.role,
        joinedAt: projectMembers.joinedAt,
        user: users,
      })
      .from(projectMembers)
      .innerJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.projectId, projectId));
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await db
      .delete(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
  }

  // Contact form operations
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<void> {
    await db
      .update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id));
  }

  // Analytics operations
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db
      .insert(analyticsEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getAnalyticsEvents(userId?: string, projectId?: string): Promise<AnalyticsEvent[]> {
    const conditions = [];
    
    if (userId) {
      conditions.push(eq(analyticsEvents.userId, userId));
    }
    if (projectId) {
      conditions.push(eq(analyticsEvents.projectId, projectId));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(analyticsEvents)
        .where(and(...conditions))
        .orderBy(desc(analyticsEvents.createdAt));
    } else {
      return await db
        .select()
        .from(analyticsEvents)
        .orderBy(desc(analyticsEvents.createdAt));
    }
  }

  async getProjectStats(userId?: string): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    avgCompletionTime: number;
  }> {
    if (userId) {
      // User-specific stats
      const [totalResult] = await db
        .select({ count: count() })
        .from(projects)
        .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
        .where(eq(projectMembers.userId, userId));

      const [activeResult] = await db
        .select({ count: count() })
        .from(projects)
        .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
        .where(and(eq(projectMembers.userId, userId), eq(projects.status, 'active')));

      const [completedResult] = await db
        .select({ count: count() })
        .from(projects)
        .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
        .where(and(eq(projectMembers.userId, userId), eq(projects.status, 'completed')));

      return {
        totalProjects: totalResult?.count || 0,
        activeProjects: activeResult?.count || 0,
        completedProjects: completedResult?.count || 0,
        avgCompletionTime: 12.5,
      };
    } else {
      // Admin stats - all projects
      const [totalResult] = await db
        .select({ count: count() })
        .from(projects);

      const [activeResult] = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.status, 'active'));

      const [completedResult] = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.status, 'completed'));

      return {
        totalProjects: totalResult?.count || 0,
        activeProjects: activeResult?.count || 0,
        completedProjects: completedResult?.count || 0,
        avgCompletionTime: 12.5,
      };
    }
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
