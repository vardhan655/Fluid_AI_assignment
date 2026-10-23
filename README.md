# 🚀 Full-Stack Task Board Application

A production-ready, feature-rich task management application built for Fluid AI's senior technical assessment. This application showcases advanced full-stack development skills with AI-powered features, beautiful UI/UX, and clean architecture.

## ✨ Standout Features

### 🤖 AI-Powered Task Breakdown
- Automatically decompose high-level tasks into actionable sub-tasks
- Mock LLM integration demonstrating AI workflow readiness
- Sub-task progress tracking with interactive checkboxes

### 📊 Interactive Kanban & Priority Matrix View
- Toggle between List View and Visual Kanban Board
- Group tasks by Priority (High/Medium/Low) or Status
- Drag-and-drop support (visual organization)

### 🔍 Advanced Filtering & Search
- Real-time debounced search across task titles and descriptions
- Instant filter pills for category and status
- Combined filtering with visual feedback

### 🎨 Delightful UX
- Smooth animations with Framer Motion
- Toast notifications for all actions
- Empty states with engaging graphics
- Complete keyboard accessibility (Enter to submit, Escape to cancel)
- Responsive design for all screen sizes

### 📈 Real-Time Progress Tracking
- Animated circular progress indicator
- Total tasks, completed, and remaining counters
- Visual completion percentage

## 🛠️ Technology Stack

### Backend
- **FastAPI** (Python 3.10+) with async/await support
- **Pydantic v2** for robust data validation
- **Thread-safe** in-memory storage with JSON persistence
- Clean dependency injection and service layer pattern

### Frontend
- **React 18** with Vite for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **Lucide React** for crisp, modern icons
- **Framer Motion** for smooth animations and micro-interactions
- **Axios** for API communication

## 📁 Project Structure

```
fluid_ai_assignment/
├── backend/
│   ├── main.py              # FastAPI application & routes
│   ├── models.py            # Data models & storage
│   ├── schemas.py           # Pydantic validation schemas
│   ├── services.py          # Business logic & AI service
│   ├── requirements.txt     # Python dependencies
│   └── tasks.json          # Persistent storage
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskInput.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── Toast.jsx
│   │   ├── services/       # API client
│   │   │   └── api.js
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📡 API Documentation

### Endpoints

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project proposal",
  "description": "Draft and finalize the Q4 project proposal",
  "priority": "high",
  "category": "work",
  "dueDate": "2026-10-30"
}
```

#### Get All Tasks
```http
GET /api/tasks?completed=false&priority=high&category=work
```

Query Parameters:
- `completed`: Filter by completion status (true/false)
- `priority`: Filter by priority (high/medium/low)
- `category`: Filter by category (work/personal/shopping/health/other)

#### Update Task
```http
PATCH /api/tasks/{id}
Content-Type: application/json

{
  "completed": true,
  "title": "Updated title"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
```

#### AI Task Breakdown
```http
POST /api/tasks/{id}/breakdown
```

Returns:
```json
{
  "taskId": "uuid",
  "subTasks": [
    {
      "id": "uuid",
      "title": "Research requirements",
      "completed": false
    },
    ...
  ]
}
```

## 🎯 Key Features Breakdown

### 1. Task Management Core
- **CRUD Operations**: Full create, read, update, delete functionality
- **Data Validation**: Pydantic schemas ensure data integrity
- **Persistence**: Thread-safe JSON file storage with automatic recovery
- **Error Handling**: Comprehensive error messages and status codes

### 2. AI-Powered Intelligence
- **Task Breakdown**: Click the "🤖 AI Breakdown" button to decompose complex tasks
- **Smart Sub-tasks**: Automatically generates 3 actionable sub-tasks
- **Progress Tracking**: Each sub-task has its own completion checkbox
- **Mock LLM Service**: Demonstrates production-ready AI integration patterns

### 3. Advanced Filtering
- **Text Search**: Debounced real-time search (300ms delay)
- **Category Filters**: Quick-select pills for all categories
- **Status Filters**: All/Active/Completed views
- **Priority Filters**: High/Medium/Low priority filtering
- **Combined Filters**: All filters work together seamlessly

### 4. View Modes
- **List View**: Clean, scannable task list with all details
- **Kanban Board**: Visual board grouped by priority or status
- **Responsive Layout**: Works beautifully on desktop, tablet, and mobile

### 5. User Experience Excellence
- **Keyboard Shortcuts**: 
  - `Enter` to submit new tasks
  - `Escape` to cancel editing
  - Full keyboard navigation support
- **Animations**: 
  - Smooth entry/exit animations
  - Progress bar transitions
  - Hover states and micro-interactions
- **Toast Notifications**: Success/error feedback for all actions
- **Empty States**: Engaging graphics when no tasks exist
- **Loading States**: Skeleton screens and spinners
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### 6. Progress Tracking
- **Circular Progress**: Animated ring showing completion percentage
- **Task Counters**: Total, completed, and remaining counts
- **Real-time Updates**: Instantly reflects all changes
- **Visual Feedback**: Color-coded progress states

## 🏗️ Architecture Decisions

### Backend Architecture

#### Service Layer Pattern
- **Separation of Concerns**: Routes handle HTTP, services handle business logic
- **Testability**: Services can be unit tested independently
- **Reusability**: Business logic can be reused across different endpoints

#### Thread-Safe Storage
- **Locking Mechanism**: Python threading.Lock prevents race conditions
- **JSON Persistence**: Automatic save/load with error recovery
- **In-Memory Performance**: Fast reads with persistent backup

#### Async/Await Support
- **Non-blocking I/O**: FastAPI's async support for better performance
- **Scalability**: Handle multiple concurrent requests efficiently

### Frontend Architecture

#### Component-Based Design
- **Reusability**: Each component is self-contained and reusable
- **Single Responsibility**: Components do one thing well
- **Props Validation**: JSDoc annotations for type safety

#### State Management
- **React Hooks**: useState, useEffect for local state
- **Lifting State Up**: Shared state managed in App.jsx
- **Optimistic Updates**: Immediate UI feedback with rollback on error

#### API Service Layer
- **Centralized API Calls**: Single source of truth for backend communication
- **Error Handling**: Consistent error handling across all requests
- **Axios Interceptors**: Ready for authentication tokens

## 🧪 Testing the AI Feature

The AI Task Breakdown feature uses a mock LLM service that demonstrates production-ready patterns:

1. Create a task (e.g., "Launch new product")
2. Click the "🤖 AI Breakdown" button on the task card
3. Watch as the AI generates 3 actionable sub-tasks:
   - Research and planning sub-task
   - Execution sub-task
   - Review and finalization sub-task
4. Track progress by checking off sub-tasks
5. Sub-task progress is saved and persists across sessions

**Production Integration**: To integrate with a real LLM (OpenAI, Anthropic, etc.), simply replace the mock implementation in `backend/services.py` with actual API calls.

## 🎨 Design Philosophy

### Visual Design
- **Modern & Clean**: Minimalist interface focusing on content
- **Color Psychology**: 
  - Red for high priority
  - Yellow for medium priority
  - Green for low priority
  - Blue for informational elements
- **Whitespace**: Generous spacing for readability
- **Typography**: Clear hierarchy with appropriate font sizes

### Interaction Design
- **Immediate Feedback**: Every action has visual confirmation
- **Forgiving UX**: Easy undo, clear error messages
- **Progressive Disclosure**: Advanced features don't clutter the main UI
- **Consistency**: Same patterns used throughout the application

## 🔒 Security Considerations

- **Input Validation**: All inputs validated on both client and server
- **XSS Prevention**: React's built-in XSS protection
- **SQL Injection**: N/A (no SQL database, but validation patterns prevent injection)
- **CORS**: Configured for local development, ready for production domains
- **Error Messages**: Sanitized error messages don't leak sensitive information

## 🚀 Production Deployment

### Backend
- Deploy to: Railway, Render, Heroku, or AWS Lambda
- Use PostgreSQL instead of JSON for production storage
- Add authentication middleware (JWT)
- Enable HTTPS
- Configure CORS for production domain

### Frontend
- Deploy to: Vercel, Netlify, or Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: Set `VITE_API_URL` to production backend URL

## 📈 Future Enhancements

- [ ] Real LLM integration (OpenAI GPT-4, Claude, etc.)
- [ ] User authentication and multi-user support
- [ ] Real-time collaboration with WebSockets
- [ ] Drag-and-drop task reordering
- [ ] Task tags and custom fields
- [ ] Recurring tasks and reminders
- [ ] File attachments
- [ ] Activity history and audit log
- [ ] Data export (CSV, PDF)
- [ ] Mobile native apps (React Native)

## 👨‍💻 Code Quality

- **Clean Code**: PEP 8 compliant Python, ESLint-ready JavaScript
- **Modular Design**: Small, focused functions and components
- **Documentation**: Comprehensive docstrings and comments
- **Error Handling**: Graceful degradation and user-friendly error messages
- **Type Safety**: Pydantic models for runtime type checking

## 📝 License

This project is created for Fluid AI's technical assessment.

## 🙏 Acknowledgments

Built with modern best practices and production-ready patterns to demonstrate senior-level full-stack development capabilities.

---

**Built with ❤️ for Fluid AI**
