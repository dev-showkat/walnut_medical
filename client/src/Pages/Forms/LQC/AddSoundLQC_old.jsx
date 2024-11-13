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
  Table,
  QRCode,
  Space,
} from "antd";
import {
  LogoutOutlined,
  PlusOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { logoutActiveLine, saveActiveLine } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { QrReader } from "react-qr-reader";

const AddSoundLQC = () => {
  const text = "https://ant.design/";
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [exitModel, setExitModel] = useState(false);
  const { batch_number } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const [IMEINumber, setIMEINumber] = useState("");
  const [BatchModel, setBatchModel] = useState(false);
  const [IMEIList, setIMEIList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsIMEI, setSelectedRowsIMEI] = useState([]);
  const [selectedRowsBatch, setSelectedRowsBatch] = useState([]);

  const [startScan, setStartScan] = useState(false);

  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;
  const navigate = useNavigate();
  useEffect(() => {
    checkLineActive();
    getIMEI(batch_number);
  }, []);
  const handleCloseexitModel = () => {
    setExitModel(false);
  };

  const showBatchModel = () => {
    setBatchModel(true);
  };
  const BatchModelCancel = () => {
    setBatchModel(false);
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

  const handleCreateBatchModal = (finalIMEINumber) => {
    setStartScan(!startScan);
    messageApi.open({
      type: "success",
      content: "Scanned  Successfully",
    });

    // let IMEINumber = `${new Date().getTime()}`;
    // const random = Math.floor(Math.random() * 1000);
    // let finalIMEINumber = `${IMEINumber}${random}`;
    console.log(finalIMEINumber);
    setIMEINumber(finalIMEINumber);
    showBatchModel();
    handleCreateBatchModalFunction(text);
  };
  const handleCreateBatchModalFunction = (scannedText) => {
    console.log("Scanned Text:", scannedText);
  };
  const handleLogout = () => {
    setExitModel(true);
  };
  const data = [
    {
      key: 1,
      lqcl: "Speaker",
    },
    {
      key: 2,
      lqcl: "Body Gap",
    },
    {
      key: 3,
      lqcl: "Device Validation",
    },
    {
      key: 4,
      lqcl: "Scratches on QR code",
    },
    {
      key: 5,
      lqcl: "Body dents,flow lines, sink marks, patterns",
    },
    {
      key: 6,
      lqcl: "Battery indicator  LED indication sequence",
    },
    {
      key: 7,
      lqcl: "Check for the battery, keboard and antenna connections",
    },
    {
      key: 8,
      lqcl: "Battery fitment",
    },
    {
      key: 9,
      lqcl: "Speaker fitment",
    },
    {
      key: 10,
      lqcl: "N/W  LED indication sequence",
    },
    {
      key: 11,
      lqcl: "Check that N/W LED not remaining on always",
    },
    {
      key: 12,
      lqcl: "Volume keys functioning",
    },
    {
      key: 13,
      lqcl: "Scratch on rubber keypad",
    },
    {
      key: 14,
      lqcl: "Mesh ventilation pattern",
    },
    {
      key: 15,
      lqcl: "Check for moulding issue on complete body",
    },
    {
      key: 16,
      lqcl: "MCheck  for  Dome Logo shape /print/scratches",
    },
    {
      key: 17,
      lqcl: "Check  for the four rubber feet",
    },
    {
      key: 18,
      lqcl: "5 no. of screws must be tight and free from rust",
    },
    {
      key: 19,
      lqcl: "Bar code sticker  Printing",
    },
    {
      key: 20,
      lqcl: "Helpdesk sticker and Paytm sticker",
    },
    {
      key: 21,
      lqcl: "speaker dust protecrtion cover",
    },
    {
      key: 22,
      lqcl: "verify the  breakage and displacement of  USB jack",
    },
    {
      key: 23,
      lqcl: "Cleaning",
    },
    {
      key: 24,
      lqcl: "BIS sticker scratch/Miss",
    },
    {
      key: 25,
      lqcl: "Poly carbonate LED PIP missing",
    },
  ];

  const AddLineQuality = (IMEI_number, batch_number) => {
    navigate(`/line_quality_check_list/${IMEI_number}/${batch_number}`);
  };
  const handleCreateIMEI = () => {
    let newData = [];
    newData = data.map((item) => ({
      lqcl: item.lqcl,
      status: "Ok",
      defect_category: "Select Any Defect",
      remarks: "",
      picture: "",
      analysis_details: " ",
    }));
    let batchObj = {
      IMEI: IMEINumber,
      line_name: LineSelectedName,
      type: "LQC",
      batch_number: batch_number,
      IMEI_status: "Checked",
      Soundboxlinequalitychecklist: newData,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/saveIMEI", batchObj)
      .then((result) => {
        getIMEI(batch_number);
        BatchModelCancel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getIMEI = (batch_number) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getIMEI", {
        batch_number,
      })
      .then((result) => {
        let newData = [];
        result.data.map((x) => {
          newData.push({
            key: x._id,
            IMEINumber: x.IMEI,
            IMEI_status: x.IMEI_status,
            batch_number: x.batch_number,
          });
        });
        setIMEIList(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRowKeys);
    const selectedIMEINumbers = selectedRows.map((row) => row.IMEINumber);
    const selectedBatchNumbers = selectedRows.map((row) => row.batch_number);

    setSelectedRowsIMEI(selectedIMEINumbers);
    setSelectedRowsBatch(selectedBatchNumbers);
  };

  const handleDeleteSelected = () => {
    confirm({
      title: "Delete the IMEI Code",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const selectedIds = selectedRows;
        const slectedIMEI = selectedRowsIMEI;
        const selectedBatch = selectedRowsBatch;
        deleteItem(selectedIds, slectedIMEI, selectedBatch);
      },
    });
  };

  const deleteItem = (selectedIds, slectedIMEI, selectedBatch) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_IMEI", {
        data: {
          ids: selectedIds,
          ref_IMEI: slectedIMEI,
          batch_number: selectedBatch,
        },
      })
      .then((response) => {
        console.log("Items deleted successfully");
        getIMEI(batch_number);
      })
      .catch((error) => {
        console.error("Error deleting items:", error);
      });
  };

  const goToChecklist = (line_number) => {
    navigate("/Check_list");
  };

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "1",
      key: "1",
      render: (text, record, index) => <a>{index + 1}</a>,
    },

    {
      title: "Sound Box IMEI Code",
      dataIndex: "IMEINumber",
      key: "IMEINumber",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Status",
      dataIndex: "IMEI_status",
      key: "IMEI_status",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Test Sound Box",
      key: "action",
      render: (_, record) => (
        <div>
          <a>
            <span>
              <Button
                key="buy"
                className="circular-button"
                onClick={() => AddLineQuality(record.IMEINumber, batch_number)}
              >
                Start Testing
              </Button>
            </span>
          </a>
        </div>
      ),
    },
  ];
  return (
    <div>
      {startScan && (
        <>
          <div>
            <div
              style={{
                width: "300px",
              }}
            >
              <QrReader
                constraints={{
                  facingMode: "environment",
                }}
                onResult={(result, error) => {
                  if (!!result) {
                    handleCreateBatchModal(result.text);
                  }

                  if (!!error) {
                    // console.info('error');
                  }
                }}
              />
            </div>
            <Button onClick={() => setStartScan(!startScan)}>close</Button>
          </div>
        </>
      )}
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
          <span className="TopMenuTxt">Add Sound Box</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            Batch ID:{" "}
            {LineLogedIn === true ? (
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
                value={batch_number}
              />
            ) : (
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
                value={""}
              />
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

        <Col span={24}>
          <div style={{ marginBottom: "15px" }}>
            Please Scan Sound Box BR Code
          </div>
          <div>
            <Button
              className="masterCartonAddButton"
              onClick={() => setStartScan(!startScan)}
            >
              Line Quality Check <QrcodeOutlined />
            </Button>
          </div>
        </Col>
      </Row>

      <Col span={24} style={{ backgroundColor: "#fff", marginTop: "20px" }}>
        {IMEIList.length === 0 ? (
          <Result
            icon={<img src="./SVG/noitem.svg" />}
            subTitle="No Item Found"
          />
        ) : (
          <div style={{ marginTop: "20px" }}>
            <Table
              columns={columns}
              dataSource={IMEIList}
              pagination={false}
              rowSelection={{
                type: "checkbox",
                onChange: handleRowSelection,
              }}
            />
            <Button
              key="buy"
              className="circular-buttonsave"
              style={{ marginTop: "10px" }}
              onClick={() => goToChecklist(LineSelectedName)}
            >
              <span className="btn-save">Save</span>
            </Button>
            <Button
              key="delete"
              className="btn-savedelete"
              onClick={handleDeleteSelected}
            >
              <span className="btn-save">Delete</span>
            </Button>
          </div>
        )}
      </Col>
      <Modal open={BatchModel} onCancel={BatchModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Sound Box IMEI Code Found</span>
              </Col>
              <Col
                span={24}
                style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
              >
                <img src="./SVG/check.svg" />
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                Sound Box IMEI Code: {IMEINumber}
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
                      onClick={() => handleCreateIMEI()}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default AddSoundLQC;
