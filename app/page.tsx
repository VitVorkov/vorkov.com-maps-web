"use client";

import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  Legend,
  Tooltip,
  ChartConfiguration,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import states10m from "../public/states-10m.json";

const mapNation: ChartGeo.Feature = (
  ChartGeo.topojson.feature(
    states10m as any,
    states10m.objects.nation as any
  ) as ChartGeo.Feature
).features[0];
const mapStates: ChartGeo.Feature = (
  ChartGeo.topojson.feature(
    states10m as any,
    states10m.objects.states as any
  ) as ChartGeo.Feature
).features;

ChartJS.register(
  Legend,
  Tooltip,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

const labels = mapStates.map(
  (d: { properties: { name: any } }) => d.properties.name
);

export const data: ChartConfiguration<"choropleth">["data"] = {
  labels,
  datasets: [
    {
      label: "United States",
      outline: mapNation,
      data: mapStates.map((d: any) => ({
        feature: d,
        value: Math.random() * 10,
      })),
    },
  ],
};

export const config: ChartConfiguration<"choropleth"> = {
  type: "choropleth",
  data,
  options: {
    scales: {
      projection: {
        axis: "x",
        projection: "albersUsa",
      },
      color: {
        axis: "x",
        quantize: 5,
        legend: {
          position: "bottom-right",
          align: "right",
        },
      },
    },
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Chart
          type="choropleth"
          data={config.data}
          options={config.options}
        ></Chart>
      </div>
    </main>
  );
}
