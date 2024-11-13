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
  DownloadOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { logoutActiveLine } from "../../../Redux/Actions";
import TextArea from "antd/es/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

const EmployeeLoginDetailsPH = () => {
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const selector = useSelector((state) => state.persistedReducer);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const { Option } = Select;
  const [form] = Form.useForm();
  const { batch_id, line_name, date } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [Activekey, setActivekey] = useState(0);
  const [exitModel, setExitModel] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [SoundBoxModel, setSoundBoxModel] = useState(false);
  useEffect(() => {
    goToEmployeeDetails(batch_id, line_name, date);
  }, []);

  const goToEmployeeDetails = (batch_id, line_name, date) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getLinelogsEmpPH", {
        batch_id: batch_id,
        line_name: line_name,
        createdAt: date,
      })
      .then((result) => {
        const data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            user_id: x.user_id,
            key: x._id,
            username: x.username,
            batch_id: x.batch_id,
            line_name: x.line_name,
            count: x.count,
            line_login_time: new Date(x.line_login_time).toLocaleTimeString(),
            LogedOutTime: new Date(x.LogedOutTime).toLocaleTimeString()
              ? new Date(x.LogedOutTime).toLocaleTimeString()
              : "NA",
          });
        });
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToListedSoundBox = (batch_number, line_name, user_id) => {
    navigate(
      `/Check_listed_Single_soundboxPH/${batch_number}/${line_name}/${user_id}`
    );
  };

  const columns = [
    {
      title: "Employee name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Batch ID",
      dataIndex: "batch_id",
      key: "batch_id",
    },
    {
      title: "Line Number",
      dataIndex: "line_name",
      key: "line_name",
    },
    {
      title: "Add Sound Box",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Login Time",
      dataIndex: "line_login_time",
      key: "line_login_time",
    },
    {
      title: "Logout Time",
      dataIndex: "LogedOutTime",
      key: "LogedOutTime",
    },

    {
      title: "Review",
      key: "Review",
      render: (_, record) => (
        <div style={{ margin: "0 10px" }}>
          <Button
            className="ButtonSUbmit"
            onClick={() =>
              goToListedSoundBox(
                record.batch_id,
                record.line_name,
                record.user_id
              )
            }
          >
            Review
          </Button>
        </div>
      ),
    },
  ];

  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    const formattedBatchList = tableData.map((item) => {
      const { id, key, count, user_id, createdAt, ...rest } = item;
      return {
        ...rest,
        SoundBoxAdded: count,
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Employee_lineLogin_data.xlsx";
    a.click();
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <span className="TopMenuTxt">Employee Login Entry List</span>
        </Col>
        <Col span={12}>
          <span
            className="TopMenuTxt"
            style={{ float: "right", marginRight: "15px" }}
          >
            <Button
              key="excelImport"
              type="primary"
              onClick={handleExcelImport}
              style={{ marginRight: "15px" }}
            >
              Export Report <DownloadOutlined />
            </Button>
          </span>
        </Col>
      </Row>

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

export default EmployeeLoginDetailsPH;
