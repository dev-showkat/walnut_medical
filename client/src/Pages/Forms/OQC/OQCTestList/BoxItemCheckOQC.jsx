import { Button, Col, Row, Select, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BoxItemCheckOQC = ({ dataList2, IMEICode }) => {
  const [dataList, setDataList] = useState([]);
  const [dataList3, setDataList3] = useState([]);
  const [fullArr, setfullArr] = useState([]);
  const [Activekey, setActivekey] = useState(0);
  const selector = useSelector((state) => state.persistedReducer);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getData();
  }, [dataList2]);

  let { Option } = Select;

  const getData = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCartonEMI", {
        masterCartonNumber: IMEICode,
      })
      .then((result) => {
        let newData = [];
        if (result.length !== 0) {
          if (dataList2.length == 0) {
            let mono_carton = result.data[0].details[0].mono_carton;
            let standee = result.data[0].details[0].standee;

            mono_carton.map((x) => {
              newData.push({
                id: `mono${x.id}`,
                name: `Mono Carton ${x.id}`,
                imei: x.imei,
                status: { default: "ok", key: `mono${x.id}` },
              });
            });

            standee.map((x) => {
              newData.push({
                id: `standee${x.id}`,
                name: `Standee Box ${x.id}`,
                imei: x.imei,
                status: { default: "ok", key: `standee${x.id}` },
              });
            });

            let objArr = [];
            let objArr2 = [];

            let midNumber = newData.length / 2;

            setfullArr(newData);

            newData.map((x, i) => {
              // if (midNumber - 1 >= i) {
              objArr.push({
                id: x.id,
                name: x.name,
                imei: x.imei,
                status: x.status,
              });
              // } else {
              //   objArr2.push({
              //     id: x.id,
              //     name: x.name,
              //     imei: x.imei,
              //     status: x.status,
              //   });
              // }
            });

            setDataList(objArr);
            setDataList3(objArr2);
          } else {
            if (dataList2.bic.length == 0) {
              let newData = [];

              let mono_carton = result.data[0].details[0].mono_carton;
              let standee = result.data[0].details[0].standee;

              mono_carton.map((x) => {
                newData.push({
                  id: `mono${x.id}`,
                  name: `Mono Carton ${x.id}`,
                  imei: x.imei,
                  status: { default: "ok", key: `mono${x.id}` },
                });
              });

              standee.map((x) => {
                newData.push({
                  id: `standee${x.id}`,
                  name: `Standee Box ${x.id}`,
                  imei: x.imei,
                  status: { default: "ok", key: `standee${x.id}` },
                });
              });

              let objArr = [];
              let objArr2 = [];

              let midNumber = newData.length / 2;

              setfullArr(newData);

              newData.map((x, i) => {
                if (midNumber - 1 >= i) {
                  objArr.push({
                    id: x.id,
                    name: x.name,
                    imei: x.imei,
                    status: x.status,
                  });
                } else {
                  objArr2.push({
                    id: x.id,
                    name: x.name,
                    imei: x.imei,
                    status: x.status,
                  });
                }
              });

              setDataList(objArr);
              setDataList3(objArr2);
            } else {
              newData = dataList2.bic;

              setDataList(newData);

              let objArr = [];
              let objArr2 = [];

              let midNumber = newData.length / 2;

              setfullArr(newData);

              newData.map((x, i) => {
                if (midNumber - 1 >= i) {
                  objArr.push({
                    id: x.id,
                    name: x.name,
                    imei: x.imei,
                    status: x.status,
                  });
                } else {
                  objArr2.push({
                    id: x.id,
                    name: x.name,
                    imei: x.imei,
                    status: x.status,
                  });
                }
              });
              setDataList(objArr);
              setDataList3(objArr2);
            }
          }
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <Select
            placeholder="Select Status"
            allowClear
            defaultValue={status.default}
            style={{ minWidth: "100px", textAlign: "center" }}
            onChange={(value) => updateStatus(value, status.key)}
          >
            <Option value="ok">OK</Option>
            <Option value="notok">NOT OK</Option>
          </Select>
        );
      },
    },
  ];

  const updateStatus = (value, key) => {
    let arr = fullArr;
    arr.map((x) => {
      if (x.id === key) {
        x.status.default = value;
      }
    });
    setfullArr(arr);
  };

  const handleSubmit = () => {
    dataList.map((x) => {
      if (x.status.default === "notok") {
        console.log(x);
        let reviewArr = {
          batch: selector.LineLogin.active_batch,
          line: selector.LineLogin.line_name,
          master_carton: IMEICode,
          defect_list_name: "Box Items check",
          imei: x.imei,
          oqcl: x.name,
        };

        axios
          .post(process.env.REACT_APP_API_URL + "/addForReview", reviewArr)
          .then((result) => {
            console.log(result.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    let dataObj = {
      mc_imei_code: IMEICode,
      bic: fullArr,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/updateOQCTest", dataObj)
      .then((result) => {
        getData();

        messageApi.open({
          type: "success",
          content: "Saved",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {contextHolder}
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
              rowClassName={(record) => {
                return record.status.default === "notok" ? "not-ok-row" : "";
              }}
            />
          </Col>
          {/* <Col span={12} style={{ padding: "1rem" }}>
            <Table
              columns={columns}
              dataSource={dataList3}
              pagination={{
                position: ["none", "none"],
                pageSize: 50,
              }}
            />
          </Col> */}
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <div style={{ margin: "0 15px" }}>
            <Button className="lineModalButtonSUbmit2">Edit</Button>
          </div>
          <div>
            <Button
              className="lineModalButtonSUbmit"
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxItemCheckOQC;
