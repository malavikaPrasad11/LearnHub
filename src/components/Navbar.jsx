// import React from "react";
// import { BookOpen, HomeIcon, MessageSquare, Award, User, LogOut } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const Navbar = ({ currentPage, setCurrentPage, setShowAuth }) => {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <BookOpen className="w-8 h-8 text-indigo-600" />
//             <span className="text-2xl font-bold text-gray-800">LearnHub</span>
//           </div>

//           <div className="flex items-center gap-6">
//             <button
//               onClick={() => setCurrentPage("home")}
//               className={`flex items-center gap-2 ${currentPage === "home" ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
//             >
//               <HomeIcon className="w-5 h-5" />
//               <span className="font-medium">Home</span>
//             </button>

//             <button
//               onClick={() => setCurrentPage("courses")}
//               className={`flex items-center gap-2 ${currentPage === "courses" ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
//             >
//               <BookOpen className="w-5 h-5" />
//               <span className="font-medium">Courses</span>
//             </button>

//             <button
//               onClick={() => setCurrentPage("discussion")}
//               className={`flex items-center gap-2 ${currentPage === "discussion" ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
//             >
//               <MessageSquare className="w-5 h-5" />
//               <span className="font-medium">Discussion</span>
//             </button>

//             <button
//               onClick={() => setCurrentPage("dashboard")}
//               className={`flex items-center gap-2 ${currentPage === "dashboard" ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
//             >
//               <Award className="w-5 h-5" />
//               <span className="font-medium">Dashboard</span>
//             </button>

//             {/* Conditionally render "Sign In" or "User Info" */}
//             {!user ? (
//               <button
//                 onClick={() => setShowAuth(true)}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//               >
//                 Sign In
//               </button>
//             ) : (
//               <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
//                 <span className="text-sm font-medium text-gray-700">{user?.name}</span>
//                 <button
//                   onClick={logout}
//                   className="ml-2 text-red-600 hover:text-red-700"
//                   title="Logout"
//                 >
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, HomeIcon, MessageSquare, Award, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ currentPage, setCurrentPage, setShowAuth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to handle navigation for both systems
  const handleNavigation = (page) => {
    if (setCurrentPage) {
      // State-based navigation (for your existing components)
      setCurrentPage(page);
    } else {
      // React Router navigation
      switch (page) {
        case "home":
          navigate("/");
          break;
        case "courses":
          navigate("/courses");
          break;
        case "discussion":
          navigate("/discussion");
          break;
        case "dashboard":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  };

  // Determine active page for styling
  const getActivePage = () => {
    if (currentPage) return currentPage; // State-based
    
    // React Router based
    switch (location.pathname) {
      case "/":
        return "home";
      case "/courses":
        return "courses";
      case "/discussion":
        return "discussion";
      case "/dashboard":
        return "dashboard";
      case "/auth":
        return "auth";
      default:
        return "";
    }
  };

  const activePage = getActivePage();

  const handleAuth = () => {
    if (setShowAuth) {
      // State-based auth
      setShowAuth(true);
    } else {
      // React Router auth
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    logout();
    if (!setCurrentPage) {
      // If using React Router, redirect to home after logout
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation("home")}
          >
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">LearnHub</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavigation("home")}
              className={`flex items-center gap-2 ${
                activePage === "home" ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => handleNavigation("courses")}
              className={`flex items-center gap-2 ${
                activePage === "courses" ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Courses</span>
            </button>

            <button
              onClick={() => handleNavigation("discussion")}
              className={`flex items-center gap-2 ${
                activePage === "discussion" ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Discussion</span>
            </button>

            <button
              onClick={() => handleNavigation("dashboard")}
              className={`flex items-center gap-2 ${
                activePage === "dashboard" ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* User Authentication Section */}
            {!user ? (
              <button
                onClick={handleAuth}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;