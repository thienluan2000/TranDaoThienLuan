import React from 'react';
import logo from './logo.svg';
import './App.css';
import CurrencyConversion from './components/CurrencyConversion';

function App() {
  return (
    <div className="App flex h-screen bg-gradient-to-tr from-gray-400 via-gray-200 to-teal-300 w-full justify-center items-center">
      <CurrencyConversion />
    </div>
  );
}

export default App;
