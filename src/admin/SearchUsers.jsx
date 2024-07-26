import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../hooks/useFirebaseData'; // Ensure correct path
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function SearchUsers() {
  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setSelectedRole(userDetails.role || 'user'); // Default to 'user' if no role is set
      setAccess(userDetails.access || false); // Set access boolean field
    }
  }, [userDetails]);

  const handleSearch = async () => {
    if (!email) {
      toast.error('Please enter an email.');
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserDetails(userData);
        setUserDetails((prev) => ({ ...prev, id: querySnapshot.docs[0].id })); // Save the document ID
      } else {
        toast.error('No user found with this email.');
        setUserDetails(null);
      }
    } catch (error) {
      toast.error('Error fetching user data.');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = () => {
    if (!userDetails) return;

    setConfirmationVisible(true);
  };

  const confirmRoleChange = async () => {
    const hardcodedPassword = 'mcb121450'; // Replace with your actual hardcoded password

    if (password !== hardcodedPassword) {
      toast.error('Incorrect password.');
      return;
    }

    if (!userDetails) return;

    setLoading(true);

    try {
      const userRef = doc(db, 'users', userDetails.id); // Use document ID for the reference
      await updateDoc(userRef, { role: selectedRole }); // Update the role in Firestore
      toast.success('User role updated successfully.');
      setUserDetails((prev) => ({ ...prev, role: selectedRole })); // Update the local state
    } catch (error) {
      toast.error('Error updating user role.');
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
      setConfirmationVisible(false); // Hide the confirmation dialog after update
    }
  };

  const toggleAccess = async () => {
    if (!userDetails) return;

    setLoading(true);

    try {
      const userRef = doc(db, 'users', userDetails.id); // Use document ID for the reference
      await updateDoc(userRef, { access: !access }); // Toggle the access boolean in Firestore
      toast.success('User access updated successfully.');
      setUserDetails((prev) => ({ ...prev, access: !access })); // Update the local state
      setAccess(!access); // Toggle the access state
    } catch (error) {
      toast.error('Error updating user access.');
      console.error('Error updating user access:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      <div className="row">
        <div className="">
          <h3 className="admin-text-center mb-4">Search Users by Email</h3>
          <div className="admin-input-group mb-3">
            <input
              type="email"
              className="admin-form-control"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {userDetails && (
            <div className="admin-card mt-4 shadow-lg border-light">
              <div className="topdetail">
                <div className="admin-text-center mb-3">
                  {userDetails.photo && (
                    <img
                      src={userDetails.photo}
                      alt="User Photo"
                      className="admin-img-fluid admin-rounded-circle"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <h4 className="admin-card-title admin-text-center mb-3">
                  <strong>{userDetails.firstName} {userDetails.lastName}</strong>
                </h4>
              </div>
              <div className="admin-user-info">
                <p className="admin-card-text"><strong>First Name:</strong> {userDetails.firstName}</p>
                <p className="admin-card-text"><strong>Last Name:</strong> {userDetails.lastName}</p>
                <p className="admin-card-text"><strong>Phone:</strong> {userDetails.phone}</p>
                <p className="admin-card-text"><strong>Address:</strong> {userDetails.address}</p>
                <p className="admin-card-text"><strong>City:</strong> {userDetails.city}</p>
                <p className="admin-card-text"><strong>Access:</strong> {access ? "Yes" : "No"}</p>
                <p className="admin-card-text"><strong>Role:</strong> {userDetails.role}</p>
                <div className="admin-role-change">
                  <label htmlFor="role-select">Change Role:</label>
                  <select
                    id="role-select"
                    className="admin-form-control"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="admin-btn admin-btn-secondary mt-3"
                    onClick={handleRoleChange}
                    disabled={loading}
                  >
                    Change Role
                  </button>
                </div>
                <div className="admin-access-toggle mt-3">
                  <button
                    className={`admin-btn ${access ? 'admin-btn-danger' : 'admin-btn-success'}`}
                    onClick={toggleAccess}
                    disabled={loading}
                  >
                    {access ? 'Revoke Access' : 'Grant Access'}
                  </button>
                </div>
              </div>
            </div>
          )}
          {confirmationVisible && (
            <div className="admin-password-prompt mt-4">
              <div className="admin-card shadow-lg border-light">
                <div className="admin-card-body">
                  <h5 className="admin-text-center mb-3">Confirm Role Change</h5>
                  <p className="admin-text-center">Enter password to confirm role change:</p>
                  <input
                    type="password"
                    className="admin-form-control mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={confirmRoleChange}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Confirm'}
                  </button>
                  <button
                    className="admin-btn admin-btn-secondary mt-2"
                    onClick={() => setConfirmationVisible(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
