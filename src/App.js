import logo from './logo.svg';
import './App.css';
import React from 'react';
import Background from './Components/Background';
import StickyBar from './Components/Stickybar';
import HomePage from './Components/Homepage';

function App() {
  return (
    <div className="App">
      <Background />
      <StickyBar />
      <HomePage />
    </div>
  );
}

export default App;
