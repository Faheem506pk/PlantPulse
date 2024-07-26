import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { useLocation } from 'react-router-dom'; // Import useLocation
import "../assets/css/admin.css"; // Adjust the path as needed
import {
    MDBCollapse,
    MDBListGroup,
    MDBListGroupItem,
    MDBIcon,
    MDBRipple
} from 'mdb-react-ui-kit';

const AppSidebar = ({ showShow }) => {
    const location = useLocation();

    // Function to check if the link is active
    const isActive = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    // Conditional class for the sidebar visibility and height
    const sidebarClass = showShow ? 'd-block full-height' : 'd-none';

    console.log('AppSidebar render:', { showShow });

    return (
        <MDBCollapse show={showShow} tag="nav" className={`bg-white sidebar ${sidebarClass}`}>
            <div className="">
                <MDBListGroup flush className="mx-3 mt-4">
                    <h3>Plant Pulse</h3>
                    
                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/dashboard') + ' border-0 border-bottom rounded'}
                            aria-current='true'
                        >
                            <MDBIcon fas icon="tachometer-alt me-3" />
                            Main Dashboard
                        </MDBListGroupItem>
                    </MDBRipple>

                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/website-traffic') + ' border-0 border-bottom rounded'}
                        >
                            <MDBIcon fas icon="chart-area me-3" />
                            Website traffic
                        </MDBListGroupItem>
                    </MDBRipple>

                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/password') + ' border-0 border-bottom rounded'}
                        >
                            <MDBIcon fas icon="lock me-3" />
                            Password
                        </MDBListGroupItem>
                    </MDBRipple>

                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/analytics') + ' border-0 border-bottom rounded'}
                        >
                            <MDBIcon fas icon="chart-line me-3" />
                            Analytics
                        </MDBListGroupItem>
                    </MDBRipple>

                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/seo') + ' border-0 border-bottom rounded'}
                        >
                            <MDBIcon fas icon="chart-pie me-3" />
                            SEO
                        </MDBListGroupItem>
                    </MDBRipple>

                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/users') + ' border-0 border-bottom rounded'}
                        >
                            <MDBIcon fas icon="users me-3" />
                            Users
                        </MDBListGroupItem>
                    </MDBRipple>

                    <MDBRipple rippleTag='span'>
                        <MDBListGroupItem
                            tag='a'
                            href='#'
                            action
                            className={isActive('/sales') + ' border-0 rounded'}
                        >
                            <MDBIcon fas icon="money-bill me-3" />
                            Sales
                        </MDBListGroupItem>
                    </MDBRipple>
                </MDBListGroup>
            </div>
        </MDBCollapse>
    );
};

export default AppSidebar;
