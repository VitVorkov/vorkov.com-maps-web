import states10m from "../../public/states-10m.json";
import * as ChartGeo from "chartjs-chart-geo";
import { CountryStatus } from "../enums";
import { ChartConfiguration } from "chart.js";

const mapNation = (
  ChartGeo.topojson.feature(
    states10m as any,
    states10m.objects.nation as any
  ) as ChartGeo.Feature
).features[0];
const mapStates = (
  ChartGeo.topojson.feature(
    states10m as any,
    states10m.objects.states as any
  ) as ChartGeo.Feature
).features;

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
        value: CountryStatus.NOT_VISITED,
      })),
    },
  ],
};

export const config: ChartConfiguration<"choropleth"> = {
  type: "choropleth",
  data,
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      projection: {
        axis: "x",
        projection: "albersUsa",
      },
      color: {
        display: false,
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
