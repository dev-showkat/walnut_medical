import { LogoutOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select, Table, Upload, message } from "antd";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

const MonoCartonSingleTesting = () => {
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

  const getData = (code) => {
    let dataObj = {
      mc_imei_code: parms.imei,
      ref_id: parms.id,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/getOQCTestSingle", dataObj)
      .then((result) => {
        if (result.data.length !== 0) {
          setDataList(result.data[0].data);
        } else {
          setDataList([
            {
              id: 1,
              name: "seal sticker on box",
              status: { default: "ok", key: 1 },
              defect_category: { default: "1", key: 1 },
              pictures: { default: [], key: 1 },
              remarks: { default: "", key: 1 },
            },
            {
              id: 2,
              name: "Sound box Mono carton sticker scratches/printing/tear-off/contents/ adhesive",
              status: { default: "ok", key: 2 },
              defect_category: { default: "1", key: 2 },
              pictures: { default: [], key: 2 },
              remarks: { default: "", key: 2 },
            },
            {
              id: 3,
              name: "Barcode IMEI sticker presence/scratch/printing/tilted",
              status: { default: "ok", key: 3 },
              defect_category: { default: "1", key: 3 },
              pictures: { default: [], key: 3 },
              remarks: { default: "", key: 3 },
            },
            {
              id: 4,
              name: "Check for user manual",
              status: { default: "ok", key: 4 },
              defect_category: { default: "1", key: 4 },
              pictures: { default: [], key: 4 },
              remarks: { default: "", key: 4 },
            },
            {
              id: 5,
              name: "Check for adaptor( 5v, 1 Amps)",
              status: { default: "ok", key: 5 },
              defect_category: { default: "1", key: 5 },
              pictures: { default: [], key: 5 },
              remarks: { default: "", key: 5 },
            },
            {
              id: 6,
              name: "BIS sticker presence on device.",
              status: { default: "ok", key: 6 },
              defect_category: { default: "1", key: 6 },
              pictures: { default: [], key: 6 },
              remarks: { default: "", key: 6 },
            },
            {
              id: 7,
              name: "Battery indicator sticker presence on device.",
              status: { default: "ok", key: 7 },
              defect_category: { default: "1", key: 7 },
              pictures: { default: [], key: 7 },
              remarks: { default: "", key: 7 },
            },
            {
              id: 8,
              name: "Dome Logo presence",
              status: { default: "ok", key: 8 },
              defect_category: { default: "1", key: 8 },
              pictures: { default: [], key: 8 },
              remarks: { default: "", key: 8 },
            },
            {
              id: 9,
              name: "Rubber feet presence and sticking  on device base body.4#",
              status: { default: "ok", key: 9 },
              defect_category: { default: "1", key: 9 },
              pictures: { default: [], key: 9 },
              remarks: { default: "", key: 9 },
            },
            {
              id: 10,
              name: "Shake the device to check unwanted material inside it.",
              status: { default: "ok", key: 10 },
              defect_category: { default: "1", key: 10 },
              pictures: { default: [], key: 10 },
              remarks: { default: "", key: 10 },
            },
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.status.default = value;
      }
    });
    setDataList(arr);
  };

  const updateDefect = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.defect_category.default = value;
      }
    });
    setDataList(arr);
  };

  const updateFileImage = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.pictures.default = name;
      }
    });
    setDataList(arr);
  };

  const updateText = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.remarks.default = name;
      }
    });
    setDataList(arr);
  };

  const columns = [
    {
      title: "Outgoing Quality Check list",
      dataIndex: "name",
      key: "name",
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
            <Option value="2">Functional</Option>
            <Option value="3">Aesthetic</Option>
            <Option value="4">Missing category</Option>
            <Option value="5">Other</Option>
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
    let totalDefeact = 0;

    dataList.map((x) => {
      if (x.status.default === "notok") {
        console.log(x);
        let reviewArr = {
          batch: selector.LineLogin.active_batch,
          line: selector.LineLogin.line_name,
          master_carton: IMEICode,
          defect_list_name: "Sound Box Outgoing Quality Check list",
          imei: parms.id,
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

        totalDefeact++;
      }
    });

    let dataObj = {
      mc_imei_code: IMEICode,
      ref_id: parms.id,
      data: dataList,
      totalDefeact,
    };
    axios
      .post(process.env.REACT_APP_API_URL + "/updateOQCTestSingle", dataObj)
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
      <Row style={{ alignItems: "center" }}>
        <Col span={10}>
          <span className="TopMenuTxt">
            Sound Box Outgoing Quality Check list
          </span>
        </Col>
        <Col span={7}>
          <span style={{ margin: "0 7px" }}>
            <span style={{ fontWeight: "600", marginRight: "10px" }}>
              Master Carton IMEI No. :
            </span>
            <span style={{ fontWeight: "400" }}>{IMEICode}</span>
          </span>
        </Col>
        <Col span={7} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            <Button
              type="text"
              style={{ backgroundColor: "#fff" }}
              className="topLogoutBtn"
            >
              {selector.LineLogin.line_name} (
              {new Date(
                selector.LineLogin.line_login_time
              ).toLocaleTimeString()}
              )
              <LogoutOutlined style={{ color: "red" }} />
            </Button>
          </span>
        </Col>
      </Row>
      <Row style={{ marginTop: "2rem", backgroundColor: "#fff" }}>
        <Col span={24}>
          <div>
            <Table
              columns={columns}
              dataSource={dataList}
              pagination={{
                position: ["none", "none"],
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
                <Button
                  className="lineModalButtonSUbmit2"
                  onClick={() => navigate(`/SondBoxOQCList/${parms.imei}`)}
                >
                  Back
                </Button>
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

export default MonoCartonSingleTesting;
