const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Auth0
const { expressjwt: expressjwtMiddleware } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// JWT for custom auth
const jsonwebtoken = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// -------------------- Middleware -------------------- //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- MongoDB Connection -------------------- //
const mongoURL = process.env.DB_URL;

mongoose
  .connect(mongoURL)
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- Mongoose Schemas -------------------- //

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Added for custom auth
  createdAt: { type: Date, default: Date.now },
});

const feedbackSchema = new mongoose.Schema({
  name: String,
  image: {
    type: String,
    default: "https://yourdomain.com/default-avatar.png",
    set: (v) =>
      v === "" ? "https://yourdomain.com/default-avatar.png" : v,
  },
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now },
});
const paymentSchema = new mongoose.Schema({
  courseName: String,
  amount: Number,
  sessionId: String,
  userEmail: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  fullDescription: String,
  image: String,
  price: Number,
  modules: [{
    id: Number,
    title: String,
    videoUrl: String,
    duration: String
  }],
  quizzes: [{
    id: Number,
    moduleId: Number,
    question: String,
    options: [String],
    correct: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }
});

const quizScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  quizId: Number,
  score: Number,
  completedAt: { type: Date, default: Date.now }
});
// -------------------- Models -------------------- //
const User = mongoose.model("User", userSchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Course = mongoose.model("Course", courseSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
const QuizScore = mongoose.model("QuizScore", quizScoreSchema);

// -------------------- Auth0 JWT Middleware -------------------- //

const checkJwt = expressjwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-u7vek4cis1rwe2yw.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://my-elearning-api",
  issuer: "https://dev-u7vek4cis1rwe2yw.us.auth0.com/",
  algorithms: ["RS256"],
});


// -------------------- Routes -------------------- //

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), port });
});

// -------------------- Authentication -------------------- //

// Register new user
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found. Please register first." });
    }

    // Check if user has a password (for Auth0 users who don't have passwords)
    if (!user.password) {
      return res.status(401).json({ error: "Please login with Auth0" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password. Please try again.s" });
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Users -------------------- //

// Protected route: create/update user in DB (Auth0)
app.post("/profile", checkJwt, async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email });
      await user.save();
      return res.json({ message: "User saved successfully!" });
    } else {
      return res.json({ message: "User already exists." });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
const login = async (email, password) => {
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } else {
      alert(data.error || "Invalid credentials");
      return false;
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
    return false;
  }
};

const register = async (email, password, name) => {
  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (data.success) {
      // ✅ Auto-login after successful registration
      setUser(data.user);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } else {
      alert(data.error || "Registration failed");
      return false;
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
    return false;
  }
};

// -------------------- Feedback -------------------- //

// Add new feedback
app.post("/feedback/new", async (req, res) => {
  const { name, image, rating, comment } = req.body;
  try {
    const newFeedback = new Feedback({ name, image, rating, comment });
    await newFeedback.save();
    res.json({ success: true, id: newFeedback._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedback
app.get("/feedback", async (req, res) => {
  try {
    const data = await Feedback.find({}).sort({ date: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete feedback by ID
app.delete("/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Stripe Payment -------------------- //

// Create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, courseName, courseId, userId } = req.body; // Added courseId and userId

    // Validate input
    if (!amount || !courseName || !userId) {
      return res.status(400).json({
        error: "Missing required fields: amount, courseName, and userId",
      });
    }

    // ✅ Find user by ID to get email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: courseName,
              description: `Enroll in ${courseName}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173/"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:5173/"
      }/courses`,
      metadata: {
        courseName: courseName,
        courseId: courseId, // ✅ Include courseId
        userId: userId,     // ✅ Include userId
        userEmail: user.email, // ✅ Include user email
      },
    });

    // Save payment record to database
    const payment = new Payment({
      courseName,
      amount: amount / 100,
      sessionId: session.id,
      userEmail: user.email,
      userId: userId, // ✅ Save userId too
      status: "pending",
    });
    await payment.save();

    console.log("✅ Checkout session created:", session.id);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    res.status(500).json({
      error: error.message || "Failed to create checkout session",
    });
  }
});

// Verify payment
app.get("/verify-payment/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );

    // Update payment status in database
    await Payment.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { status: session.payment_status === "paid" ? "completed" : "failed" }
    );

    res.json({
      success: true,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save payment details (called from success page)
app.post("/payment/save", async (req, res) => {
  try {
    const { courseName, price, sessionId } = req.body;

    const payment = new Payment({
      courseName,
      amount: price,
      sessionId: sessionId || "unknown",
      status: "completed",
    });

    await payment.save();
    res.json({ success: true, message: "Payment saved successfully" });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all payments (admin)
app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's enrolled courses
app.get("/api/user/:userId/enrollments", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const enrollments = await Enrollment.find({ userId: userId })
      .populate('courseId')
      .sort({ enrolledAt: -1 });

    // Extract just the course IDs for frontend
    const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId._id.toString());

    res.json({ 
      success: true, 
      enrolledCourses: enrolledCourseIds,
      enrollments: enrollments 
    });
  } catch (error) {
    console.error("❌ Fetch enrollments error:", error);
    res.status(500).json({ error: error.message });
  }
});
// -------------------- Courses -------------------- //

// Get all courses
app.get("/courses", async (req, res) => {
  try {
    console.log("📚 Fetching all courses...");
    const courses = await Course.find({});
    console.log(`✅ Found ${courses.length} courses`);
    res.json({ success: true, data: courses });
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get single course
app.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new course (admin)
app.post("/courses", async (req, res) => {
  try {
    console.log("➕ Adding new course:", req.body.title);
    const course = new Course(req.body);
    await course.save();
    console.log("✅ Course saved:", course._id);
    res.json({ success: true, data: course });
  } catch (err) {
    console.error("❌ Error adding course:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Enrollments -------------------- //

// Enroll user in course
app.post("/enroll", async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    
    console.log("📝 Enrollment request:", { userId, courseId });
    
    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }
    
    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();
    console.log("✅ User enrolled successfully");
    res.json({ success: true, data: enrollment });
  } catch (err) {
    console.error("❌ Enrollment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user enrollments
app.get("/enrollments/:userId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId })
      .populate('courseId');
    res.json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/enroll", async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const enrollment = new Enrollment({ userId, courseId, date: new Date() });
    await enrollment.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Enrollment save error:", error);
    res.status(500).json({ success: false, error: "Failed to enroll user" });
  }
});
// ✅ Fixed: Verify payment AND enroll user
app.get("/api/confirm-payment", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    console.log("🔍 Verifying payment session:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ success: false, error: "Missing session_id" });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    });

    console.log("📦 Stripe session:", {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata
    });

    if (session.payment_status === "paid") {
      // ✅ Update payment status in database
      await Payment.findOneAndUpdate(
        { sessionId: sessionId },
        { status: "completed" }
      );

      // ✅ Extract course info from session metadata or line items
      const courseName = session.metadata?.courseName;
      const userEmail = session.metadata?.userEmail;
      
      console.log("✅ Payment successful, enrolling user:", { courseName, userEmail });

      // ✅ Find the user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: "User not found" 
        });
      }

      // ✅ Find the course by name (you might want to use courseId instead)
      const course = await Course.findOne({ title: courseName });
      if (!course) {
        return res.status(404).json({ 
          success: false, 
          error: "Course not found" 
        });
      }

      // ✅ Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({ 
        userId: user._id, 
        courseId: course._id 
      });

      if (!existingEnrollment) {
        // ✅ Create enrollment
        const enrollment = new Enrollment({ 
          userId: user._id, 
          courseId: course._id 
        });
        await enrollment.save();
        console.log("✅ User enrolled in course:", enrollment._id);
      } else {
        console.log("ℹ️ User already enrolled in this course");
      }

      res.json({ 
        success: true, 
        message: "Payment confirmed and user enrolled",
        courseId: course._id
      });
    } else {
      console.log("❌ Payment not completed:", session.payment_status);
      res.json({ 
        success: false, 
        error: "Payment not completed" 
      });
    }
  } catch (error) {
    console.error("❌ Payment confirmation error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// -------------------- Quiz Scores -------------------- //

// Save quiz score
app.post("/quiz-score", async (req, res) => {
  try {
    const { userId, courseId, quizId, score } = req.body;
    console.log("📊 Saving quiz score:", { userId, courseId, quizId, score });
    
    const quizScore = new QuizScore({ userId, courseId, quizId, score });
    await quizScore.save();
    console.log("✅ Quiz score saved");
    res.json({ success: true, data: quizScore });
  } catch (err) {
    console.error("❌ Quiz score error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user quiz scores
app.get("/quiz-scores/:userId", async (req, res) => {
  try {
    const scores = await QuizScore.find({ userId: req.params.userId });
    res.json({ success: true, data: scores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Test Database -------------------- //

// Test route to check database
app.get("/test-db", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const enrollmentCount = await Enrollment.countDocuments();
    
    res.json({
      success: true,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: {
        users: userCount,
        courses: courseCount,
        payments: paymentCount,
        enrollments: enrollmentCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// -------------------- Start Server -------------------- //
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`📍 http://localhost:${port}`);
});