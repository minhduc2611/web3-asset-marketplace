# App: Keyword Explorer (Mind Mapping)

## Overview
Keyword Explorer is an AI-powered mind mapping tool that helps users visualize knowledge, explore topics, and create interactive knowledge graphs. It uses advanced graph layouts and AI integration to generate meaningful connections between concepts.

## Features:

### 🎨 Interactive Mind Map Canvas
- **Visual Node-Based Interface**: Interactive cytoscape.js powered graph visualization
- **Smart Layouts**: Automatic mind map layout with collision detection and proper spacing
- **Node Types**: Support for original and AI-generated nodes with different visual styles
- **Real-time Updates**: Dynamic graph updates and responsive interactions
- **Zoom & Pan**: Full canvas navigation with fit-to-view functionality

### 🤖 AI-Powered Keyword Generation
- **Right-click Context Menu**: Generate keywords from any node via context menu
- **Smart Keyword Suggestions**: AI analyzes hierarchical context and existing relationships
- **Automatic Mode**: AI determines optimal number of keywords (max 15) based on topic complexity
- **Manual Mode**: User specifies exact number of keywords to generate (up to 10)
- **Context-Aware Generation**: Uses topic path, siblings, and children for better suggestions

### 🔍 Integrated Web Search & Research
- **Google Search Integration**: Right-click → "Search and Generate Article"
- **Real-time Web Results**: Tavily API integration for current information
- **AI Analysis**: Gemini-powered analysis of search results
- **System Instruction Support**: Custom AI instructions for targeted research
- **Search Result Previews**: Modal display of search results and AI insights

### ✏️ Node Management & Editing
- **Node Editing**: Right-click → "Edit" for name and description modification
- **Rich Descriptions**: Markdown support for detailed node information
- **Progress Tracking**: Track learning progress and video creation status
- **Knowledge Storage**: Store comprehensive knowledge about each concept
- **Visual Indicators**: Different node styles for nodes with descriptions/knowledge

### 📚 Flashcard Generation
- **Direct Integration**: Generate flashcards from any node via right-click
- **AI-Powered Creation**: Intelligent flashcard generation based on node content
- **Bulk Generation**: Create multiple flashcards from single nodes
- **Cross-Platform**: Seamlessly integrates with Flashcard Studio

### 🌳 Advanced Node Relationships
- **Hierarchical Structure**: Parent-child relationships with visual connections
- **Sub-node Creation**: Add child nodes to create knowledge hierarchies
- **Sibling Awareness**: AI considers existing related nodes for better suggestions
- **Graph Traversal**: Navigate through complex knowledge networks

### ⚙️ Canvas Configuration
- **Custom System Instructions**: Define AI behavior for specific domains
- **Canvas Settings**: Configurable canvas name and behavior
- **Multi-Canvas Support**: Create multiple knowledge maps for different topics
- **Persistent Storage**: Save and restore canvas state

### 🎯 Interactive Features
- **Node Selection**: Click nodes to select and highlight
- **Context Menus**: Rich right-click menus with contextual actions
- **Modal Dialogs**: Comprehensive editing and configuration interfaces
- **Touch Support**: Mobile-friendly touch interactions
- **Keyboard Shortcuts**: Efficient navigation and actions

### 🔄 Real-time Collaboration Features
- **Live Updates**: Real-time synchronization across sessions
- **Conflict Resolution**: Handle concurrent edits gracefully
- **Version History**: Track changes and modifications

### 📊 Visual Enhancements
- **Smart Positioning**: Collision detection prevents node overlap
- **Color Coding**: Different colors for node types and states
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Design**: Adapts to different screen sizes
- **Loading States**: Visual feedback during AI operations

### 🧠 Memory System
- **Memory Viewer**: Built-in component for knowledge tracking
- **Context Preservation**: Maintain conversation context across sessions
- **Learning Analytics**: Track knowledge building progress

## Technical Implementation

### Core Technologies
- **Cytoscape.js**: Graph visualization and layout engine
- **Neo4j**: Graph database for persistent node relationships
- **OpenAI GPT-4**: AI-powered content generation
- **Tavily API**: Real-time web search capabilities
- **React Query**: State management and data fetching

### API Endpoints
- `/api/canvas` - Canvas CRUD operations
- `/api/canvas/graph-data/[canvasId]` - Graph data retrieval
- `/api/generate-keywords` - AI keyword generation
- `/api/google-search` - Web search and AI analysis
- `/api/node` - Node management operations

### Key Components
- `GraphCanvas` - Main mind map visualization component
- Modal system for editing and configuration
- Context menu system for node interactions
- AI integration services

## User Workflows

### Creating a New Mind Map
1. Create new canvas with name and system instruction
2. Add initial topic/keyword node
3. Use AI generation to expand the mind map
4. Edit and refine nodes with descriptions and knowledge

### Exploring Topics
1. Right-click on any node
2. Generate related keywords using AI
3. Search and analyze topics with web integration
4. Build comprehensive knowledge networks

### Converting to Flashcards
1. Select nodes with rich content
2. Generate flashcards from node knowledge
3. Transfer to Flashcard Studio for learning
4. Create comprehensive study materials

## Integration Points

### With Flashcard Studio
- One-click flashcard generation from nodes
- Shared AI content generation
- Cross-app learning workflows

### With External Services
- Web search for real-time information
- AI analysis and content generation
- Cloud storage and synchronization 