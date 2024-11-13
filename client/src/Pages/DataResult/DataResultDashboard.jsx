import React from "react";
import { Tabs } from "antd";
import DataResultOneDay from "./DataResultOneDay";
import DataResultCurrent from "./DataResultCurrent";

const DataResultDashboard = () => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Today Live Data",
      children: <DataResultCurrent />,
    },
    {
      key: "2",
      label: "Data By Date",
      children: <DataResultOneDay />,
    },
  ];
  return (
    <div>
      <Tabs centered defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default DataResultDashboard;
