import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Result,
  Modal,
  Pagination,
  Select,
  Input,
} from "antd";
import {
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const { Option } = Select;

const SoundBoxLQCCcjekListAllPH = () => {
  const pageSize = 4;
  const [BatchList, setBatchList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchIMEI, setSearchIMEI] = useState("");
  const navigate = useNavigate();
  const [dummyState, setdummyState] = useState(false);
  useEffect(() => {
    getBatch();
  }, []);

  const totalItems = BatchList.length;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startItemIndex = (currentPage - 1) * pageSize;
  const endItemIndex = Math.min(currentPage * pageSize, totalItems);
  const visibleItems = BatchList.slice(startItemIndex, endItemIndex);

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

  const getBatch = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getBatchListAllPH", {})
      .then((result) => {
        setBatchList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [LineNumbers, setLineNumbers] = useState([
    {
      id: 1,
      name: "Line number 1",
      active: false,
    },
    {
      id: 2,
      name: "Line number 2",
      active: false,
    },
    {
      id: 3,
      name: "Line number 3",
      active: false,
    },
    {
      id: 4,
      name: "Line number 4",
      active: false,
    },
    {
      id: 5,
      name: "Line number 5",
      active: false,
    },
    {
      id: 6,
      name: "Line number 6",
      active: false,
    },
    {
      id: 7,
      name: "Line number 7",
      active: false,
    },
    {
      id: 8,
      name: "Line number 8",
      active: false,
    },
  ]);
  const selectLineNumber = (id = null) => {
    let lines = LineNumbers;

    LineNumbers.map((x) => {
      if (x.id == id) {
        x.active = true;
      } else {
        x.active = false;
      }
    });

    setLineNumbers(lines);
    setdummyState(!dummyState);
  };
  const goToListedSoundBox = (batch_number, line_name) => {
    navigate(`/Check_listed_soundboxPH/${batch_number}/${line_name}`);
  };
  const goToEmployeeDetails = (batch_id, line_name, date) => {
    navigate(`/getEmployee_deatils/${batch_id}/${line_name}/${date}`);
  };
  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const formattedBatchList = BatchList.map((item) => {
      const { Soundboxlinequalitychecklist, user_id, createdAt, ...rest } =
        item;
      return {
        ...rest,
        DateTime: new Date(item.createdAt).toLocaleString(),
      };
    });

    // Convert the table data to worksheet with formatted createdAt
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a download link for the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a click to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "Soundbox_Checked_data.xlsx";
    a.click();
  };

  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={12}>
          <span className="TopMenuTxt">Sound Box Batches checked list</span>
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
            {/* <Button key="filter" type="primary" onClick={handleFilterClick}>
              Filter
              <FilterOutlined />
            </Button> */}
          </span>
        </Col>
      </Row>

      <Row style={{ marginTop: "2rem" }}>
        {visibleItems.length === 0 ? (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
        ) : (
          visibleItems.map((x) => (
            <Col
              span={24}
              key={x.BatchID}
              style={{
                backgroundColor: x.Soundboxlinequalitychecklist.some(
                  (item) => item.status === "NOT OK"
                )
                  ? "#ffe7e7"
                  : "white",
                marginBottom: "1rem",
              }}
            >
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#606060",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <div>
                    <div>Batch ID: {x.BatchID}</div>
                    <div>
                      Number of Sound Box Added: {x.NumberOfSoundBoxAdded}
                    </div>
                    <div>
                      Date - {new Date(x.createdAt).toLocaleDateString()}
                    </div>
                    <div>Line Number - {x.line_name}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div>
                        <Button
                          className="ButtonSUbmit"
                          style={{ width: "100%" }}
                          onClick={() =>
                            goToEmployeeDetails(
                              x.BatchID,
                              x.line_name,
                              new Date(x.createdAt).toISOString().split("T")[0]
                            )
                          }
                        >
                          Employee login details
                        </Button>
                      </div>
                      <div style={{ margin: "0 10px" }}>
                        <Button
                          className="ButtonSUbmit"
                          onClick={() =>
                            goToListedSoundBox(x.BatchID, x.line_name)
                          }
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>

      <Row justify="end" style={{ marginRight: "1rem" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Row>

      <Modal
        visible={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
        className="filter-modal1 right-modal"
        closeIcon={<span />}
        maskClosable={false}
        bodyStyle={{ overflow: "auto" }}
      >
        <Input
          placeholder="Search Batch ID"
          value={searchIMEI}
          onChange={(e) => handleSearchIMEI(e.target.value)}
          style={{ marginTop: "10px", height: "35px" }}
          prefix={<SearchOutlined />}
        />
        <hr
          style={{ marginTop: "20px", marginBottom: "15px", color: "#D9D9D9" }}
        />
        <Col span={24}>
          <span style={{ marginBottom: "10px", marginLeft: "10px" }}>
            Line Number
          </span>
          <Row gutter={[20, 20]} style={{ marginTop: "15px" }}>
            {LineNumbers.map((x) => {
              return (
                <Col className="lineModalCol" span={12}>
                  <Button
                    className={
                      x.active == true
                        ? "lineModalButton lineModalButtonActive"
                        : "lineModalButton"
                    }
                    onClick={() => selectLineNumber(x.id)}
                  >
                    {x.name}
                  </Button>
                </Col>
              );
            })}

            <Col
              className="lineModalCol"
              span={24}
              style={{
                marginTop: ".5rem",
              }}
            >
              <hr
                style={{
                  marginBottom: "15px",
                  color: "#D9D9D9",
                }}
              />
              <div>
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
                    marginRight: "40px",
                    float: "right",
                    color: "#A7A7A7",
                  }}
                >
                  {" "}
                  Cancel
                </a>
              </div>
            </Col>
          </Row>
        </Col>

        <br />
        {/* <Button
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
        </Button> */}
      </Modal>
    </div>
  );
};

export default SoundBoxLQCCcjekListAllPH;
