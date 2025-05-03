"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughNout = ({userData}) => {
  const data = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Solved",
        data: [userData.easy.solved, userData.medium.solved, userData.hard.solved],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "95%", // controls the doughnut thickness
    plugins: {
      legend: {
        display: false
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};

export default DoughNout;
