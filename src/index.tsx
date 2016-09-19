import * as React from "react";
import * as ReactDOM from "react-dom";
import * as L from "leaflet";

declare function require<T>(packageName: string): T;

require("leaflet/dist/leaflet.css");
require("./index.scss");

const map = L.map("maptoberfest");
(window as any).map = map;

L.Icon.Default.imagePath = "./images";

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  accessToken: "pk.eyJ1IjoiZ2lsYWRncmF5IiwiYSI6ImNpdDl5dHczNjAwNGQydHFkbjZnMDFxNDkifQ.6lH5nD6wyypIIRLp4LPyEw",
  attribution: "Mapbox",
  id: "giladgray/cit9yvyet001q2joxwj7u2svm",
  minZoom: 14,
  maxZoom: 18,
}).addTo(map);

function getTime(timestring: string) {
  // "20160918T143718+0200"
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\+(\d+)$/.exec(timestring);
  return `${match[4]}:${match[5]}`;
}

function getTimeRange(properties: MovesProperties) {
  return `${getTime(properties.startTime)} - ${getTime(properties.endTime)}`;
}

interface MovesActivity {
  activity: string;
  calories: number;
  distance: number;
  duration: number;
  endTime: string;
  group: string;
  manual: boolean;
  startTime: string;
  steps: number;
}

interface MovesPlace {
  facebookPlaceId: string;
  id: number;
  location: { lat: number, lon: number };
  name: string;
  type: string;
}

interface MovesProperties {
  activities: MovesActivity[];
  date: string;
  endTime: string;
  lastUpdate: string;
  place?: MovesPlace;
  startTime: string;
  type: string;
}

interface MovesGeoJsonData extends L.GeoJSON {
  type: string;
  geometry: {
    coordinates: [number, number] | [number, number][];
    type: string;
  };
  properties: MovesProperties;
}

const geojson = L.geoJson(require("./geojson/daily/storyline/storyline_20160918.geojson"), {
  style: (data) => ({ color: "blue" }),
  onEachFeature: ({ properties }: MovesGeoJsonData, layer: L.FeatureGroup<L.TileLayer>) => {
    if (properties.place != null) {
      layer.bindPopup(`
        <strong>${properties.place.name}</strong><br>
        ${getTimeRange(properties)}
      `);
    } else {
      const activity = properties.activities[0];
      const duration = Math.round(properties.activities[0].duration / 60);
      layer.bindPopup(`
        <strong>${duration} minutes ${activity.activity}</strong><br>
        ${getTimeRange(properties)}<br>
        ${activity.steps} steps
      `);
      layer.on("popupopen", () => layer.setStyle({ color: "green" }).bringToFront());
      layer.on("popupclose", () => layer.setStyle({ color: "blue" }));
    }
  },
});

map.addLayer(geojson);
map.setView(geojson.getBounds().getCenter(), 14);
