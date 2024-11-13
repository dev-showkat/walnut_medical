import {
  DeleteOutlined,
  LogoutOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Modal,
  Result,
  Row,
  Table,
  message,
  Select,
  DatePicker,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShowMonoCartonSandeeModal from "./Modals/ShowMonoCartonSandeeModal";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

const AddMasterCartonOQC = () => {
  const [Standee1Number, setStandee1Number] = useState();
  const [Standee2Number, setStandee2Number] = useState();
  const { Option } = Select;
  const [ModalNumber, setModalNumber] = useState();
  const [LineNumber, setLineNumber] = useState();
  const [MasterCartonDate, setMasterCartonDate] = useState();
  console.log(MasterCartonDate);
  const [BoxNumber, setBoxNumber] = useState();
  const [Language, setLanguage] = useState();

  const [masterCartonList, setMasterCartonList] = useState([]);
  const [MonoCartonList, setMonoCartonList] = useState([]);
  const [foundDataModal, setFoundDataModal] = useState(false);
  const [showViewCartonModal, setShowViewCartonModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [startScan, setStartScan] = useState(false);

  const [masterCartonNumber, setMasterCartonNumber] = useState("");
  const [dataFound, setDataFound] = useState({
    mono_carton: 0,
    sandee: 0,
  });

  const [dataFoundDetails, setDataFoundDetails] = useState([]);
  const [foundDataDetails, setFoundDataDetails] = useState(false);

  const selector = useSelector((state) => state.persistedReducer);

  useEffect(() => {
    getMasterCartons();
  }, []);

  const getMasterCartons = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCarton", {
        batch_name: selector.LineLogin.active_batch,
      })
      .then((result) => {
        let newArr = [];
        result.data.map((x) => {
          newArr.push({
            mcn: x.masterCartonNumber,
            status: x.check_status === "true" ? "Checked" : "Unchecked",
            iicf: "Found",
            vic: x.details,
            tmc: x._id,
            action: x._id,
            modal_number: x.ModalNumber,
            box_number: x.BoxNumber,
            language: x.Language,
          });
        });

        setMasterCartonList(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScanQR = (data) => {
    setStartScan(!startScan);
    messageApi.open({
      type: "success",
      content: "Scanned  Successfully",
    });

    data = data.split("\r\n");

    data = data.filter((x) => x != "");

    let master_carton_no = data.length;

    let dataObj = {
      mono_carton: master_carton_no,
      sandee: 2,
    };

    let dataObjDetails = [
      {
        mono_carton: [],
        standee: [],
      },
    ];

    let standee_sr = 1;

    data.map((x, i) => {
      // if (i < master_carton_no) {
      dataObjDetails[0].mono_carton.push({
        id: i + 1,
        imei: x,
        defect: 0,
      });
      // } else {
      //   dataObjDetails[0].standee.push({
      //     id: standee_sr,
      //     imei: x,
      //     defect: 0,
      //   });
      //   standee_sr++;
      // }
    });

    console.log(dataObj);

    gotDataFromQR(dataObj, dataObjDetails);
  };

  const gotDataFromQR = (data, details) => {
    setDataFound(data);
    setDataFoundDetails(details);
    showFoundDataModal();
  };

  const showFoundDataModal = () => {
    setFoundDataModal(true);
  };

  const BatchModelCancel = () => {
    setFoundDataModal(false);
  };

  const handleCreateDataFound = () => {
    setFoundDataDetails(true);
    BatchModelCancel();
  };

  const handleMasterCatronAdd = () => {
    let standee = [
      { id: 1, imei: Standee1Number, defect: 0 },
      { id: 2, imei: Standee2Number, defect: 0 },
    ];

    let masterCartonObj = {
      batch_name: selector.LineLogin.active_batch,
      mono_carton: dataFound.mono_carton,
      sandee: dataFound.sandee,
      masterCartonNumber,
      details: dataFoundDetails,
      total_no: masterCartonList.length + 1,
      user_id: selector.user.employee_id,
      ModalNumber,
      LineNumber,
      MasterCartonDate,
      BoxNumber,
      Language,
    };

    masterCartonObj.details[0].standee = standee;

    console.log(masterCartonObj);

    axios
      .post(process.env.REACT_APP_API_URL + "/AddMasterCarton", masterCartonObj)
      .then((result) => {
        console.log(result.data);

        setFoundDataDetails(false);
        setDataFound({
          mono_carton: 0,
          sandee: 0,
        });
        setMasterCartonNumber("");
        getMasterCartons();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteMasterCarton", { id })
      .then((result) => {
        console.log(result.data);
        getMasterCartons();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewCarton = (data) => {
    setMonoCartonList(data);
    setShowViewCartonModal(true);
  };

  const handleViewCartonCancel = () => {
    setShowViewCartonModal(false);
  };

  const StartTesting = (id) => {
    masterCartonList.map((x) => {
      if (x.action === id) {
        navigate(`/SondBoxOQCList/${x.mcn}`);
      }
    });
  };

  const columns = [
    {
      title: "Master Carton Number",
      dataIndex: "mcn",
      key: "mcn",
    },
    {
      title: "Modal Number",
      dataIndex: "modal_number",
      key: "modal_number",
    },
    {
      title: "Box Number",
      dataIndex: "box_number",
      key: "box_number",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    // },
    {
      title: "Items IMEI code Found",
      dataIndex: "iicf",
      key: "iicf",
    },
    {
      title: "View IMEI code",
      dataIndex: "vic",
      key: "vic",
      render: (record) => (
        <Button
          className="lineModalButtonSUbmit"
          onClick={() => handleViewCarton(record)}
          style={{ width: "90px", padding: "15px", fontSize: "12px" }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Test Master Carton",
      dataIndex: "tmc",
      key: "tmc",
      render: (record) => {
        return (
          <Button
            className="lineModalButtonSUbmit"
            onClick={() => StartTesting(record)}
            style={{ width: "90px", padding: "15px", fontSize: "12px" }}
          >
            Start Testing
          </Button>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (id) => (
        <DeleteOutlined
          onClick={() => handleDelete(id)}
          style={{ fontSize: "14px", color: "red" }}
        />
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
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
                    handleScanQR(result.text);
                  }

                  if (!!error) {
                    // messageApi.open({
                    //   type: "error",
                    //   content: "device not found",
                    // });
                    // console.log(error);
                    // handleScanQRError();
                  }
                }}
              />
            </div>
            <Button onClick={() => setStartScan(!startScan)}>close</Button>
          </div>
        </>
      )}
      <ShowMonoCartonSandeeModal
        MonoCartonList={MonoCartonList}
        showViewCartonModal={showViewCartonModal}
        handleViewCartonCancel={() => handleViewCartonCancel()}
      />
      <Modal open={foundDataModal} onCancel={BatchModelCancel} footer={[]}>
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Master Carton Items</span>
            </Col>
            <Col
              span={24}
              style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
            >
              <img src="./SVG/check.svg" />
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              {dataFound.mono_carton} Mono Carton IMEI code
            </Col>
            <Col span={24} style={{ textAlign: "center", marginTop: "10px" }}>
              successfully on scanning!
            </Col>
            <Col span={24} style={{ padding: "2rem  3rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
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
                    onClick={() => handleCreateDataFound()}
                  >
                    OK
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
      <Row style={{ alignItems: "center" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Add Master Carton</span>
        </Col>
        <Col span={6}>
          <span style={{ margin: "0 7px" }}>
            <span style={{ fontWeight: "600", marginRight: "10px" }}>
              Batch ID:
            </span>
            <span style={{ fontWeight: "400" }}>
              {selector.LineLogin.active_batch}
            </span>
          </span>
        </Col>
        <Col span={7} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            <Button
              type="text"
              style={{ backgroundColor: "#fff" }}
              className="topLogoutBtn"
            >
              {selector.LineLogin.line_name} (
              {new Date(
                selector.LineLogin.line_login_time
              ).toLocaleTimeString()}
              )
              <LogoutOutlined style={{ color: "red" }} />
            </Button>
          </span>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1rem" }}
      >
        <Col span={12}>
          <div style={{ display: "flex" }}>
            <div>
              <div style={{ marginBottom: "15px" }}>
                Please Scan Mater Carton BR Code
              </div>
              <div>
                <Button
                  className="masterCartonAddButton"
                  onClick={() => setStartScan(!startScan)}
                >
                  Outgoing Quality Check <QrcodeOutlined />
                </Button>
              </div>
              {foundDataDetails === true ? (
                <div style={{ color: "#606060", fontSize: "12px" }}>
                  <div style={{ marginTop: "5px" }}>
                    {dataFound.mono_carton} Mono Carton IMEI code successfully
                    on scanning!
                  </div>
                  <div style={{ marginTop: "2px" }}></div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div>
            <div style={{ marginBottom: "15px" }}>Master Carton Number</div>
            <div>
              <Input
                className="masterCartonAddInput"
                placeholder="Please Enter Master Carton Number"
                onChange={(e) => setMasterCartonNumber(e.target.value)}
                value={masterCartonNumber}
              />
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ marginTop: "30px" }}>
            <div style={{ marginBottom: "15px" }}>Standee 1 Number</div>
            <div>
              <Input
                className="masterCartonAddInput"
                placeholder="Standee 1 Number"
                onChange={(e) => setStandee1Number(e.target.value)}
                value={Standee1Number}
              />
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <div style={{ marginBottom: "15px" }}>Standee 2 Number</div>
            <div>
              <Input
                className="masterCartonAddInput"
                placeholder="Standee 2 Number"
                onChange={(e) => setStandee2Number(e.target.value)}
                value={Standee2Number}
              />
            </div>
          </div>
          <div style={{ marginTop: "40px" }}>
            <Button
              className="lineModalButtonSUbmit"
              onClick={() => handleMasterCatronAdd()}
            >
              Save
            </Button>
          </div>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={12}>
              <div style={{ marginTop: "30px" }}>
                <div style={{ marginBottom: "15px" }}>Model number</div>
                <div>
                  <Input
                    style={{ width: "200px" }}
                    className="masterCartonAddInput"
                    placeholder="Model number"
                    onChange={(e) => setModalNumber(e.target.value)}
                    value={ModalNumber}
                  />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: "30px" }}>
                <div style={{ marginBottom: "15px" }}>Line number</div>
                <div>
                  <Input
                    style={{ width: "200px" }}
                    className="masterCartonAddInput"
                    placeholder="Line number"
                    onChange={(e) => setLineNumber(e.target.value)}
                    value={LineNumber}
                  />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: "30px" }}>
                <div style={{ marginBottom: "15px" }}>Date</div>
                <div>
                  {/* <Input
                    style={{ width: "200px" }}
                    className="masterCartonAddInput"
                    placeholder="Date"
                    onChange={(e) => setMasterCartonDate(e.target.value)}
                    value={MasterCartonDate}
                  /> */}
                  <DatePicker
                    className="masterCartonAddInput"
                    style={{ width: "200px" }}
                    format="DD-MM-YY"
                    onChange={(date, dateString) => {
                      const formattedDate = dateString;
                      setMasterCartonDate(formattedDate);
                    }}
                  />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: "30px" }}>
                <div style={{ marginBottom: "15px" }}>Box number</div>
                <div>
                  <Input
                    style={{ width: "200px" }}
                    className="masterCartonAddInput"
                    placeholder="Box number"
                    onChange={(e) => setBoxNumber(e.target.value)}
                    value={BoxNumber}
                  />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: "30px" }}>
                {/* <div style={{ marginBottom: "15px" }}>Language</div> */}
                <Select
                  style={{ width: "200px" }}
                  // className="masterCartonAddInput"
                  placeholder="Select Language"
                  onChange={(value) => setLanguage(value)}
                  value={Language}
                >
                  <Option value="English">English</Option>
                  <Option value="Hindi">Hindi</Option>
                </Select>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {/* <div style={{ marginTop: "40px" }}>
            <Button
              className="lineModalButtonSUbmit"
              onClick={() => handleMasterCatronAdd()}
            >
              Save
            </Button>
          </div> */}
        </Col>
      </Row>
      <Row
        style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1rem" }}
      >
        <Col span={24}>
          {masterCartonList.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          ) : (
            <Table
              style={{ textAlign: "center" }}
              columns={columns}
              dataSource={masterCartonList}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AddMasterCartonOQC;
