import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();
  const observerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const animateMainContent = () => {
      const mainContent = document.querySelectorAll('.main-content');
      mainContent.forEach((element, index) => {
        if (element.dataset.animated === 'true') {
          return;
        }

        element.dataset.animated = 'true';
        element.style.transition = `transform 0.5s ease-out ${index * 0.1}s, opacity 0.5s ease-out ${index * 0.1}s`;
        element.style.transform = 'translateY(-50px)';
        element.style.opacity = '0';

        setTimeout(() => {
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
        }, 100 + index * 100);
      });
    };

    document.querySelectorAll('.main-content').forEach((element) => {
      delete element.dataset.animated;
    });

    animateMainContent();

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver(() => {
      animateMainContent();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
