import "./App.css";
import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import { ArrowUpDown } from "lucide-react";

function App() {
	const [data, setData] = useState(null);
	const [processes, setProcess] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: "ascending",
	});
	const [metricDictionary, setDict] = useState({
		memory: [],
		cpu: [],
		disk: [],
	});
	// console.log('test')
	const MAX_ARRAY_SIZE = 20;

	useEffect(() => {
		//Fetch statics of system
		const fetchdata = async () => {
			try {
				const response = await fetch(
					"http://127.0.0.1:5000/api/system-metrics",
				);
				const data = await response.json();
				setData(data);

				setDict((prevDict) => {
					const newDict = { ...prevDict };

					newDict.memory = [
						...prevDict.memory,
						parseFloat(data.memory_percent),
					];
					newDict.cpu = [...prevDict.cpu, parseFloat(data.cpu_percent)];
					newDict.disk = [...prevDict.disk, parseFloat(data.disk_percent)];

					Object.keys(newDict).forEach((key) => {
						if (newDict[key].length > MAX_ARRAY_SIZE) {
							newDict[key] = newDict[key].slice(-MAX_ARRAY_SIZE);
						}
					});
					return newDict;
				});
			} catch (error) {
				console.error("Error:", error);
			}
		};

		//Get statistics on an interval of 5 seconds
		const intervalFetch = setInterval(fetchdata, 5000);
		return () => clearInterval(intervalFetch);
	}, []);

	const processFetch = async () => {
		try {
			const response = await fetch("http://127.0.0.1:5000/api/process-info");
			const processData = await response.json();
			setProcess(processData);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		const intervalFetch = setInterval(processFetch, 10000);
		return () => clearInterval(intervalFetch);
	}, []);

	const handleSort = (key) => {
		let direction = "ascending";
		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const sortedData = React.useMemo(() => {
		if (!sortConfig.key) return processes;

		const sorted = [...processes].sort((a, b) => {
			let aValue, bValue;

			// Extract numeric values for percentage columns
			if (
				sortConfig.key === "cpu_percent" ||
				sortConfig.key === "memory_percent"
			) {
				aValue = Number(a[sortConfig.key]);
				bValue = Number(b[sortConfig.key]);
			} else {
				aValue = a[sortConfig.key];
				bValue = b[sortConfig.key];
			}

			// Handle the sorting direction
			if (aValue < bValue) {
				return sortConfig.direction === "ascending" ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortConfig.direction === "ascending" ? 1 : -1;
			}
			return 0;
		});
		return sorted;
	}, [processes, sortConfig]);

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold mb-6">System Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				{/* System Info */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-sm font-medium text-gray-600">System Info</h2>
					</div>
					<div className="space-y-2">
						<p className="text-sm">Hostname: </p>
						{data ? <p>Time: {data.timestamp}</p> : <p>Loading...</p>}
						{data ? (
							<p>Memory Percent: {data.memory_percent}</p>
						) : (
							<p>Loading...</p>
						)}
						{data ? (
							<p>Disk Percent: {data.disk_percent}</p>
						) : (
							<p>Loading...</p>
						)}
						{data ? (
							<p>Network Connections: {data.network_connections}</p>
						) : (
							<p>Loading...</p>
						)}
						{data ? <p>CPU Percent: {data.cpu_percent}</p> : <p>Loading...</p>}
						<p>{navigator.platform || "Unkown"}</p>
						<p>{navigator.deviceMemory || "Unkown"}</p>
						{navigator.userAgent.split(") ")[0].split("(")[1]}
						<p>{metricDictionary ? metricDictionary["memory"] : 0}</p>
					</div>
				</div>

				{/*Processes Display */}
				<div className="bg-white rounded-lg shadow-md p-6 overflow-auto max-h-96">
					<table max-h-96>
						<thead>
							<tr>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
									<div
										className="flex items-center space-x-1"
										onClick={() => handleSort("name")}
									>
										<span>Program Name</span>
										<ArrowUpDown className="h-4 w-4" />
									</div>
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
									<div
										className="flex items-center space-x-1"
										onClick={() => handleSort("cpu_percent")}
									>
										<span>CPU Usage</span>
										<ArrowUpDown className="h-4 w-4" />
									</div>
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
									<div
										className="flex items-center space-x-1"
										onClick={() => handleSort("memory_percent")}
									>
										<span>Memory Usage</span>
										<ArrowUpDown className="h-4 w-4" />
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{sortedData.map((item, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="px-6 py-4 text-sm text-gray-800">
										{item["name"]}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center">
											<div className="w-full bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-blue-600 h-2.5 rounded-full"
													style={{ width: `${item["cpu_percent"]}%` }}
												></div>
											</div>
											<span className="ml-2 text-sm text-gray-600">
												{item["cpu_percent"]}%
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center">
											<div className="w-full bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-green-600 h-2.5 rounded-full"
													style={{ width: `${item["memory_percent"]}%` }}
												></div>
											</div>
											<span className="ml-2 text-sm text-gray-600">
												{item["memory_percent"]}%
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* CPU, Disk, RAM Graphs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				{/* CPU Usage Graph */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-bold text-center mb-4">CPU % Usage</h2>
					<Chart data={metricDictionary["cpu"]} />
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
		</div>
	);
}

export default App;
