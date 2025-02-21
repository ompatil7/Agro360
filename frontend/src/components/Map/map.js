/* eslint-disable */

maptilersdk.config.apiKey = "DrLHBz4sGQJTXNNCWdc3";
const locations = [
  { coordinates: [76.6552, 12.3052] },
  {
    coordinates: [76.6707, 12.2732],
  },
  {
    coordinates: [76.5726, 12.4224],
  },
];
//console.log("my locations", locations);
const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: locations[0].coordinates,
  zoom: 7,
});

locations.forEach((location) => {
  // Create a custom marker element
  const el = document.createElement("div");
  el.className = "marker";
  //   // You can add any custom styling or content to your marker element
  //   marker.innerHTML = '<img src="path/to/your-marker-icon.png" alt="Marker">';

  // Set the marker's position
  const { coordinates } = location;
  //console.log(location);
  //console.log(coordinates);
  const lngLat = new maptilersdk.LngLat(coordinates[0], coordinates[1]);

  // Add the marker to the map
  new maptilersdk.Marker({ element: el, anchor: "bottom" })
    .setLngLat(lngLat)
    .addTo(map);
});
