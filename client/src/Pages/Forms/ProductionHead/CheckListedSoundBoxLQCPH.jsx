import { DownloadOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Col, Row, Result, Modal, Pagination } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutActiveLine, saveActiveLine } from "../../../Redux/Actions";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const CheckListedSoundBoxLQCPH = () => {
  const itemsPerPage = 5;
  const selector = useSelector((state) => state.persistedReducer);
  const { batch_number, line_name } = useParams();
  const [BatchList, setBatchList] = useState([]);
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [exitModel, setExitModel] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const isStatusNotOk = (status) => status === "NOT OK";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getBatch(line_name, batch_number);
    checkLineActive();
  }, []);

  const handleCloseexitModel = () => {
    setExitModel(false);
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
  const getBatch = (line, BatchNumber) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getIMEIList", {
        line: line,
        BatchNumber: BatchNumber,
      })
      .then((result) => {
        setBatchList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLogout = () => {
    setExitModel(true);
  };

  const goToListedSoundBox = (IMEI_number, batch_number) => {
    navigate(`/line_quality_check_listPH/${IMEI_number}/${batch_number}`);
  };
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBatchList = BatchList.slice(startIndex, endIndex);

  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const formattedBatchList = BatchList.map((item) => {
      const {
        Soundboxlinequalitychecklist,
        user_id,
        createdAt,
        updatedAt,
        __v,
        _id,
        ...rest
      } = item;
      return {
        ...rest,
        CreatedDateTime: new Date(item.createdAt).toLocaleString(),
        UpdatedDateTime: new Date(item.updatedAt).toLocaleString(),
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Soundbox_Checked_data_IMEINumber.xlsx";
    a.click();
  };
  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={12}>
          <span className="TopMenuTxt">Listed Sound Box</span>
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
        {BatchList.length === 0 ? (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
        ) : (
          paginatedBatchList.map((x) => (
            <Col
              span={24}
              key={x.IMEI}
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
                    <div>Sound Box</div>
                    <div style={{ marginTop: "5px" }}>
                      IMEI Code: {x.ref_IMEI}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div>
                        <Button
                          className="lineModalButtonSUbmit"
                          style={{ background: "#5B7690" }}
                          onClick={() =>
                            goToListedSoundBox(x.ref_IMEI, batch_number)
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
      <Row justify="end" style={{ marginTop: "1rem" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={BatchList.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
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
    </div>
  );
};

export default CheckListedSoundBoxLQCPH;
