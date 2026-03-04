import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();
  const observerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const animateMainContent = () => {
      const mainContent = document.querySelectorAll('.main-content');
      let animated = false;
      mainContent.forEach((element, index) => {
        if (element.dataset.animated === 'true') {
          return;
        }

        animated = true;
        element.dataset.animated = 'true';
        element.style.transition = `transform 0.5s ease-out ${index * 0.1}s, opacity 0.5s ease-out ${index * 0.1}s`;
        element.style.transform = 'translateY(-50px)';
        element.style.opacity = '0';

        setTimeout(() => {
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
        }, 100 + index * 100);
      });
      return animated;
    };

    document.querySelectorAll('.main-content').forEach((element) => {
      delete element.dataset.animated;
    });

    animateMainContent();

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Use rAF inside observer so animation runs after browser layout
    observerRef.current = new MutationObserver(() => {
      requestAnimationFrame(() => {
        animateMainContent();
      });
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fallback: retry after a delay for lazy-loaded components
    // whose DOM may not exist when the route first changes
    const retryTimer = setTimeout(() => {
      animateMainContent();
    }, 400);

    return () => {
      clearTimeout(retryTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
