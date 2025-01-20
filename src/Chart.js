import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Chart = ({ data }) => {
	const chartData = Array.isArray(data)
		? data.map((value, index) => ({
				name: index,
				value: value,
		  }))
		: [];

	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart data={chartData}>
				<XAxis dataKey="name" hide={true} />
				<YAxis domain={[0, 100]} />
				<Line
					type="monotone"
					dataKey="value"
					stroke="#8884d8"
					dot={false}
					isAnimationActive={false}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};
//Create a component to display your charts using the library you installed.

export default Chart;
