import {
  DeleteOutlined,
  LogoutOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Modal, Result, Row, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import ShowMonoCartonSandeeModal from "../Modals/ShowMonoCartonSandeeModal";
import { useNavigate } from "react-router-dom";

const MasterCartonCheckListOQC = () => {
  const [masterCartonList, setMasterCartonList] = useState([]);
  const [MonoCartonList, setMonoCartonList] = useState([]);
  const [foundDataModal, setFoundDataModal] = useState(false);
  const [showViewCartonModal, setShowViewCartonModal] = useState(false);
  const navigate = useNavigate();

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
      .get(process.env.REACT_APP_API_URL + "/getMasterCartonAll")
      .then((result) => {
        let newArr = [];
        result.data.map((x) => {
          if (x.check_status === "true") {
            newArr.push({
              mcn: x.masterCartonNumber,
              status: "Unchecked",
              iicf: "Found",
              vic: x.details,
              tmc: x._id,
              action: x._id,
            });
          }
        });

        setMasterCartonList(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScanQR = () => {
    let dataObj = {
      mono_carton: 20,
      sandee: 2,
    };
    let dataObjDetails = [
      {
        mono_carton: [
          {
            id: "1",
            imei: "4915953731462031",
            defect: 0,
          },
          {
            id: "2",
            imei: "4915953731462032",
            defect: 0,
          },
          {
            id: "3",
            imei: "4915953731462033",
            defect: 0,
          },
          {
            id: "4",
            imei: "4915953731462034",
            defect: 0,
          },
          {
            id: "5",
            imei: "4915953731462035",
            defect: 0,
          },
          {
            id: "6",
            imei: "4915953731462036",
            defect: 0,
          },
          {
            id: "7",
            imei: "4915953731462037",
            defect: 0,
          },
          {
            id: "8",
            imei: "4915953731462038",
            defect: 0,
          },
          {
            id: "9",
            imei: "4915953731462039",
            defect: 0,
          },
          {
            id: "10",
            imei: "49159537314620310",
            defect: 0,
          },
        ],
        standee: [
          {
            id: "1",
            imei: "4759847597448721",
            defect: 0,
          },
          {
            id: "2",
            imei: "4759847597448722",
            defect: 0,
          },
          {
            id: "3",
            imei: "4759847597448723",
            defect: 0,
          },
          {
            id: "4",
            imei: "4759847597448724",
            defect: 0,
          },
        ],
      },
    ];
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
    let masterCartonObj = {
      batch_name: selector.LineLogin.active_batch,
      mono_carton: dataFound.mono_carton,
      sandee: dataFound.sandee,
      masterCartonNumber,
      details: dataFoundDetails,
      total_no: masterCartonList.length + 1,
    };

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
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
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
      <Row style={{ alignItems: "center" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Listed Mater Carton</span>
        </Col>
        <Col span={6}></Col>
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

      {masterCartonList.length === 0 ? (
        <Result
          icon={<img src="./SVG/noitem.svg" />}
          subTitle="No Item Found"
        />
      ) : (
        masterCartonList.map((x) => {
          return (
            <Row style={{ marginTop: "2rem" }}>
              <Col span={24} style={{ backgroundColor: "#fff" }}>
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
                      <div>Master Carton</div>
                      <div style={{ margin: "5px 0" }}>
                        Number :{" "}
                        <span style={{ margin: "0 2px" }}>{x.mcn}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex" }}>
                        <div>
                          <Button
                            className="lineModalButtonSUbmit"
                            onClick={() => navigate(`/SondBoxOQCList/${x.mcn}`)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          );
        })
      )}

      {/* <Row
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
        </Row> */}
    </div>
  );
};

export default MasterCartonCheckListOQC;
