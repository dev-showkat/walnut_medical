import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChartData = ({ PassData, FailData }) => {
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    checkPassFailStatus(PassData);
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
        formatter: (value, ctx) => {
          // Display the data labels with percentage and value
          return `${(
            (value / ctx.dataset.data.reduce((a, b) => a + b)) *
            100
          ).toFixed(2)}%`;
        },
        color: "white", // Set the color of the data labels
      },
    },
  };

  const data = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: ["Total Number"],
        data: [passCount, failCount],
        backgroundColor: ["#2b3e50", "#5b7690"],
        borderColor: ["#2b3e50", "#5b7690"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: "18px", fontWeight: "500" }}>Test Result</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <Pie options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default PieChartData;
