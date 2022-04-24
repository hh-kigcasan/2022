const fetchPHTopoJsons = async () => {
	const geoJson = "./topojson/regions.0.01.json";
	// const municities = [
	// 	"./topojson/municities/municities-province-ph012800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph012900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph013300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph015500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph020900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph021500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph023100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph025000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph025700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph030800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph031400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph034900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph035400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph037700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph036900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph037100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph037700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph041000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph042100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph043400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph045600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph045800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph050500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph051600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph051700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph052000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph054100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph056200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph060400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph060600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph061900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph063000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph067900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph071200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph072200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph076100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph082600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph083700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph084800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph086000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph086400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph087800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph097200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph097300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph098300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph099700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph101300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph101800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph103500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph104200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph104300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph112300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph112400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph112500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph118200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph118600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph124700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph126300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph126500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph128000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph129800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph133900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph137400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph137500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph137600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph140100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph141100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph142700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph143200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph144400000.0.01.json",
	// 	"./topojson/municities/municities-province-ph148100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph150700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph153600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph153800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph156600000.0.01.json",
	// 	"./topojson/municities/municities-province-ph157000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph160200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph160300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph166700000.0.01.json",
	// 	"./topojson/municities/municities-province-ph166800000.0.01.json",
	// 	"./topojson/municities/municities-province-ph168500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph174000000.0.01.json",
	// 	"./topojson/municities/municities-province-ph175100000.0.01.json",
	// 	"./topojson/municities/municities-province-ph175200000.0.01.json",
	// 	"./topojson/municities/municities-province-ph175300000.0.01.json",
	// 	"./topojson/municities/municities-province-ph175900000.0.01.json",
	// 	"./topojson/municities/municities-province-ph184500000.0.01.json",
	// 	"./topojson/municities/municities-province-ph184600000.0.01.json",
	// ];
	const provinces = [
		"./topojson/provinces/provinces-region-ph010000000.0.01.json",
		"./topojson/provinces/provinces-region-ph020000000.0.01.json",
		"./topojson/provinces/provinces-region-ph030000000.0.01.json",
		"./topojson/provinces/provinces-region-ph040000000.0.01.json",
		"./topojson/provinces/provinces-region-ph050000000.0.01.json",
		"./topojson/provinces/provinces-region-ph060000000.0.01.json",
		"./topojson/provinces/provinces-region-ph070000000.0.01.json",
		"./topojson/provinces/provinces-region-ph080000000.0.01.json",
		"./topojson/provinces/provinces-region-ph090000000.0.01.json",
		"./topojson/provinces/provinces-region-ph100000000.0.01.json",
		"./topojson/provinces/provinces-region-ph110000000.0.01.json",
		"./topojson/provinces/provinces-region-ph120000000.0.01.json",
		"./topojson/provinces/provinces-region-ph130000000.0.01.json",
		"./topojson/provinces/provinces-region-ph140000000.0.01.json",
		"./topojson/provinces/provinces-region-ph150000000.0.01.json",
		"./topojson/provinces/provinces-region-ph160000000.0.01.json",
		"./topojson/provinces/provinces-region-ph170000000.0.01.json",
		"./topojson/provinces/provinces-region-ph180000000.0.01.json",
	];
	const json = [];

	json.push(await d3.json(geoJson));
	for (let i = 0; i < provinces.length; i++) {
		json.push(await d3.json(provinces[i]));
	}

	return json;
};

const displayMap = async () => {
	const dimensions = {
		width: 768,
		height: 1280,
	};

	const geoJson = await fetchPHTopoJsons();

	const svg = d3
		.select("#d3-ph-map")
		.append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height)
		.style("overflow", "auto");

	const projection = d3
		.geoMercator()
		.scale(2500)
		.center([122, 12])
		.translate([dimensions.width / 2, dimensions.height / 2]);

	const path = d3.geoPath(projection);

	svg.append("g")
		.attr("class", "country")
		.selectAll("path")
		.data(geoJson[0].features)
		.enter()
		.append("path")
		.attr("d", path);

	const infoText = d3
		.select("#d3-ph-map")
		.append("text")
		.style("font", "20px sans-serif");

	const tooltip = d3
		.select("#d3-ph-map")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	const onMouseHover = (d) => {
		svg.selectAll(".geopath")
			.filter(
				(td) =>
					td.properties.ADM2_PCODE ===
					d.path[0].__data__.properties.ADM2_PCODE
				//console.log(td.properties)
			)
			.attr("fill", "red");
		tooltip.transition().duration(200).style("opacity", 0.9);
		tooltip
			.text(d.path[0].__data__.properties.ADM2_EN)
			.style("position", "absolute")
			.style("left", d.clientX + "px")
			.style("top", d.clientY - 25 + "px");
		infoText.text(d.path[0].__data__.properties.ADM2_EN);
	};

	const onMouseLeave = (d) => {
		svg.selectAll(".geopath")
			.filter(
				(td) =>
					td.properties.ADM2_PCODE ===
					d.path[0].__data__.properties.ADM2_PCODE
			)
			.attr("fill", "#999");
		tooltip.transition().duration(500).style("opacity", 0);
		infoText.text("");
	};

	const Enter = (enter) => {
		enter
			.append("path")
			.attr("d", path)
			.attr("stroke", "black")
			.attr("fill", "#999")
			.classed("geopath", true)
			.on("mouseover", onMouseHover)
			.on("mouseleave", onMouseLeave);
	};
	const Update = null;
	const Exit = null;

	for (let i = 1; i < geoJson.length; i++) {
		svg.append("g")
			.attr("class", "municities")
			.selectAll(".geopath")
			.data(geoJson[i].features)
			.join(Enter, Update, Exit);
	}
};

displayMap();
