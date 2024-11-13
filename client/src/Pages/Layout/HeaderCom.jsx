import React from "react";
import { Layout, Row, Col, Input } from "antd";
import { SearchOutlined, HomeOutlined, BellOutlined } from "@ant-design/icons";

const HeaderCom = () => {
  const { Header } = Layout;
  return (
    <Header
      style={{
        padding: 0,
        background: "#fff",
        boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.10)",
      }}
    >
      <Row style={{ margin: "0 30px" }}>
        <Col span={10} className="h64p">
          <span className="appBarTxt">
            <HomeOutlined /> Dashboard
          </span>
        </Col>

        <Col span={7} className="h64p">
          {/* <div style={{ padding: "0 10px" }}>
            <Input placeholder="Select Line number" />
          </div> */}
        </Col>

        <Col span={6} className="h64p">
          <div style={{ padding: "0 10px" }}>
            <Input
              style={{ backgroundColor: "#f5f6fa" }}
              placeholder="Search something"
              prefix={<SearchOutlined />}
            />
          </div>
        </Col>

        <Col span={1} className="h64p">
          <div style={{ padding: "0 10px" }}>
            <BellOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderCom;
