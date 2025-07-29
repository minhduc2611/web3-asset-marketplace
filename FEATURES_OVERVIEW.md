# MindGraph Platform - Features Overview

**Motto:** Build lasting knowledge!

MindGraph is a comprehensive learning platform that combines AI-powered mind mapping with intelligent flashcard creation. The platform consists of two main apps working together to help users build and retain knowledge effectively.

## 🎯 Platform Overview

MindGraph integrates two powerful learning tools:
- **Keyword Explorer**: AI-powered mind mapping and knowledge visualization
- **Flashcard Studio**: Intelligent spaced repetition learning system

Both apps work seamlessly together, allowing users to generate flashcards from mind map nodes and create comprehensive learning experiences.

## 📱 Main Applications

### 1. Keyword Explorer (Mind Mapping)
Interactive AI-powered mind mapping tool for knowledge visualization and exploration.

### 2. Flashcard Studio (Collections) 
Advanced flashcard creation and learning system with spaced repetition algorithms.

## 🔧 Core Platform Features

### Authentication & User Management
- User registration with email verification
- Login with email/password
- Google OAuth integration
- Password reset functionality
- User profiles and avatars

### Payment & Subscription System
- Stripe integration for secure payments
- Three-tier pricing: Starter (Free), Premium ($9.99/month), Diamond ($24.99/month)
- Monthly and yearly billing options
- Subscription management and webhooks
- Payment success handling

### Marketplace & Sharing
- Public marketplace for flashcard collections
- Collection publishing and discovery
- Download and share collections
- Rating and review system
- Tag-based categorization

### AI & Search Integration
- OpenAI GPT-4 integration for content generation
- Tavily web search API for real-time information
- AI-powered keyword generation
- Intelligent content creation

### User Interface & Experience
- Modern responsive design with Tailwind CSS
- Dark/light theme support
- Mobile-friendly interface
- Animated interactions with Framer Motion
- Loading states and error handling

### Data Storage & Management
- Supabase for user authentication and data
- Neo4j graph database for mind map relationships
- Real-time data synchronization
- Efficient query optimization

## 📊 Usage Limits by Plan

### Starter (Free)
- 2 canvases (max 70 nodes each)
- 2 flashcard collections (up to 50 cards each)

### Premium ($9.99/month)
- 10 canvases (100 nodes each)
- 10 flashcard collections (150 cards each)
- Access to all online course modules
- Email support

### Diamond ($24.99/month)
- Unlimited canvases & collections
- Early access to new features
- Priority support (chat/video)
- Exclusive webinars & certificates

## 🛠 Technical Stack

**Frontend:**
- Next.js 15 with TypeScript
- React 19 with Hooks
- Tailwind CSS for styling
- Framer Motion for animations
- Radix UI components

**Backend:**
- Next.js API routes
- Supabase for authentication
- Neo4j for graph data
- Stripe for payments

**AI & External Services:**
- OpenAI GPT-4 for content generation
- Tavily for web search
- Notion API integration

**Development:**
- ESLint for code quality
- Yarn for package management
- TypeScript for type safety 