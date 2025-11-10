import React, { useState } from 'react';
import { Video, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LearningPage = ({ course, setCurrentPage }) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const { saveQuizScore } = useAuth();

  const currentQuiz = course.quizzes.find(q => q.moduleId === course.modules[currentModule]?.id);

  const handleQuizSubmit = () => {
    if (currentQuiz && selectedAnswer !== null) {
      const correct = selectedAnswer === currentQuiz.correct;
      saveQuizScore(course.id, currentQuiz.id, correct ? 100 : 0);
      setQuizSubmitted(true);
    }
  };

  const handleNextModule = () => {
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setShowQuiz(false);
      setQuizSubmitted(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => setCurrentPage('courses')}
        className="text-indigo-600 mb-6 hover:underline"
      >
        ← Back to Courses
      </button>
      
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold mb-4">Modules</h3>
            {course.modules.map((module, idx) => (
              <button
                key={module.id}
                onClick={() => {
                  setCurrentModule(idx);
                  setShowQuiz(false);
                  setQuizSubmitted(false);
                }}
                className={`w-full text-left p-3 rounded mb-2 ${
                  currentModule === idx ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{module.title}</div>
                <div className="text-xs text-gray-500">{module.duration}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3">
          {!showQuiz ? (
            <div className="bg-white rounded-lg shadow">
              <div className="bg-gray-900 aspect-video flex items-center justify-center">
                <Video className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{course.modules[currentModule]?.title}</h2>
                <p className="text-gray-600 mb-6">Video content would play here. This is a demo showing the learning interface.</p>
                
                <div className="flex gap-4">
                  {currentQuiz && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      <FileText className="w-5 h-5" />
                      Take Quiz
                    </button>
                  )}
                  
                  {currentModule < course.modules.length - 1 && (
                    <button
                      onClick={handleNextModule}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Next Module →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Module Quiz</h2>
              
              {currentQuiz && (
                <div>
                  <p className="text-lg mb-4">{currentQuiz.question}</p>
                  
                  <div className="space-y-3 mb-6">
                    {currentQuiz.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-4 border-2 rounded-lg transition ${
                          selectedAnswer === idx
                            ? quizSubmitted
                              ? idx === currentQuiz.correct
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-indigo-500 bg-indigo-50'
                            : quizSubmitted && idx === currentQuiz.correct
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={selectedAnswer === null}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-lg ${
                        selectedAnswer === currentQuiz.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedAnswer === currentQuiz.correct ? '✓ Correct!' : '✗ Incorrect'}
                      </div>
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                      >
                        Back to Video
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;