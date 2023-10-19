import './App.css';
import React from 'react';
import StickyBar from './Components/ForEveryPage/Stickybar';
import HomePage from './Components/Homepage';

function App() {
  return (
    <div className="App">
      <StickyBar />
      <HomePage />
    </div>
  );
}

export default App;
