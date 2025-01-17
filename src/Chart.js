import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
];


//Create a component to display your charts using the library you installed.
function Chart(){
    return(
        <BarChart width={600} height={300} data={data}>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="name" />
         <YAxis />
         <Tooltip />
         <Legend />
         <Bar dataKey="pv" fill="#8884d8" />
         <Bar dataKey="uv" fill="#82ca9d" />
       </BarChart>
     );
}

export default Chart;
