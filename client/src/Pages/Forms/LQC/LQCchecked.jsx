import React, { useState } from "react";
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
} from "antd";
import { LoginOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";

const LQCchecked = () => {
  const [loading, setLoading] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const generateUniqueBatchNumber = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `BATCH_${timestamp}_${random}`;
  };

  const handleCreateBatchClick = () => {
    const newBatchNumber = generateUniqueBatchNumber();
    setBatchNumber(newBatchNumber);
  };
  const handleSaveBatch = () => {
    console.log(batchNumber);
  };

  const handleLogout = () => {
    setShowModal(true);
  };
  return (
    <div>
      <Row>
        <Col span={12}>
          <span className="TopMenuTxt">Sound Box Line Quality Check List</span>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <span
            style={{
              fontFamily: "Montserrat",
              fontSize: "12px",
              fontWeight: "600",
              lineHeight: "15px",
              letterSpacing: "0.02em",
              textAlign: "left",
              color: "#606060",
            }}
          ></span>
          Sound Box IMEI No.
          <Input
            style={{
              width: "200px",
              height: "35px",
              margin: "0 7px",
              textAlign: "center",
              padding: "10px",
              borderRadius: "4px",
              gap: "10px",
            }}
            value={3486785768567}
          />
          <span style={{ margin: "0 7px" }}>
            <Button
              className="TopMenuButton"
              style={{ backgroundColor: "#fff", color: "#5b7690" }}
              onClick={handleLogout}
            >
              Line 1 (
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              )
              <LogoutOutlined style={{ color: "#FF5C5C" }} />
            </Button>
          </span>
        </Col>
      </Row>
      <Modal
        title="Line Exit"
        visible={showModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Result
          status="logout"
          icon={<LogoutOutlined style={{ color: "#FF5C5C" }} />}
          subTitle={
            <span className="result-subtitle">
              Do you want to exit from this production line?
            </span>
          }
          extra={[
            <Button
              key="buy"
              onClick={handleCloseModal}
              className="circular-button"
            >
              Cancel
            </Button>,
            <Button
              key="buy"
              type="primary"
              onClick={handleSaveBatch}
              className="circular-button"
            >
              Save
            </Button>,
          ]}
        />
      </Modal>
      <Row style={{ marginTop: "2rem" }}>
        <Col span={24} style={{ backgroundColor: "#fff" }}>
          <Result
            icon={<img src="./SVG/noitem.svg" />}
            subTitle="No Item Found"
          />
        </Col>
      </Row>
    </div>
  );
};

export default LQCchecked;
