import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import "../assets/css/admin.css"; // Adjust the path as needed
import {
    MDBCollapse,
    MDBListGroup,
    MDBIcon
} from 'mdb-react-ui-kit';

const AppSidebar = ({ showShow }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
    const sidebarClass = showShow ? 'd-block full-height' : 'd-none';

    console.log('AppSidebar render:', { showShow });

    return (
        <MDBCollapse show={showShow} tag="nav" className={`bg-white sidebar ${sidebarClass}`}>
            <div className="">
                <MDBListGroup flush className="mx-3 mt-4">
                    <h3>Plant Pulse</h3>
                    
                    <Link to="/admin" className={`nav-link ${isActive('/admin')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <MDBIcon fas icon="tachometer-alt me-3" />
                        Main Dashboard
                    </Link>

                    

                    <Link to="/password" className={`nav-link ${isActive('/password')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <MDBIcon fas icon="lock me-3" />
                        Password
                    </Link>

                    <Link to="/analytics" className={`nav-link ${isActive('/analytics')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <MDBIcon fas icon="chart-line me-3" />
                        Analytics
                    </Link>

                    

                    <Link to="/users" className={`nav-link ${isActive('/users')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <MDBIcon fas icon="users me-3" />
                        Users
                    </Link>

                    
                </MDBListGroup>
            </div>
        </MDBCollapse>
    );
};

export default AppSidebar;
