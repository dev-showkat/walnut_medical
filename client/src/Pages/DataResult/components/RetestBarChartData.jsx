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

const RetestBarChartData = ({ FailData, allData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    checkPassFailStatus();
  }, [FailData]);

  const checkPassFailStatus = () => {
    let DataLabelArr = [];
    let DataSetLabelArr = [];
    let DataCountArr = [];
    let mainArr = [];

    FailData.map((x) => {
      let retest_count = 0;
      allData.map((y) => {
        if (x.imei === y.imei) {
          retest_count++;
          x.retest_count = retest_count;
        }
      });
    });

    FailData.map((x) => {
      if (x.ver_app !== "none") {
        const extractedNumber = parseInt(x.ver_app.match(/\d+/)[0], 10);
        mainArr.push({
          name: x.ver_app,
          no: x.retest_count,
          imei: x.imei,
          id: extractedNumber,
        });
        DataLabelArr.push(x.ver_app);
        DataCountArr.push(x.retest_count);
        DataSetLabelArr.push(x.imei);
      }
    });
    mainArr = mainArr.slice().sort((a, b) => a.id - b.id);

    let DataSetRender = {
      fill: true,
      labels: mainArr.map((item) => item.name),
      datasets: [
        {
          label: "Dataset 1",
          imei: mainArr.map((item) => item.imei),
          data: mainArr.map((item) => item.no),
          backgroundColor: "#2b3e50",
        },
      ],
    };

    setBarData(DataSetRender);
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (d) => {
            return `IMEI :- ${d.dataset.imei[d.dataIndex]}`;
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Re-Test",
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
        <div style={{ fontSize: "18px", fontWeight: "500" }}>Re-Test</div>
      </div>
      <div>
        <Bar options={options} data={BarData} />
      </div>
    </div>
  );
};

export default RetestBarChartData;
