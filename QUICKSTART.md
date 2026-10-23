# 🎯 Quick Start Guide

## One-Command Setup (Windows)

Simply double-click `start.bat` or run:
```bash
start.bat
```

This will:
1. ✅ Create Python virtual environment
2. ✅ Install backend dependencies
3. ✅ Install frontend dependencies
4. ✅ Start backend server (http://localhost:8000)
5. ✅ Start frontend app (http://localhost:5173)

## Manual Setup

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc

## 🚀 Key Features to Test

### 1. Basic Task Management
- ✨ Add a task using the input field (press Enter)
- ✅ Check/uncheck tasks to mark completion
- 🗑️ Delete tasks (hover over a task to see delete button)
- 📝 Expand the input form for description, priority, category, due date

### 2. AI-Powered Task Breakdown ⭐
- Create a task like "Launch new website"
- Click the "🤖 AI Breakdown" button
- Watch as the AI generates 3 smart, contextually-relevant sub-tasks
- Check off sub-tasks individually
- See the sub-task progress bar update

### 3. Advanced Filtering & Search
- Use the search bar (debounced, searches titles & descriptions)
- Click category pills: Work, Personal, Shopping, Health, Other
- Filter by status: All, Active, Completed
- Filter by priority: High, Medium, Low
- Combine multiple filters
- Clear all filters with one click

### 4. Kanban Board View 📊
- Toggle between List and Kanban views
- Kanban groups by Priority or Status
- Drag-free visual organization
- See task counts per column

### 5. Visual Polish
- Smooth animations on every interaction (Framer Motion)
- Toast notifications for all actions
- Progress ring showing completion percentage
- Due date indicators ("Overdue!", "Due today", "Due in X days")
- Priority color coding (Red = High, Amber = Medium, Green = Low)
- Responsive design (works on mobile, tablet, desktop)

## 📚 Example Tasks to Create

To showcase the AI breakdown feature, try these:

1. **"Build a REST API for user management"**
   - AI generates: API design, implementation, testing sub-tasks

2. **"Launch marketing campaign"**
   - AI generates: Research, content creation, deployment sub-tasks

3. **"Plan team offsite event"**
   - AI generates: Venue research, agenda planning, execution sub-tasks

4. **"Write technical documentation"**
   - AI generates: Research, drafting, review sub-tasks

## 🔧 Technologies Used

**Backend:**
- FastAPI (async Python web framework)
- Pydantic v2 (data validation)
- Thread-safe in-memory storage with JSON persistence
- Smart AI mock service with keyword analysis

**Frontend:**
- React 18 with Vite
- Tailwind CSS (utility-first styling)
- Framer Motion (smooth animations)
- Lucide React (modern icons)
- Axios (API client)

## 📁 Project Structure

```
fluid_ai_assignment/
├── backend/
│   ├── main.py           # FastAPI routes & app setup
│   ├── models.py         # Task store & data models
│   ├── schemas.py        # Pydantic validation schemas
│   ├── services.py       # Business logic & AI service
│   ├── requirements.txt  # Python dependencies
│   └── tasks.json        # Persistent storage (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   ├── App.jsx       # Main application
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Build configuration
├── README.md             # Full documentation
├── QUICKSTART.md         # This file
├── start.bat             # Windows quick-start script
└── start.sh              # Unix quick-start script
```

## 🎨 Design Highlights

- **Color Palette**: Slate neutrals with Indigo accents
- **Typography**: Inter font family (clean, modern)
- **Spacing**: Generous padding and whitespace
- **Shadows**: Subtle elevation for depth
- **Animations**: Smooth 60fps transitions
- **Accessibility**: Keyboard navigation, ARIA labels, semantic HTML

## 🧪 Testing Checklist

- [ ] Create tasks with all fields
- [ ] Mark tasks complete/incomplete
- [ ] Delete tasks
- [ ] Generate AI breakdowns
- [ ] Toggle sub-tasks
- [ ] Search tasks
- [ ] Filter by category, status, priority
- [ ] Switch between List and Kanban views
- [ ] Test on mobile/tablet/desktop
- [ ] Verify toast notifications
- [ ] Check progress ring updates
- [ ] Test keyboard shortcuts (Enter, Escape)

## 💡 Pro Tips

1. **Keyboard Shortcuts**: Press Enter in the title field to quickly add a task
2. **Escape Key**: Press Escape to collapse the expanded form
3. **Filters Persist**: Your filter selections stay active as you work
4. **Optimistic Updates**: UI updates instantly, rolls back on error
5. **Auto-Save**: All changes persist to `tasks.json` automatically

## 🆘 Troubleshooting

**Backend won't start:**
- Ensure Python 3.10+ is installed: `python --version`
- Check port 8000 is available
- Activate virtual environment first

**Frontend won't start:**
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check port 5173 is available

**API errors in browser console:**
- Verify backend is running at http://localhost:8000
- Check backend terminal for errors
- Visit http://localhost:8000/docs to test API directly

## 🎓 Architecture Notes

**Why This Stack?**
- **FastAPI**: Modern, fast, auto-generates OpenAPI docs
- **Pydantic v2**: Type-safe data validation at runtime
- **React + Vite**: Lightning-fast development with HMR
- **Tailwind CSS**: Rapid UI development without CSS files
- **Framer Motion**: Production-ready animations

**Design Patterns:**
- **Service Layer**: Business logic separated from routes
- **Dependency Injection**: Clean, testable architecture
- **Optimistic Updates**: Instant UI feedback
- **Debounced Search**: Reduces API calls, smooth UX
- **Component Composition**: Reusable, maintainable React components

---

**Ready to impress Fluid AI? Launch the app and explore! 🚀**
