const tooltip = document.getElementById("tooltip");

fetch(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
	.then((res) => res.json())
	.then((data) => {
		const { baseTemperature, monthlyVariance } = data;
		console.log(monthlyVariance);

		createHeatMap(
			monthlyVariance.map((d) => [
				d.year,
				d.month,
				d.variance,
				baseTemperature - d.variance,
			])
		);
	});

const colors = [
	"#a50026",
	"#d73027",
	"#f46d43",
	"#fdae61",
	"#fee090",
	"#ffffbf",
	"#e0f3f8",
	"#abd9e9",
	"#74add1",
	"#4575b4",
	"#313695",
];

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const createHeatMap = (data) => {
	const h = 400;
	const w = 800;
	const padding = 60;

	const xScale = d3
		.scaleLinear()
		.domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleLinear()
		.domain([0, 11])
		.range([padding, h - padding]);

	console.log(data);

	const svg = d3
		.select("#container")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	const yAxis = d3.axisLeft(yScale).tickFormat((month) => {
		const date = new Date(0);
		date.setUTCMonth(month);
		return d3.timeFormat("%B")(date);
	});

	svg
		.append("g")
		.attr("transform", `translate(0, ${h - padding})`)
		.attr("id", "x-axis")
		.call(xAxis);

	svg
		.append("g")
		.attr("transform", `translate(${padding}, 0)`)
		.attr("id", "y-axis")
		.call(yAxis);
};
