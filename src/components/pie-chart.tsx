import { useQuery } from "@tanstack/react-query";
import { fetchPokemonTypes } from "api/pokemon";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = (
  { favorites }: { favorites: string[] } = { favorites: [] }
) => {
  const { data, isLoading, error } = useQuery<{ [key: string]: number }>({
    queryKey: ["favorites"],
    queryFn: () => {
      if (!favorites || favorites.length === 0) return Promise.resolve({});
      return fetchPokemonTypes(favorites);
    },
  });

  // Build labels/values and generate randomized colors for each label
  const labels = data ? Object.keys(data) : [];
  const values = data ? Object.values(data) : [];

  const generateRandomColors = (count: number, alpha = 0.85) =>
    Array.from({ length: count }, () => {
      const h = Math.floor(Math.random() * 360);
      const s = 60 + Math.floor(Math.random() * 30); // 60–90%
      const l = 45 + Math.floor(Math.random() * 20); // 45–65%
      return `hsla(${h} ${s}% ${l}% / ${alpha})`;
    });

  // Only regenerate colors when the number of labels changes
  const backgroundColors = useMemo(
    () => generateRandomColors(labels.length),
    [labels.length]
  );

  const chartData = {
    datasets: [
      {
        label: "Favorite Types",
        data: values,
        backgroundColor: backgroundColors,
      },
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle" as const,
          boxWidth: 10,
        },
      },
    },
  };
  if (!data || data.length === 0) return null;
  isLoading && <div>Loading...</div>;

  return (
    <div className="grid col-span-12 p-5">
      <h1 className="text-lg font-medium">Types of Favorited Pokemon</h1>
      <Pie data={chartData} options={options} />
    </div>
  );
};
