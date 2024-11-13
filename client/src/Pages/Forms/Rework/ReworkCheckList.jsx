import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Button,
  Modal,
  Spin,
  Form,
  message,
  Select,
  Upload,
  Table,
  Input,
} from "antd";

import {
  LogoutOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { logoutActiveLine } from "../../../Redux/Actions";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
const ReworkCheckList = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchIMEI, setSearchIMEI] = useState("");
  useEffect(() => {
    getSoundboxlinequalitychecklist();
  }, []);

  const getSoundboxlinequalitychecklist = () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/getAllCheckedSoundboxlist`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        let newData = [];
        data.forEach((item, index) => {
          const { _id, Soundboxlinequalitychecklist, ...rest } = item;
          Soundboxlinequalitychecklist.forEach((x, subIndex) => {
            newData.push({
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
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilterClick = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterSelect = (value) => {
    if (value === "clear") {
      setFilterStatus(null);
    } else {
      setFilterStatus(value);
    }
    setIsFilterModalVisible(false);
  };

  const handleSearchIMEI = (value) => {
    setSearchIMEI(value);
  };

  const filteredTableData = tableData.filter((record) => {
    if (filterStatus && record.status !== filterStatus) {
      return false;
    }
    if (searchIMEI && !record.ref_IMEI.includes(searchIMEI)) {
      return false;
    }
    return true;
  });

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
      title: "Defect Category",
      dataIndex: "defect_category",
      key: "defect_category",
      render: (_, record) => (
        <Select
          placeholder="Select Any Defect"
          allowClear
          style={{ minWidth: "250px", textAlign: "center" }}
          value={record.defect_category}
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
        <TextArea value={record.remarks} style={{ width: "220px" }} />
      ),
    },
    {
      title: "Analysis Details",
      dataIndex: "analysis_details",
      key: "analysis_details",
      render: (_, record) => (
        <TextArea value={record.analysis_details} style={{ width: "220px" }} />
      ),
    },

    {
      title: "Status",
      key: "Review",
      render: (_, record) => (
        <div>
          <a>
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

  const handleImageClick = (picture) => {
    setPreviewImage(picture);
  };

  const handleImageClose = () => {
    setPreviewImage(null);
  };

  const handleExcelImport = () => {
    // Create a workbook
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    // Convert the table data to worksheet
    const ws = XLSX.utils.json_to_sheet(filteredTableData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a download link for the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a click to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "rework_data.xlsx";
    a.click();
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <span className="TopMenuTxt">Rework Item List</span>
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
            <Button key="buy" type="primary" onClick={handleFilterClick}>
              Filter
              <FilterOutlined />
            </Button>
          </span>
        </Col>
      </Row>

      <Row style={{ marginTop: "2rem" }}>
        <Col span={24} style={{ backgroundColor: "#fff", padding: "20px" }}>
          <div style={{ overflowX: "auto" }}>
            <Table
              columns={columns}
              dataSource={filteredTableData}
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

      <Modal
        visible={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
        className="filter-modal"
        closeIcon={<span />}
        maskClosable={false}
        bodyStyle={{ height: "190px", overflow: "auto" }}
      >
        <Input
          placeholder="Search IMEI Code"
          value={searchIMEI}
          onChange={(e) => handleSearchIMEI(e.target.value)}
          style={{ marginTop: "10px", height: "35px" }}
          prefix={<SearchOutlined />}
        />
        <hr
          style={{ marginTop: "20px", marginBottom: "15px", color: "#D9D9D9" }}
        />
        <span
          style={{
            color: "#000000",
            fontFamily: "Montserrat",
            fontSize: "15px",
            fontWeight: "400",
            lineHeight: "15px",
            letterSpacing: "0.02em",
            textAlign: "left",
            width: "197px",
            height: "15px",
            marginLeft: "14px",
          }}
        >
          View Fixed and damaged items
        </span>
        <br />
        <Button
          onClick={() => handleFilterSelect("OK")}
          type="primary"
          className="circular-button1"
          style={{ marginTop: "15px", marginRight: "10px" }}
        >
          OK
        </Button>
        <Button
          onClick={() => handleFilterSelect("NOT OK")}
          type="primary"
          className="circular-button1"
          style={{ marginTop: "15px", marginRight: "10px" }}
        >
          NOT OK
        </Button>
        <br />
        <a
          onClick={() => handleFilterSelect("clear")}
          style={{
            marginTop: "5px",
            marginLeft: "20px",
            float: "left",
            color: "#FF5C5C",
          }}
        >
          {" "}
          Clear all filters
        </a>

        <a
          onClick={() => setIsFilterModalVisible(false)}
          style={{
            marginTop: "5px",
            marginLeft: "20px",
            float: "right",
            color: "#A7A7A7",
          }}
        >
          {" "}
          Cancel
        </a>
      </Modal>
    </div>
  );
};

export default ReworkCheckList;
