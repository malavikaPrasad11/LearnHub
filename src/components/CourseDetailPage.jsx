import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PaymentPage from './PaymentPage';

const CourseDetailPage = ({ course, setCurrentPage }) => {
  const { isEnrolled, enrollCourse } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const enrolled = isEnrolled(course.id);

  const handleEnroll = () => {
    if (enrolled) {
      setCurrentPage('learning');
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    // This will be called when payment is successful
    enrollCourse(course.id);
    setShowPayment(false);
    setPaymentSuccess(true);
  };

  const handleStartLearning = () => {
    setCurrentPage('learning');
  };

  if (showPayment) {
    return <PaymentPage course={course} onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />;
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully enrolled in <strong>{course.title}</strong>. You can now start learning.
          </p>
          <button
            onClick={handleStartLearning}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Start Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button
        onClick={() => setCurrentPage('courses')}
        className="text-indigo-600 mb-6 hover:underline"
      >
        ← Back to Courses
      </button>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
          }}
        />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full">
              {course.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{course.duration}</span>
              <span>•</span>
              <span>{course.total_students} students</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{course.fullDescription}</p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-bold mb-4">Course Modules</h3>
            <ul className="space-y-3">
              {course.modules.map((module, idx) => (
                <li key={module.id} className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{module.title}</p>
                    <p className="text-sm text-gray-500">{module.duration}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-indigo-600">${course.price}</span>
              <p className="text-sm text-gray-600 mt-1">One-time payment</p>
            </div>
            <button
              onClick={handleEnroll}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition text-lg font-medium"
            >
              {enrolled ? 'Continue Learning' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
