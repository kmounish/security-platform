import './App.css';
import React, { useEffect, useState } from 'react';
import Chart from './Chart';

function App() {
  const [data, setData] = useState(null)
  const [metricDictionary, setDict] = useState({
    memory:[],
    cpu:[],
    disk:[]
  });
  
  const MAX_ARRAY_SIZE =20;

  useEffect(() => {
    //Fetch statics of system
    const fetchdata = async () =>{
      try{
        const response = await fetch('http://127.0.0.1:5000/api/system-metrics');
        const data = await response.json();
        setData(data);

        setDict(prevDict =>{
          const newDict = {...prevDict};

          newDict.memory = [...prevDict.memory, parseFloat(data.memory_percent)];
          newDict.cpu = [...prevDict.cpu, parseFloat(data.cpu_percent)];
          newDict.disk = [...prevDict.disk, parseFloat(data.disk_percent)];

          Object.keys(newDict).forEach(key =>{
            if(newDict[key].length > MAX_ARRAY_SIZE){
              newDict[key] = newDict[key].slice(-MAX_ARRAY_SIZE);
            }
          });
          return newDict;
        });


      }catch(error){
        console.error('Error:', error);
      }
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
                <p>{metricDictionary ? metricDictionary["memory"]: 0}</p>
            </div>
          </div>

        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

          {/* CPU Usage Graph */}
          <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-center mb-4">CPU % Usage</h2>
              <Chart data={metricDictionary["cpu"]}/>
          </div>
          {/* Memory Usage Graph */}
          <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-center mb-4">Memory % Usage</h2>
              <Chart data={metricDictionary["memory"]} />
          </div>
          {/* Disk Usage Graph */}
          <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-center mb-4">Disk % Usage</h2>
              <Chart data={metricDictionary["disk"]} />
          </div>
 
        </div>
    
      {/* <Dashboard/> */}
    </div>
  );
}

export default App;
