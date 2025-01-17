import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>My React Website</h1>
         <p> Hello World!</p>
      </header>
      <Dashboard/>
    </div>
  );
}

export default App;
