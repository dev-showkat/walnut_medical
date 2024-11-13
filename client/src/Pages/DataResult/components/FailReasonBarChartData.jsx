import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ChartDataLabels);

const FailReasonBarChartData = ({ FailData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // const sortedData = { ...FailData };
    // console.log(sortedData);
    // sortedData.datasets[0].data.sort((a, b) => {
    //   console.log(a, b);
    //   // if (sortOrder === "asc") {
    //   return a - b;
    //   // } else {
    //   //   return b - a;
    //   // }
    // });

    checkPassFailStatus(FailData);
  }, [FailData]);

  const checkPassFailStatus = (data) => {
    let DataLabelArr = [];
    let DataCountArr = [];
    let mainArr = [];

    let uniqueFailResons = new Set();
    let fail_reasons = data.filter((obj) => {
      if (!uniqueFailResons.has(obj.fail_reason)) {
        uniqueFailResons.add(obj.fail_reason);
        return true;
      }
      return false;
    });

    fail_reasons.map((x) => {
      let failCount = 0;
      data.map((y) => {
        if (x.fail_reason === y.fail_reason) {
          failCount++;
        }
      });

      mainArr.push({
        name: x.fail_reason,
        no: failCount,
      });

      DataLabelArr.push(x.fail_reason);
      DataCountArr.push(failCount);
    });

    mainArr = mainArr.slice().sort((a, b) => b.no - a.no);

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
      sort: {
        enable: true,
        mode: "array",
      },
    },
  };

  return (
    <div>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: "18px", fontWeight: "500" }}>Fail Resson</div>
      </div>
      <div>
        <Bar options={options} data={BarData} />
      </div>
    </div>
  );
};

export default FailReasonBarChartData;
