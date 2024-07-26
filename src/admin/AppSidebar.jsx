import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import "../assets/css/admin.css"; // Adjust the path as needed
import {
    MDBCollapse,
    MDBListGroup,
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBadge
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
                    <Link to="/admin" className={`nav-link ${isActive('/admin')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <i className="bi bi-speedometer2 me-3"></i>
                        Main Dashboard
                    </Link>

                    <Link to="/admin/graphs" className={`nav-link ${isActive('/admin/graphs')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <i className="bi bi-graph-up me-3"></i>
                        Graphs
                    </Link>

                    <Link to="/admin/presets" className={`nav-link ${isActive('/admin/presets')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <i className="bi bi-graph-up me-3"></i>
                        Presets
                    </Link>

                    <Link to="/admin/addnewpreset" className={`nav-link ${isActive('/admin/addnewpreset')} list-group-item list-group-item-action border-0 border-bottom rounded`}>
                        <i className="bi bi-lock me-3"></i>
                        Add New Preset
                    </Link>

                    <MDBDropdown>
                        <MDBDropdownToggle tag="a" className="nav-link list-group-item list-group-item-action border-0 border-bottom rounded d-flex align-items-center">
                            <i className="bi bi-people me-3"></i>
                            Users
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem tag={Link} to="/admin/addnewuser" className="list-group-item list-group-item-action border-0 border-bottom rounded">Add New User</MDBDropdownItem>
                            <MDBDropdownItem tag={Link} to="/admin/searchusers" className="list-group-item list-group-item-action border-0 border-bottom rounded">Search Users</MDBDropdownItem>
                            <MDBDropdownItem tag={Link} to="/admin/resetuserpassword" className="list-group-item list-group-item-action border-0 border-bottom rounded">Reset User Password</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBListGroup>
            </div>
        </MDBCollapse>
    );
};

export default AppSidebar;
