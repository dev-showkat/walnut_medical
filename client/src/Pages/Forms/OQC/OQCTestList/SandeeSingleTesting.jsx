import { LogoutOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select, Table, Upload, message } from "antd";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

const SandeeSingleTesting = ({ dataList2 }) => {
  const [IMEICode, setIMEICode] = useState();
  const selector = useSelector((state) => state.persistedReducer);
  const parms = useParams();
  const [dataList, setDataList] = useState([]);
  const [Activekey, setActivekey] = useState(0);

  const navigate = useNavigate();

  let { Option } = Select;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setIMEICode(parms.imei);
    getData();
  }, []);

  const props = {
    name: "image",
    action: `${process.env.REACT_APP_API_URL}/uploadTestingImages`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        updateFileImage(info.file.response, Activekey);
      } else if (info.file.status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
  };

  const getData = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCartonEMI", {
        masterCartonNumber: parms.imei,
      })
      .then((result) => {
        if (dataList2.sbcl != undefined && dataList2.sbcl.length != 0) {
          // console.log(dataList2);
          setDataList(dataList2.sbcl);
        } else {
          let dataFound = result.data;
          if (dataFound.length !== 0) {
            let standee = dataFound[0].details[0].standee;

            let newData = [];

            standee.map((x, i) => {
              newData.push({
                id: x.id,
                sno: `Standee Box ${x.id}`,
                name: `In standee box check for  ${x.id} no. Standees.`,
                imei: x.imei,
                defect_category: { default: "1", key: x.id },
                status: { default: "ok", key: x.id },
                pictures: { default: [], key: x.id },
                remarks: { default: "", key: x.id },
              });
            });
            setDataList(newData);
          }
        }
      });
  };

  const updateDefect = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.defect_category.default = value;
      }
    });
    setDataList(arr);
  };

  const updateFileImage = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.pictures.default = name;
      }
    });
    setDataList(arr);
  };

  const updateText = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.remarks.default = name;
      }
    });
    setDataList(arr);
  };

  const updateStatus = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.status.default = value;
      }
    });

    console.log(arr);

    setDataList(arr);
  };

  const columns = [
    {
      title: "S No.",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "Outgoing Quality Check list",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "IMEI Code",
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: "Defect Category",
      dataIndex: "defect_category",
      key: "defect_category",
      render: (defect) => {
        return (
          <Select
            placeholder="Select Any Defect"
            allowClear
            style={{ minWidth: "150px", textAlign: "center" }}
            defaultValue={defect.default}
            onChange={(value) => updateDefect(value, defect.key)}
          >
            <Option value="1">Select Any Defect</Option>
            <Option value="2">Aesthetic</Option>
            <Option value="3">Fitment</Option>
            <Option value="4">Other</Option>
          </Select>
        );
      },
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
            style={{ minWidth: "100px", textAlign: "center" }}
            defaultValue={status.default}
            onChange={(value) => updateStatus(value, status.key)}
          >
            <Option value="ok">OK</Option>
            <Option value="notok">NOT OK</Option>
          </Select>
        );
      },
    },
    {
      title: "Pictures",
      dataIndex: "pictures",
      key: "pictures",
      render: (data) => {
        return (
          <div style={{ paddingRight: "20px" }}>
            <Upload
              {...props}
              maxCount={1}
              onClick={() => setActivekey(data.key)}
            >
              <Button icon={<UploadOutlined />}>Upload image</Button>
            </Upload>
          </div>
        );
      },
    },
    {
      title: "Piece Missing",
      dataIndex: "piecemMssing",
      key: "piecemMssing",
      render: (remarks) => {
        return 1;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (remarks) => {
        return (
          <Input.TextArea
            defaultValue={remarks.default}
            onChange={(value) => updateText(value.target.value, remarks.key)}
          />
        );
      },
    },
  ];

  const handleSubmit = () => {

    dataList.map((x) => {
      if (x.status.default === "notok") {


        let reviewArr = {
          batch: selector.LineLogin.active_batch,
          line: selector.LineLogin.line_name,
          master_carton: IMEICode,
          defect_list_name: "Standee Box check List",
          imei: x.imei,
          oqcl: x.name,
          pictures: x.pictures.default,
          defect_category: x.defect_category.default,
          remarks: x.remarks.default,
        };

        axios
          .post(process.env.REACT_APP_API_URL + "/addForReview", reviewArr)
          .then((result) => {
            // console.log(result.data);
          })
          .catch((err) => {
            console.log(err);
          });

  

      }
    })


    let dataObj = {
      mc_imei_code: IMEICode,
      sbcl: dataList,
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
      <Row style={{ marginTop: "2rem", backgroundColor: "#fff" }}>
        <Col span={24}>
          <div>
            <Table
              columns={columns}
              dataSource={dataList}
              pagination={{
                position: ["none", "none"],
              }}
              rowClassName={(record) => {
                return record.status.default === "notok" ? "not-ok-row" : "";
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ margin: "0 15px" }}>
                {/* <Button
                  className="lineModalButtonSUbmit2"
                  onClick={() => navigate(`/SondBoxOQCList/${parms.imei}`)}
                >
                  Back
                </Button> */}
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
        </Col>
      </Row>
    </div>
  );
};

export default SandeeSingleTesting;
