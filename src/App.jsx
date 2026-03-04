import './App.css';
import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './ThemeContext';
import StickyBar from './Components/ForEveryPage/Stickybar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './Components/ForEveryPage/ScrollToTop';

import HomePage from './Components/Pages/Homepage';
import NotFoundPage from './Components/NotFoundPage';

const AboutPage = React.lazy(() => import('./Components/Pages/AboutPage'));
const ProjectsPage = React.lazy(() => import('./Components/Pages/ProjectsPage'));
const MiscPage = React.lazy(() => import('./Components/Pages/MiscPage'));
const ContractsPage = React.lazy(() => import('./Components/Pages/HomePages/Contracts'));
const FriendsPage = React.lazy(() => import('./Components/Pages/HomePages/Friends'));
const PhilosophyPage = React.lazy(() => import('./Components/Pages/HomePages/Philosophy'));
const SocialPage = React.lazy(() => import('./Components/Pages/HomePages/Social'));
const RecruitersPage = React.lazy(() => import('./Components/Pages/HomePages/Recruiters'));
const ATourismApp = React.lazy(() => import('./Components/Pages/ProjectPages/ATourismApp'));
const ChessDeckMenu = React.lazy(() => import('./Components/Pages/ProjectPages/ChessDeckMenu'));
const ChessDeck = React.lazy(() => import('./Components/Pages/ProjectPages/ChessDeck'));
const ChessDeckComputer = React.lazy(() => import('./Components/Pages/ProjectPages/ChessDeckComputer'));
const ChessDeckOnline = React.lazy(() => import('./Components/Pages/ProjectPages/ChessDeckOnline'));
const DrinkDecider = React.lazy(() => import('./Components/Pages/ProjectPages/DrinkDecider'));
const ExcelWorkBooks = React.lazy(() => import('./Components/Pages/ProjectPages/ExcelWorkBooks'));
const CipherTracker = React.lazy(() => import('./Components/Pages/ProjectPages/CipherTracker'));
const RamblerRegistrar = React.lazy(() => import('./Components/Pages/ProjectPages/RamblerRegistrar'));
const ReactNativeCreditCardApp = React.lazy(() => import('./Components/Pages/ProjectPages/ReactNativeCreditCardApp'));
const SnipeITTag = React.lazy(() => import('./Components/Pages/ProjectPages/SnipeITTag'));
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
const GeneralPhilosophy = React.lazy(() => import('./Components/Pages/PhilosophyPages/GeneralPhilosophy'));

function App() {
  return (
    <HelmetProvider>
    <ThemeProvider>
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
            <Route path="/ChessDeck" element={<ChessDeckMenu />} />
            <Route path="/ChessDeck/local" element={<ChessDeck />} />
            <Route path="/ChessDeck/computer" element={<ChessDeckComputer />} />
            <Route path="/ChessDeck/online" element={<ChessDeckOnline />} />
            <Route path="/ChessDeck/online/:peerId" element={<ChessDeckOnline />} />
            <Route path="/DrinkDecider" element={<DrinkDecider />} />
            <Route path="/ExcelWorkBooks" element={<ExcelWorkBooks />} />
            <Route path="/CipherTracker" element={<CipherTracker />} />
            <Route path="/RamblerRegistrar" element={<RamblerRegistrar />} />
            <Route path="/ReactNativeCreditCardApp" element={<ReactNativeCreditCardApp />} />
            <Route path="/SnipeITTag" element={<SnipeITTag />} />
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
            {/* Philosophy Pages */}
            <Route path="/phil1" element={<GeneralPhilosophy />} />
            {/* Misc. Page Recipes*/}
            <Route path="/AmazingBurgerRecipe" element={<AmazingBurgerRecipe />} />
            <Route path="/MimosaRecipe" element={<MimosaRecipe/>} />
            <Route path="/CrockPotChilli" element={<CrockPotChilli/>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
