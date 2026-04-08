import './App.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './ThemeContext';
import StickyBar from './Components/ForEveryPage/Stickybar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import ATourismApp from './Components/Pages/ProjectPages/ATourismApp';
import ChessDeckMenu from './Components/Pages/ProjectPages/ChessDeckMenu';
import ChessDeck from './Components/Pages/ProjectPages/ChessDeck';
import ChessDeckComputer from './Components/Pages/ProjectPages/ChessDeckComputer';
import ChessDeckOnline from './Components/Pages/ProjectPages/ChessDeckOnline';
import DrinkDecider from './Components/Pages/ProjectPages/DrinkDecider';
import ExcelWorkBooks from './Components/Pages/ProjectPages/ExcelWorkBooks';
import CipherTracker from './Components/Pages/ProjectPages/CipherTracker';
import RamblerRegistrar from './Components/Pages/ProjectPages/RamblerRegistrar';
import ReactNativeCreditCardApp from './Components/Pages/ProjectPages/ReactNativeCreditCardApp';
import SnipeIT from './Components/Pages/ProjectPages/SnipeIT';
import WeatherApp from './Components/Pages/ProjectPages/WeatherApp';
import BabelReview from './Components/Pages/MiscPages/BabelReview';
import GoldenSonReview from './Components/Pages/MiscPages/GoldenSonReview';
import HowToBlowUpAPipelineReview from './Components/Pages/MiscPages/HowToBlowUpAPipelineReview';
import MorningStarReview from './Components/Pages/MiscPages/MorningStarReview';
import MythOfSisyphusReview from './Components/Pages/MiscPages/MythOfSisyphusReview';
import RedRisingReview from './Components/Pages/MiscPages/RedRisingReview';
import WayOfKingsReview from './Components/Pages/MiscPages/WayOfKingsReview';
import KatabasisReview from './Components/Pages/MiscPages/KatabasisReview';
import WillOfTheManyReview from './Components/Pages/MiscPages/WillOfTheManyReview';
import StrengthOfTheFewReview from './Components/Pages/MiscPages/StrengthOfTheFewReview';
import RecursionReview from './Components/Pages/MiscPages/RecursionReview';
import BriefHistoryOfIntelligenceReview from './Components/Pages/MiscPages/BriefHistoryOfIntelligenceReview';
import SunAlsoRisesReview from './Components/Pages/MiscPages/SunAlsoRisesReview';
import ProjectHailMaryReview from './Components/Pages/MiscPages/ProjectHailMaryReview';
import LiesOfLockeLamoraReview from './Components/Pages/MiscPages/LiesOfLockeLamoraReview';
import RedSeasUnderRedSkiesReview from './Components/Pages/MiscPages/RedSeasUnderRedSkiesReview';
import RepublicOfThievesReview from './Components/Pages/MiscPages/RepublicOfThievesReview';
import SparrowReview from './Components/Pages/MiscPages/SparrowReview';
import TrivoliTavernReview from './Components/Pages/MiscPages/TrivoliTavernReview';
import Hopleaf from './Components/Pages/MiscPages/Hopleaf';
import AmazingBurgerRecipe from './Components/Pages/MiscPages/AmazingBurgerRecipe';
import TavaFreshIndian from './Components/Pages/MiscPages/TavaFreshIndian';
import MimosaRecipe from './Components/Pages/MiscPages/MimosaRecipe';
import CrockPotChilli from './Components/Pages/MiscPages/CrockPotChilli';
import GeneralPhilosophy from './Components/Pages/PhilosophyPages/GeneralPhilosophy';

function App() {
  return (
    <HelmetProvider>
    <ThemeProvider>
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
          <Route path="/ChessDeck" element={<ChessDeckMenu />} />
          <Route path="/ChessDeck/local" element={<ChessDeck />} />
          <Route path="/ChessDeck/computer" element={<ChessDeckComputer />} />
          <Route path="/ChessDeck/online/:peerId?" element={<ChessDeckOnline />} />
          <Route path="/DrinkDecider" element={<DrinkDecider />} />
          <Route path="/ExcelWorkBooks" element={<ExcelWorkBooks />} />
          <Route path="/CipherTracker" element={<CipherTracker />} />
          <Route path="/RamblerRegistrar" element={<RamblerRegistrar />} />
          <Route path="/ReactNativeCreditCardApp" element={<ReactNativeCreditCardApp />} />
          <Route path="/SnipeIT" element={<SnipeIT />} />
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
          <Route path="/KatabasisReview" element={<KatabasisReview />} />
          <Route path="/WillOfTheManyReview" element={<WillOfTheManyReview />} />
          <Route path="/StrengthOfTheFewReview" element={<StrengthOfTheFewReview />} />
          <Route path="/RecursionReview" element={<RecursionReview />} />
          <Route path="/BriefHistoryOfIntelligenceReview" element={<BriefHistoryOfIntelligenceReview />} />
          <Route path="/SunAlsoRisesReview" element={<SunAlsoRisesReview />} />
          <Route path="/ProjectHailMaryReview" element={<ProjectHailMaryReview />} />
          <Route path="/LiesOfLockeLamoraReview" element={<LiesOfLockeLamoraReview />} />
          <Route path="/RedSeasUnderRedSkiesReview" element={<RedSeasUnderRedSkiesReview />} />
          <Route path="/RepublicOfThievesReview" element={<RepublicOfThievesReview />} />
          {/* Philosophy Pages */}
          <Route path="/phil1" element={<GeneralPhilosophy />} />
          {/* Misc. Page Recipes*/}
          <Route path="/AmazingBurgerRecipe" element={<AmazingBurgerRecipe />} />
          <Route path="/MimosaRecipe" element={<MimosaRecipe/>} />
          <Route path="/CrockPotChilli" element={<CrockPotChilli/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
    <SpeedInsights />
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
