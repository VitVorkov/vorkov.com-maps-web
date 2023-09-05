"use client";

import { MouseEvent, useRef } from "react";
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  Legend,
  Tooltip,
  ChartConfiguration,
  CategoryScale,
  InteractionItem,
} from "chart.js";
import { Chart, getElementAtEvent } from "react-chartjs-2";
import states10m from "../public/states-10m.json";
import { CountryStatus } from "./enums";
import { useUser } from "@auth0/nextjs-auth0/client";

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

ChartJS.register(
  Legend,
  Tooltip,
  CategoryScale,
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

export default function Home() {
  const chartRef = useRef<ChartJS<"choropleth">>(null);
  const { user, error, isLoading } = useUser();
  if (error) return <div>{error.message}</div>;

  const changeCountryStatus = (element: InteractionItem[]) => {
    if (!element.length || !data.labels) return;
    const { datasetIndex, index } = element[0];

    data.datasets[datasetIndex].data[index].value =
      data.datasets[datasetIndex].data[index].value === CountryStatus.VISITED
        ? CountryStatus.NOT_VISITED
        : CountryStatus.VISITED;
  };

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }
    changeCountryStatus(getElementAtEvent(chart, event));

    chart.update();
  };

  const testGetUser = async () => {
    const userEmail = user?.email ? user.email : "test@email.com";
    const response = await fetch(`api/user?name=${userEmail}`);
    const data = await response.json();
    console.log(data);
  };

  const testGetUserAuth = async () => {
    const userEmail = user?.email ? user.email : "test@email.com";
    const response = await fetch(`api/user-auth?email=${userEmail}`);
    const data = await response.json();
    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {isLoading && <div>Loading...</div>}
      {!user && !isLoading && (
        <div>
          You can{" "}
          <a href="/api/auth/login" className="underline">
            login in
          </a>{" "}
          to save visited countries on the map.
        </div>
      )}
      {user && !isLoading && (
        <div>
          You are logged in as {user.email}.{" "}
          <a href="/api/auth/logout" className="underline">
            Logout.
          </a>
        </div>
      )}
      <div>
        <Chart
          ref={chartRef}
          type="choropleth"
          data={config.data}
          options={config.options}
          width={600}
          height={500}
          onClick={onClick}
        ></Chart>
      </div>
      <button onClick={testGetUser}>TestGetUser</button>
      <button onClick={testGetUserAuth}>TextGetUserAuth</button>
    </main>
  );
}
