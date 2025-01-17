import './App.css';
import Dashboard from './Dashboard';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    //Fetch statics of system
    const fetchdata = async () =>{
      const response = await fetch('http://127.0.0.1:5000/api/system-metrics');
      const data = await response.json();
      setData(data);
    };
    
    //Get statistics on an interval of 5 seconds 
    const intervalFetch = setInterval(fetchdata, 5000);
    return () => clearInterval(intervalFetch); 
  },[]);
  
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">System Dashboard</h1>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-600">System Info</h2>
            </div>
            <div className="space-y-2">
                <p className="text-sm">Hostname: </p>
                {data ? <p>Time: {data.timestamp}</p> : <p>Loading...</p>}
                {data ? <p>Memory Percent: {data.memory_percent}</p> : <p>Loading...</p>}
                {data ? <p>Disk Percent: {data.disk_percent}</p> : <p>Loading...</p>}
                {data ? <p>Network Connections: {data.network_connections}</p> : <p>Loading...</p>}
                {data ? <p>CPU Percent: {data.cpu_percent}</p> : <p>Loading...</p>}
                <p>{navigator.platform || 'Unkown'}</p>
                <p>{navigator.deviceMemory || 'Unkown'}</p>
                {navigator.userAgent.split(') ')[0].split('(')[1]}
            </div>
          </div>
        </div>
        

      
      <Dashboard/>
    </div>
  );
}

export default App;
