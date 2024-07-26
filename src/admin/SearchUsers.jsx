import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../hooks/useFirebaseData"; // Ensure correct path
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import "../assets/css/admin.css"; // Adjust the path as needed

export default function SearchUsers() {
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUserData(null); // Clear previous user data
        try {
            // Debug: Log the email and document reference
            console.log("Searching for email:", email);

            // Firestore document reference
            const docRef = doc(db, "users", email);

            // Fetch the document
            const docSnap = await getDoc(docRef);

            // Debug: Log the result of the fetch
            console.log("Document snapshot:", docSnap.data());

            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                toast.info("No user found with this email.");
            }
        } catch (error) {
            toast.error(`Error fetching user data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Search User by Email</h2>
            <form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <input
                    type="email"
                    className="form-control me-2"
                    placeholder="Enter user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {loading && <p className="text-center">Loading...</p>}

            {userData && (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">User Details</h5>
                        <p className="card-text"><strong>First Name:</strong> {userData.firstName}</p>
                        <p className="card-text"><strong>Last Name:</strong> {userData.lastName}</p>
                        <p className="card-text"><strong>Email:</strong> {userData.email}</p>
                        <p className="card-text"><strong>Phone:</strong> {userData.phone}</p>
                        <p className="card-text"><strong>Address:</strong> {userData.address}</p>
                        <p className="card-text"><strong>City:</strong> {userData.city}</p>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
