import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../hooks/useFirebaseData"; // Ensure correct path
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import "../assets/css/admin.css"; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function ViewAllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userList);
            } catch (error) {
                toast.error(`Error fetching users: ${error.message}`);
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">View All Users</h2>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="row">
                    {users.length === 0 ? (
                        <p className="text-center">No users found.</p>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                <div className="card user-card">
                                    <img src={user.photo || "./assets/images/default-photo.png"} className="card-img-top rounded-circle mx-auto mt-3" alt={`${user.firstName} ${user.lastName}`} />
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{user.firstName} {user.lastName}</h5>
                                        <div className="user-info">
                                            <p className="card-text"><strong>Email:</strong> {user.email}</p>
                                            <p className="card-text"><strong>Phone:</strong> {user.phone}</p>
                                            <p className="card-text"><strong>Address:</strong> {user.address}</p>
                                            <p className="card-text"><strong>City:</strong> {user.city}</p>
                                            <p className="card-text"><strong>Role:</strong> {user.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
