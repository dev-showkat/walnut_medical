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
} from "antd";
import { LoginOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const Incoming_materiallist = () => {
  const [loading, setLoading] = useState(false);
  const [SystemLogedIn, setSystemLogedIn] = useState(false);
  const [SystemSelectedTime, setSystemSelectedTime] = useState(false);
  const [vendorName, setVendorName] = useState([]);
  const [VendorList, setVendorList] = useState([]);
  const [VendorNameList, setVendorNameList] = useState([]);
  const [exitModel, setExitModel] = useState(false);
  const [exitModel1, setExitModel1] = useState(false);
  const [SystemLoginModel, setSystemLoginModel] = useState(false);

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
      .get(process.env.REACT_APP_API_URL + "/getVendor")
      .then((result) => {
        setVendorList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (Id, vendor_name) => {
    confirm({
      title: "Delete the Vendor",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Vendor?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(Id, vendor_name);
      },
    });
  };

  const deleteItem = (Id, vendor_name) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_vendor", {
        data: {
          id: Id,
          vendor_name: vendor_name,
        },
      })
      .then((response) => {
        setVendorList((prevData) => prevData.filter((item) => item.key !== Id));
        getVendor();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const AddMaterial = (vendor_name) => {
    navigate(`/AddMaterialIQC/${vendor_name}`);
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
        // navigate("/incoming_material");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Row style={{ marginBottom: "10px" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Incoming Material Check List</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          {SystemLogedIn === true ? (
            <span style={{ margin: "0 7px" }}>
              <Button
                className="TopMenuButton"
                onClick={() => handleCreateVendor()}
              >
                Create New Vendor <PlusOutlined />
              </Button>
            </span>
          ) : (
            ""
          )}

          {SystemLogedIn === true ? (
            <span style={{ margin: "0 7px" }}>
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
        <Col span={24}>
          <div style={{ marginBottom: "15px" }}>Select the vendor name</div>
          <div>
            <Select
              placeholder="Select Vendor Name"
              allowClear
              style={{ minWidth: "280px" }}
              onChange={(value) => handleSaveOption(value)}
            >
              {VendorNameList.map((x) => (
                <Option key={x.vendor_name} value={x.vendor_name}>
                  {x.vendor_name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={24}>
          <div style={{ marginTop: "40px" }}>
            <Button
              className="lineModalButtonSUbmit"
              onClick={() => haldleSaveVendor()}
            >
              Ok
            </Button>
          </div>
        </Col>
      </Row>
      <hr />
      <Row style={{ marginTop: "2rem" }}>
        {SystemLogedIn === true ? (
          <div style={{ marginBottom: "15px" }}>
            Added Incoming Material For checking
          </div>
        ) : (
          ""
        )}
        {VendorList.length !== 0 && SystemLogedIn === true ? (
          VendorList.map((x) => (
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
                    <div>{x.vendor_name}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div style={{ margin: "0 10px" }}>
                        <Button
                          className="lineModalButtonSUbmit2"
                          onClick={() => handleDelete(x._id, x.vendor_name)}
                        >
                          Delete
                        </Button>
                      </div>
                      <div>
                        <Button
                          className="lineModalButtonSUbmit"
                          onClick={() => AddMaterial(x.vendor_name)}
                        >
                          Add Material
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
                  //   onFinishFailed={onFinishFailed}
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

export default Incoming_materiallist;
