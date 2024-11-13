import React, { useEffect, useState } from "react";
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
} from "antd";
import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveLine, saveActiveLine } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const SoundBoxLQCList = () => {
  const [LineModel, setLineModel] = useState(false);
  const [BatchModel, setBatchModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dummyState, setdummyState] = useState(false);
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [BatchName, setBatchName] = useState("");
  const [BatchList, setBatchList] = useState([]);
  const [exitModel, setExitModel] = useState(false);
  const { confirm } = Modal;
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

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const navigate = useNavigate();

  useEffect(() => {
    checkLineActive();
  }, []);

  const handleCloseexitModel = () => {
    setExitModel(false);
  };
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

  const showBatchModel = () => {
    setBatchModel(true);
  };
  const BatchModelCancel = () => {
    setBatchModel(false);
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
          type: "LQC",
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
        setExitModel(false);
        dispatch(logoutActiveLine());
        getBatch("");
      })
      .catch((err) => {
        console.log(err);
      });
    selectLineNumber();
  };

  const handleCreateBatchModal = () => {
    let batchName = `Batch_${new Date().getTime()}`;
    setBatchName(batchName);
    showBatchModel();
  };

  const handleCreateBatch = () => {
    setLoading(true);
    let batchObj = {
      user_id: selector.user.employee_id,
      batch_name: BatchName,
      line_name: LineSelectedName,
      type: "LQC",
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/saveBatch", batchObj)
      .then((result) => {
        setLoading(false);
        getBatch(LineSelectedName);
        BatchModelCancel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBatch = (line) => {
    console.log(LineSelectedName);
    axios
      .post(process.env.REACT_APP_API_URL + "/getBatch", {
        line,
      })
      .then((result) => {
        setBatchList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddSoundBox = (bacth_number) => {
    navigate(`/AddSoundLQC/${bacth_number}`);
  };
  const handleLogout = () => {
    setExitModel(true);
  };

  const handleDelete = (batch_id, batch_number, line_name) => {
    confirm({
      title: "Delete the Batch",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this batch?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(batch_id, batch_number, line_name);
      },
    });
  };

  const deleteItem = (batch_id, batch_number, line_name) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_batch", {
        data: {
          batch_id: batch_id,
          batch_number: batch_number,
          line_name: line_name,
        },
      })
      .then((response) => {
        setBatchList((prevData) =>
          prevData.filter((item) => item.key !== batch_id)
        );
        getBatch(selector.LineLogin.line_name);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <Modal open={BatchModel} onCancel={BatchModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Batch Number</span>
              </Col>
              <Col
                span={24}
                style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
              >
                <img src="./SVG/check.svg" />
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                Batch Genrated successfully with Batch Number:
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                {BatchName}
              </Col>
              <Col span={24} style={{ padding: "2rem  3rem 0" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <div>
                    <Button
                      className="lineModalButtonSUbmit2"
                      onClick={() => BatchModelCancel()}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="lineModalButtonSUbmit"
                      onClick={() => handleCreateBatch()}
                      loading={loading}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Modal open={LineModel} onCancel={lineModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
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
          <span className="TopMenuTxt">Batch List For LQC</span>
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
          <span style={{ margin: "0 7px" }}>
            {LineLogedIn === true ? (
              <Button
                className="TopMenuButton"
                onClick={() => handleCreateBatchModal()}
              >
                Create New Batch <PlusOutlined />
              </Button>
            ) : (
              <Button className="TopMenuButton" disabled>
                Create New Batch <PlusOutlined />
              </Button>
            )}
          </span>
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
              style={{ backgroundColor: "#fff", marginBottom: "1rem" }}
              key={x._id}
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
                    <div>Batch ID: {x.batch_name}</div>
                    <div>Number of Sound Box Added: 0 </div>
                    <div>
                      Date - {new Date(x.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div style={{ margin: "0 10px" }}>
                        <Button
                          className="lineModalButtonSUbmit2"
                          onClick={() =>
                            handleDelete(x._id, x.batch_name, LineSelectedName)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                      <div>
                        <Button
                          className="lineModalButtonSUbmit"
                          onClick={() => AddSoundBox(x.batch_name)}
                        >
                          Add Sound Box
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
    </div>
  );
};

export default SoundBoxLQCList;
