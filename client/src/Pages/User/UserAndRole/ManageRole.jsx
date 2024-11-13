import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageRole = () => {
  const [ApiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ActiveId, setActiveId] = useState(0);

  const [colorList, setColorList] = useState([
    "processing",
    "success",
    "warning",
    "magenta",
    "red",
    "gold",
  ]);

  const [optionList, setOptionList] = useState([
    {
      key: "admin",
      name: "Admin",
    },
    {
      key: "PostApi",
      name: "POST Response",
    },
    {
      key: "PostApiRead",
      name: "POST Response Read",
    },
    {
      key: "FileUpload",
      name: "File Upload",
    },
    {
      key: "oqc",
      name: "OQC",
    },
    {
      key: "lqc",
      name: "LQC",
    },
    {
      key: "qh",
      name: "Quailty Head",
    },
  ]);

  const { Option } = Select;

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API_URL + "/getRole")
      .then((result) => {
        let data = result.data;
        let newArr = [];

        data.map((x, i) => {
          newArr.push({
            no: i + 1,
            name: x.name,
            date_time: new Date(x.createdAt).toLocaleString(),
            access: x.access,
            action: x._id,
            id: x._id,
            fileLink: x.link,
          });
        });

        setApiData(newArr);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const EditUser = (id) => {
    ApiData.map((x) => {
      if (x.id == id) {
        setActiveId(id);
        form2.setFieldsValue(x);
        showModal();
      }
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values) => {
    // setLoading(true);

    let accessArr = [];

    values.access.map((z) => {
      optionList.map((y) => {
        if (z.key !== undefined) {
          if (y.key === z.key) {
            accessArr.push({ key: y.key, name: y.name });
          }
        } else {
          if (y.key === z) {
            accessArr.push({ key: y.key, name: y.name });
          }
        }
      });
    });

    values.access = accessArr;
    values.id = ActiveId;

    axios
      .post(process.env.REACT_APP_API_URL + "/UpdateRole", values)
      .then((result) => {
        console.log(result.data);
        getData();
        messageApi.open({
          type: "success",
          content: "file uploaded successfully",
        });
        setLoading(false);
        form2.resetFields();
        handleCancel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      render: (access) => {
        return (
          <div style={{ cursor: "pointer" }}>
            {access.map((x) => {
              return (
                <Tag
                  bordered={false}
                  color={colorList[randomIntFromInterval(0, 5)]}
                >
                  {x.name}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Date & Time",
      dataIndex: "date_time",
      key: "date_time",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (id) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <EditOutlined
              onClick={() => EditUser(id)}
              title="Copy Link"
              style={{
                fontSize: "14px",
                color: "green",
                marginRight: "10px",
              }}
            />
            <Popconfirm
              title="Are you sure"
              onConfirm={() => handleDelete(id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ fontSize: "14px", color: "red" }} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteRole", { id })
      .then((result) => {
        console.log(result.data);
        messageApi.open({
          type: "error",
          content: "File has been deleted",
        });
        getData();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (values) => {
    let accessArr = [];

    values.access.map((z) => {
      optionList.map((y) => {
        if (y.key === z) {
          accessArr.push({ key: y.key, name: y.name });
        }
      });
    });

    values.access = accessArr;

    axios
      .post(process.env.REACT_APP_API_URL + "/CreateRole", values)
      .then((result) => {
        getData();
        messageApi.open({
          type: "success",
          content: "Role Added successfully",
        });
        setLoading(false);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Update Role</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form2}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleSubmit}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Role Name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Access"
                        name="access"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Access!",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          style={{
                            width: "100%",
                          }}
                          placeholder="select one country"
                          optionLabelProp="label"
                        >
                          {optionList.map((x) => {
                            return (
                              <Option value={x.key} label={x.name}>
                                {x.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Save Changes
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
      <Spin spinning={loading}>
        {contextHolder}
        <div style={{ marginBottom: "2rem" }}>
          <h3>Role Managemeant</h3>
        </div>
        <div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row gutter={24} style={{ width: "100%" }}>
              <Col span={24}>
                <Form.Item
                  label="Role Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Role Name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Access"
                  name="access"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Access!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    style={{
                      width: "100%",
                    }}
                    placeholder="select one country"
                    optionLabelProp="label"
                  >
                    {optionList.map((x) => {
                      return (
                        <Option value={x.key} label={x.name}>
                          {x.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    className="myAntLoginBtn"
                    type="primary"
                    htmlType="submit"
                  >
                    Add New Role
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table columns={columns} dataSource={ApiData} />
        </div>
      </Spin>
    </div>
  );
};

export default ManageRole;
