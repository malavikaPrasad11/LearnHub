import React, { useState } from 'react';
import { BookOpen, CheckCircle, Users } from 'lucide-react';

const HomePage = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
    setEmail('');
  };

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Transform Your Future with Online Learning
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Access world-class courses, learn at your own pace, and achieve your career goals with our comprehensive e-learning platform.
            </p>
            <button
              onClick={() => setCurrentPage('courses')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert-Led Courses</h3>
            <p className="text-gray-600">Learn from industry professionals with years of experience</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Certification</h3>
            <p className="text-gray-600">Earn certificates to showcase your achievements</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">Connect with learners worldwide in our discussion forums</p>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-8">About LearnHub</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 text-lg mb-4">
                LearnHub is a comprehensive e-learning platform designed to empower learners worldwide. We believe education should be accessible, engaging, and effective for everyone.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                Our platform offers a wide range of courses taught by industry experts, interactive learning modules, and a supportive community to help you achieve your goals.
              </p>
              <p className="text-gray-700 text-lg">
                Whether you're looking to advance your career, learn a new skill, or explore your passions, LearnHub provides the tools and resources you need to succeed.
              </p>
            </div>
            <div className="bg-indigo-100 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-indigo-900">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">High-quality courses from industry experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Learn at your own pace with flexible schedules</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Interactive quizzes and hands-on projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Certificates to validate your achievements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Active community and discussion forums</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div id="gallery" className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8">Gallery</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" alt="Students learning" className="rounded-lg shadow-lg h-48 w-full object-cover hover:scale-105 transition" />
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400" alt="Online course" className="rounded-lg shadow-lg h-48 w-full object-cover hover:scale-105 transition" />
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400" alt="Coding" className="rounded-lg shadow-lg h-48 w-full object-cover hover:scale-105 transition" />
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400" alt="Team collaboration" className="rounded-lg shadow-lg h-48 w-full object-cover hover:scale-105 transition" />
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-6">Get the latest course updates and learning tips delivered to your inbox</p>
          <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
              required
            />
            <button type="submit" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentPage('home')} className="hover:text-white transition">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('courses')} className="hover:text-white transition">
                    Courses
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('discussion')} className="hover:text-white transition">
                    Discussion
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('dashboard')} className="hover:text-white transition">
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Coimbatore, Tamil Nadu, India</li>
                <li>+091 **********</li>
                <li>
                  <a href="mailto:Facultyperson7050@gmail.com" className="hover:text-white transition">
                    Facultyperson7050@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Gallery Link */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Gallery</h3>
              <p className="mb-2">View our learning community in action</p>
              <a href="#gallery" className="text-indigo-400 hover:text-indigo-300 transition">
                View Gallery →
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
              <p className="mb-4">Stay updated with our latest courses and offers</p>
              <a href="#newsletter" className="text-indigo-400 hover:text-indigo-300 transition">
                Subscribe Now →
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm mb-4">
              This website is a Final Year project of Cloud Computing, Amrita.
            </p>
            <p className="text-center text-sm mb-4">
              © eLearning, All Right Reserved. Designed By G07
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <button onClick={() => openModal('Home', 'Welcome to LearnHub - Your gateway to quality education!')} className="hover:text-white transition">
                Home
              </button>
              <button onClick={() => openModal('Cookies Policy', 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.')} className="hover:text-white transition">
                Cookies
              </button>
              <button onClick={() => openModal('Help', 'Need assistance? Contact us at Facultyperson7050@gmail.com or call +091 ********** for support.')} className="hover:text-white transition">
                Help
              </button>
              <button onClick={() => openModal('FAQs', 'Q: How do I enroll in a course?\nA: Browse courses, click "View Details", then "Enroll Now" to complete payment.\n\nQ: Can I access courses offline?\nA: Currently, all courses require internet connection.\n\nQ: Do you offer certificates?\nA: Yes! Complete all modules and quizzes to earn your certificate.')} className="hover:text-white transition">
                FAQs
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-gray-700 whitespace-pre-line mb-6">{modalContent.content}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;