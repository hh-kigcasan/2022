mapboxgl.accessToken = "pk.eyJ1IjoibWlsYWdvczA5IiwiYSI6ImNsMjRmOWJmZDF1MHkzaXBleTR1bjUxN20ifQ.OzT3SJ6oNTgIS_cogJCx_Q";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v11",
    center: [122.5735878359785, 10.692826384501162],
    zoom: 14,
});
