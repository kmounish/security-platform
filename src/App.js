import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/system-metrics')
      .then(response => response.json())
      .then(data => setData(data))
  },[]);
  // console.log(data.message);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>System Information</h1>
        <div>
                {data ? <p>Time: {data.timestamp}</p> : <p>Loading...</p>}
                {data ? <p>Memory Percent: {data.memory_percent}</p> : <p>Loading...</p>}
                {data ? <p>Disk Percent: {data.disk_percent}</p> : <p>Loading...</p>}
                {data ? <p>Network Connections: {data.network_connections}</p> : <p>Loading...</p>}
                {data ? <p>CPU Percent: {data.cpu_percent}</p> : <p>Loading...</p>}
        </div>

      </header>
      <Dashboard/>
    </div>
  );
}

export default App;
