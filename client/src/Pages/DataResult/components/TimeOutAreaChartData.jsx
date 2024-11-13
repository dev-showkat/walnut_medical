import React, { useEffect, useState } from "react";

import { Bar, Line } from "react-chartjs-2";

import "chart.js/auto";

const RetestBarChartData = ({ PassData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const [averageTime, setAverageTime] = useState(0);

  useEffect(() => {
    checkPassFailStatus(PassData);
  }, [PassData]);

  const checkPassFailStatus = (PassData) => {
    let DataLabelArr = [];
    let DataCountArr = [];

    PassData.map((x) => {
      let inputText = x.ver_res;
      const dataArray = inputText.split(", ");
      const resultObject = {};

      for (let i = 0; i < dataArray.length; i += 2) {
        const taskName = dataArray[i];
        const taskTime = parseFloat(dataArray[i + 1]);
        resultObject[taskName] = taskTime;
      }

      if (resultObject.Total_time === 5.27) {
        console.log(x);
      }

      DataLabelArr.push(new Date(x.createdAt).toLocaleString());
      DataCountArr.push(resultObject.Total_time);
    });

    let DataSetRender = {
      labels: DataLabelArr,
      datasets: [
        {
          fill: true,
          label: "Total Time",
          data: DataCountArr,
          borderColor: "#182e42a4",
          backgroundColor: "#2b3e50da",
        },
      ],
    };

    const sum = DataCountArr.reduce((acc, number) => acc + number, 0);

    const average = sum / DataCountArr.length;

    setAverageTime(average.toFixed(2));

    setBarData(DataSetRender);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Total Time",
      },
      datalabels: {
        display: false,
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
      <div>
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>Total Time</div>
          <div>Average Time :- {averageTime}</div>
        </div>
        <Line options={options} data={BarData} />
      </div>
    </div>
  );
};

export default RetestBarChartData;
