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
import {
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const IQCCheckedMaterail = () => {
  const [loading, setLoading] = useState(false);
  const [SystemLogedIn, setSystemLogedIn] = useState(false);
  const [SystemSelectedTime, setSystemSelectedTime] = useState(false);
  const [materialName, setMaterialName] = useState([]);
  const [materialId, setMaterialId] = useState([]);
  const [MaterialList, setMaterialList] = useState([]);
  const [exitModel, setExitModel] = useState(false);
  const [exitModel1, setExitModel1] = useState(false);
  const { confirm } = Modal;
  const { vendor_name } = useParams();
  const [MaterialNameList, setMaterialNameList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [MaterialModel, setMaterialModel] = useState(false);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const navigate = useNavigate();
  const { Option } = Select;
  const [MaterialParameter, setMaterialParameter] = useState([
    { parameter: undefined, spacification: undefined, inst_used: undefined },
  ]);
  useEffect(() => {
    checkLineActive();
    setMaterialName();
    setMaterialId();
    getMaterialName();
    getMaterial(vendor_name);
  }, []);

  const showMaterialModel = () => {
    setMaterialModel(true);
  };
  const MaterialModelCancel = () => {
    setMaterialModel(false);
  };
  const handleSaveOption = (value, key) => {
    setMaterialName(value);
    setMaterialId(key);
  };
  const handleCloseexitModel = () => {
    setExitModel(false);
  };

  const handleCloseexitModel1 = () => {
    setExitModel1(false);
  };
  const checkLineActive = () => {
    setSystemLogedIn(selector.SystemLogin.isLogedIn);
    setSystemSelectedTime(new Date(selector.SystemLogin.system_login_time));
  };
  const haldleSaveMaterial = () => {
    const material_name = materialName;
    const material_Id = materialId;
    const vendor_Name = vendor_name;
    axios
      .post(process.env.REACT_APP_API_URL + "/saveMaterial", {
        material_name: material_name,
        material_Id: material_Id,
        vendor_name: vendor_Name,
      })
      .then((result) => {
        getMaterial(vendor_name);
        message.success("Data saved successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data.");
      });
  };

  const getMaterial = (vendor_name) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMaterialchecked", {
        vendor_name,
      })
      .then((result) => {
        setMaterialList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const CheckMaterial = (material_id, material_name, vendor_name, date) => {
    navigate(
      `/check_Material/${material_id}/${material_name}/${vendor_name}/${date}`
    );
  };
  const handleCreateBatchModal = () => {
    // let batchName = `Batch_${new Date().getTime()}`;
    showMaterialModel();
  };

  const handleSaveMaterial = (values) => {
    const postData = {
      MaterialParameter: values.MaterialParameter,
      material_name: values.material_name,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/saveMaterialName`, postData)
      .then((result) => {
        getMaterialName();
        getMaterial(vendor_name);
        form.resetFields();
        setMaterialModel(false);
        message.success("Data saved successfully!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data.");
      });
  };

  const getMaterialName = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getMaterialName")
      .then((result) => {
        setMaterialNameList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
  const handleLogout = () => {
    setExitModel1(true);
  };

  const handleAddMore = () => {
    setMaterialParameter([
      ...MaterialParameter,
      { parameter: undefined, spacification: undefined, inst_used: undefined },
    ]);
  };

  const handleRemove = (index) => {
    setMaterialParameter((prevmaterials) =>
      prevmaterials.filter((item, i) => i !== index)
    );
  };

  return (
    <div>
      <Row>
        <Col span={11}>
          <span className="TopMenuTxt">Incoming Material has been checked</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            Vendor Name:{" "}
            {SystemLogedIn === true ? (
              <Input
                style={{
                  width: "200px",
                  height: "35px",
                  margin: "0 7px",
                  padding: "10px",
                  borderRadius: "4px",
                  gap: "10px",
                }}
                value={vendor_name}
              />
            ) : (
              <Input
                style={{
                  width: "200px",
                  height: "35px",
                  margin: "0 7px",
                  padding: "10px",
                  borderRadius: "4px",
                  gap: "10px",
                }}
                value={""}
              />
            )}
          </span>
          <span style={{ margin: "0 7px" }}>
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
                type="text"
                style={{ backgroundColor: "#fff" }}
                className="topLogoutBtn"
              >
                System Login
                <LoginOutlined style={{ color: "#4DDE4A" }} />
              </Button>
            )}
          </span>
        </Col>
      </Row>

      <Row style={{ marginTop: "2rem" }}>
        {MaterialList.length === 0 ? (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
        ) : (
          MaterialList.map((x) => (
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
                    <div>Material : {x.material_name}</div>
                    <div style={{ marginTop: "5px" }}>
                      Date: {new Date(x.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div>
                        <Button
                          className="ButtonSUbmit"
                          onClick={() =>
                            CheckMaterial(
                              x.material_Id,
                              x.material_name,
                              vendor_name,
                              new Date(x.createdAt).toISOString().split("T")[0]
                            )
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
      <Modal open={MaterialModel} onCancel={MaterialModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Material</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleSaveMaterial}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Material Name"
                        name="material_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input material name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter material name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    {MaterialParameter.map((item, index) => (
                      <React.Fragment key={index}>
                        <Col span={7}>
                          <Form.Item
                            label={`Parameter`}
                            name={["MaterialParameter", index, "parameter"]}
                            initialValue={item.parameter}
                          >
                            <Input
                              className="myAntIpt2"
                              placeholder="Enter Parameter"
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item
                            label={`Spacification(mm)`}
                            name={["MaterialParameter", index, "spacification"]}
                            initialValue={item.spacification}
                          >
                            <Input
                              className="myAntIpt2"
                              placeholder="Spacification"
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item
                            label={`Instrument`}
                            name={["MaterialParameter", index, "inst_used"]}
                            initialValue={item.inst_used}
                          >
                            <Input
                              className="myAntIpt2"
                              placeholder="Instrument"
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={3} style={{ marginTop: "-5px" }}>
                          {index === MaterialParameter.length - 1 && (
                            <Form.Item>
                              <Button
                                type="primary"
                                onClick={handleAddMore}
                                block
                                className="add-more-button"
                              >
                                <PlusOutlined style={{ marginLeft: "-5px" }} />
                              </Button>
                            </Form.Item>
                          )}
                          {index !== MaterialParameter.length - 1 && (
                            <Button
                              type="primary"
                              onClick={() => handleRemove(index)}
                              block
                              className="remove-button"
                            >
                              <DeleteOutlined style={{ marginLeft: "-5px" }} />
                            </Button>
                          )}
                        </Col>
                      </React.Fragment>
                    ))}

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
    </div>
  );
};

export default IQCCheckedMaterail;
