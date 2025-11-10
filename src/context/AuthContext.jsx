// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [quizScores, setQuizScores] = useState({});

//   const BACKEND_URL = "http://localhost:5000"; // ✅ change if backend runs elsewhere

//   useEffect(() => {
//     const savedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
//     const savedEnrollments = JSON.parse(sessionStorage.getItem('enrollments') || '[]');
//     const savedScores = JSON.parse(sessionStorage.getItem('quizScores') || '{}');
    
//     if (savedUser) {
//       setUser(savedUser);
//       setEnrolledCourses(savedEnrollments);
//       setQuizScores(savedScores);
//     }
//   }, []);

//   // ✅ Register user via backend
//   const register = async (email, password, name) => {
//     try {
//       const res = await axios.post(`${BACKEND_URL}/auth/register`, {
//         name,
//         email,
//         password,
//       });

//       if (res.data.success) {
//         alert('✅ Registration successful! Please login.');
//         return true;
//       } else {
//         alert(res.data.error || 'Registration failed');
//         return false;
//       }
//     } catch (err) {
//       alert(err.response?.data?.error || 'Registration failed');
//       return false;
//     }
//   };

//   // ✅ Login user via backend
//   const login = async (email, password) => {
//     try {
//       const res = await axios.post(`${BACKEND_URL}/auth/login`, {
//         email,
//         password,
//       });

//       if (res.data.success) {
//         const userData = res.data.user;
//         setUser(userData);
//         sessionStorage.setItem('user', JSON.stringify(userData));
//         alert('✅ Logged in successfully!');
//         return true;
//       } else {
//         alert(res.data.error || 'Invalid credentials');
//         return false;
//       }
//     } catch (err) {
//       alert(err.response?.data?.error || 'Login failed');
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem('user');
//   };

//   // ✅ Enroll course (now also syncs with backend)
//   const enrollCourse = async (courseId) => {
//     try {
//       // frontend update
//       const updated = [...new Set([...enrolledCourses, courseId])];
//       setEnrolledCourses(updated);
//       sessionStorage.setItem('enrollments', JSON.stringify(updated));

//       // backend update
//       if (user?._id) {
//         await axios.post(`${BACKEND_URL}/api/enroll`, {
//           userId: user._id,
//           courseId,
//         });
//       }
//     } catch (error) {
//       console.error("Enrollment sync failed:", error);
//     }
//   };

//   // ✅ Quiz score logic unchanged
//   const saveQuizScore = (courseId, quizId, score) => {
//     const updated = { ...quizScores, [`${courseId}-${quizId}`]: score };
//     setQuizScores(updated);
//     sessionStorage.setItem('quizScores', JSON.stringify(updated));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         register,
//         logout,
//         enrolledCourses,
//         enrollCourse,
//         quizScores,
//         saveQuizScore,
//         isEnrolled: (courseId) => enrolledCourses.includes(courseId),
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quizScores, setQuizScores] = useState({});

  const BACKEND_URL = "http://localhost:5000"; // ✅ backend base URL

  useEffect(() => {
    const savedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
    const savedEnrollments = JSON.parse(sessionStorage.getItem('enrollments') || '[]');
    const savedScores = JSON.parse(sessionStorage.getItem('quizScores') || '{}');
    
    if (savedUser) {
      setUser(savedUser);
      setEnrolledCourses(savedEnrollments);
      setQuizScores(savedScores);
    }
  }, []);
useEffect(() => {
  localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
}, [enrolledCourses]);
useEffect(() => {
  const saved = localStorage.getItem("enrolledCourses");
  if (saved) setEnrolledCourses(JSON.parse(saved));
}, []);

  // ✅ Register user
  const register = async (email, password, name) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, { name, email, password });
      if (res.data.success) {
        alert('✅ Registration successful! Please login.');
        return true;
      } else {
        alert(res.data.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  // ✅ Login user
// In your AuthContext.jsx - update the login function
const login = async (email, password) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
    if (res.data.success) {
      const userData = res.data.user;
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      // Don't show alert here, let the AuthPage handle the redirect
      return { success: true, user: userData };
    } else {
      return { success: false, error: res.data.error || 'Invalid credentials' };
    }
  } catch (err) {
    return { success: false, error: err.response?.data?.error || 'Login failed' };
  }
};
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

const enrollCourse = async (courseId) => {
  try {
    // Avoid duplicate enrollment in frontend
    if (enrolledCourses.includes(courseId)) {
      console.log("Course already enrolled");
      return;
    }

    // Update frontend state immediately
    const updated = [...enrolledCourses, courseId];
    setEnrolledCourses(updated);
    sessionStorage.setItem('enrollments', JSON.stringify(updated));
    localStorage.setItem('enrolledCourses', JSON.stringify(updated)); // Also save to localStorage

    console.log("✅ Course enrolled in frontend:", courseId);

    // ✅ Send to backend to store permanently
    if (user?.id) {
      try {
        await axios.post("http://localhost:5000/api/enroll", {
          userId: user.id,
          courseId: courseId,
        });
        console.log("✅ Enrollment saved in backend too");
      } catch (backendErr) {
        console.error("❌ Backend enrollment failed:", backendErr);
        // Don't revert frontend state - enrollment happened, just backend sync failed
      }
    }
  } catch (err) {
    console.error("❌ Enrollment error:", err);
  }
};

// Add this function to your AuthContext
const refreshEnrollments = async () => {
  if (!user?.id) return;
  
  try {
    const response = await axios.get(`http://localhost:5000/api/user/${user.id}/enrollments`);
    if (response.data.success) {
      setEnrolledCourses(response.data.enrolledCourses);
      sessionStorage.setItem('enrollments', JSON.stringify(response.data.enrolledCourses));
    }
  } catch (error) {
    console.error('Failed to refresh enrollments:', error);
  }
};

  // ✅ Quiz score logic unchanged

  const saveQuizScore = (courseId, quizId, score) => {
    const updated = { ...quizScores, [`${courseId}-${quizId}`]: score };
    setQuizScores(updated);
    sessionStorage.setItem('quizScores', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        enrolledCourses,
        enrollCourse,
        refreshEnrollments,
        quizScores,
        saveQuizScore,
        isEnrolled: (courseId) => enrolledCourses.includes(courseId),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
