import './App.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './ThemeContext';
import StickyBar from './Components/ForEveryPage/Stickybar';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './Components/ForEveryPage/ScrollToTop';

import HomePage from './Components/Pages/Homepage';
import NotFoundPage from './Components/NotFoundPage';
import AboutPage from './Components/Pages/AboutPage';
import ProjectsPage from './Components/Pages/ProjectsPage';
import MiscPage from './Components/Pages/MiscPage';
import ContractsPage from './Components/Pages/HomePages/Contracts';
import FriendsPage from './Components/Pages/HomePages/Friends';
import PhilosophyPage from './Components/Pages/HomePages/Philosophy';
import SocialPage from './Components/Pages/HomePages/Social';
import RecruitersPage from './Components/Pages/HomePages/Recruiters';
import HikeAwayTours from './Components/Pages/ProjectPages/HikeAwayTours';
import ChessDeckMenu from './Components/Pages/ProjectPages/ChessDeckMenu';
import ChessDeckCase from './Components/Pages/ProjectPages/ChessDeckCase';
import ChessDeck from './Components/Pages/ProjectPages/ChessDeck';
import ChessDeckComputer from './Components/Pages/ProjectPages/ChessDeckComputer';
import ChessDeckOnline from './Components/Pages/ProjectPages/ChessDeckOnline';
import DrinkDecider from './Components/Pages/ProjectPages/DrinkDecider';
import ExcelWorkBooks from './Components/Pages/ProjectPages/ExcelWorkBooks';
import CipherTracker from './Components/Pages/ProjectPages/CipherTracker';
import RamblerRegistrar from './Components/Pages/ProjectPages/RamblerRegistrar';
import PaperTrail from './Components/Pages/ProjectPages/PaperTrail';
import SnipeIT from './Components/Pages/ProjectPages/SnipeIT';
import WeatherApp from './Components/Pages/ProjectPages/WeatherApp';
import { reviews } from './reviews';
import ReviewPage from './reviews/ReviewPage';
import { essays } from './philosophy';
import EssayPage from './philosophy/EssayPage';

function App() {
  return (
    <HelmetProvider>
    <ThemeProvider>
    <MotionConfig reducedMotion="user">
    <Router>
      <ScrollToTop />
      <div className="App">
        <a className="skip-link" href="#main">Skip to content</a>
        <StickyBar />
        <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/misc" element={<MiscPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/philosophy" element={<PhilosophyPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/recruiters" element={<RecruitersPage />} />
           {/* Projects Page*/}
          <Route path="/HikeAwayTours" element={<HikeAwayTours />} />
          <Route path="/ATourismApp" element={<Navigate to="/HikeAwayTours" replace />} />
          <Route path="/ChessDeck" element={<ChessDeckCase />} />
          <Route path="/ChessDeck/play" element={<ChessDeckMenu />} />
          <Route path="/ChessDeck/local" element={<ChessDeck />} />
          <Route path="/ChessDeck/computer" element={<ChessDeckComputer />} />
          <Route path="/ChessDeck/online/:peerId?" element={<ChessDeckOnline />} />
          <Route path="/DrinkDecider" element={<DrinkDecider />} />
          <Route path="/ExcelWorkBooks" element={<ExcelWorkBooks />} />
          <Route path="/CipherTracker" element={<CipherTracker />} />
          <Route path="/RamblerRegistrar" element={<RamblerRegistrar />} />
          <Route path="/PaperTrail" element={<PaperTrail />} />
          <Route path="/SnipeIT" element={<SnipeIT />} />
          <Route path="/WeatherApp" element={<WeatherApp />} />
          {/* Reviews & recipes — every entry in src/reviews/entries gets a route */}
          {reviews.map((r) => (
            <Route key={r.slug} path={`/${r.slug}`} element={<ReviewPage review={r} />} />
          ))}
          {/* Philosophy essays — every entry in src/philosophy/entries gets a route */}
          {essays.map((e) => (
            <Route key={e.slug} path={`/${e.slug}`} element={<EssayPage essay={e} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </main>
      </div>
    </Router>
    <SpeedInsights />
    </MotionConfig>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
