# AI Job Tracker

An AI-powered job application management platform that helps job seekers stay organized, track their progress, analyze resumes against job descriptions, and gain actionable insights throughout their job search.

**Live Demo:** [ai-job-tracker-puce.vercel.app](https://ai-job-tracker-puce.vercel.app/)

---

## Features

### Authentication & User Management
- JWT-based authentication with protected routes and middleware
- User registration and login via email/password
- Google OAuth login and registration
- Secure account management

### Job Application Management
- Create, update, and delete job applications
- Track applications across key stages: **Applied → Online Assessment (OA) → Interview → Offer / Rejected**
- Store job details, deadlines, notes, and relevant links
- Maintain a full timeline for each application

### Dashboard & Analytics
- Overview of application statistics
- Stage distribution charts
- Progress tracking visualizations
- Application trend analysis
- Upcoming deadline alerts
- Interactive dashboard widgets

### Kanban Board
- Drag-and-drop application management
- Visual pipeline for tracking progress
- Real-time status updates
- Organized, at-a-glance workflow view

### Search, Filter & Sort
- Search applications by company or role
- Filter by application status
- Sort by date, deadline, or other criteria
- Debounced search for smoother performance

### AI Resume Matching
- Upload resumes for AI-powered analysis
- Compare resumes against job descriptions
- Generate match scores and identify skill gaps
- Receive resume improvement suggestions and job fit insights

### Resume Management
- Resume upload with Cloudinary-based storage
- Easy resume retrieval and management
- File validation and handling

### Interview Journal
- Record and revisit interview experiences
- Auto-save functionality
- Application-specific notes
- Progress history tracking

### User Experience
- Dark and light mode support
- Fully responsive, mobile-friendly design
- Skeleton loaders during data fetching
- Toast notifications for user feedback
- Empty-state illustrations and messaging
- Clean, consistent modern UI components

### Deployment Ready
- Production deployment support
- Vercel frontend hosting
- Render backend hosting
- Multi-origin CORS configuration
- SPA routing support

---

## Tech Stack

**Frontend**
React · React Router · Tailwind CSS · Context API · Axios · Chart.js / Recharts · React Hot Toast

**Backend**
Node.js · Express.js · MongoDB Atlas · Mongoose · JWT Authentication · Passport.js · Passport Google OAuth 2.0

**AI & Storage**
Google Gemini API · Cloudinary · Multer

**Deployment**
Vercel · Render

---

## Core Workflow

1. The user creates an account or signs in with Google.
2. The user adds job applications to their tracker.
3. Applications are organized across different pipeline stages.
4. The dashboard surfaces application statistics and insights.
5. The user uploads a resume and a job description.
6. Gemini AI analyzes the two and generates:
   - A match score
   - Missing skills
   - Suggestions for improvement
   - Overall recommendations
7. The user logs interview progress and keeps ongoing notes.
8. The analytics dashboard helps monitor job search performance over time.

---

## Key Functionalities

**Authentication**
- Email/password registration and login
- Google OAuth authentication
- JWT token generation and validation

**Job Tracking**
- Full CRUD operations for job applications
- Timeline tracking and deadline management
- Status updates across the pipeline

**AI Analysis**
- Resume parsing
- Job description analysis
- Resume-to-job matching
- Skill gap detection

**Analytics**
- Application statistics
- Status distribution
- Progress visualization
- Deadline monitoring

---

## Environment Variables

Create a `.env` file inside the `server` directory with the following variables:

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

### Clone the Repository

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

| Component | Platform |
|-----------|----------|
| Frontend  | Vercel |
| Backend   | Render |
| Database  | MongoDB Atlas |
| Storage   | Cloudinary |

---

## Future Improvements

- Email reminders for upcoming deadlines
- Resume version management
- Interview preparation assistant
- Application export functionality
- Company insights integration
- Multi-resume support
- Advanced AI recommendations
- Recruiter CRM mode

---

## Author

**Chaitri Vadaviya**,
B.Tech ICT Student, Dhirubhai Ambani University (DAU)
