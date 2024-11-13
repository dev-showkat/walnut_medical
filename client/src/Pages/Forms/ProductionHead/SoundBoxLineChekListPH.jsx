import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Result,
  Modal,
  Form,
  message,
  Input,
  Table,
  Select,
  Upload,
} from "antd";
import {
  LogoutOutlined,
  PlusOutlined,
  QrcodeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveLine } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const SoundBoxLineChekListPH = () => {
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [exitModel, setExitModel] = useState(false);
  const { IMEI_number, batch_number } = useParams();
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const [IMEINumber, setIMEINumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;
  const { Option } = Select;
  const navigate = useNavigate();
  const [Activekey, setActivekey] = useState(0);

  useEffect(() => {
    checkLineActive();
    setIMEINumber(IMEI_number);
    getSoundboxlinequalitychecklist(IMEI_number);
  }, [IMEI_number]);

  const handleCloseexitModel = () => {
    setExitModel(false);
  };

  const checkLineActive = () => {
    setLineLogedIn(selector.LineLogin.isLogedIn);
    setLineLineSelectedName(selector.LineLogin.line_name);
    setLineSelectedTime(new Date(selector.LineLogin.line_login_time));
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
  const getSoundboxlinequalitychecklist = (IMEINumber) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/getSoundboxlinequalitychecklist?IMEINumber=${IMEINumber}`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        if (data.length > 0) {
          const { _id, Soundboxlinequalitychecklist, ...rest } = data[0];
          let newData = [];
          Soundboxlinequalitychecklist.map((x, index) => {
            newData.push({
              key: index,
              lqcl: x.lqcl,
              status: x.status,
              defect_category: x.defect_category,
              remarks: x.remarks,
              picture: x.picture,
              analysis_details: x.analysis_details,
            });
          });
          setTableData(newData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleLogout = () => {
    setExitModel(true);
  };

  const columns = [
    {
      title: "Line Quality Check list",
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
          onChange={(value) => handleStatusChange(record.key, value)}
          value={record.status}
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
          onChange={(value) => handleDefectCategoryChange(record.key, value)}
          value={record.defect_category} // Set the value from the state
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
      dataIndex: "pictures",
      key: "pictures",
      render: (_, record) => (
        <div style={{ paddingRight: "20px" }}>
          <Upload
            {...props}
            maxCount={1}
            value={record.picture}
            onClick={() => setActivekey(record.key)}
            onRemove={() => handleImageRemove(record.key)} // Handle image removal
          >
            <Button icon={<UploadOutlined />}>Upload image</Button>
          </Upload>
        </div>
      ),
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (_, record) => (
        <TextArea
          onChange={(e) => handleRemarksChange(record.key, e.target.value)}
          value={record.remarks}
        />
      ),
    },
  ];

  const handleStatusChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].status = value;
    setTableData(updatedTableData);
  };

  const handleDefectCategoryChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].defect_category = value;
    setTableData(updatedTableData);
  };

  function handleRemarksChange(key, value) {
    const updatedTableData = [...tableData];
    updatedTableData[key].remarks = value;
    setTableData(updatedTableData);
  }

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

  const SaveData = () => {
    const newData = tableData.map((item) => ({
      lqcl: item.lqcl,
      status: item.status || "OK",
      defect_category: item.defect_category || "Select Any Defect",
      remarks: item.remarks || "",
      picture: item.picture || form.getFieldValue(`picture_${item.key}`) || "",
      analysis_details: item.analysis_details ? item.analysis_details : "",
    }));

    const postData = {
      Soundboxlinequalitychecklist: newData,
      ref_IMEI: IMEI_number,
      batch_number: batch_number,
      type: "LQC",
      IMEI_status: "Checked",
      line_name: `${LineSelectedName}`,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/saveSoundboxlinequalitychecklist`,
        postData
      )
      .then((response) => {
        message.success("Data saved successfully!");
        getSoundboxlinequalitychecklist(IMEI_number);
      })
      .catch((error) => {
        message.error("Error saving data.");
      });
  };

  return (
    <div>
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
      <Row>
        <Col span={11}>
          <span className="TopMenuTxt">Sound Box Line Quality Check list </span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            Sound Box IMEI No:{" "}
            <Input
              style={{
                width: "200px",
                height: "35px",
                margin: "0 7px",
                textAlign: "center",
                padding: "10px",
                borderRadius: "4px",
                gap: "10px",
              }}
              value={IMEINumber}
            />
          </span>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowClassName={(record) =>
          record.status === "NOT OK" ? "not-ok-row" : ""
        }
        style={{ marginTop: "15px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <div style={{ margin: "0 15px", marginBottom: "15px" }}>
          <Button className="lineModalButtonSUbmit2">Edit</Button>
        </div>
        <div>
          <Button className="lineModalButtonSUbmit" onClick={SaveData}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SoundBoxLineChekListPH;
