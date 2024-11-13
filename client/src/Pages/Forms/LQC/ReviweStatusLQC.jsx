import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Button,
  Result,
  Modal,
  Spin,
  Form,
  message,
  Input,
  Select,
  Upload,
  Table,
} from "antd";

import {
  EyeOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { logoutActiveLine } from "../../../Redux/Actions";
import TextArea from "antd/es/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const ReviewStatusLQC = () => {
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const selector = useSelector((state) => state.persistedReducer);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [Activekey, setActivekey] = useState(0);
  const [exitModel, setExitModel] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

  const [SoundBoxModel, setSoundBoxModel] = useState(false);
  useEffect(() => {
    checkLineActive();
    getSoundboxlinequalitychecklist(selector.LineLogin.line_name);
  }, []);

  const handleCloseexitModel = () => {
    setShowModal(false);
  };
  const SoundBoxModelCancel = () => {
    setSoundBoxModel(false);
  };

  const props = {
    name: "image",
    action: `${process.env.REACT_APP_API_URL}/uploadTestingImages`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        updateFileImage(Activekey, info.file.response);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const getSoundboxlinequalitychecklist = (line_name) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/getAllDefectedSoundboxlinequalitychecklist?line_name=${line_name}`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        let newData = [];

        data.forEach((item, index) => {
          const { _id, Soundboxlinequalitychecklist, ...rest } = item;

          Soundboxlinequalitychecklist.forEach((x, subIndex) => {
            if (x.status === "NOT OK") {
              newData.push({
                key: `${index}-${subIndex}`,
                id: _id,
                lqcl: x.lqcl,
                status: x.status,
                defect_category: x.defect_category,
                remarks: x.remarks,
                picture: x.picture,
                analysis_details: x.analysis_details,
                batch_number: rest.batch_number,
                ref_IMEI: rest.ref_IMEI,
                line_name: rest.line_name,
              });
            }
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    setExitModel(true);
  };
  const checkLineActive = () => {
    setLineLogedIn(selector.LineLogin.isLogedIn);
    setLineLineSelectedName(selector.LineLogin.line_name);
    setLineSelectedTime(new Date(selector.LineLogin.line_login_time));
  };
  const handleLineLogout = () => {
    setLineLogedIn(false);
    let logObj = {
      id: selector.LineLogin.line_id,
      time: new Date(),
    };
    axios
      .post(process.env.REACT_APP_API_URL + "/LogoutLine", logObj)
      .then((result) => {
        setExitModel(false);
        dispatch(logoutActiveLine());
        navigate("/sound_box");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOK = (id) => {
    setSoundBoxModel(true);
  };

  const handleImageClick = (picture) => {
    setPreviewImage(picture);
  };

  const handleImageClose = () => {
    setPreviewImage(null);
  };
  const columns = [
    {
      title: "Batch Number",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Line Number",
      dataIndex: "line_name",
      key: "line_name",
    },
    {
      title: "IMEI Code",
      dataIndex: "ref_IMEI",
      key: "ref_IMEI",
    },
    {
      title: "Line quality check list",
      dataIndex: "lqcl",
      key: "lqcl",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          placeholder="Select Status"
          allowClear
          style={{ minWidth: "100px", textAlign: "center" }}
          value={record.status}
          onChange={(value) => handleStatusChange(record.key, value)}
        >
          <Option value="OK">OK</Option>
          <Option value="NOT OK">NOT OK</Option>
        </Select>
      ),
    },
    {
      title: "Defect Category",
      dataIndex: "defect_category",
      key: "defect_category",
      render: (_, record) => (
        <Select
          placeholder="Select Any Defect"
          allowClear
          style={{ minWidth: "250px", textAlign: "center" }}
          value={record.defect_category}
          onChange={(value) => handleDefectCategoryChange(record.key, value)}
        >
          <Option value="Select Any Defect">Select Any Defect</Option>
          <Option value="Functional">Functional</Option>
          <Option value="Aesthetic">Aesthetic</Option>
          <Option value="Missing category">Missing category</Option>
          <Option value="Other">Other</Option>
        </Select>
      ),
    },
    {
      title: "Pictures",
      dataIndex: "picture",
      key: "picture",
      render: (_, record) => (
        <div style={{ paddingRight: "20px" }}>
          {record.picture ? (
            <div
              style={{
                paddingRight: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "3px" }}>{record.picture}</span>
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleImageClick(record.picture)}
                style={{ border: "none" }}
              />
              <Modal
                visible={previewImage !== null}
                onCancel={handleImageClose}
                footer={null}
              >
                <img
                  alt="Preview"
                  src={`${process.env.REACT_APP_API_URL}/testingImages/${previewImage}`}
                  style={{ width: "100%" }}
                />
              </Modal>
            </div>
          ) : (
            <span>No image available</span>
          )}
        </div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (_, record) => (
        <TextArea
          value={record.remarks}
          style={{ width: "220px" }}
          onChange={(e) => handleRemarksChange(record.key, e.target.value)}
        />
      ),
    },

    {
      title: "Review",
      key: "Review",
      render: (_, record) => (
        <div>
          <a onClick={() => handleOK(record.id)}>
            <span>
              <Button key="buy" type="primary" className="circular-button">
                {record.status}
              </Button>
            </span>
          </a>
        </div>
      ),
    },
  ];

  const handleStatusChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, status: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleDefectCategoryChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, defect_category: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleRemarksChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, remarks: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleImageChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].picture = value;
    setTableData(updatedTableData);
  };

  const handleImageRemove = (key) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].picture = "";
    setTableData(updatedTableData);
  };
  function updateFileImage(key, value) {
    form.setFieldsValue({
      [`picture_${key}`]: value,
    });
  }

  const handleSaveData = (ststus) => {
    const postData = tableData.map((item) => ({
      ...item,
      id: item.id,
      lqcl: item.lqcl,
      status: item.status,
      defect_category: item.defect_category,
      remarks: item.remarks,
      picture: item.picture,
      analysis_details: item.analysis_details,
    }));
    axios
      .post(process.env.REACT_APP_API_URL + "/api/updateData", {
        Soundboxlinequalitychecklist: postData,
        type: "LQC",
        IMEI_status: "Checked",
      })
      .then((response) => {
        message.success("Data saved successfully!");
        getSoundboxlinequalitychecklist(selector.LineLogin.line_name);
        setSoundBoxModel(false);
      })
      .catch((error) => {
        message.error("Error saving data.");
      });
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <span className="TopMenuTxt">Review Status</span>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            {LineLogedIn === true ? (
              <span style={{ margin: "0 7px" }}>
                <Button
                  onClick={() => handleLogout()}
                  type="text"
                  style={{ backgroundColor: "#fff" }}
                  className="topLogoutBtn"
                >
                  {LineSelectedName} ({LineSelectedTime.toLocaleTimeString()})
                  <LogoutOutlined style={{ color: "red" }} />
                </Button>
              </span>
            ) : (
              ""
            )}
          </span>
        </Col>
      </Row>
      <Modal
        title="Line Exit"
        visible={exitModel}
        onCancel={handleCloseexitModel}
        footer={null}
      >
        <Result
          status="logout"
          icon={<LogoutOutlined style={{ color: "#FF5C5C" }} />}
          subTitle={
            <span className="result-subtitle">
              Do you want to exit from this production line?
            </span>
          }
          extra={[
            <Button
              key="buy"
              onClick={handleCloseexitModel}
              className="circular-button cancle"
            >
              Cancel
            </Button>,
            <Button
              key="buy"
              type="primary"
              onClick={handleLineLogout}
              className="circular-button"
            >
              Ok
            </Button>,
          ]}
        />
      </Modal>
      <Modal open={SoundBoxModel} onCancel={SoundBoxModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Update Status</span>
              </Col>
              <Col
                span={24}
                style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
              >
                <img src="./SVG/check.svg" />
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                Sound Box defect is now successfully fixed?
              </Col>
              <Col span={24} style={{ padding: "2rem  3rem 0" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <div>
                    <Button
                      className="lineModalButtonSUbmit2"
                      onClick={() => handleSaveData("NOT OK")}
                    >
                      NOT OK
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="lineModalButtonSUbmit"
                      onClick={() => handleSaveData("OK")}
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Row style={{ marginTop: "2rem" }}>
        <Col span={24} style={{ backgroundColor: "#fff", padding: "20px" }}>
          <div style={{ overflowX: "auto" }}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={true}
              rowClassName={(record) =>
                record.status === "NOT OK" ? "not-ok-row" : ""
              }
              style={{ marginTop: "15px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          ></div>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewStatusLQC;
