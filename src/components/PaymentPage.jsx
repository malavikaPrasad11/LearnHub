// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// import { CreditCard, ArrowLeft } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const stripePromise = loadStripe(
//   "pk_test_51SPPJT5Oy7jytMSeEtVgx7bqGqnVz34u05utHnnnjrqXiAxDOpqk7nPk1W8bi7X8gQpz5Evg91BEPZaxPRElGxdG00jjfxzWWR"
// );

// const PaymentPage = ({ course, onSuccess, onCancel }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ✅ Check if user returned from Stripe after payment
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const sessionId = params.get("session_id");

//     if (sessionId) {
//       confirmPayment(sessionId);
//     }
//   }, []);

//   const confirmPayment = async (sessionId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/confirm-payment?session_id=${sessionId}`
//       );

//       if (res.data.success) {
//         // ✅ CRITICAL: Call enrollCourse to update AuthContext
//         await enrollCourse(course.id);
        
//         alert("✅ Payment successful! You are now enrolled in this course.");
//         if (onSuccess) onSuccess(course);
        
//         // Redirect to dashboard or course page
//         window.location.href = '/dashboard';
//       } else {
//         alert("⚠️ Payment not verified. Please contact support.");
//       }
//     } catch (err) {
//       console.error("Payment confirmation error:", err);
//       alert("Error verifying payment. Please try again later.");
//     }
//   };

// const handlePayment = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       console.log("Initiating payment for:", {
//         courseName: course.title,
//         price: course.price,
//         userId: user?.id // Use user from AuthContext
//       });

//       // Create Stripe checkout session
//       const { data } = await axios.post(
//         "http://localhost:5000/create-checkout-session",
//         {
//           amount: Math.round(course.price * 100),
//           courseName: course.title,
//           courseId: course.id, // include course id for enrollment
//           userId: localStorage.getItem("userId"), // if you store logged-in user id
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       console.log("Response from backend:", data);

//       if (data && data.url) {
//         window.location.href = data.url; // redirect to Stripe Checkout
//       } else {
//         throw new Error("No checkout URL received from server");
//       }
//     } catch (err) {
//       console.error("Payment Error:", err);

//       if (err.response) {
//         setError(
//           `Server Error: ${
//             err.response.data.message ||
//             err.response.data.error ||
//             "Payment processing failed"
//           }`
//         );
//       } else if (err.request) {
//         setError("Cannot connect to payment server. Please try again later.");
//       } else {
//         setError(err.message || "Payment failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-12">
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <div className="flex items-center gap-2 mb-6">
//           <button
//             onClick={onCancel}
//             className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
//             disabled={loading}
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Back
//           </button>
//         </div>

//         <h2 className="text-3xl font-bold mb-6 text-center">Complete Payment</h2>

//         <div className="bg-gray-50 p-6 rounded-lg mb-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <span className="font-medium text-lg">{course.title}</span>
//               <p className="text-sm text-gray-600 mt-1">{course.category}</p>
//             </div>
//             <span className="text-2xl font-bold text-indigo-600">
//               ${course.price}
//             </span>
//           </div>
//         </div>

//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//           <div className="flex items-center gap-3">
//             <CreditCard className="w-6 h-6 text-blue-600" />
//             <div>
//               <h4 className="font-medium text-blue-800">Secure Payment</h4>
//               <p className="text-sm text-blue-600">
//                 You will be redirected to Stripe for secure payment processing
//               </p>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         )}

//         <div className="flex gap-4 pt-4">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handlePayment}
//             disabled={loading}
//             className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="w-5 h-5" />
//                 Pay ${course.price}
//               </>
//             )}
//           </button>
//         </div>

//         <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
//           <CreditCard className="w-4 h-4" />
//           <span>Secured by Stripe</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, ArrowLeft } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = ({ course, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Check if user returned from Stripe after payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      confirmPayment(sessionId);
    }
  }, []);

  // ✅ Confirm payment and enroll the user
  const confirmPayment = async (sessionId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/confirm-payment?session_id=${sessionId}`
      );

      if (res.data.success) {
        alert("✅ Payment successful! You are now enrolled in this course.");
        if (onSuccess) onSuccess(course); // update parent / context
      } else {
        alert("⚠️ Payment not verified. Please contact support.");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      alert("Error verifying payment. Please try again later.");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Initiating payment for:", {
        courseName: course.title,
        price: course.price,
      });

      // Create Stripe checkout session
      const { data } = await axios.post(
        "http://localhost:5000/create-checkout-session",
        {
          amount: Math.round(course.price * 100),
          courseName: course.title,
          courseId: course.id, // include course id for enrollment
          userId: localStorage.getItem("userId"), // if you store logged-in user id
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response from backend:", data);

      if (data && data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (err) {
      console.error("Payment Error:", err);

      if (err.response) {
        setError(
          `Server Error: ${
            err.response.data.message ||
            err.response.data.error ||
            "Payment processing failed"
          }`
        );
      } else if (err.request) {
        setError("Cannot connect to payment server. Please try again later.");
      } else {
        setError(err.message || "Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Complete Payment</h2>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium text-lg">{course.title}</span>
              <p className="text-sm text-gray-600 mt-1">{course.category}</p>
            </div>
            <span className="text-2xl font-bold text-indigo-600">
              ${course.price}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-800">Secure Payment</h4>
              <p className="text-sm text-blue-600">
                You will be redirected to Stripe for secure payment processing
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${course.price}
              </>
            )}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" />
          <span>Secured by Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;