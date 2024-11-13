import React, { useEffect, useState } from "react";
import { Row, Col, Card, Progress, Avatar, List, Table, Button } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const myStyle = {
  cardTxtContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  cardTxtContainer2: {
    display: "flex",
    justifyContent: "center",
  },
};

const CardComp = () => {
  const [checkedPercentage, setCheckedPercentage] = useState([]);
  const [damagedPercentage, setDamagedPercentage] = useState([]);
  const [masterCarton, setMasterCarton] = useState([]);
  const [masterCartonChecked, setMasterCartonChecked] = useState([]);
  const [masterCartonDF, setMasterCartonDF] = useState([]);

  useEffect(() => {
    getMasterCarton();
    getMasterCartonDefected();
  }, []);

  const getMasterCarton = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getMasterCartonAll")
      .then((result) => {
        let arr = [];

        result.data.map((x) => {
          if (x.check_status === "true") {
            arr.push(x);
          }
        });

        setMasterCarton(result.data);
        setMasterCartonChecked(arr);

        axios
          .get(process.env.REACT_APP_API_URL + "/getItemsForReview")
          .then((result2) => {
            setMasterCartonDF(result2.data);
            getGraphPercentage(
              result.data.length,
              arr.length,
              result2.data.length
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGraphPercentage = (totalItem, checked, damaged) => {
    let checkedPercentagein = (100 * checked) / totalItem;
    let damagedPercentagein = (100 * damaged) / totalItem;
    checkedPercentagein = checkedPercentagein.toFixed();
    damagedPercentagein = damagedPercentagein.toFixed();
    setCheckedPercentage(checkedPercentagein);
    setDamagedPercentage(damagedPercentagein);
  };

  const getMasterCartonDefected = () => {};

  return (
    <Card className="dashboardCard" style={{ height: "310px" }}>
      <div style={myStyle.cardTxtContainer2}>
        <span className="dashboardCardTxt">Master Carton in OQC this week</span>
      </div>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <Progress
          percent={checkedPercentage}
          strokeColor="#5B7690"
          success={{
            percent: damagedPercentage,
            strokeColor: "#2B3E50",
          }}
          trailColor="#C9D5E3"
          type="circle"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#2B3E50",
              verticalAlign: "middle",
              width: "12px",
              height: "12px",
              marginRight: "5px",
            }}
            size="small"
          />
          Checked
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>
            {masterCartonChecked.length}
          </span>
          <Button className="reviewBtn">Review</Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#5B7690",
              verticalAlign: "middle",
              width: "12px",
              height: "12px",
              marginRight: "5px",
            }}
            size="small"
          />
          Defected
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>{masterCartonDF.length}</span>
          <Button className="reviewBtn">Review</Button>
        </div>
      </div>
    </Card>
  );
};
const CardComp2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getLotAndDefectedMaterialOfThisWeek();
  }, []);
  const [totalLotSize, setTotalLotSize] = useState(0);
  const [totalDefectedItem, setTotalDefectedItem] = useState(0);
  const [ratioPercentage, setRatioPercentage] = useState(0);

  const getLotAndDefectedMaterialOfThisWeek = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL + "/getLotAndDefectedMaterialOfThisWeek"
      )
      .then((result) => {
        console.log(result.data);
        setTotalLotSize(result.data.totalLotSize);
        setTotalDefectedItem(result.data.totalDefectedItem);
        setRatioPercentage(result.data.roundedPercentage);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const goToDefected = () => {
    navigate(`/iqc_reviewStatusHQ`);
  };
  const goToChecked = () => {
    navigate(`/IQC_checkedHQ`);
  };
  return (
    <Card className="dashboardCard" style={{ height: "310px" }}>
      <div style={myStyle.cardTxtContainer2}>
        <span className="dashboardCardTxt">
          Incoming Material in IQC this week
        </span>
      </div>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <Progress
          percent={100 - ratioPercentage}
          strokeColor="#5B7690"
          success={{
            percent: ratioPercentage,
            strokeColor: "#2B3E50",
          }}
          trailColor="#C9D5E3"
          type="circle"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#2B3E50",
              verticalAlign: "middle",
              width: "12px",
              height: "12px",
              marginRight: "5px",
            }}
            size="small"
          />
          Loat size
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>{totalLotSize}</span>
          <Button className="reviewBtn" onClick={goToChecked}>
            Review
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#5B7690",
              verticalAlign: "middle",
              width: "12px",
              height: "12px",
              marginRight: "5px",
            }}
            size="small"
          />
          Defected
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>{totalDefectedItem}</span>
          <Button className="reviewBtn" onClick={goToDefected}>
            Review
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CardComp3 = () => {
  const [EmpList, setEmpList] = useState([]);

  useEffect(() => {
    getEmploye();
  }, []);

  const getEmploye = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/GetUserList")
      .then((result) => {
        axios
          .get(process.env.REACT_APP_API_URL + "/getRole")
          .then((result2) => {
            result.data.map((x) => {
              result2.data.map((y) => {
                if (y._id === x.role) {
                  x.roleName = y.name;
                  x.access = y.access;
                }
              });
            });
            setEmpList(result.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card
      className="dashboardCard"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "310px",
      }}
    >
      <div>No data</div>
    </Card>
  );
};

const CardComp4 = () => {
  const [EmpListOqc, setEmpListOqc] = useState([]);
  const [EmpListLqc, setEmpListLqc] = useState([]);

  useEffect(() => {
    getEmploye();
  }, []);

  const getEmploye = () => {
    let OQCEmp = [];
    let LQCEmp = [];
    axios
      .get(process.env.REACT_APP_API_URL + "/GetUserList")
      .then((result) => {
        axios
          .get(process.env.REACT_APP_API_URL + "/getRole")
          .then((result2) => {
            result.data.map((x) => {
              result2.data.map((y) => {
                if (y._id === x.role) {
                  x.roleName = y.name;

                  y.access.map((n) => {
                    if (n.key == "oqc") {
                      OQCEmp.push(x);
                    }
                    if (n.key == "lqc") {
                      LQCEmp.push(x);
                    }
                  });

                  // console.log(x, y.access);
                }
              });
            });

            setEmpListOqc(OQCEmp);
            setEmpListLqc(LQCEmp);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card className="dashboardCard" style={{ height: "400px" }}>
      <div style={myStyle.cardTxtContainer}>
        <span className="dashboardCardTxt">Employees Details</span>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "20px", textAlign: "center", width: "100% " }}>
          <div style={{ padding: "10px  0", textAlign: "left" }}>In OQC</div>
          <List
            itemLayout="horizontal"
            dataSource={EmpListOqc}
            style={{ height: "300px", overflow: "auto" }}
            renderItem={(item) => {
              return (
                <List.Item
                  style={{
                    textAlign: "left",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`${process.env.REACT_APP_API_URL}/images/${item.image}`}
                      />
                    }
                    title={
                      <span>
                        {item.f_name} {item.l_name}
                      </span>
                    }
                    description={item.roleName}
                  />
                </List.Item>
              );
            }}
          />
        </div>
        <div style={{ margin: "20px", textAlign: "center", width: "100% " }}>
          <div style={{ padding: "10px  0", textAlign: "left" }}>In LQC</div>
          <List
            itemLayout="horizontal"
            dataSource={EmpListLqc}
            style={{ height: "300px", overflow: "auto" }}
            renderItem={(item) => {
              return (
                <List.Item
                  style={{
                    textAlign: "left",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`${process.env.REACT_APP_API_URL}/images/${item.image}`}
                      />
                    }
                    title={
                      <span>
                        {item.f_name} {item.l_name}
                      </span>
                    }
                    description={item.roleName}
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </Card>
  );
};

const CardComp5 = () => {
  return (
    <Card
      className="dashboardCard"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}
    >
      <div>No data</div>
    </Card>
  );
};

const Dashboard_qh = () => {
  return (
    <div>
      <Row>
        {/* <Col span={8} style={{ padding: "20px" }}>
          <CardComp />
        </Col> */}
        <Col span={8} style={{ padding: "20px" }}>
          <CardComp />
        </Col>

        <Col span={8} style={{ padding: "20px" }}>
          <CardComp2 />
        </Col>

        <Col span={8} style={{ padding: "20px" }}>
          <CardComp3 />
        </Col>

        <Col span={16} style={{ padding: "20px" }}>
          <CardComp4 />
        </Col>
        {/* <Col span={8} style={{ padding: "20px" }}>
          <CardComp5 />
        </Col> */}
      </Row>
    </div>
  );
};

export default Dashboard_qh;
