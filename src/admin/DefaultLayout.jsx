import React, { useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import Navbar from './navbar'; // Adjust path as needed
import AppContent from './AppContent'; // Adjust the path as needed


const DefaultLayout = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);

    useEffect(() => {
        // Function to update screen size
        const handleResize = () => {
            const largeScreen = window.innerWidth > 992;
            setIsLargeScreen(largeScreen);
            // Reset sidebar visibility if switching from small to large screen
            if (largeScreen) {
                setSidebarVisible(true); // Show sidebar on large screens
            } else {
                setSidebarVisible(false); // Hide sidebar on small screens
            }
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        if (!isLargeScreen) { // Only toggle sidebar on small screens
            setSidebarVisible(prev => !prev);
        }
    };

    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
            <div className="main-layout-admin">
                <AppSidebar showShow={sidebarVisible} /> {/* Pass sidebarVisible as showShow */}
                <div className={`main-content-admin ${sidebarVisible && !isLargeScreen ? 'hide-on-small' : ''}`}>
                    <AppContent />
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
