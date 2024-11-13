import { useEffect } from "react";

import { Layout } from "antd";

import { useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import SideBar from "./Layout/SideBar";
import HeaderCom from "./Layout/HeaderCom";

const { Content } = Layout;

const LayoutMain = () => {
  const navigate = useNavigate();

  const selector = useSelector((state) => state.persistedReducer);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    if (!selector.isLogin) {
      navigate("/login");
    }
  };

  return (
    <>
      <Layout>
        <SideBar />
        <Layout style={{ backgroundColor: "#f6f8fb" }}>
          <HeaderCom />
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "auto",
              height: "80vh",
              background: "#F6F8FB",
            }}
          >
            <div
              style={{
                height: "100%",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default LayoutMain;
