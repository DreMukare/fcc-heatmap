const tooltip = document.getElementById("tooltip");

fetch(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
	.then((res) => res.json())
	.then((data) => {
		createScatterPlot(
			data.map((d) => [
				parseTime(d.Time),
				d.Year,
				d.Name,
				d.Nationality,
				d.Doping,
			])
		);
	});
