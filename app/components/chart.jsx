import React from "react";
import { ReactChart } from "chartjs-react";
import {
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";

// Register modules,
// this example for time scale and linear scale
ReactChart.register(
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

// options of chart similar to v2 with a few changes
// https://www.chartjs.org/docs/next/getting-started/v3-migration/
const chart = ({ reviews }) => {
  const dates = reviews.map((review) => review.date);
  const ratings = reviews.map((review) => parseFloat(review.rating));
  const difficulties = reviews.map((review) => parseFloat(review.difficulty));

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Rating",
        data: ratings,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Difficulty",
        data: difficulties,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const chartOption = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ratings and Difficulty Over Time",
      },
    },
  };

  return (
    <ReactChart
      type="line"
      data={chartData}
      options={chartOption}
      height={400}
    />
  );
};

export default chart;
