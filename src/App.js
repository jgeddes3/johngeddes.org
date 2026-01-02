import './App.css';
import React, { Suspense } from 'react';
import StickyBar from './Components/ForEveryPage/Stickybar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
const ATourismApp = React.lazy(() => import('./Components/Pages/ProjectPages/ATourismApp'));
const ChessDeck = React.lazy(() => import('./Components/Pages/ProjectPages/ChessDeck'));
const DrinkDecider = React.lazy(() => import('./Components/Pages/ProjectPages/DrinkDecider'));
const ExcelWorkBooks = React.lazy(() => import('./Components/Pages/ProjectPages/ExcelWorkBooks'));
const InstagramBots = React.lazy(() => import('./Components/Pages/ProjectPages/InstagramBots'));
const RamblerRegistrar = React.lazy(() => import('./Components/Pages/ProjectPages/RamblerRegistrar'));
const ReactNativeCreditCardApp = React.lazy(() => import('./Components/Pages/ProjectPages/ReactNativeCreditCardApp'));
const SpotifyAstrologyApp = React.lazy(() => import('./Components/Pages/ProjectPages/SpotifyAstrologyApp'));
const WeatherApp = React.lazy(() => import('./Components/Pages/ProjectPages/WeatherApp'));
const BabelReview = React.lazy(() => import('./Components/Pages/MiscPages/BabelReview'));
const GoldenSonReview = React.lazy(() => import('./Components/Pages/MiscPages/GoldenSonReview'));
const HowToBlowUpAPipelineReview = React.lazy(() => import('./Components/Pages/MiscPages/HowToBlowUpAPipelineReview'));
const MorningStarReview = React.lazy(() => import('./Components/Pages/MiscPages/MorningStarReview'));
const MythOfSisyphusReview = React.lazy(() => import('./Components/Pages/MiscPages/MythOfSisyphusReview'));
const RedRisingReview = React.lazy(() => import('./Components/Pages/MiscPages/RedRisingReview'));
const WayOfKingsReview = React.lazy(() => import('./Components/Pages/MiscPages/WayOfKingsReview'));
const SparrowReview = React.lazy(() => import('./Components/Pages/MiscPages/SparrowReview'));
const TrivoliTavernReview = React.lazy(() => import('./Components/Pages/MiscPages/TrivoliTavernReview'));
const Hopleaf = React.lazy(() => import('./Components/Pages/MiscPages/Hopleaf'));
const AmazingBurgerRecipe = React.lazy(() => import('./Components/Pages/MiscPages/AmazingBurgerRecipe'));
const TavaFreshIndian = React.lazy(() => import('./Components/Pages/MiscPages/TavaFreshIndian'));
const MimosaRecipe = React.lazy(() => import('./Components/Pages/MiscPages/MimosaRecipe'));
const CrockPotChilli = React.lazy(() => import('./Components/Pages/MiscPages/CrockPotChilli'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <StickyBar />
        <Suspense fallback={<div />}>
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
            <Route path="/ATourismApp" element={<ATourismApp />} />
            <Route path="/ChessDeck" element={<ChessDeck />} />
            <Route path="/DrinkDecider" element={<DrinkDecider />} />
            <Route path="/ExcelWorkBooks" element={<ExcelWorkBooks />} />
            <Route path="/InstagramBots" element={<InstagramBots />} />
            <Route path="/RamblerRegistrar" element={<RamblerRegistrar />} />
            <Route path="/ReactNativeCreditCardApp" element={<ReactNativeCreditCardApp />} />
            <Route path="/SpotifyAstrologyApp" element={<SpotifyAstrologyApp />} />
            <Route path="/WeatherApp" element={<WeatherApp />} />
            {/* Misc. Page Resturants*/}
            <Route path="/Hopleaf" element={<Hopleaf />} />
            <Route path="/TrivoliTavernReview" element={<TrivoliTavernReview />} />
            <Route path="/SparrowReview" element={<SparrowReview />} />
            <Route path="/TavaFreshIndian" element={<TavaFreshIndian />} />
            {/* Misc. Page Books*/}
            <Route path="/BabelReview" element={<BabelReview />} />
            <Route path="/GoldenSonReview" element={<GoldenSonReview />} />
            <Route path="/HowToBlowUpAPipelineReview" element={<HowToBlowUpAPipelineReview />} />
            <Route path="/MorningStarReview" element={<MorningStarReview />} />
            <Route path="/MythOfSisyphusReview" element={<MythOfSisyphusReview />} />
            <Route path="/RedRisingReview" element={<RedRisingReview />} />
            <Route path="/WayOfKingsReview" element={<WayOfKingsReview />} />
            {/* Misc. Page Recipes*/}
            <Route path="/AmazingBurgerRecipe" element={<AmazingBurgerRecipe />} />
            <Route path="/MimosaRecipe" element={<MimosaRecipe/>} />
            <Route path="/CrockPotChilli" element={<CrockPotChilli/>} />
            <Route component={NotFoundPage} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
