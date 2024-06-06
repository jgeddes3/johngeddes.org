import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Add animation to main content with staggered effect
    const mainContent = document.querySelectorAll('.main-content');
    mainContent.forEach((element, index) => {
      element.style.transition = `transform 0.5s ease-out ${index * 0.1}s, opacity 0.5s ease-out ${index * 0.1}s`;
      element.style.transform = 'translateY(-50px)';
      element.style.opacity = '0';

      setTimeout(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
      }, 100 + index * 100);
    });

  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
