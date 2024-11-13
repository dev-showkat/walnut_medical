import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Select,
  Upload,
  Table,
} from "antd";

import {
  DownloadOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import TextArea from "antd/es/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

const RejectedMaterial = () => {
  const selector = useSelector((state) => state.persistedReducer);

  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [Activekey, setActivekey] = useState(0);
  const [exitModel, setExitModel] = useState(false);
  const [exitModel1, setExitModel1] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [SoundBoxModel, setSoundBoxModel] = useState(false);
  const [SystemLogedIn, setSystemLogedIn] = useState(false);
  const [SystemSelectedTime, setSystemSelectedTime] = useState(false);
  const [restoreId, setRestoreId] = useState("");
  useEffect(() => {
    checkLineActive();
    getrejectedLot();
  }, []);

  const handleCloseexitModel = () => {
    setShowModal(false);
  };
  const handleCloseexitModel1 = () => {
    setExitModel1(false);
  };
  const SoundBoxModelCancel = () => {
    setSoundBoxModel(false);
  };
  const checkLineActive = () => {
    setSystemLogedIn(selector.SystemLogin.isLogedIn);
    setSystemSelectedTime(new Date(selector.SystemLogin.system_login_time));
  };

  const handleSaveSystemLogin = () => {
    let activeTime = new Date();
    setSystemSelectedTime(activeTime);
    let logObj = {
      user_id: selector.user.token,
      isLogedIn: true,
      system_login_time: activeTime,
      type: "IQC",
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/LoginSystem", logObj)
      .then((result) => {
        logObj.system_id = result.data._id;
        dispatch(saveActiveSystem(logObj));
      })
      .catch((err) => {
        console.log(err);
      });

    setSystemLogedIn(true);
    setExitModel(false);
  };

  const getrejectedLot = () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/getrejectedLot`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x._id,
            vendor_name: x.vendor_name,
            date: new Date(x.updatedAt).toLocaleDateString(),
            material_name: x.material_name,
            lot_id: x.lot_id,
            lot_size: x.lot_size,
            remark: x.rejected_lot_remark,
            material_id: x.material_id,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          });
        });
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenSystemLogin = () => {
    setExitModel(true);
  };
  const handleLogout = () => {
    setExitModel1(true);
  };

  const handleSystemLogout = () => {
    setSystemLogedIn(false);
    let logObj = {
      id: selector.SystemLogin.system_id,
      time: new Date(),
    };
    axios
      .post(process.env.REACT_APP_API_URL + "/LogoutSystem", logObj)
      .then((result) => {
        dispatch(logoutActiveSystem());
        setExitModel1(false);
        navigate("/incoming_material");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOK = (id) => {
    console.log(id);
    setSoundBoxModel(true);
    setRestoreId(id);
  };
  const CheckMaterial = (material_id, material_name, vendor_name, date) => {
    navigate(
      `/check_Material/${material_id}/${material_name}/${vendor_name}/${date}`
    );
  };
  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
    },
    {
      title: "Material Type",
      dataIndex: "material_name",
      key: "material_name",
    },
    {
      title: "Lot ID",
      dataIndex: "lot_id",
      key: "lot_id",
    },
    {
      title: "Lot Size",
      dataIndex: "lot_size",
      key: "lot_size",
    },
    {
      title: "Rejected Date",
      dataIndex: "date",
      key: "date",
    },

    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      render: (_, record) => (
        <TextArea
          onChange={(e) => handleRemarksChange(record.key, e.target.value)}
          value={record.remark ? record.remark : "NA"}
          style={{ width: "250px" }}
        />
      ),
    },

    {
      title: "Review",
      key: "Review",
      render: (_, record) => (
        <div>
          <Button
            key="buy"
            type="primary"
            className="ButtonSUbmit"
            style={{ marginLeft: "-10px" }}
            onClick={() =>
              CheckMaterial(
                record.material_id,
                record.material_name,
                record.vendor_name,
                new Date(record.createdAt).toISOString().split("T")[0]
              )
            }
          >
            Review
          </Button>
        </div>
      ),
    },
    {
      title: "Action",
      key: "restore",
      render: (_, record) => (
        <div>
          <Button
            key="buy"
            type="primary"
            className="ButtonSUbmit"
            style={{ marginLeft: "-10px" }}
            onClick={() => handleOK(record.key)}
          >
            Restore
          </Button>
        </div>
      ),
    },
  ];

  const handleRemarksChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, remark: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleUpdateRejectedStatus = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/updateRejectedStatus", {
        id: id,
      })
      .then((response) => {
        getrejectedLot();
        setSoundBoxModel(false);
        message.success("Material Restored successfully!");
      })
      .catch((error) => {
        message.error("Error saving data.");
      });
  };
  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    const formattedBatchList = tableData.map((item) => {
      const {
        id,
        key,
        createdAt,
        date,
        picture,
        updatedAt,
        material_id,
        ...rest
      } = item;
      return {
        ...rest,
        CreatedDateTime: new Date(item.createdAt).toLocaleString(),
        UpdatedDateTime: new Date(item.updatedAt).toLocaleString(),
        Rejected: "Full Lot",
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Rejected_Material_report.xlsx";
    a.click();
  };
  return (
    <div>
      <Row style={{ marginBottom: "10px" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Rejected Material</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          {SystemLogedIn === true ? (
            <span style={{ margin: "0 7px" }}>
              <Button
                key="excelImport"
                type="primary"
                onClick={handleExcelImport}
                style={{ marginRight: "15px" }}
              >
                Export Report <DownloadOutlined />
              </Button>
              <Button
                onClick={() => handleLogout()}
                type="text"
                style={{ backgroundColor: "#fff" }}
                className="topLogoutBtn"
              >
                ({SystemSelectedTime.toLocaleTimeString()})
                <LogoutOutlined style={{ color: "red" }} />
              </Button>
            </span>
          ) : (
            <Button
              onClick={() => handleOpenSystemLogin()}
              type="text"
              style={{ backgroundColor: "#fff" }}
              className="topLogoutBtn"
            >
              System Login
              <LoginOutlined style={{ color: "#4DDE4A" }} />
            </Button>
          )}
        </Col>
      </Row>
      <Modal
        title="System Entry"
        visible={exitModel}
        onCancel={handleCloseexitModel}
        footer={null}
      >
        <Result
          status="Login"
          icon={<LoginOutlined style={{ color: "#4DDE4A" }} />}
          subTitle={
            <span className="result-subtitle">
              Do you want to System Login?
              <br />
              <p style={{ marginTop: "10px" }}></p>
              Login time:
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
              onClick={handleSaveSystemLogin}
              className="circular-button"
            >
              Ok
            </Button>,
          ]}
        />
      </Modal>
      <Modal
        title="System Exit"
        visible={exitModel1}
        onCancel={handleCloseexitModel1}
        footer={null}
      >
        <Result
          status="logout"
          icon={<LogoutOutlined style={{ color: "#FF5C5C" }} />}
          subTitle={
            <span className="result-subtitle">
              Do you want to Logout from System?
              <br />
              <p style={{ marginTop: "10px" }}></p>
              Logout time:
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
            </span>
          }
          extra={[
            <Button
              key="buy"
              onClick={handleCloseexitModel1}
              className="circular-button cancle"
            >
              Cancel
            </Button>,
            <Button
              key="buy"
              type="primary"
              onClick={handleSystemLogout}
              className="circular-button"
            >
              Ok
            </Button>,
          ]}
        />
      </Modal>
      <Modal open={SoundBoxModel} onCancel={SoundBoxModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Restore Material</span>
              </Col>
              <Col
                span={24}
                style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
              >
                <img src="./SVG/check.svg" />
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                Do you want to restore this material?
              </Col>
              <Col span={24} style={{ padding: "2rem  3rem 0" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <div>
                    <Button
                      className="lineModalButtonSUbmit2"
                      onClick={() => SoundBoxModelCancel()}
                    >
                      Cancle
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="lineModalButtonSUbmit"
                      onClick={() => handleUpdateRejectedStatus(restoreId)}
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Row style={{ marginTop: "2rem" }}>
        {SystemLogedIn === true ? (
          <Col span={24} style={{ backgroundColor: "#fff", padding: "20px" }}>
            <div>
              <div style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={true}
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
            </div>
          </Col>
        ) : (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default RejectedMaterial;
