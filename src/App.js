import './App.css';
import React from 'react';
import StickyBar from './Components/ForEveryPage/Stickybar';
import HomePage from './Components/Pages/Homepage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NotFoundPage from './Components/NotFoundPage';
import AboutPage from './Components/Pages/AboutPage';
import ProjectsPage from './Components/Pages/ProjectsPage';
import MiscPage from './Components/Pages/MiscPage';
import ContractsPage from './Components/Pages/HomePages/Contracts';
import FriendsPage from './Components/Pages/HomePages/Friends';
import PhilosophyPage from './Components/Pages/HomePages/Philosophy';
import SocialPage from './Components/Pages/HomePages/Social';
import RecruitersPage from './Components/Pages/HomePages/Recruiters';
import ScrollToTop from './Components/ForEveryPage/ScrollToTop';
import ATourismApp from './Components/Pages/ProjectPages/ATourismApp';
import ChessDeck from './Components/Pages/ProjectPages/ChessDeck';
import DrinkDecider from './Components/Pages/ProjectPages/DrinkDecider';
import ExcelWorkBooks from './Components/Pages/ProjectPages/ExcelWorkBooks';
import InstagramBots from './Components/Pages/ProjectPages/InstagramBots';
import RamblerRegistrar from './Components/Pages/ProjectPages/RamblerRegistrar';
import ReactNativeCreditCardApp from './Components/Pages/ProjectPages/ReactNativeCreditCardApp';
import SpotifyAstrologyApp from './Components/Pages/ProjectPages/SpotifyAstrologyApp';
import WeatherApp from './Components/Pages/ProjectPages/WeatherApp';
import BabelReview from './Components/Pages/MiscPages/BabelReview';
import GoldenSonReview from './Components/Pages/MiscPages/GoldenSonReview';
import HowToBlowUpAPipelineReview from './Components/Pages/MiscPages/HowToBlowUpAPipelineReview';
import MorningStarReview from './Components/Pages/MiscPages/MorningStarReview';
import MythOfSisyphusReview from './Components/Pages/MiscPages/MythOfSisyphusReview';
import RedRisingReview from './Components/Pages/MiscPages/RedRisingReview';
import WayOfKingsReview from './Components/Pages/MiscPages/WayOfKingsReview';
import SparrowReview from './Components/Pages/MiscPages/SparrowReview';
import TrivoliTavernReview from './Components/Pages/MiscPages/TrivoliTavernReview';
import Hopleaf from './Components/Pages/MiscPages/Hopleaf';
import AmazingBurgerRecipe from './Components/Pages/MiscPages/AmazingBurgerRecipe';
import TavaFreshIndian from './Components/Pages/MiscPages/TavaFreshIndian';
import MimosaRecipe from './Components/Pages/MiscPages/MimosaRecipe';
import CrockPotChilli from './Components/Pages/MiscPages/CrockPotChilli';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <StickyBar />
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
      </div>
    </Router>
  );
}

export default App;
