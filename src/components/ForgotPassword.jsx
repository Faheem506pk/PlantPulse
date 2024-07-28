import React, { useState } from "react";
import { auth } from "../hooks/useFirebaseData";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import "../assets/css/style.css"; // Adjust the path as needed

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Check the sign-in methods associated with the email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      // If the email is linked with Google sign-in, notify the user
      if (signInMethods.includes("google.com")) {
        toast.info("Please sign in with Google. Password reset is not available for Google sign-ins.", {
          position: "top-center",
        });
      } else {
        // If email is not linked with Google sign-in, send password reset email
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent. Check your inbox.", {
          position: "top-center",
        });
        setEmail(""); // Clear the input field
      }
    } catch (error) {
      console.error("Error handling password reset:", error);
      toast.error("Error handling password reset. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="loginpage">
      <ToastContainer />
        <form className="forgot-password-page" onSubmit={handleResetPassword}>
          <h3>Forgot Password</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Send Reset Link
            </button>
          </div>
          <p className="text-center mt-3">
            Remembered your password? <Link className="forgot-password" to="/login"> Login here</Link>
          </p>
        </form>
     
    </div>
  );
}

export default ForgotPassword;
