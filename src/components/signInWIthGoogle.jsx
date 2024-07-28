import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../hooks/useFirebaseData";

import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import googleImage from "../assets/images/google.png";
import { toast, ToastContainer } from "react-toastify";
function SignInwithGoogle() {
  const navigate = useNavigate();

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const registrationDate = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          await setDoc(userDocRef, {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || "",
            lastName: user.displayName?.split(' ')[1] || "",
            photo: user.photoURL,
            registrationDate,
            role: "user", // Add role field here
            access: false
          });
        }

        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to log in with Google. Please try again.", {
        position: "top-center",
      });
    }
  }

  return (
    <div>
      
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={googleImage} width={"50%"} alt="Google Sign In" />
      </div>
    </div>
  );
}

export default SignInwithGoogle;
