import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';  // Add some custom styles for the 404 page
import Background from './ForEveryPage/Background';

const NotFoundPage = () => {
  return (
    <>
    <Background />
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="back-home-button">Go Back Home</Link>
    </div>
    </>
  );
};

export default NotFoundPage;
