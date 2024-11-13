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
  Select,
  Pagination,
} from "antd";
import { LoginOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const IQCCheckedHQ = () => {
  const pageSize = 7;
  const [loading, setLoading] = useState(false);
  const [SystemLogedIn, setSystemLogedIn] = useState(false);
  const [SystemSelectedTime, setSystemSelectedTime] = useState(false);
  const [vendorName, setVendorName] = useState([]);
  const [VendorList, setVendorList] = useState([]);
  const [VendorNameList, setVendorNameList] = useState([]);
  const [exitModel, setExitModel] = useState(false);
  const [exitModel1, setExitModel1] = useState(false);
  const [SystemLoginModel, setSystemLoginModel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [MaterialModel, setMaterialModel] = useState(false);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const navigate = useNavigate();
  const { Option } = Select;
  useEffect(() => {
    checkLineActive();
    setVendorName();
    getVendor();
    getVendorName();
  }, []);

  const showMaterialModel = () => {
    setMaterialModel(true);
  };
  const MaterialModelCancel = () => {
    setMaterialModel(false);
  };
  const handleSaveOption = (value) => {
    setVendorName(value);
  };
  const handleCloseexitModel = () => {
    setExitModel(false);
  };

  const handleCloseexitModel1 = () => {
    setExitModel1(false);
  };
  const handleCloseLoginModel = () => {
    setSystemLoginModel(false);
  };
  const checkLineActive = () => {
    setSystemLogedIn(selector.SystemLogin.isLogedIn);
    setSystemSelectedTime(new Date(selector.SystemLogin.system_login_time));
  };

  const totalItems = VendorList.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startItemIndex = (currentPage - 1) * pageSize;
  const endItemIndex = Math.min(currentPage * pageSize, totalItems);
  const visibleItems = VendorList.slice(startItemIndex, endItemIndex);

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

  const haldleSaveVendor = () => {
    if (SystemLogedIn === true) {
      const vendor_name = vendorName;
      axios
        .post(process.env.REACT_APP_API_URL + "/saveVendor", {
          vendor_name: vendor_name,
        })
        .then((result) => {
          getVendor();
          getVendorName();
          message.success("Data saved successfully!");
        })
        .catch((err) => {
          console.log(err);
          message.error("Error saving data.");
        });
    } else {
      setSystemLoginModel(true);
    }
  };

  const getVendor = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getVendorincheckedHQ")
      .then((result) => {
        setVendorList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddMaterial = (vendor_name) => {
    navigate(`/Iqc_checkedMaterail/${vendor_name}`);
  };
  const handleCreateVendor = () => {
    showMaterialModel();
  };

  const handleSaveVendor = (values) => {
    if (SystemLogedIn === true) {
      axios
        .post(process.env.REACT_APP_API_URL + "/saveVendorName", {
          vendor_name: values.vendor_name,
        })
        .then((result) => {
          getVendorName();
          getVendor();
          form.resetFields();
          setMaterialModel(false);
          message.success("Data saved successfully!");
        })
        .catch((err) => {
          console.log(err);
          message.error("Error saving data.");
        });
    } else {
      setSystemLoginModel(true);
    }
  };
  const getVendorName = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getVendorName")
      .then((result) => {
        setVendorNameList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleOpenSystemLogin = () => {
    setSystemLoginModel(false);
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

  return (
    <div>
      <Row style={{ marginBottom: "10px" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Incoming Material has been checked</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}></Col>
      </Row>

      <Row style={{ marginTop: "2rem" }}>
        {visibleItems.length !== 0 ? (
          visibleItems.map((x) => (
            <Col
              span={24}
              style={{ backgroundColor: "#fff", marginBottom: "1rem" }}
              key={x._id}
            >
              <div style={{ padding: ".5rem" }}>
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
                    <div>Vendor Name : {x.vendor_name}</div>
                    <div style={{ marginTop: "5px" }}>
                      Date : {new Date(x.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div>
                        <Button
                          className="ButtonSUbmit"
                          onClick={() => AddMaterial(x.vendor_name)}
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
        ) : (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
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
      <Modal open={MaterialModel} onCancel={MaterialModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Vendor</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleSaveVendor}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Vendor Name"
                        name="vendor_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input vendor name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter vendor name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
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
      <Modal
        title="System Login"
        visible={SystemLoginModel}
        onCancel={handleCloseLoginModel}
        footer={null}
      >
        <Result
          status="Login"
          icon={<LoginOutlined style={{ color: "#4DDE4A" }} />}
          subTitle={
            <span className="result-subtitle">
              Please Login to your System First?
            </span>
          }
          extra={[
            <Button
              key="buy"
              type="primary"
              onClick={handleOpenSystemLogin}
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

export default IQCCheckedHQ;
