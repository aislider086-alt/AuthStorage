# CreativeFlow - Project Management Platform

## Overview

CreativeFlow is a comprehensive business/project management platform tailored for creative agencies and brand-focused teams. The application streamlines project creation, asset management, and collaboration through a modern React frontend and Express.js backend with PostgreSQL database storage via Neon.

The platform features multi-step project creation wizards, real-time dashboards, admin controls, analytics reporting, and secure authentication. It's designed to solve workflow challenges for creative teams by providing centralized asset organization, secure file sharing, project tracking, and team collaboration tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Routing**: Wouter for client-side routing with protected routes based on authentication status
- **State Management**: TanStack Query (React Query) for server state management with custom query client
- **Form Handling**: React Hook Form with Zod validation schemas
- **File Structure**: Organized by feature domains (components, pages, hooks, lib) with shared utilities

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Design**: RESTful API endpoints with middleware for authentication, logging, and error handling
- **File Structure**: Modular structure separating routes, storage layer, and database configuration
- **Session Management**: Express sessions with PostgreSQL session store for persistent user sessions

### Authentication & Authorization
- **Primary Method**: Replit OpenID Connect (OIDC) authentication with passport.js
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Role-based Access**: User roles (user/admin) with different permission levels
- **Protected Routes**: Frontend route protection based on authentication status and user roles

### Database Schema Design
- **Users Table**: Stores user profiles with OIDC integration fields
- **Projects Table**: Comprehensive project data including brand information, objectives, and status tracking
- **Project Assets**: File metadata and relationships to projects
- **Project Members**: Many-to-many relationship for team collaboration
- **Contact Submissions**: Customer inquiry management
- **Analytics Events**: User behavior and project metrics tracking
- **Sessions Table**: Secure session persistence

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon cloud service with connection pooling
- **File Storage**: Prepared for AWS S3 or Google Cloud integration for asset uploads
- **Session Storage**: Database-backed sessions for security and scalability
- **Schema Management**: Drizzle migrations for version-controlled database changes

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Replit Authentication**: OpenID Connect provider for secure user authentication

### UI & Design Libraries
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **shadcn/ui**: Pre-built component library built on Radix UI with Tailwind styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool and development server with React plugin
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database migration and schema management tools
- **ESBuild**: Production bundling for server-side code

### Data Management
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting utilities

### Planned Integrations
- **Chart.js/D3/Recharts**: Analytics visualization and reporting dashboards
- **AWS S3/Google Cloud**: Cloud storage for file uploads and asset management
- **WebSockets**: Real-time collaboration features and live updates
- **OAuth Providers**: Google and GitHub authentication for enhanced login options