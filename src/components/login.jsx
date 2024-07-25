import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "../hooks/useFirebaseData";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWIthGoogle";
import { Link } from 'react-router-dom';
import "../assets/css/style.css"; // Adjust the path as needed

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Hardcoded admin credentials
  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin121450";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the entered credentials match the admin credentials
    if (email === adminEmail && password === adminPassword) {
      console.log("Admin logged in Successfully");
      navigate("/admin"); // Use navigate to redirect
      toast.success("Admin logged in Successfully", {
        position: "top-center",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      navigate("/profile"); // Use navigate to redirect
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="loginpage">
      <form className="login-password-page" onSubmit={handleSubmit}>
        <h3>Login</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
        <p className="forgot-password text-right">
          <Link to="/forgotpassword">Forget password?</Link>
        </p>
        <p className="Sign-up text-center">
          <Link to="/register">Sign up</Link>
        </p>
        <SignInwithGoogle />
      </form>
    </div>
  );
}

export default Login;
