import { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col, notification, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserToken } from "../../../Redux/Actions";
import axios from "axios";

let myStyle = {
  container: {
    padding: "3em 9em",
  },
  main: { height: "83vh", overflow: "hidden", borderRadius: "10px" },
};

const ForgotPassword = () => {
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
        message: "Invalid Email User not Found",
        description: "",
      });
    } else {
      api[type]({
        message: "OTP send successfully",
        description: "Check your Email for OTP",
      });
    }
  };

  const handleSubmit = (values) => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API_URL + "/getwebsetting")
      .then((result) => {
        if (result.length != 0) {
          let final_result = result.data[0];

          let obj_data = {
            email: values.email,
            remember: values.remember,
            smtpHost: final_result.smtp_host,
            smtpPort: final_result.smtp_port,
            smtpUsername: final_result.smtp_username,
            smtpPassword: final_result.smtp_password,
          };

          axios
            .post(process.env.REACT_APP_API_URL + "/checkUserEmail", obj_data)
            .then((res) => {
              setLoading(false);
              if (res.data.length === 0) {
                openNotificationWithIcon("error");
              } else {
                console.log(res.data);
                if (res.data.token != "") {
                  let data = res.data;
                  dispatch(
                    updateUserToken({
                      id: data.token,
                    })
                  );
                  openNotificationWithIcon("success");
                  navigate("/otpVerify");
                } else {
                  openNotificationWithIcon("error");
                }
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        }
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
        <div style={myStyle.container}>
          <Row style={myStyle.main}>
            <Col span={12} style={{ backgroundColor: "#f6f7fc" }}>
              <div>
                <div className="loginFormContainer">
                  <div className="loginTitleDiv">
                    <div>
                      <span className="loginTitle">Forgot Password</span>
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
                        label="Email"
                        name="email"
                        rules={[
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                          {
                            required: true,
                            message: "Please input your E-mail!",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt"
                          placeholder="Enter your email"
                        />
                      </Form.Item>

                      <Form.Item name="remember" valuePropName="checked">
                        <div
                          className="remenberAndFrgotPassContainer"
                          style={{ justifyContent: "center" }}
                        >
                          <div>
                            <Link style={{ color: "#525252" }} to="/login">
                              Back to Sign in
                            </Link>
                          </div>
                        </div>
                      </Form.Item>

                      <Form.Item>
                        <Button
                          className="myAntLoginBtn"
                          type="primary"
                          htmlType="submit"
                          block
                        >
                          Send
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

export default ForgotPassword;
