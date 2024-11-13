import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  HomeFilled,
  LogoutOutlined,
  SettingOutlined,
  ApiOutlined,
  MoneyCollectOutlined,
  CloudUploadOutlined,
  CodepenOutlined,
  CheckSquareOutlined,
  FileDoneOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  RightCircleOutlined,
  BankOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Card, Menu, Avatar, Layout } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAc } from "../../Redux/Actions";
import axios from "axios";

const batchId = {
  paytm: "paytm",
  bharatPe: "PCBA-BBID",
  hdfc: "PCBA-BID",
};

const SideBar = () => {
  const { SubMenu } = Menu;
  const { Sider } = Layout;

  const routerParms = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);

  const [menuList, setMenuList] = useState([]);
  const [userAccess, setUserAccess] = useState([]);
  const [ActiveRoleName, setActiveRoleName] = useState();

  // const [menuActiveId, setMenuActiveId] = useState("4");
  const [selectedKeys, setSelectedKeys] = useState(["1"]);

  const [subMenuOpen, setSubMenuOpen] = useState([]);

  const routeLocation = useLocation();

  useEffect(() => {
    getUserRole();
  }, []);

  const handleLogout = () => {
    dispatch(handleLogoutAc());
    navigate("/login");
  };

  const getUserRole = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getRole")
      .then((result) => {
        result.data.map((x) => {
          if (x._id == selector.user.role) {
            setActiveRoleName(x.name);
            setUserAccess(x.access);
            createMenuList(x.access);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createMenuList = (access) => {
    let AllMenu = [
      {
        id: 1,
        key: "admin",
        name: "Dashboard",
        icon: <HomeFilled className="sidebarIcon" />,
        link: "/ResultDashboard",
        SubMenu: false,
      },
      {
        id: 202,
        key: "admin",
        name: "BharatPe Data",
        icon: <DatabaseOutlined className="sidebarIcon" />,
        link: `/PostDataShow/${batchId.bharatPe}`,
        SubMenu: false,
      },
      {
        id: 201,
        key: "admin",
        name: "HDFC Data",
        icon: <BankOutlined className="sidebarIcon" />,
        link: `/PostDataShow/${batchId.hdfc}`,
        SubMenu: false,
      },
      {
        id: 2,
        key: "admin",
        name: "Paytm Data",
        icon: <MoneyCollectOutlined className="sidebarIcon" />,
        link: `/PostDataShow/${batchId.paytm}`,
        SubMenu: false,
      },
      {
        id: 3,
        key: "admin",
        name: "Upload Files",
        icon: <CloudUploadOutlined className="sidebarIcon" />,
        link: "/FileUpload",
        SubMenu: false,
      },
      {
        id: 4,
        key: "admin",
        name: "User & Role's",
        icon: <UserOutlined className="sidebarIcon" />,

        SubMenu: true,
        SubMenuItems: [
          {
            id: 50,
            key: "ManageUser",
            link: "/ManageUser",
            name: "User Managemeant",
          },
          {
            id: 60,
            key: "ManageRole",
            link: "/ManageRole",
            name: "Role Managemeant",
          },
        ],
      },
      {
        id: 7,
        key: "oqc",
        name: "Master Carton",
        icon: <CodepenOutlined className="sidebarIcon" />,
        link: "/MasterCartonOQC",
        SubMenu: false,
      },
      {
        id: 8,
        key: "oqc",
        name: "Checked",
        icon: <CheckSquareOutlined className="sidebarIcon" />,
        link: "/CheckedOQC",
        SubMenu: false,
      },
      {
        id: 9,
        key: "oqc",
        name: "Review Status",
        icon: <FileDoneOutlined className="sidebarIcon" />,
        link: "/ReviewStatusOQC",
        SubMenu: false,
      },
      {
        id: 10,
        key: "lqc",
        name: "Sound Box",
        icon: <CodepenOutlined className="sidebarIcon" />,
        link: "/sound_box",
        SubMenu: false,
      },
      {
        id: 11,
        key: "lqc",
        name: "Checked",
        icon: <CheckSquareOutlined className="sidebarIcon" />,
        link: "/Check_list",
        SubMenu: false,
      },
      {
        id: 12,
        key: "lqc",
        name: "Review Status",
        icon: <FileDoneOutlined className="sidebarIcon" />,
        link: "/lqc_reviewStatus",
        SubMenu: false,
      },
      {
        id: 13,
        key: "iqc",
        name: "Incoming Material",
        icon: <FileDoneOutlined className="sidebarIcon" />,
        link: "/incoming_material",
        SubMenu: false,
      },
      {
        id: 14,
        key: "iqc",
        name: "Checked",
        icon: <CheckSquareOutlined className="sidebarIcon" />,
        link: "/IQC_checked",
        SubMenu: false,
      },
      {
        id: 15,
        key: "iqc",
        name: "Review Status",
        icon: <FileDoneOutlined className="sidebarIcon" />,
        link: "/iqc_reviewStatus",
        SubMenu: false,
      },
      {
        id: 16,
        key: "iqc",
        name: "Rejected Material",
        icon: <CloseCircleOutlined className="sidebarIcon" />,
        link: "/iqc_rejectedmaterial",
        SubMenu: false,
      },
      {
        id: 160,
        key: "iqc",
        name: "Accepted Material",
        icon: <RightCircleOutlined className="sidebarIcon" />,
        link: "/iqc_acceptedmaterial",
        SubMenu: false,
      },
      {
        id: 17,
        key: "rework",
        name: "Defected List",
        icon: <FileDoneOutlined className="sidebarIcon" />,
        link: "/rework_soundbox",
        SubMenu: false,
      },
      {
        id: 18,
        key: "rework",
        name: "Rework Item List",
        icon: <FileDoneOutlined className="sidebarIcon" />,
        link: "/rework_checklist",
        SubMenu: false,
      },
      {
        id: 19,
        key: "qh",
        name: "Dashboard",
        icon: <HomeFilled className="sidebarIcon" />,
        link: "/dashboard_qh",
        SubMenu: false,
      },
      {
        id: 20,
        key: "qh",
        name: "Master Carton",
        icon: <UserOutlined className="sidebarIcon" />,

        SubMenu: true,
        SubMenuItems: [
          {
            id: 21,
            key: "qh_1",
            link: "/MasterCartonBatchList_qc",
            name: "Checked",
          },
          {
            id: 22,
            key: "qh_2",
            link: "/Review_qh",
            name: "Review",
          },
        ],
      },
      {
        id: 23,
        key: "qh",
        name: "IQC",
        icon: <UserOutlined className="sidebarIcon" />,
        link: "/",
        SubMenu: true,
        SubMenuItems: [
          {
            id: 24,
            key: "qh_1",
            link: "/IQC_checkedHQ",
            name: "Review",
          },
          {
            id: 25,
            key: "qh_2",
            link: "/iqc_reviewStatusHQ",
            name: "Defected",
          },
        ],
      },
      {
        id: 26,
        key: "ph",
        name: "Dashboard",
        icon: <HomeFilled className="sidebarIcon" />,
        link: "/dashboard_ph",
        SubMenu: false,
      },
      {
        id: 27,
        key: "ph",
        name: "Sound Box",
        icon: <CodepenOutlined className="sidebarIcon" />,
        link: "/",
        SubMenu: true,
        SubMenuItems: [
          {
            id: 28,
            key: "ph_1",
            link: "/LQC_checkedAllPH",
            name: "Checked",
          },
          {
            id: 29,
            key: "ph_2",
            link: "/lqc_reviewStatusPH",
            name: "Review Status",
          },
        ],
      },
      {
        id: 30,
        key: "ph",
        name: "Rework",
        icon: <RetweetOutlined className="sidebarIcon" />,
        link: "/",
        SubMenu: true,
        SubMenuItems: [
          {
            id: 31,
            key: "ph_1",
            link: "/rework_soundbox",
            name: "Defected List",
          },
          {
            id: 32,
            key: "ph_2",
            link: "/rework_checklist",
            name: "Rework Item List",
          },
        ],
      },
      {
        id: 34,
        key: "PostApiRead",
        name: "Dashboard",
        icon: <HomeFilled className="sidebarIcon" />,
        link: "/ResultDashboard",
        SubMenu: false,
      },
      {
        id: 35,
        key: "PostApiRead",
        name: "Show POST Data",
        icon: <ApiOutlined className="sidebarIcon" />,
        link: "/PostApiRead",
        SubMenu: false,
      },
      {
        id: 98,
        key: "settings",
        name: "Settings",
        icon: <SettingOutlined className="sidebarIcon" />,
        link: "/settings",
        SubMenu: false,
      },
      {
        id: 99,
        key: "logout",
        name: "Logout",
        icon: <LogoutOutlined className="sidebarIcon" />,
        link: "/logout",
        SubMenu: false,
      },
    ];

    let countID = 1;
    let ActiveMenu = [];

    access.map((x) => {
      AllMenu.map((y) => {
        if (x.key === y.key) {
          y.id = countID;
          ActiveMenu.push(y);
          countID++;
        }
      });
    });

    AllMenu.map((x) => {
      if (x.key === "settings") {
        ActiveMenu.push(x);
        countID++;
      }
      if (x.key === "logout") {
        ActiveMenu.push(x);
        countID++;
      }
    });

    let adminCount = 1;
    access.map((x) => {
      if (x.key === "admin") {
        ActiveMenu = [];
        AllMenu.map((z) => {
          if (z.key == "admin") {
            z.id = adminCount;
            ActiveMenu.push(z);
            adminCount++;
          }
          if (z.key === "settings") {
            ActiveMenu.push(z);
            countID++;
          }
          if (z.key === "logout") {
            ActiveMenu.push(z);
            countID++;
          }
        });
      }
    });

    setMenuList(ActiveMenu);
    const { pathname } = routeLocation;
    const activeLink = ActiveMenu.find((menu) => pathname.includes(menu.link));
    if (activeLink?.id) {
      setSelectedKeys([`${activeLink.id}` || "1"]);
    } else {
      navigate(ActiveMenu[0].link);
    }
  };

  const handleClick = (e) => {
    setSelectedKeys([e.key]);
  };

  return (
    <Sider
      className="overlayContainer "
      theme="light"
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {}}
      onCollapse={(collapsed, type) => {}}
      width={250}
      style={{
        backgroundColor: "#C9D5E3",
        height: "100vh",
        position: "relative",
        width: "100%",
      }}
    >
      <div style={{ textAlign: "center", width: "100%" }}>
        <img src="./logo.png" alt="" style={{ padding: "15px 20px 30px" }} />
      </div>

      <Menu
        style={{ backgroundColor: "#C9D5E3" }}
        mode="inline"
        selectedKeys={selectedKeys}
        onClick={handleClick}
        openKeys={subMenuOpen}
        onOpenChange={(openKeys) => {
          setSubMenuOpen(openKeys);
        }}
      >
        {menuList.map((x) => {
          if (x.SubMenu) {
            return (
              <SubMenu
                key={x.id}
                title={
                  <span>
                    <span style={{ marginRight: "5px" }}>{x.icon}</span>
                    <span>{x.name}</span>
                  </span>
                }
              >
                {x.SubMenuItems.map((sub) => {
                  return (
                    <Menu.Item key={sub.id}>
                      <Link to={sub.link}>{sub.name}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          } else {
            if (x.key === "logout") {
              return (
                <Menu.Item key={x.id} onClick={() => handleLogout()}>
                  <div style={{ display: "flex" }}>
                    <div>{x.icon}</div>
                    <div>
                      <span className="menuText">{x.name}</span>
                    </div>
                  </div>
                </Menu.Item>
              );
            } else {
              return (
                <Menu.Item key={x.id}>
                  <div style={{ display: "flex" }}>
                    <div>{x.icon}</div>
                    <div>
                      <Link to={x.link} className="menuText">
                        {x.name}
                      </Link>
                    </div>
                  </div>
                </Menu.Item>
              );
            }
          }
        })}
      </Menu>
      <div style={{ position: "absolute", width: "100%", bottom: "20px" }}>
        <div
          style={{
            padding: "0 10px",
          }}
        >
          <Card className="sidebarDiv">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Avatar
                  size={35}
                  src={
                    <img
                      src={`${process.env.REACT_APP_API_URL}/images/${selector.user.photo}`}
                      alt="avatar"
                    />
                  }
                  style={{ marginRight: "15px" }}
                />
              </div>
              <div>
                <div>
                  <span className="appBarUserName">
                    {selector.user.f_name} {selector.user.l_name}
                  </span>
                </div>
                <div>
                  <span className="appBarUserType"> {ActiveRoleName}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Sider>
  );
};

export default SideBar;
