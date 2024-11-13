import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  Avatar,
  List,
  Table,
  Button,
  Select,
} from "antd";
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
  const navigate = useNavigate();

  const [checkedPercentage, setCheckedPercentage] = useState([]);
  const [damagedPercentage, setDamagedPercentage] = useState([]);
  const [masterCarton, setMasterCarton] = useState([]);
  const [masterCartonChecked, setMasterCartonChecked] = useState([]);
  const [masterCartonDF, setMasterCartonDF] = useState([]);

  useEffect(() => {
    getAddedSoundBoxListPH();
  }, []);

  const [totalAddedSoundbox, setTotalAddedSoundBox] = useState(0);
  const [totalDefectedItem, setTotalDefectedItem] = useState(0);
  const [ratioPercentage, setRatioPercentage] = useState(0);
  const getAddedSoundBoxListPH = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAddedSoundBoxListPH")
      .then((result) => {
        setTotalAddedSoundBox(result.data.batchCounts);
        setTotalDefectedItem(result.data.totalDefectedItem);
        setRatioPercentage(result.data.roundedPercentage);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const goToChecked = () => {
    navigate(`/LQC_checkedPH`);
  };
  const goToDefected = () => {
    navigate(`/lqc_reviewStatusPH`);
  };

  function getData(event) {
    const selectedValue = event;
    let apiUrl = `${process.env.REACT_APP_API_URL}/getAddedSoundBoxListPH/?duration=${selectedValue}`;
    axios
      .get(apiUrl)
      .then((result) => {
        setTotalAddedSoundBox(result.data.batchCounts);
        setTotalDefectedItem(result.data.totalDefectedItem);
        setRatioPercentage(result.data.roundedPercentage);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <Card className="dashboardCard" style={{ height: "310px" }}>
      <div style={myStyle.cardTxtContainer2}>
        <span className="dashboardCardTxt">Sound Box in LQC this week</span>
        <Select
          style={{ width: "50%", marginLeft: "10px" }}
          onChange={getData}
          defaultValue="Select Filter"
        >
          <option>Select Filter</option>
          <option value="current_month">Current Months</option>
          <option value="current_year">Current Year</option>
        </Select>
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
          Checked
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>{totalAddedSoundbox}</span>
          <Button className="reviewBtn" onClick={goToChecked}>
            Review
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
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
const CardComp2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getRemarkItemListPH();
    getSoundboxlinequalitychecklistPH();
  }, []);
  const [totalWorkingFine, setTotalWorkingFine] = useState(0);
  const [totalDamagedItem, setTotalDamagedItem] = useState(0);
  const [successRatioPercentage, setSuccessRatioPercentage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);

  const getRemarkItemListPH = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getRemarkItemListPH")
      .then((result) => {
        setTotalWorkingFine(result.data.workingFineCount);
        setTotalDamagedItem(result.data.totalDamagedItem);
        setSuccessRatioPercentage(result.data.roundedPercentage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSoundboxlinequalitychecklistPH = () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/getAllCheckedSoundboxlistPH`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        const idCount = {};

        let newData = [];
        let newData1 = [];

        data.forEach((item) => {
          const { _id, Soundboxlinequalitychecklist, ...rest } = item;
          Soundboxlinequalitychecklist.forEach((x) => {
            if (x.status === "OK") {
              const id = x.id;
              idCount[id] = (idCount[id] || 0) + 1;
              newData.push({
                id: _id,
                lqcl: x.lqcl,
                status: x.status,
                defect_category: x.defect_category,
                remarks: x.remarks,
                picture: x.picture,
                analysis_details: x.analysis_details,
                batch_number: rest.batch_number,
                ref_IMEI: rest.ref_IMEI,
                line_name: rest.line_name,
              });
            }
            if (x.status != "OK") {
              newData1.push({
                id: _id,
                lqcl: x.lqcl,
                status: x.status,
                defect_category: x.defect_category,
                remarks: x.remarks,
                picture: x.picture,
                analysis_details: x.analysis_details,
                batch_number: rest.batch_number,
                ref_IMEI: rest.ref_IMEI,
                line_name: rest.line_name,
              });
            }
          });
        });

        setTableData(newData);
        setTableData1(newData1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const ratioPercentage = (tableData1.length / tableData.length) * 100;
  const roundedPercentage = Math.round(ratioPercentage * 100) / 100;
  const goToFixedItem = () => {
    navigate("/rework_checklistPH");
  };

  function getDataReworkData(event) {
    const selectedValue = event;
    let apiUrl = `${process.env.REACT_APP_API_URL}/getAllCheckedSoundboxlistPH/?duration=${selectedValue}`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        const idCount = {};

        let newData = [];
        let newData1 = [];

        data.forEach((item) => {
          const { _id, Soundboxlinequalitychecklist, ...rest } = item;
          Soundboxlinequalitychecklist.forEach((x) => {
            if (x.status === "OK") {
              const id = x.id;
              idCount[id] = (idCount[id] || 0) + 1;
              newData.push({
                id: _id,
                lqcl: x.lqcl,
                status: x.status,
                defect_category: x.defect_category,
                remarks: x.remarks,
                picture: x.picture,
                analysis_details: x.analysis_details,
                batch_number: rest.batch_number,
                ref_IMEI: rest.ref_IMEI,
                line_name: rest.line_name,
              });
            }
            if (x.status != "OK") {
              newData1.push({
                id: _id,
                lqcl: x.lqcl,
                status: x.status,
                defect_category: x.defect_category,
                remarks: x.remarks,
                picture: x.picture,
                analysis_details: x.analysis_details,
                batch_number: rest.batch_number,
                ref_IMEI: rest.ref_IMEI,
                line_name: rest.line_name,
              });
            }
          });
        });

        setTableData(newData);
        setTableData1(newData1);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <Card className="dashboardCard" style={{ height: "310px" }}>
      <div style={myStyle.cardTxtContainer2}>
        <span className="dashboardCardTxt">Sound Box in Rework this week</span>
        <Select
          style={{ width: "50%", marginLeft: "10px" }}
          onChange={getDataReworkData}
          defaultValue="Select Filter"
        >
          <option>Select Filter</option>
          <option value="current_month">Current Months</option>
          <option value="current_year">Current Year</option>
        </Select>
      </div>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <Progress
          percent={100 - roundedPercentage}
          strokeColor="#5B7690"
          success={{
            percent: roundedPercentage,
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
          Working Fine
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>{tableData.length}</span>
          <Button className="reviewBtn" onClick={goToFixedItem}>
            Review
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
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
          Damaged
        </div>
        <div>
          <span style={{ marginRight: "10px" }}>{tableData1.length}</span>
          <Button className="reviewBtn" disabled>
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
  const [EmpListRework, setEmpListRework] = useState([]);

  useEffect(() => {
    getEmploye();
  }, []);

  const getEmploye = () => {
    let OQCEmp = [];
    let LQCEmp = [];
    let ReworkEmp = [];
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
                    if (n.key == "rework") {
                      ReworkEmp.push(x);
                    }
                  });

                  // console.log(x, y.access);
                }
              });
            });

            setEmpListOqc(OQCEmp);
            setEmpListLqc(LQCEmp);
            setEmpListRework(ReworkEmp);
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
        <div style={{ margin: "20px", textAlign: "center", width: "100% " }}>
          <div style={{ padding: "10px  0", textAlign: "left" }}>In Rework</div>
          <List
            itemLayout="horizontal"
            dataSource={EmpListRework}
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
