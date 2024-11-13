import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Button, Col, Row, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeLoginList_qh = () => {
  const [ApiData, setApiData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/empLogin")
      .then((result) => {
        let data = result.data;
        let newArr = [];

        console.log(data);

        data.map((x, i) => {
          let { f_name, l_name } = x.UserDetail[0];
          newArr.push({
            emp_name: `${f_name} ${l_name}`,
            master_carton: 0,
            login: new Date(x.line_login_time).toLocaleString(),
            logout: new Date(x.LogedOutTime).toLocaleString(),
          });
        });

        setApiData(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      title: "Employee name",
      dataIndex: "emp_name",
      key: "emp_name",
    },
    {
      title: "Add master carton",
      dataIndex: "master_carton",
      key: "master_carton",
    },
    {
      title: "Login Time",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Logout Time",
      dataIndex: "logout",
      key: "logout",
    },
    {
      title: "Review",
      dataIndex: "action",
      key: "action",
      render: (id) => {
        return (
          <Button
            className="lineModalButtonSUbmit"
            style={{ width: "unset" }}
            onClick={() => navigate("/ListedMaterCarton_qh")}
          >
            Review
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Employee Login Entry List</span>
        </Col>
      </Row>
      <Row style={{ marginTop: "2rem" }}>
        <Col span={24} style={{ backgroundColor: "#fff" }}>
          <div style={{ marginTop: "25px" }}>
            <Table columns={columns} dataSource={ApiData} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeLoginList_qh;
