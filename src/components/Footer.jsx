import React, { useState } from 'react';

const Footer = ({ setCurrentPage }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition">Home</button></li>
                <li><button onClick={() => setCurrentPage('courses')} className="hover:text-white transition">Courses</button></li>
                <li><button onClick={() => setCurrentPage('discussion')} className="hover:text-white transition">Discussion</button></li>
                <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white transition">Dashboard</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Coimbatore, Tamil Nadu, India</li>
                <li>+091 **********</li>
                <li><a href="mailto:Facultyperson7050@gmail.com" className="hover:text-white transition">Facultyperson7050@gmail.com</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Gallery</h3>
              <p className="mb-2">View our learning community in action</p>
              <button onClick={() => setCurrentPage('home')} className="text-indigo-400 hover:text-indigo-300 transition">View Gallery →</button>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
              <p className="mb-4">Stay updated with our latest courses</p>
              <button onClick={() => setCurrentPage('home')} className="text-indigo-400 hover:text-indigo-300 transition">Subscribe Now →</button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm mb-4">This website is a Final Year project of Cloud Computing, Amrita.</p>
            <p className="text-center text-sm mb-4">© eLearning, All Right Reserved. Designed By G07</p>
            <div className="flex justify-center gap-6 text-sm">
              <button onClick={() => openModal('Home', 'Welcome to LearnHub - Your gateway to quality education!')} className="hover:text-white transition">Home</button>
              <button onClick={() => openModal('Cookies Policy', 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.')} className="hover:text-white transition">Cookies</button>
              <button onClick={() => openModal('Help', 'Need assistance? Contact us at Facultyperson7050@gmail.com or call +091 ********** for support.')} className="hover:text-white transition">Help</button>
              <button onClick={() => openModal('FAQs', 'Q: How do I enroll in a course?\nA: Browse courses, click "View Details", then "Enroll Now" to complete payment.\n\nQ: Can I access courses offline?\nA: Currently, all courses require internet connection.\n\nQ: Do you offer certificates?\nA: Yes! Complete all modules and quizzes to earn your certificate.')} className="hover:text-white transition">FAQs</button>
            </div>
          </div>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-gray-700 whitespace-pre-line mb-6">{modalContent.content}</p>
            <button onClick={() => setShowModal(false)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;