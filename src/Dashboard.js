import React from "react";
import Chart from "./Chart";

//This will be the main container for your dashboard elements.
function Dashboard(data) {
	return (
		<div>
			<h1>Dashboard</h1>
			<Chart />
		</div>
	);
}

export default Dashboard;
