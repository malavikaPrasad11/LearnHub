import React from 'react';
import { BookOpen, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // If using React Router

// Dashboard Page
const DashboardPage = () => {
  const { enrolledCourses, quizScores, courses, user } = useAuth();
  const navigate = useNavigate(); // Alternative navigation approach

  // Safe data filtering with fallbacks
  const enrolledCourseData = courses?.filter(course => 
    enrolledCourses?.includes(course?.id || course?._id)
  ) || [];

  // Calculate statistics safely
  const totalEnrolled = enrolledCourses?.length || 0;
  const totalQuizzesCompleted = Object.keys(quizScores || {}).length;
  const passedQuizzes = Object.keys(quizScores || {})
    .filter(key => quizScores[key] >= 70).length;

  const handleBrowseCourses = () => {
    // Use your preferred navigation method
    window.location.hash = '#courses';
    // Or with React Router: navigate('/courses');
  };

  const handleContinueLearning = (course) => {
    window.dispatchEvent(new CustomEvent('continueLearning', { detail: course }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2">
          Welcome back, {user?.name || 'Student'}! 👋
        </h2>
        <p className="text-gray-600">
          Track your learning progress and continue where you left off
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          value={totalEnrolled}
          label="Enrolled Courses"
          gradient="from-indigo-500 to-indigo-600"
        />
        
        <StatCard
          icon={<Award className="w-6 h-6" />}
          value={totalQuizzesCompleted}
          label="Quizzes Completed"
          gradient="from-green-500 to-green-600"
        />

        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          value={passedQuizzes}
          label="Passed Quizzes"
          gradient="from-purple-500 to-purple-600"
        />
      </div>
      
      {/* My Courses Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold mb-6">My Courses</h3>
        
        {enrolledCourseData.length === 0 ? (
          <EmptyCoursesState onBrowseCourses={handleBrowseCourses} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourseData.map(course => (
              <CourseCard 
                key={course.id || course._id} 
                course={course}
                quizScores={quizScores}
                onContinueLearning={handleContinueLearning}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Quiz Results */}
      {totalQuizzesCompleted > 0 && (
        <RecentQuizResults quizScores={quizScores} courses={courses} />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-white bg-opacity-20 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-opacity-90 capitalize">{label}</p>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyCoursesState = ({ onBrowseCourses }) => (
  <div className="text-center py-16">
    <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-600 text-lg mb-2">No enrolled courses yet</p>
    <p className="text-gray-500 mb-6">Start learning by enrolling in a course</p>
    <button 
      onClick={onBrowseCourses}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
    >
      Browse Courses
    </button>
  </div>
);

// Course Card Component
const CourseCard = ({ course, quizScores, onContinueLearning }) => {
  const courseId = course.id || course._id;
  
  const courseQuizzes = (course.quizzes || []).filter(q => 
    quizScores?.[`${courseId}-${q.id}`] !== undefined
  );

  const avgScore = courseQuizzes.length > 0
    ? courseQuizzes.reduce((sum, q) => sum + quizScores[`${courseId}-${q.id}`], 0) / courseQuizzes.length
    : 0;

  const progress = Math.round((courseQuizzes.length / Math.max(course.quizzes?.length || 1, 1)) * 100);

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/images/course-placeholder.jpg';
          }}
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-indigo-600">
          {progress}% Complete
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="font-bold text-xl mb-2">{course.title}</h4>
        <p className="text-sm text-gray-600 mb-4">
          {course.modules?.length || 0} modules • {course.quizzes?.length || 0} quizzes
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {courseQuizzes.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">
              Average Score: <span className="font-bold text-green-600">{avgScore.toFixed(0)}%</span>
            </span>
          </div>
        )}
        
        <button 
          onClick={() => onContinueLearning(course)}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium group-hover:shadow-md"
        >
          Continue Learning →
        </button>
      </div>
    </div>
  );
};

// Recent Quiz Results Component
const RecentQuizResults = ({ quizScores, courses }) => {
  const recentQuizzes = Object.entries(quizScores)
    .slice(-5)
    .reverse()
    .map(([key, score]) => {
      const [courseId, quizId] = key.split('-');
      const course = courses?.find(c => String(c.id || c._id) === courseId);
      const quiz = course?.quizzes?.find(q => String(q.id) === quizId);
      
      return { key, score, course, quizId, quiz };
    });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6">Recent Quiz Results</h3>
      <div className="space-y-3">
        {recentQuizzes.map(({ key, score, course, quizId, quiz }) => (
          <QuizResultItem 
            key={key}
            score={score}
            courseTitle={course?.title}
            quizId={quizId}
            quizTitle={quiz?.title}
          />
        ))}
      </div>
    </div>
  );
};

// Quiz Result Item Component
const QuizResultItem = ({ score, courseTitle, quizId, quizTitle }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
        score >= 70 ? 'bg-green-500' : 'bg-red-500'
      }`}>
        {score}%
      </div>
      <div>
        <p className="font-medium">{courseTitle || 'Unknown Course'}</p>
        <p className="text-sm text-gray-600">
          {quizTitle || `Quiz #${quizId}`}
        </p>
      </div>
    </div>
    <div>
      {score >= 70 ? (
        <span className="flex items-center gap-1 text-green-600 font-medium">
          <CheckCircle className="w-5 h-5" />
          Passed
        </span>
      ) : (
        <span className="text-red-600 font-medium">
          Review Required
        </span>
      )}
    </div>
  </div>
);

export default DashboardPage;
// const DashboardPage = () => {
//   const { enrolledCourses, quizScores } = useAuth();
  
//   const enrolledCourseData = MOCK_COURSES.courses.filter(course => enrolledCourses.includes(course.id));
  
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <h2 className="text-4xl font-bold mb-8">My Dashboard</h2>
      
//       <div className="grid md:grid-cols-2 gap-8 mb-8">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="bg-indigo-100 p-3 rounded-lg">
//               <BookOpen className="w-6 h-6 text-indigo-600" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
//               <p className="text-gray-600">Enrolled Courses</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="bg-green-100 p-3 rounded-lg">
//               <Award className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">{Object.keys(quizScores).length}</h3>
//               <p className="text-gray-600">Quizzes Completed</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-2xl font-bold mb-6">My Courses</h3>
        
//         {enrolledCourseData.length === 0 ? (
//           <div className="text-center py-12">
//             <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600 text-lg">No enrolled courses yet</p>
//             <p className="text-gray-500 mb-6">Start learning by enrolling in a course</p>
//             <button
//               onClick={() => window.location.href = '/courses'}
//               className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
//             >
//               Browse Courses
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {enrolledCourseData.map(course => {
//               const courseQuizzes = course.quizzes.filter(q => 
//                 quizScores[`${course.id}-${q.id}`] !== undefined
//               );
//               const avgScore = courseQuizzes.length > 0
//                 ? courseQuizzes.reduce((sum, q) => sum + quizScores[`${course.id}-${q.id}`], 0) / courseQuizzes.length
//                 : 0;
              
//               return (
//                 <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <img 
//                         src={course.image} 
//                         alt={course.title} 
//                         className="w-20 h-20 rounded-lg object-cover"
//                         onError={(e) => {
//                           e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
//                         }}
//                       />
//                       <div>
//                         <h4 className="font-bold text-lg">{course.title}</h4>
//                         <p className="text-sm text-gray-600">{course.category}</p>
//                         <p className="text-sm text-gray-500">{course.modules.length} modules • {course.duration}</p>
//                         {courseQuizzes.length > 0 && (
//                           <p className="text-sm text-green-600 font-medium">
//                             Average Score: {avgScore.toFixed(0)}%
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm text-gray-500 mb-2">Progress</div>
//                       <div className="text-2xl font-bold text-indigo-600">
//                         {Math.round((courseQuizzes.length / Math.max(course.quizzes.length, 1)) * 100)}%
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
      
//       {Object.keys(quizScores).length > 0 && (
//         <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
//           <h3 className="text-2xl font-bold mb-6">Quiz Scores</h3>
//           <div className="space-y-3">
//             {Object.entries(quizScores).map(([key, score]) => {
//               const [courseId, quizId] = key.split('-').map(Number);
//               const course = MOCK_COURSES.courses.find(c => c.id === courseId);
//               const quiz = course?.quizzes.find(q => q.id === quizId);
              
//               return (
//                 <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium">{course?.title}</p>
//                     <p className="text-sm text-gray-600">Quiz #{quizId}</p>
//                   </div>
//                   <div className={`px-4 py-2 rounded-lg font-bold ${
//                     score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                   }`}>
//                     {score}%
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;
