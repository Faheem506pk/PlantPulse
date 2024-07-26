import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../hooks/useFirebaseData"; // Ensure correct path
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import "../assets/css/admin.css"; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function ViewAllUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userList);
                setFilteredUsers(userList);

                // Calculate counts
                const totalCount = userList.length;
                const admins = userList.filter(user => user.role === 'admin').length;
                const usersCount = userList.filter(user => user.role === 'user' || user.role === null).length;

                setTotalUserCount(totalCount);
                setAdminCount(admins);
                setUserCount(usersCount);
            } catch (error) {
                toast.error(`Error fetching users: ${error.message}`);
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAdminClick = () => {
        setFilteredUsers(users.filter(user => user.role === 'admin'));
    };

    const handleUserClick = () => {
        setFilteredUsers(users.filter(user => user.role === 'user' || user.role === null));
    };

    const handleAllUsersClick = () => {
        setFilteredUsers(users);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">View All Users</h2>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <>
                    <div className="row mb-4">
                        <div className="col-lg-4 col-md-12 mb-4">
                            <div className="card card-stats" onClick={handleAllUsersClick}>
                                <div className="admin-card-body text-center">
                                    <h5 className="card-title">Total Users</h5>
                                    <p className="card-text">{totalUserCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 mb-4">
                            <div className="card card-stats" onClick={handleAdminClick}>
                                <div className="admin-card-body text-center">
                                    <h5 className="card-title">Admins</h5>
                                    <p className="card-text">{adminCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 mb-4">
                            <div className="card card-stats" onClick={handleUserClick}>
                                <div className="admin-card-body text-center">
                                    <h5 className="card-title">Users</h5>
                                    <p className="card-text">{userCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {filteredUsers.length === 0 ? (
                            <p className="text-center">No users found.</p>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                    <div className="card user-card">
                                        <img src={user.photo || "./assets/images/default-photo.png"} className="card-img-top rounded-circle mx-auto mt-3" alt={`${user.firstName} ${user.lastName}`} />
                                        <div className="admin-card-body">
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
                </>
            )}

            <ToastContainer />
        </div>
    );
}