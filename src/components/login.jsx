import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../hooks/useFirebaseData"; // Import Firestore
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWIthGoogle";
import { Link } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import "../assets/css/style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        if (role === 'admin') {
          console.log("Admin logged in Successfully");
          toast.success("Admin logged in Successfully", {
            position: "top-center",
          });
          navigate("/admin");
        } else {
          console.log("User logged in Successfully");
          toast.success("User logged in Successfully", {
            position: "top-center",
          });
          navigate("/dashboard");
        }
      } else {
        console.log("No such document!");
        toast.error("No user data found", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="loginpage">
      <ToastContainer />
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
