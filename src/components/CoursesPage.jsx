import React from 'react';
import MOCK_COURSES from '../data/courses.json';
import Footer from './Footer';

const CoursesPage = ({ setCurrentPage, setSelectedCourse }) => {
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setCurrentPage('course-detail');
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Available Courses</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/img/default-course.jpg';
                }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-sm text-gray-500">{course.duration}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
                    <span className="text-sm text-gray-500">{course.total_students} students</span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(course)}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer setCurrentPage={setCurrentPage} />
    </>
  );
};

export default CoursesPage;