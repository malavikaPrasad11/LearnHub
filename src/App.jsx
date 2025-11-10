// import React, { useState } from 'react';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import HomePage from './components/HomePage';
// import CoursesPage from './components/CoursesPage';
// import CourseDetailPage from './components/CourseDetailPage';
// import LearningPage from './components/LearningPage';
// import DiscussionPage from './components/DiscussionPage';
// import DashboardPage from './components/DashboardPage';
// import AuthPage from './components/AuthPage';

// const AppContent = () => {
//   const { user } = useAuth();
//   const [currentPage, setCurrentPage] = useState("home");
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showAuth, setShowAuth] = useState(false); // 👈 new state to toggle AuthPage

//   // If user clicks Sign In, show AuthPage
//   if (showAuth) {
//     return <AuthPage onAuth={() => { setShowAuth(false); setCurrentPage("home"); }} />;
//   }

//   const renderPage = () => {
//     switch (currentPage) {
//       case "home":
//         return <HomePage setCurrentPage={setCurrentPage} />;
//       case "courses":
//         return (
//           <CoursesPage
//             setCurrentPage={setCurrentPage}
//             setSelectedCourse={setSelectedCourse}
//           />
//         );
//       case "course-detail":
//         return (
//           <CourseDetailPage
//             course={selectedCourse}
//             setCurrentPage={setCurrentPage}
//           />
//         );
//       case "learning":
//         return (
//           <LearningPage
//             course={selectedCourse}
//             setCurrentPage={setCurrentPage}
//           />
//         );
//       case "discussion":
//         return <DiscussionPage />;
//       case "dashboard":
//         return <DashboardPage />;
//       default:
//         return <HomePage setCurrentPage={setCurrentPage} />;
//     }
//   };
// <Route path="/payment-success" element={<PaymentSuccessPage />} />
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* 👇 Pass setShowAuth to Navbar so clicking “Sign In” opens AuthPage */}
//       <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} setShowAuth={setShowAuth} />
//       {renderPage()}
//     </div>
//   );
// };


// const App = () => {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// };

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CoursesPage from './components/CoursesPage';
import CourseDetailPage from './components/CourseDetailPage';
import LearningPage from './components/LearningPage';
import DiscussionPage from './components/DiscussionPage';
import DashboardPage from './components/DashboardPage';
import AuthPage from './components/AuthPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';

// Router wrapper for state-based components
const StateBasedRouter = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "courses":
        return (
          <CoursesPage
            setCurrentPage={setCurrentPage}
            setSelectedCourse={setSelectedCourse}
          />
        );
      case "course-detail":
        return (
          <CourseDetailPage
            course={selectedCourse}
            setCurrentPage={setCurrentPage}
          />
        );
      case "learning":
        return (
          <LearningPage
            course={selectedCourse}
            setCurrentPage={setCurrentPage}
          />
        );
      case "discussion":
        return <DiscussionPage />;
      case "dashboard":
        return <DashboardPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return renderPage();
};

// Route-based CourseDetail wrapper
const CourseDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const MOCK_COURSES = require('./data/courses.json');
  
  const course = MOCK_COURSES.courses.find(c => c.id === parseInt(id));
  
  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return <CourseDetailPage course={course} setCurrentPage={(page) => {
    if (page === 'courses') navigate('/courses');
    if (page === 'learning') navigate(`/learning/${course.id}`);
  }} />;
};

// Route-based Learning wrapper
const LearningWrapper = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const MOCK_COURSES = require('./data/courses.json');
  const { isEnrolled } = useAuth();
  
  const course = MOCK_COURSES.courses.find(c => c.id === parseInt(courseId));
  const enrolled = course ? isEnrolled(course.id) : false;

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (!enrolled) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">You need to enroll in this course to access the content.</p>
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Enroll Now
        </button>
      </div>
    );
  }

  return <LearningPage course={course} setCurrentPage={(page) => {
    if (page === 'courses') navigate('/courses');
  }} />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<StateBasedRouter />} />
            <Route path="/courses" element={<StateBasedRouter />} />
            <Route path="/course/:id" element={<CourseDetailWrapper />} />
            <Route path="/learning/:courseId" element={<LearningWrapper />} />
            <Route path="/discussion" element={<DiscussionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import HomePage from './components/HomePage';
// import CoursesPage from './components/CoursesPage';
// import CourseDetailPage from './components/CourseDetailPage';
// import LearningPage from './components/LearningPage';
// import DiscussionPage from './components/DiscussionPage';
// import DashboardPage from './components/DashboardPage';
// import AuthPage from './components/AuthPage';
// import PaymentSuccessPage from './components/PaymentSuccessPage';

// // State-based AppContent component
// const AppContent = () => {
//   const { user } = useAuth();
//   const [currentPage, setCurrentPage] = useState("home");
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const navigate = useNavigate();

//   const renderPage = () => {
//     switch (currentPage) {
//       case "home":
//         return <HomePage setCurrentPage={setCurrentPage} />;
//       case "courses":
//         return (
//           <CoursesPage
//             setCurrentPage={setCurrentPage}
//             setSelectedCourse={setSelectedCourse}
//           />
//         );
//       case "course-detail":
//         return (
//           <CourseDetailPage
//             course={selectedCourse}
//             setCurrentPage={setCurrentPage}
//           />
//         );
//       case "learning":
//         return (
//           <LearningPage
//             course={selectedCourse}
//             setCurrentPage={setCurrentPage}
//           />
//         );
//       case "discussion":
//         return <DiscussionPage />;
//       case "dashboard":
//         return <DashboardPage />;
//       default:
//         return <HomePage setCurrentPage={setCurrentPage} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar 
//         currentPage={currentPage} 
//         setCurrentPage={setCurrentPage} 
//         setShowAuth={() => navigate('/auth')} 
//       />
//       {renderPage()}
//     </div>
//   );
// };

// // Main App component with Router
// const App = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<AppContent />} />
//           <Route path="/courses" element={<AppContent />} />
//           <Route path="/discussion" element={<AppContent />} />
//           <Route path="/dashboard" element={<AppContent />} />
//           <Route path="/auth" element={<AuthPageWrapper />} />
//           <Route path="/payment-success" element={<PaymentSuccessPage />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// };

// // AuthPage wrapper that handles redirect
// const AuthPageWrapper = () => {
//   const navigate = useNavigate();
  
//   const handleAuthSuccess = () => {
//     // Redirect to home page after successful auth
//     navigate('/');
//   };

//   return <AuthPage onAuth={handleAuthSuccess} />;
// };

// export default App;