const mongoose = require('mongoose');
require('dotenv').config();

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  fullDescription: String,
  image: String,
  price: Number,
  modules: Array,
  quizzes: Array
});

const Course = mongoose.model("Course", courseSchema);

const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
    fullDescription: 'Master full-stack web development with this comprehensive bootcamp. Build real-world projects and launch your career.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
    price: 49.99,
    modules: [
      { id: 1, title: 'HTML & CSS Fundamentals', videoUrl: 'video1.mp4', duration: '2h 30m' },
      { id: 2, title: 'JavaScript Essentials', videoUrl: 'video2.mp4', duration: '3h 15m' },
      { id: 3, title: 'React Masterclass', videoUrl: 'video3.mp4', duration: '4h 00m' },
      { id: 4, title: 'Node.js Backend', videoUrl: 'video4.mp4', duration: '3h 45m' }
    ],
    quizzes: [
      { id: 1, moduleId: 1, question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correct: 0 },
      { id: 2, moduleId: 2, question: 'Which keyword is used to declare a variable in JavaScript?', options: ['var', 'let', 'const', 'All of the above'], correct: 3 }
    ]
  },
  {
    title: 'Python for Data Science',
    description: 'Master Python programming and data analysis',
    fullDescription: 'Learn Python from scratch and dive into data science with pandas, numpy, and machine learning libraries.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500',
    price: 59.99,
    modules: [
      { id: 1, title: 'Python Basics', videoUrl: 'python1.mp4', duration: '2h 00m' },
      { id: 2, title: 'Data Analysis with Pandas', videoUrl: 'python2.mp4', duration: '3h 30m' },
      { id: 3, title: 'Machine Learning Intro', videoUrl: 'python3.mp4', duration: '4h 15m' }
    ],
    quizzes: [
      { id: 3, moduleId: 1, question: 'What is Python?', options: ['A snake', 'A programming language', 'A database', 'An operating system'], correct: 1 }
    ]
  },
  {
    title: 'UI/UX Design Mastery',
    description: 'Create stunning user interfaces and experiences',
    fullDescription: 'Learn design principles, Figma, prototyping, and user research to become a professional UI/UX designer.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
    price: 44.99,
    modules: [
      { id: 1, title: 'Design Principles', videoUrl: 'design1.mp4', duration: '2h 15m' },
      { id: 2, title: 'Figma Masterclass', videoUrl: 'design2.mp4', duration: '3h 00m' }
    ],
    quizzes: []
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert new courses
    const result = await Course.insertMany(courses);
    console.log(`✅ Added ${result.length} courses to database`);

    // Display added courses
    result.forEach(course => {
      console.log(`   📚 ${course.title} - ₹${course.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();