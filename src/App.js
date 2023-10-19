import './App.css';
import React from 'react';
import StickyBar from './Components/ForEveryPage/Stickybar';
import HomePage from './Components/Pages/Homepage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AboutPage from './Components/Pages/AboutPage';
import ProjectsPage from './Components/Pages/ProjectsPage';
import MiscPage from './Components/Pages/MiscPage';
import ContactPage from './Components/Pages/ContactPage';

function App() {
  return (
    <Router>
      <div className="App">
        <StickyBar />
        <Routes>
          <Route path="/" element={<HomePage />} index />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/misc" element={<MiscPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
