# 🌊 Dampe - AI-Powered Cloud Storage Platform

> *"Store Here, Access Anywhere - Powered by AI"*  

## Overview

Dampe is a modern, intelligent cloud storage platform that combines secure file storage with AI-powered analysis. Built with cutting-edge technologies, it offers seamless file management, smart content analysis, and universal accessibility through your Gmail account.

## Key Features

### **Secure Authentication**
- Gmail-based OAuth integration
- GitHub social login support
- Email/password authentication with Better Auth

### **Intelligent Cloud Storage**
- Secure file upload and management
- AWS S3-compatible storage with Cloudflare R2
- Real-time file organization and categorization

### **AI-Powered Analysis**
- **Document Intelligence**: Automatic text extraction and summarization
- **Image Recognition**: OCR, object detection, and color analysis
- **Smart Categorization**: AI-driven file organization and tagging
- **Content Search**: Search files by content, not just names

### **Advanced Dashboard**
- Interactive file management table
- Real-time upload progress tracking
- File analytics and insights
- Responsive design for all devices

### **Modern UI/UX**
- Beautiful animated cloud backgrounds
- Dark/light theme support
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion

## Tech Stack

### **Frontend**
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.13 with custom animations
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation

### **Backend & Database**
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with migrations
- **Authentication**: Better Auth with social providers

### **AI & Machine Learning**
- **Text Analysis**: Groq SDK for document processing
- **Image Processing**: Hugging Face Transformers
- **Text Extraction from PDF**: Used gemini-2.5-flash for PDF-Text Extraction
- **OCR**: Xenova Transformers for text extraction
- **File Parsing**: Mammoth (DOCX)

### **Cloud Infrastructure**
- **File Storage**: AWS S3 SDK with Cloudflare R2
- **CDN**: Cloudflare integration
- **Deployment**: Vercel-ready configuration

### **Development Tools**
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint with Next.js config
- **Package Manager**: Bun/PNPM support
- **Type Safety**: Full TypeScript coverage

## Project Structure

```
dampe/
├── src/
│   ├── app/               
│   │   ├── (auth)/          
│   │   ├── api/              
│   │   ├── dashboard/         
│   │   └── settings/           
│   ├── components/           
│   │   ├── dashboard/         
│   │   ├── ui/               
│   │   └── FileAnalysis.tsx  
│   ├── db/                  
│   ├── lib/                 
│   ├── hooks/                
│   └── types/                
├── drizzle/                 
└── public/                 
```

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- AWS S3 or Cloudflare R2 bucket
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/quantinium3/dampe.git
cd dampe
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env

DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

R2_TOKEN_VALUE=
R2_ACCESS_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET=
GROQ_API_KEY=

```

4. **Database Setup**
```bash
bun run db:push
# or
npm run db:push
```

5. **Start Development Server**
```bash
bun dev
# or
npm run dev
```

Visit `http://localhost:3000` to see your application running!


### File Upload & Management
- Drag-and-drop file uploads
- Progress tracking with real-time updates
- File type validation and size limits
- Bulk operations (delete, analyze)

### AI Analysis Engine
- **Text Documents**: Summarization, keyword extraction, topic modeling
- **Images**: Object detection, OCR, color analysis, safety detection
- **PDFs**: Text extraction, metadata analysis
- **Office Documents**: Content parsing and analysis

### Search & Discovery
- Full-text search across all file contents
- AI-powered semantic search
- Filter by file type, date, size
- Tag-based organization

## Security Features

- **Authentication**: Multi-provider OAuth with Better Auth
- **File Security**: Signed URLs for secure file access
- **Data Protection**: Encrypted storage with AWS S3/R2
- **Privacy**: User data isolation and GDPR compliance

## UI Components

Built with modern design principles:
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Theme Support**: Dark/light mode toggle
- **Animations**: Smooth transitions and micro-interactions

## Performance

- **Fast Loading**: Turbopack for lightning-fast builds
- **Optimized Images**: Next.js Image optimization
- **Lazy Loading**: Component-level code splitting
- **Optimized Fetching**: Custom hooks for efficient data management


---
