"use client";

import { MouseEvent, useRef, useEffect, useState } from "react";
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  Legend,
  Tooltip,
  CategoryScale,
  InteractionItem,
} from "chart.js";
import { Chart, getElementAtEvent } from "react-chartjs-2";
import { CountryStatus } from "./enums";
import { useUser } from "@auth0/nextjs-auth0/client";
import { data, config } from "./maps/world-map";

ChartJS.register(
  Legend,
  Tooltip,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

export default function Home() {
  const chartRef = useRef<ChartJS<"choropleth">>(null);
  const [countriesCounter, setCountriesCounter] = useState(0);
  const { user, error, isLoading } = useUser();
  if (error) return <div>{error.message}</div>;

  useEffect(() => {
    const getCountries = async () => {
      if (!user?.email) return;
      await fetch(
        process.env.NEXT_PUBLIC_NEXT_URL + `/api/users?email=${user?.email}`
      );

      const { current: chart } = chartRef;

      if (!chart) return;

      const response = await fetch(
        process.env.NEXT_PUBLIC_NEXT_URL +
          `/api/countries/all?email=${user?.email}`
      );
      const dataResponse = await response.json();

      setCountriesCounter(dataResponse.length);

      for (const item of dataResponse) {
        if (data.labels?.find((e) => e === item.name)) {
          const countryIndex = data.labels.indexOf(item.name);
          data.datasets[0].data[countryIndex].value = CountryStatus.VISITED;
        }
        chart.update();
      }
    };
    getCountries();
    testUserNoAuth();
  }, [user]);

  const changeCountryStatus = (element: InteractionItem[]) => {
    if (!element.length || !data.labels) return;
    const { datasetIndex, index } = element[0];

    if (
      data.datasets[datasetIndex].data[index].value === CountryStatus.VISITED
    ) {
      data.datasets[datasetIndex].data[index].value = CountryStatus.NOT_VISITED;
      setCountriesCounter(countriesCounter - 1);
    } else {
      data.datasets[datasetIndex].data[index].value = CountryStatus.VISITED;
      setCountriesCounter(countriesCounter + 1);
    }
  };

  const updateVisitedCountries = async (element: InteractionItem[]) => {
    if (!element.length || !data.labels || !user?.email) return;
    const { index } = element[0];

    await fetch(
      process.env.NEXT_PUBLIC_NEXT_URL +
        `/api/countries/update?email=${user.email}&country=${data.labels[index]}`
    );
  };

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;
    if (!chart) return;

    changeCountryStatus(getElementAtEvent(chart, event));
    updateVisitedCountries(getElementAtEvent(chart, event));

    chart.update();
  };

  const testUserNoAuth = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_NEXT_URL + `/api/users-no-auth`
    );

    const dataResponse = await res.json();
    console.log(dataResponse);
  };

  return (
    <main className="flex min-h-screen flex-col items-center h-screen">
      {isLoading && <div>Loading...</div>}
      {!user && !isLoading && (
        <div className="text-center h-[15%] justify-center align-middle flex flex-col">
          <div>
            You can{" "}
            <a href="/api/auth/login" className="underline">
              login in
            </a>{" "}
            to save visited countries on the map.
          </div>
        </div>
      )}
      {user && !isLoading && (
        <div className="text-center h-[15%] justify-center align-middle flex flex-col">
          <div>
            You are logged in as {user.email}.{" "}
            <a href="/api/auth/logout" className="underline">
              Logout.
            </a>
          </div>
          <div>You have visited {countriesCounter} countries</div>
        </div>
      )}
      {!isLoading && (
        <div className="w-[85%] h-[80%]">
          <Chart
            className="bg-slate-500 rounded-2xl h-auto min-h-min"
            ref={chartRef}
            type="choropleth"
            data={config.data}
            options={config.options}
            onClick={onClick}
          ></Chart>
        </div>
      )}
    </main>
  );
}
