# API Endpoints Documentation

This document lists all the API endpoints in the application for migration to other languages.

## Base URL
- Development: `http://localhost:8080`
- Production: `process.env.NEXT_PUBLIC_API_URL`

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All endpoints follow this response format:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 20,
    "current_page": 3,
    "total_pages": 15,
    "has_next": true,
    "has_previous": true
  }
}
```

---

## Text Processing

### POST /api/beautify-text
**Description**: Beautifies and improves text readability using AI

**Request Body**:
```json
{
  "text": "string (max 50,000 characters)"
}
```

**Response**:
```json
{
  "beautifiedText": "string",
  "originalLength": 1234,
  "beautifiedLength": 1234
}
```

**Error Responses**:
- `400`: Text is required or too long
- `500`: Internal server error

---

## Chat & AI

### POST /api/chat
**Description**: Streaming chat endpoint with document and web search context

**Request Body**:
```json
{
  "message": "string"
}
```

**Response**: Server-Sent Events (SSE) stream with:
- `sources`: Document and web search results
- `content`: AI response chunks
- `end`: Completion signal
- `error`: Error message

**Features**:
- Searches user documents via Weaviate
- Web search via Tavily
- Streaming AI responses
- Context-aware responses

---

## Canvas Management

### POST /api/canvas
**Description**: Create a new canvas

**Request Body**:
```json
{
  "name": "string",
  "authorId": "string"
}
```

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "authorId": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### GET /api/canvas/[canvasId]
**Description**: Get canvas by ID

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "authorId": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "systemInstruction": "string"
}
```

### PUT /api/canvas/[canvasId]
**Description**: Update canvas

**Request Body**:
```json
{
  "name": "string",
  "systemInstruction": "string"
}
```

### GET /api/canvas/author/[authorId]
**Description**: Get all canvases by author

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "authorId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### GET /api/canvas/graph-data/[canvasId]
**Description**: Get graph data for canvas

**Response**:
```json
{
  "nodes": [...],
  "edges": [...]
}
```

---

## Node Management

### POST /api/node
**Description**: Create a new node/topic

**Request Body**:
```json
{
  "name": "string",
  "canvasId": "string",
  "parentNodeId": "string (optional)",
  "description": "string (optional)"
}
```

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "type": "original" | "generated"
}
```

### GET /api/node/[nodeId]
**Description**: Get node by ID

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "knowledge": "string",
  "type": "original" | "generated"
}
```

### PUT /api/node/[nodeId]
**Description**: Update node

**Request Body**:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "knowledge": "string (optional)"
}
```

### DELETE /api/node/[nodeId]
**Description**: Delete node and its relationships

**Response**:
```json
{
  "message": "Successfully deleted node"
}
```

---

## Document Processing

### POST /api/parse-document
**Description**: Parse PDF or DOCX files

**Request**: FormData with file

**Supported Files**:
- PDF (application/pdf)
- DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- DOC (application/msword)

**Response**:
```json
{
  "text": "string",
  "filename": "string",
  "fileType": "pdf" | "docx",
  "wordCount": 1234,
  "success": true
}
```

### POST /api/save-chunks
**Description**: Save document chunks to Weaviate

**Request Body**:
```json
{
  "filename": "string",
  "canvasId": "string",
  "chunks": [
    {
      "id": "string",
      "name": "string",
      "text": "string",
      "description": "string"
    }
  ],
  "metadata": {
    "createdAt": "date"
  }
}
```

**Response**:
```json
{
  "message": "Chunks saved successfully",
  "chunksCount": 123,
  "filename": "string"
}
```

---

## AI Generation

### POST /api/generate-keywords
**Description**: Generate keywords for a topic using AI

**Request Body**:
```json
{
  "name": "string",
  "canvasId": "string",
  "nodeCount": 3,
  "isAutomatic": false
}
```

**Response**:
```json
{
  "keywords": [
    {
      "id": "string",
      "name": "string",
      "type": "original" | "generated"
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "string",
      "target": "string"
    }
  ]
}
```

### POST /api/generate-bulk-flashcards
**Description**: Generate educational flashcards

**Request Body**:
```json
{
  "prompt": "string",
  "count": 5
}
```

**Response**:
```json
{
  "flashcards": [
    {
      "front": "string",
      "back": "string"
    }
  ],
  "count": 5,
  "generated_by": "AI"
}
```

---

## Search & Research

### POST /api/google-search
**Description**: Perform web search with AI analysis

**Request Body**:
```json
{
  "query": "string",
  "canvasId": "string"
}
```

**Response**:
```json
{
  "searchResults": [],
  "geminiAnswer": "",
  "nodeId": "string",
  "status": "processing",
  "message": "string",
  "estimatedCompletionTime": 60
}
```

### GET /api/google-search?nodeId=[nodeId]
**Description**: Check search status

**Response**:
```json
{
  "nodeId": "string",
  "status": "idle" | "processing" | "completed" | "failed",
  "searchData": {...},
  "error": "string"
}
```

---

## Payment & Subscription

### POST /api/checkout
**Description**: Create Stripe checkout session (legacy)

**Response**:
```json
{
  "sessionId": "string"
}
```

### POST /api/create-checkout-session
**Description**: Create Stripe checkout session

**Request Body**:
```json
{
  "plan": "premium" | "diamond",
  "isYearly": true,
  "userId": "string"
}
```

**Response**:
```json
{
  "sessionId": "string",
  "url": "string"
}
```

### GET /api/verify-payment?session_id=[sessionId]
**Description**: Verify payment completion

**Response**:
```json
{
  "success": true,
  "subscriptionId": "string",
  "customerId": "string",
  "plan": "string",
  "isYearly": true
}
```

### POST /api/stripe/webhook
**Description**: Stripe webhook handler

**Headers**:
```
stripe-signature: string
```

**Events Handled**:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Feedback

### POST /api/feedback/submit
**Description**: Submit user feedback

**Request**: FormData with:
- `rating`: number
- `category`: string
- `message`: string
- `email`: string (optional)
- `userAgent`: string (optional)
- `currentRoute`: string (optional)
- `file_*`: File (optional)

**Response**:
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "notionPageId": "string",
  "filesUploaded": 0,
  "fileUrls": [...]
}
```

---

## Health & Monitoring

### GET /api/health/neo4j
**Description**: Check Neo4j database health

**Response**:
```json
{
  "status": "healthy" | "unhealthy",
  "details": "string"
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "error_type",
  "success": false
}
```

Common HTTP Status Codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (redirects to login)
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (e.g., duplicate resource)
- `422`: Unprocessable Entity
- `500`: Internal Server Error

---

## Environment Variables Required

```
NEXT_PUBLIC_API_URL=http://localhost:8080
OPENAI_API_KEY=your_openai_key
TAVILY_API_KEY=your_tavily_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PREMIUM_PRICE_ID=your_price_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Dependencies

- **Neo4j**: Graph database for canvas and node management
- **Weaviate**: Vector database for document search
- **Supabase**: User authentication and storage
- **Notion**: Feedback storage
- **Stripe**: Payment processing

---

## External Services

- **OpenAI**: AI text generation and analysis
- **Tavily**: Web search API
- **Stripe**: Payment processing
- **Notion**: Feedback management 