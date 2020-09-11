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

	const cellHeight = (h - 2 * padding) / months.length;
	const cellWidth = w / Math.floor(data.length / months.length);

	const xScale = d3
		.scaleLinear()
		.domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleLinear()
		.domain([0, 11])
		.range([padding, h - padding]);

	const tempScale = d3
		.scaleLinear()
		.domain([d3.min(data, (d) => d[3]), d3.max(data, (d) => d[3])])
		.range([0, 11]);

	const svg = d3
		.select("#container")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	svg
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", "cell")
		.attr("data-month", (d) => d[1] - 1)
		.attr("data-year", (d) => d[0])
		.attr("data-temp", (d) => d[3])
		.attr("fill", (d) => colors[Math.floor(tempScale(d[3]))])
		.attr("x", (d) => xScale(d[0]))
		.attr("y", (d) => yScale(d[1] - 1))
		.attr("width", cellWidth)
		.attr("height", cellHeight - 2)
		.on("mouseover", (d, i) => {
			svg.append("tooltip");
			tooltip.style.top = yScale(i[1]) + 45 + "px";
			tooltip.style.left = xScale(i[0]) + 180 + "px";
			tooltip.style.display = "block";
			tooltip.setAttribute("data-year", i[0]);
			tooltip.innerHTML = `${i[0]} - ${months[i[1]]} <br> ${i[3].toFixed(
				2
			)}℃ <br> ${i[2].toFixed(2)}℃`;
		})
		.on("mouseout", () => {
			tooltip.style.display = "none";
		});

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

	const legend = d3
		.select("#legend")
		.append("svg")
		.attr("width", 220)
		.attr("height", 40);
	legend
		.selectAll("rect")
		.data(colors)
		.enter()
		.append("rect")
		.attr("x", (d, i) => i * 20)
		.attr("y", 0)
		.attr("width", (d) => 200 / colors.length)
		.attr("height", 40)
		.attr("fill", (d) => d);
};
