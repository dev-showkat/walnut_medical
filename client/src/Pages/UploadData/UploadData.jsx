import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const UploadData = () => {
  const [ApiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API_URL + "/getUploadFiles")
      .then((result) => {
        let data = result.data;
        let newArr = [];

        data.map((x, i) => {
          newArr.push({
            no: i + 1,
            file: x.name,
            date_time: new Date(x.createdAt).toLocaleString(),
            action: x,
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

  const downloadFile = (id) => {
    ApiData.map((x) => {
      if (id == x.id) {
        window.location.href = `${process.env.REACT_APP_API_URL}/downloadData/${x.fileLink}?token=WgMLYoPjS56HqtD`;
      }
    });
  };

  const copyDownloadFileLink = (id) => {
    ApiData.map((x) => {
      if (id == x.id) {
        let copyText = `${process.env.REACT_APP_API_URL}/downloadData/${x.fileLink}?token=WgMLYoPjS56HqtD`;
        navigator.clipboard.writeText(copyText);
        messageApi.open({
          type: "success",
          content: "link has been copied to the clipboard",
        });
      }
    });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
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
      render: (data) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <DownloadOutlined
              onClick={() => downloadFile(data._id)}
              title="Copy Link"
              style={{
                fontSize: "14px",
                color: "#167bff",
                marginRight: "10px",
              }}
            />
            <CopyOutlined
              onClick={() => copyDownloadFileLink(data._id)}
              title="Copy Link"
              style={{
                fontSize: "14px",
                color: "green",
                marginRight: "10px",
              }}
            />
            <Popconfirm
              title="Are you sure"
              onConfirm={() => handleDelete(data)}
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

  const handleDelete = (data) => {
    let data2 = {
      id: data._id,
      name: data.link,
    };
    console.log(data2);
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteUploadFiles", data2)
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
    setLoading(true);

    console.log("Success:", values.file.file.originFileObj);

    let data = new FormData();

    data.append("name", values.name);
    data.append("myfile", values.file.file.originFileObj);

    axios
      .post(process.env.REACT_APP_API_URL + "/UploadFiles", data)
      .then((result) => {
        console.log(result.data);
        getData();
        messageApi.open({
          type: "success",
          content: "file uploaded successfully",
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

  return (
    <div>
      <Spin spinning={loading}>
        {contextHolder}
        <div style={{ marginBottom: "2rem" }}>
          <h3>Upload Files</h3>
        </div>
        <div>
          <Form
            form={form}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item
              label="File Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your File Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="File" name="file">
              <Upload action="/upload.do" listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              labelCol={{
                span: 2,
              }}
              wrapperCol={{
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Upload File
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table columns={columns} dataSource={ApiData} />
        </div>
      </Spin>
    </div>
  );
};

export default UploadData;
