# AI Job Tracker 

An AI-powered job application management platform that helps job seekers organize applications, track progress, analyze resumes against job descriptions, and gain insights throughout their job search journey.

## Live Demo

**Application:** [https://your-vercel-app.vercel.app
](https://ai-job-tracker-puce.vercel.app/)
## Features

### Authentication & User Management
- JWT-based authentication
- User registration and login
- Protected routes and middleware
- Google OAuth login and registration
- Secure account management

### Job Application Management
- Create, update, and delete job applications
- Track application stages:
  - Applied
  - Online Assessment (OA)
  - Interview
  - Offer
  - Rejected
- Store job details, deadlines, notes, and links
- Maintain application timelines

### Dashboard & Analytics
- Application statistics overview
- Stage distribution charts
- Progress tracking visualizations
- Application trend analysis
- Upcoming deadline alerts
- Interactive dashboard widgets

### Kanban Board
- Drag-and-drop application management
- Visual pipeline tracking
- Real-time status updates
- Organized workflow management

### Search, Filter & Sort
- Search applications by company or role
- Filter by application status
- Sort by date, deadline, and other criteria
- Debounced search queries for improved performance

### AI Resume Matching
- Upload resumes for analysis
- Compare resumes against job descriptions
- AI-generated match scores
- Skill gap identification
- Resume improvement suggestions
- Job fit insights and recommendations

### Resume Management
- Resume upload functionality
- Cloudinary-based storage
- Resume retrieval and management
- File validation and handling

### Interview Journal
- Record interview experiences
- Auto-save functionality
- Application-specific notes
- Progress history tracking

### User Experience Enhancements
- Dark and Light mode support
- Responsive mobile-friendly design
- Skeleton loaders during data fetching
- Toast notifications
- Empty state illustrations and messaging
- Consistent modern UI components

### Deployment Ready
- Production deployment support
- Vercel frontend hosting
- Render backend hosting
- Multi-origin CORS configuration
- SPA routing support

---

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Context API
- Axios
- Chart.js / Recharts
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Passport.js
- Passport Google OAuth 2.0

### AI & Storage
- Google Gemini API
- Cloudinary
- Multer

### Deployment
- Vercel
- Render

---

## Core Workflow

1. User creates an account or signs in with Google.
2. User adds job applications.
3. Applications are organized through different stages.
4. Dashboard provides application statistics and insights.
5. User uploads resume and job description.
6. Gemini AI analyzes compatibility and generates:
   - Match score
   - Missing skills
   - Suggestions
   - Improvement recommendations
7. User tracks interview progress and maintains notes.
8. Analytics dashboard helps monitor job search performance.

---

## Key Functionalities

### Authentication
- Email/password registration
- Email/password login
- Google OAuth authentication
- JWT token generation and validation

### Job Tracking
- CRUD operations for job applications
- Timeline tracking
- Deadline management
- Status updates

### AI Analysis
- Resume parsing
- Job description analysis
- Resume-job matching
- Skill gap detection

### Analytics
- Application statistics
- Status distribution
- Progress visualization
- Deadline monitoring

---

## Environment Variables

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:5173
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/AI-Job-Tracker.git

cd AI-Job-Tracker
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## Deployment

### Frontend
- Hosted on Vercel

### Backend
- Hosted on Render

### Database
- MongoDB Atlas

### Storage
- Cloudinary

---

## Future Improvements

- Email reminders for deadlines
- Resume version management
- Interview preparation assistant
- Application export functionality
- Company insights integration
- Multi-resume support
- Advanced AI recommendations
- Recruiter CRM mode

---

## Author

**Chaitri Vadaviya**

B.Tech ICT Student  
Dhirubhai Ambani University (DAU)

GitHub: https://github.com/your-username

---
