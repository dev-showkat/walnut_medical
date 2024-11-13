import { LogoutOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Col, Row, Result, Modal, Pagination } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutActiveLine, saveActiveLine } from "../../../Redux/Actions";
import { useNavigate, useParams } from "react-router-dom";
const SoundBoxLQCCcjekListPH = () => {
  const pageSize = 4;
  const selector = useSelector((state) => state.persistedReducer);
  const [BatchList, setBatchList] = useState([]);
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [exitModel, setExitModel] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getBatch();
    checkLineActive();
  }, []);

  const totalItems = BatchList.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startItemIndex = (currentPage - 1) * pageSize;
  const endItemIndex = Math.min(currentPage * pageSize, totalItems);
  const visibleItems = BatchList.slice(startItemIndex, endItemIndex);

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
  const getBatch = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getBatchListPH", {})
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
  const goToListedSoundBox = (batch_number, line_name) => {
    navigate(`/Check_listed_soundboxPH/${batch_number}/${line_name}`);
  };
  const goToEmployeeDetails = (batch_id, line_name, date) => {
    navigate(`/getEmployee_deatils/${batch_id}/${line_name}/${date}`);
  };
  // const handleFilterClick = () => {

  // };
  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={12}>
          <span className="TopMenuTxt">Sound Box Batches checked list</span>
        </Col>
        <Col span={12}>
          {/* <span
            className="TopMenuTxt"
            style={{ float: "right", marginRight: "15px" }}
          >
            <Button key="buy" type="primary" onClick={handleFilterClick}>
              Filter
              <FilterOutlined />
            </Button>
          </span> */}
        </Col>
        {/* <Col span={7} style={{ textAlign: "right" }}></Col> */}
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

export default SoundBoxLQCCcjekListPH;
