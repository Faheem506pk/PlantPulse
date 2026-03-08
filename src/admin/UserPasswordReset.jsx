import React, { useState } from 'react';
import { auth } from "../hooks/useFirebaseData";
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function UserPasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="admin-container">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="">
        <form  onSubmit={handleResetPassword}>
         
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
          
        </form>
        </div>
      </div>
    </div>
  );
}
