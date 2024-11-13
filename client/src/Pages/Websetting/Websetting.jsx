import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Select,
  Modal,
  message,
  Spin,
} from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css";

const { Title } = Typography;
const { Option } = Select;

const { confirm } = Modal;

const HomeSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [webSetting, setWebSetting] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getWebsetting();
  }, []);

  const getWebsetting = (values) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getWebSetting", values)
      .then((result) => {
        setWebSetting(result.data);
        form.setFieldsValue(result.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (values) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/updateWebSetting", values)
      .then((result) => {
        messageApi.open({
          type: "success",
          content: "Settings Updated",
        });
        getWebsetting();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const generateNewKey = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API_URL + "/generateKey")
      .then((result) => {
        setLoading(false);
        getWebsetting();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const copyPublicKey = () => {
    if (webSetting.length != 0) {
      let copyText = JSON.stringify(webSetting[0].publicKey);
      console.log(copyText);
      navigator.clipboard.writeText(copyText);
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        {contextHolder}
        <Row style={{ width: "100%" }}>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={5} className="Expensecolor">
                Setting
              </Title>
            </div>
          </Col>
          <Col span={24}>
            <Form
              form={form}
              name="basic"
              layout="vertical"
              autoComplete="off"
              onFinish={handleSubmit}
            >
              <Row gutter={24} style={{ width: "100%" }}>
                <Col span={24}>
                  <Form.Item label="API Token" name="token">
                    <Input readOnly />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Public Key" name="publicKey">
                    <Input.TextArea rows={15} readOnly />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Private Key" name="privateKey">
                    <Input.TextArea rows={15} readOnly />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item>
                    <Button
                      size="small"
                      onClick={() => generateNewKey()}
                      type="default"
                    >
                      Generate New Key's
                    </Button>
                    <Button
                      style={{ margin: "0 5px" }}
                      size="small"
                      onClick={() => copyPublicKey()}
                      type="default"
                    >
                      Copy Public Key
                    </Button>
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
      </Spin>
    </>
  );
};

export default HomeSettings;
