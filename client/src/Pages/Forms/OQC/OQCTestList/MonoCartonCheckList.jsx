import { Button, Col, Row, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const MonoCartonCheckList = ({ dataList2, IMEICode }) => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getData();
  }, [dataList2]);

  let navigate = useNavigate();

  const getData = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCartonEMI", {
        masterCartonNumber: IMEICode,
      })
      .then((result) => {
        let dataFound = result.data;
        let newData = [];

        if (dataFound.length !== 0) {
          let mono_carton = result.data[0].details[0].mono_carton;
          mono_carton.map((x) => {
            newData.push({
              id: `mono${x.id}`,
              name: `Mono Carton ${x.id}`,
              imei: x.imei,
              action: x.imei,
              status: { default: "ok", key: `mono${x.id}` },
              defects: x.defect,
            });
          });
          setDataList(newData);
        }
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: "S No.",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "IMEI Code",
      dataIndex: "imei",
      key: "imei",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: () => {
    //     return "Uncheck";
    //   },
    // },
    {
      title: "Defects",
      dataIndex: "defects",
      key: "defects",
      render: (status) => {
        console.log(status);
        return `${status}/10`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (status) => {
        return (
          <Button
            className="lineModalButtonSUbmit"
            style={{ width: "110px", padding: "15px" }}
            onClick={() => {
              console.log(status);
              navigate(`/MonoCartonSingleTesting/${IMEICode}/${status}`);
            }}
          >
            Start testing
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div>
        <Row style={{ width: "100%" }}>
          <Col span={24} style={{ padding: "1rem" }}>
            <Table
              columns={columns}
              dataSource={dataList}
              pagination={{
                position: ["none", "none"],
                pageSize: 50,
              }}
              rowClassName={(record) =>
                record.defects >= 1 ? "not-ok-row" : ""
              }
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MonoCartonCheckList;
