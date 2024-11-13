import { LogoutOutlined } from "@ant-design/icons";
import { Button, Col, Row, Result, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutActiveLine, saveActiveLine } from "../../../Redux/Actions";
import { useNavigate, useParams } from "react-router-dom";
const CheckListedSoundBoxLQC = () => {
  const selector = useSelector((state) => state.persistedReducer);
  const { batch_number } = useParams();
  const [BatchList, setBatchList] = useState([]);
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [exitModel, setExitModel] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getBatch(selector.LineLogin.line_name, batch_number);
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
    navigate(`/line_quality_check_list/${IMEI_number}/${batch_number}`);
  };
  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={10}>
          <span className="TopMenuTxt">Listed Sound Box</span>
        </Col>
        <Col span={7}></Col>
        <Col span={7} style={{ textAlign: "right" }}>
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
          BatchList.map((x) => (
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

export default CheckListedSoundBoxLQC;
