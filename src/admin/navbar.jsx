import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../assets/css/admin.css"; // Adjust the path as needed
import { auth } from "../hooks/useFirebaseData"; // Ensure correct path
import { toast } from 'react-toastify'; // Import toast for notifications
import { Link } from 'react-router-dom';
import { UserContext } from "../components/UserContext";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBadge,
    MDBCollapse
} from 'mdb-react-ui-kit';

export default function Navbar({ toggleSidebar, sidebarVisible }) {
    const navigate = useNavigate(); // Initialize useNavigate
    const { userDetails, loading } = useContext(UserContext);
    const [photoURL, setPhotoURL] = useState(userDetails?.photo || "./assets/images/default-photo.png");

    useEffect(() => {
        if (userDetails) {
            setPhotoURL(userDetails.photo || "./assets/images/default-photo.png");
        }
    }, [userDetails]);

    async function handleLogout() {
        try {
            await auth.signOut();
            navigate("/login"); // Use navigate for redirection
            toast.success("Admin logged out successfully!");
        } catch (error) {
            toast.error(`Error logging out: ${error.message}`);
        }
    }

    console.log('Sidebar visible in Navbar:', sidebarVisible); // Debugging line

    return (
        <MDBNavbar expand='lg' light bgColor='light' className="app-navbar">
            <MDBContainer fluid className="navbar-admin">
                <MDBNavbarNav className="d-flex flex-row align-items-center w-auto ">
                    <MDBNavbarToggler
                    className='me-3'
                        type='button'
                        aria-label='Toggle navigation'
                        onClick={() => {
                            console.log('Toggling sidebar visibility from Navbar'); // Debugging line
                            toggleSidebar(); // Call the passed function
                        }}
                    >
                        <i className="bi bi-list "></i>
                    </MDBNavbarToggler>
                    <MDBNavbarBrand className="d-flex justify-content-center align-items-center ">
                        <h3 className="title-name">Plant Pulse</h3>
                    </MDBNavbarBrand>
                </MDBNavbarNav>
                <MDBNavbarNav className="d-flex flex-row justify-content-end w-auto">
                    {/* Your other Navbar items */}
                    <MDBNavbarItem className='me-3 me-lg-0 d-flex align-items-center'>
                        <MDBDropdown>
                            <MDBDropdownToggle tag={Link}  className="hidden-arrow nav-link">
                                <img src={photoURL} className="rounded-circle dp-img" height="22" alt="Profile" loading="lazy" />
                            </MDBDropdownToggle>

                            <MDBDropdownMenu>
                                <MDBDropdownItem tag={Link} to="/admin/profile" className="list-group-item list-group-item-action border-0 p-1 rounded">My profile</MDBDropdownItem>
                                <MDBDropdownItem tag={Link} to="/admin/editprofile" className="list-group-item list-group-item-action border-0 p-1 rounded">Edit profile</MDBDropdownItem>
                                <MDBDropdownItem tag={Link} onClick={handleLogout} className="list-group-item list-group-item-action border-0 p-1 rounded">Logout</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBNavbarItem>
                </MDBNavbarNav>
            </MDBContainer>
        </MDBNavbar>
    );
}
