import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChartData = ({ PassData, FailData }) => {
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    checkPassFailStatus();
  }, [PassData]);

  const checkPassFailStatus = () => {
    setPassCount(PassData.length);
    setFailCount(FailData.length);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Test Result",
      },
      datalabels: {
        formatter: (value) => {
          return value;
        },
        color: "white",
      },
    },
  };

  const data = {
    labels: [""],
    datasets: [
      {
        label: "Pass",
        data: [passCount],
        backgroundColor: "#2b3e50",
      },
      {
        label: "Fail",
        data: [failCount],
        backgroundColor: "#5b7690",
      },
    ],
  };

  return (
    <div>
      <div>
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>Test Result</div>
        </div>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default BarChartData;
