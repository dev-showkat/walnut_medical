import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  notification,
  Spin,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../../Redux/Actions";
import axios from "axios";
import OtpInput from "react-otp-input";

let myStyle = {
  container: {
    padding: "3em 9em",
  },
  main: { height: "83vh", overflow: "hidden", borderRadius: "10px" },
};

const OtpVerify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

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
        message: "Invalid OTP",
        description: "",
      });
    } else {
      api[type]({
        message: "OTP Verify Successfully",
        description: "",
      });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    let token = selector.user.token;
    axios
      .post(process.env.REACT_APP_API_URL + "/verifyotp", { token: token, otp })
      .then((res) => {
        setLoading(false);
        let data = res.data;

        if (data) {
          openNotificationWithIcon("success");
          navigate("/changePassword");
        } else {
          openNotificationWithIcon("error");
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
                      <span className="loginTitle">Verification</span>
                    </div>
                  </div>
                  <div className="loginForm">
                    <div>
                      <span className="otpVerifyLabel">
                        Enter verification code
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      className="OTPInputContainer"
                    >
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        renderSeparator={<span> </span>}
                        renderInput={(props) => (
                          <input className="otpVerifyIpt" {...props} />
                        )}
                      />
                    </div>
                    <div
                      style={{ textAlign: "center", margin: "15px 30px 30px" }}
                    >
                      <span className="OtpResendText">
                        If you dont’t recieve a code,
                        <span style={{ color: "#0071C5" }}> Resend</span>
                      </span>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        className="myAntLoginBtn"
                        type="primary"
                        block
                        onClick={() => handleSubmit()}
                      >
                        Send
                      </Button>
                    </div>
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

export default OtpVerify;
