import React, { useEffect } from 'react';

const ScrollObserver = ({ onScrollUp, onScrollDown }) => {
  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY) {
        onScrollDown();
      } else if (currentScrollY < lastScrollY) {
        onScrollUp();
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollUp, onScrollDown]);

  return null;
};

export default ScrollObserver;
