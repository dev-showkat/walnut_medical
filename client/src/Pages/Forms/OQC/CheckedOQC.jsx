import React, { useEffect, useState } from "react";
import { Row, Col, Button, Result, Modal, Spin, Input } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveBatch,
  logoutActiveLine,
  saveActiveLine,
} from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MasterCartonOQC = () => {
  const [LineModel, setLineModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dummyState, setdummyState] = useState(false);
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);

  const [BatchList, setBatchList] = useState([]);

  const [LineNumbers, setLineNumbers] = useState([
    {
      id: 1,
      name: "Line number 1,2",
      active: false,
    },
    {
      id: 2,
      name: "Line number 3,4",
      active: false,
    },
    {
      id: 3,
      name: "Line number 5,6",
      active: false,
    },
    {
      id: 4,
      name: "Line number 7,8",
      active: false,
    },
  ]);

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const navigate = useNavigate();

  useEffect(() => {
    checkLineActive();
  }, []);

  const checkLineActive = () => {
    setLineLogedIn(selector.LineLogin.isLogedIn);
    setLineLineSelectedName(selector.LineLogin.line_name);
    setLineSelectedTime(new Date(selector.LineLogin.line_login_time));

    if (selector.LineLogin.isLogedIn == true) {
      getBatch(selector.LineLogin.line_name);
    }
  };

  const ShowtLineNumber = () => {
    showLineModel();
  };

  const showLineModel = () => {
    setLineModel(true);
  };
  const lineModelCancel = () => {
    setLineModel(false);
  };

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

  const handleSaveLineNumber = () => {
    let activeTime = new Date();
    setLineSelectedTime(activeTime);

    LineNumbers.map((x) => {
      if (x.active) {
        setLineLineSelectedName(x.name);
        let logObj = {
          user_id: selector.user.token,
          isLogedIn: true,
          line_name: x.name,
          line_login_time: activeTime,
          type: "OQC",
        };

        axios
          .post(process.env.REACT_APP_API_URL + "/LoginLine", logObj)
          .then((result) => {
            console.log(result.data);
            logObj.line_id = result.data._id;
            dispatch(saveActiveLine(logObj));
            getBatch(x.name);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    setLineLogedIn(true);
    lineModelCancel();
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
        console.log(result.data);
        dispatch(logoutActiveLine());
        getBatch("");
      })
      .catch((err) => {
        console.log(err);
      });
    selectLineNumber();
  };

  const getBatch = (line) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getBatch", {
        line,
      })
      .then((result) => {
        // setBatchList(result.data);
        let { batch_data, testting, masterCarton } = result.data;

        setBatchList(batch_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddMasterCarton = (name) => {
    dispatch(
      ActiveBatch({
        name,
      })
    );
    navigate("/MasterCartonListOQC");
  };

  return (
    <div>
      <Modal open={LineModel} onCancel={lineModelCancel} footer={[]}>
        <Spin spinning={loading}>
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Select Line Number</span>
              </Col>
              <Col span={24}>
                <Row gutter={[20, 20]}>
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
                      marginTop: "1rem",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "#606060",
                        }}
                      ></span>
                      Line Login time:
                      <Input
                        style={{
                          width: "25%",
                          height: "30px",
                          borderRadius: 0,
                          margin: "0 7px",
                          textAlign: "center",
                        }}
                        value={new Date().toLocaleTimeString()}
                        readOnly
                      />
                    </div>
                  </Col>
                  <Col className="lineModalCol" span={24}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        className="lineModalButtonSUbmit"
                        onClick={() => handleSaveLineNumber()}
                      >
                        OK
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Row style={{ alignItems: "center" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Master Carton Batches checked list</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          {LineLogedIn === true ? (
            ""
          ) : (
            <span style={{ margin: "0 7px" }}>
              <Button
                className="TopMenuButton"
                onClick={() => ShowtLineNumber()}
              >
                Select Line Number
              </Button>
            </span>
          )}

          {LineLogedIn === true ? (
            <span style={{ margin: "0 7px" }}>
              <Button
                onClick={() => handleLineLogout()}
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
        <Col span={24} style={{ backgroundColor: "#fff" }}>
          {BatchList.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          ) : (
            BatchList.map((x) => {
              return (
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
                      <div>Batch ID: {x.batch_name}</div>
                      <div>Number of Master Carton Added: {x.total_no} </div>
                      <div>
                        Date - {new Date(x.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex" }}>
                        <div>
                          <Button
                            className="lineModalButtonSUbmit"
                            onClick={() => AddMasterCarton(x.batch_name)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MasterCartonOQC;
