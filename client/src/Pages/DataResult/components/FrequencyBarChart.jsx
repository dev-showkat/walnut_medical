import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  zoomPlugin
);

const FrequencyBarChart = ({ PassData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    checkPassFailStatus(PassData);
  }, [PassData]);

  const checkPassFailStatus = (data) => {
    let DataLabelArr = [];
    let DataCountArr = [];
    let mainArr = [];

    let uniqueFailResons = new Set();
    let allmodeuls = data.filter((obj) => {
      if (!uniqueFailResons.has(obj.ver_app)) {
        uniqueFailResons.add(obj.ver_app);
        return true;
      }
      return false;
    });

    allmodeuls.map((x) => {
      let moduleRepeatCount = 0;
      data.map((y) => {
        if (x.ver_app === y.ver_app) {
          moduleRepeatCount++;
        }
      });
      if (x.ver_app !== "module-tester-rd") {
        const extractedNumber = parseInt(x.ver_app?.match(/\d+/)?.[0], 10);

        mainArr.push({
          name: x.ver_app,
          no: moduleRepeatCount,
          id: extractedNumber,
        });
      }

      DataLabelArr.push(x.ver_app);
      DataCountArr.push(moduleRepeatCount);
    });

    mainArr = mainArr.slice().sort((a, b) => a.id - b.id);

    let DataSetRender = {
      labels: mainArr.map((item) => item.name),
      datasets: [
        {
          label: "Dataset 1",
          data: mainArr.map((item) => item.no),
          backgroundColor: "#2b3e50",
        },
      ],
    };

    setBarData(DataSetRender);
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Fail Resson",
      },
      datalabels: {
        formatter: (value) => {
          return value;
        },
        color: "white",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: "x",
        },
      },
    },
  };

  return (
    <div>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: "18px", fontWeight: "500" }}>Frequency</div>
      </div>
      <div>
        <Bar options={options} data={BarData} />
      </div>
    </div>
  );
};

export default FrequencyBarChart;
