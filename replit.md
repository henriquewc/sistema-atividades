# Sistema de Acompanhamento de Atividades

## Overview

A comprehensive activity tracking system designed for team management with client activity monitoring, deadline tracking, and reporting capabilities. The application manages monthly and annual activities with visual status indicators, deadline alerts, and client history tracking. Built with a modern tech stack featuring React frontend, Express backend, and PostgreSQL database with a focus on productivity and clean UI design following Fluent Design principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Context-based authentication with localStorage persistence
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system based on Fluent Design principles
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Theme**: Light/dark mode support with CSS custom properties

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with JSON responses
- **Validation**: Zod schemas for request/response validation
- **Storage**: In-memory storage implementation (MemStorage) with interface for future database integration

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Three main entities - clients, activities, and attachments
- **Migrations**: Drizzle-kit for database migrations

### Design System
- **Approach**: Utility-focused design following Fluent Design principles adapted for minimalism
- **Typography**: Inter font from Google Fonts with weight-based hierarchy
- **Color Palette**: Orange primary (25 95% 53%), Green success (142 76% 41%), Gray neutral (220 9% 46%)
- **Status System**: Visual status indicators for activity states (em_dia, vencimento_proximo, atrasada, concluida)
- **Components**: Comprehensive UI component library with consistent spacing and elevation

### Key Features
- **Authentication**: Simple login system with hardcoded credentials (admin/admin123)
- **Dashboard**: Activity overview with statistical cards and quick actions
- **Activity Management**: Create, edit, and track activities with recurrence patterns
- **Client Management**: Complete client information with CPF/CNPJ validation and activity history
- **Status Tracking**: Visual status badges with automatic deadline calculations
- **Reporting**: Configurable report generation with date range filters
- **Responsive Design**: Mobile-optimized interface with sidebar navigation

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Validation resolvers for React Hook Form

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Utility for managing component variants
- **tailwindcss**: Utility-first CSS framework
- **clsx**: Conditional className utility

### Development Tools
- **vite**: Fast development server and build tool
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **drizzle-kit**: Database migration and management tool

### Additional Utilities
- **date-fns**: Date manipulation library with Brazilian Portuguese locale
- **wouter**: Lightweight routing for React
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel component implementation