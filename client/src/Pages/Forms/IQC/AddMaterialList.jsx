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
  Space,
} from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const AddMaterialList = () => {
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
  const [isChecked, setChecked] = useState(false);
  console.log(isChecked);
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
      .post(process.env.REACT_APP_API_URL + "/getMaterial", {
        vendor_name,
      })
      .then((result) => {
        setMaterialList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (Id) => {
    confirm({
      title: "Delete the Material",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Material?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(Id);
      },
    });
  };

  const deleteItem = (Id) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_Material", {
        data: {
          id: Id,
        },
      })
      .then((response) => {
        setMaterialList((prevData) =>
          prevData.filter((item) => item.key !== Id)
        );
        getMaterial(vendor_name);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const CheckMaterial = (material_id, material_name, vendor_name, date) => {
    navigate(
      `/check_Material/${material_id}/${material_name}/${vendor_name}/${date}`
    );
  };
  const handleCreateBatchModal = () => {
    showMaterialModel();
  };

  const handleSaveMaterial = (values) => {
    const postData = {
      MaterialParameter: values.MaterialParameter,
      material_name: values.material_name,
      checked_qr_code: isChecked,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/saveMaterialName`, postData)
      .then((result) => {
        getMaterialName();
        getMaterial(vendor_name);
        form.resetFields();
        setMaterialModel(false);
        message.success("Data saved successfully!");
        setTimeout(() => {
          setMaterialParameter([
            {
              parameter: undefined,
              spacification: undefined,
              inst_used: undefined,
            },
          ]);
          setChecked(false);
        }, 1000);
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
  const handleCheck = () => {
    setChecked(!isChecked);
  };
  const iconStyle = isChecked ? "checked" : "unchecked";
  return (
    <div>
      <Row>
        <Col span={11}>
          <span className="TopMenuTxt">Incoming Material Check List</span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            <Button
              className="TopMenuButton"
              onClick={() => handleCreateBatchModal()}
            >
              Create New Material <PlusOutlined />
            </Button>
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
        <Col span={24}>
          <div style={{ marginBottom: "15px" }}>Select the vendor name</div>
          <div>
            <Select
              placeholder="Select Vendor Name"
              style={{ minWidth: "280px" }}
              value={vendor_name}
              disabled
            ></Select>
          </div>
          <div style={{ marginBottom: "15px", marginTop: "15px" }}>
            Select the Material name
          </div>
          <div>
            <Select
              placeholder="Select Material Name"
              allowClear
              style={{ minWidth: "280px" }}
              onChange={(value, key) => handleSaveOption(value, key)}
            >
              {MaterialNameList.map((x) => (
                <Option key={x._id} value={x.material_name}>
                  {x.material_name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={24}>
          <div style={{ marginTop: "40px" }}>
            <Button
              className="lineModalButtonSUbmit"
              onClick={() => haldleSaveMaterial()}
            >
              Ok
            </Button>
          </div>
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
                    <div>{x.material_name}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div style={{ margin: "0 10px" }}>
                        <Button
                          className="lineModalButtonSUbmit2"
                          onClick={() => handleDelete(x._id)}
                        >
                          Delete
                        </Button>
                      </div>
                      <div>
                        <Button
                          className="lineModalButtonSUbmit"
                          onClick={() =>
                            CheckMaterial(
                              x.material_Id,
                              x.material_name,
                              vendor_name,
                              new Date(x.createdAt).toISOString().split("T")[0]
                            )
                          }
                        >
                          Start Testing
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
                            message: "Please input material name *",
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
                    <Col span={24}>
                      <Form.List name="MaterialParameter">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Space
                                key={key}
                                style={{
                                  display: "flex",
                                  marginBottom: 8,
                                }}
                                align="baseline"
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, "type"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Type",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Type">
                                    <Select.Option value="text">
                                      Text
                                    </Select.Option>
                                    <Select.Option value="qr">QR</Select.Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "parameter"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Parameter",
                                    },
                                  ]}
                                >
                                  <Input
                                    className="myAntIpt2"
                                    placeholder="Parameter"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "spacification"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Spacification",
                                    },
                                  ]}
                                >
                                  <Input
                                    className="myAntIpt2"
                                    placeholder="Spacification"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "inst_used"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Instrument",
                                    },
                                  ]}
                                >
                                  <Input
                                    className="myAntIpt2"
                                    placeholder="Instrument"
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add field
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Col>
                    {/* {MaterialParameter.map((item, index) => (
                      <React.Fragment key={index}>
                        <Col span={7}>
                          <Form.Item
                            label={`Parameter`}
                            name={["MaterialParameter", index, "parameter"]}
                            initialValue={item.parameter}
                            rules={[
                              {
                                required: true,
                                message: "Required*",
                              },
                            ]}
                            hasFeedback
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
                            rules={[
                              {
                                required: true,
                                message: "Required*",
                              },
                            ]}
                            hasFeedback
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
                            rules={[
                              {
                                required: true,
                                message: "Required*",
                              },
                            ]}
                            hasFeedback
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
                    ))} */}
                    {/* <Col span={24}>
                      <Form.Item>
                        <span
                          className={`checkbox-icon ${
                            isChecked ? "checked" : "unchecked"
                          }`}
                          onClick={handleCheck}
                          style={{ cursor: "pointer" }}
                        >
                          {isChecked ? <CheckOutlined /> : null}
                        </span>
                        <span style={{ marginLeft: "10px" }}>Enable QR</span>
                      </Form.Item>
                    </Col> */}
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

export default AddMaterialList;
