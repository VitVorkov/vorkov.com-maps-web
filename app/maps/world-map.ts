import countries50m from "../../public/countries-110m.json";
import * as ChartGeo from "chartjs-chart-geo";
import { CountryStatus } from "../enums";
import { ChartConfiguration } from "chart.js";

const mapWorld = (
  ChartGeo.topojson.feature(
    countries50m as any,
    countries50m.objects.countries as any
  ) as ChartGeo.Feature
).features[0];

const mapCountries = (
  ChartGeo.topojson.feature(
    countries50m as any,
    countries50m.objects.countries as any
  ) as ChartGeo.Feature
).features;

const labels = mapCountries.map(
  (d: { properties: { name: any } }) => d.properties.name
);

export const data: ChartConfiguration<"choropleth">["data"] = {
  labels: labels,
  datasets: [
    {
      label: "World",
      data: mapCountries.map((d: any) => ({
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
    showOutline: true,
    maintainAspectRatio: false,
    showGraticule: true,
    onResize: function (chart) {
      chart.resize();
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label =
              context.dataset.data[context.dataIndex].feature.properties
                ?.name || "";
            return label;
          },
        },
      },
    },
    scales: {
      projection: {
        axis: "x",
        projection: "equalEarth",
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
