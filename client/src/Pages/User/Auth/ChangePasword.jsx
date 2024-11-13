import { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col, notification, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../../Redux/Actions";
import axios from "axios";

let myStyle = {
  container: {
    padding: "3em 9em",
  },
  main: { height: "83vh", overflow: "hidden", borderRadius: "10px" },
};

const ChangePasword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    if (selector.isLogin) {
      navigate("/");
    }
  };

  const openNotificationWithIcon = (type) => {
    if (type === "error") {
      api[type]({
        message: "Server Error",
        description: "",
      });
    } else {
      api[type]({
        message: "Password Upated Successfully",
        description: "",
      });
    }
  };

  const handleSubmit = (values) => {
    setLoading(true);

    let obj = {
      id: selector.user.token,
      Password: values.password,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/updatePassword", obj)
      .then((res) => {
        setLoading(false);
        if (res.data.length === 0) {
          openNotificationWithIcon("error");
        } else {
          let data = res.data;
          if (data) {
            openNotificationWithIcon("success");
            navigate("/login");
          } else {
            openNotificationWithIcon("error");
          }
          // dispatch(
          //   handleLogin({
          //     id: data._id,
          //     f_name: data.f_name,
          //     l_name: data.l_name,
          //   })
          // );
        }
      })
      .catch((err) => {
        setLoading(false);
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
        <div style={myStyle.container}>
          <Row style={myStyle.main}>
            <Col span={12} style={{ backgroundColor: "#f6f7fc" }}>
              <div>
                <div className="loginFormContainer">
                  <div className="loginTitleDiv">
                    <div>
                      <span className="loginTitle">New Password</span>
                    </div>
                  </div>
                  <div className="loginForm">
                    <Form
                      name="basic"
                      layout="vertical"
                      initialValues={{
                        remember: true,
                      }}
                      onFinish={handleSubmit}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Enter new password"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password
                          className="myAntIpt"
                          placeholder="Enter Your new password"
                        />
                      </Form.Item>

                      <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Password do not match!")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          className="myAntIpt"
                          placeholder="Enter Your password"
                        />
                      </Form.Item>

                      {/* <Form.Item
                        label="Confirm password"
                        name="con_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password
                          className="myAntIpt"
                          placeholder="Enter Your password"
                        />
                      </Form.Item> */}

                      <Form.Item>
                        <Button
                          className="myAntLoginBtn"
                          type="primary"
                          htmlType="submit"
                          block
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <img
                src="./images/loginRightImg4.png"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default ChangePasword;
