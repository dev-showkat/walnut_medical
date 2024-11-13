import { LogoutOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Row } from "antd";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MasterCartonListOQC from "./OQCTestList/MasterCartonListOQC";
import BoxItemCheckOQC from "./OQCTestList/BoxItemCheckOQC";
import axios from "axios";
import MonoCartonCheckList from "./OQCTestList/MonoCartonCheckList";
import SandeeSingleTesting from "./OQCTestList/SandeeSingleTesting";
import CheckForSampleOQC from "./OQCTestList/CheckForSampleOQC";
import MatchDeviceAndBoxIMEIOQC from "./OQCTestList/MatchDeviceAndBoxIMEIOQC";
import { useLocalStorage } from "@uidotdev/usehooks";

const SondBoxOQCList = () => {
  const [activeAccor, setactiveAccor] = useLocalStorage(0);

  const [oqclStatus, setoqclStatus] = useState("");
  const [sbclStatus, setsbclStatus] = useState("");
  const [mdbibsStatus, setmdbibsStatus] = useState("");
  const [bicStatus, setbicStatus] = useState("");
  const [mcclStatus, setmcclStatus] = useState("");

  const [IMEICode, setIMEICode] = useState();
  const selector = useSelector((state) => state.persistedReducer);
  const parms = useParams();
  const [dataList2, setDataList2] = useState([]);
  const [showSaveCheckButton, setShowSaveCheckButton] = useState(false);

  const ListSturcture = ({ name, component, className, no }) => {
    const updateAccorToggle = (n) => {
      if (n === activeAccor) {
        setactiveAccor(0);
      } else {
        setactiveAccor(n);
      }
    };

    return (
      <Row className={className} style={{ marginTop: "2rem" }}>
        <Col span={24}>
          <div>
            <Collapse
              onChange={() => updateAccorToggle(no)}
              defaultActiveKey={[activeAccor]}
              expandIconPosition={"end"}
              bordered={false}
              items={[
                {
                  key: no,
                  label: name,
                  children: component,
                },
              ]}
            />
          </div>
        </Col>
      </Row>
    );
  };
  useEffect(() => {
    setIMEICode(parms.imei);
    getData(parms.imei);
  }, []);

  const getData = (code) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCartonIMEI", {
        imei: code,
      })
      .then((result) => {
        let data = result.data;
        if (data.length !== 0) {
          let temp_data = result.data[0];

          temp_data.details[0].mono_carton.map((x) => {
            if (x.defect === 1) {
              setmcclStatus("not-ok-row2");
            }
          });

          if (data[0].check_status === undefined) {
            setShowSaveCheckButton(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    let dataObj = {
      mc_imei_code: code,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/getOQCTest", dataObj)
      .then((result) => {
        if (result.data.length !== 0) {
          let temp_data = result.data[0];

          setDataList2(result.data[0]);

          temp_data.sbcl.map((x) => {
            if (x.status.default === "notok") {
              setsbclStatus("not-ok-row2");
            }
          });

          temp_data.mdbibs.map((x) => {
            if (x.status.default === "notok") {
              setmdbibsStatus("not-ok-row2");
            }
          });

          temp_data.bic.map((x) => {
            if (x.status.default === "notok") {
              setbicStatus("not-ok-row2");
            }
          });

          temp_data.oqcl.map((x) => {
            if (x.status.default === "notok") {
              setoqclStatus("not-ok-row2");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendToCheck = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/marked-checked", {
        imei: IMEICode,
      })
      .then((result) => {
        console.log(result.data);
        setShowSaveCheckButton(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={10}>
          <span className="TopMenuTxt">
            Sound Box Outgoing Quality Check list
          </span>
        </Col>
        <Col span={7}>
          <span style={{ margin: "0 7px" }}>
            <span style={{ fontWeight: "600", marginRight: "10px" }}>
              Master Carton IMEI No. :
            </span>
            <span style={{ fontWeight: "400" }}>{IMEICode}</span>
          </span>
        </Col>
        <Col span={7} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            <Button
              type="text"
              style={{ backgroundColor: "#fff" }}
              className="topLogoutBtn"
            >
              {selector.LineLogin.line_name} (
              {new Date(
                selector.LineLogin.line_login_time
              ).toLocaleTimeString()}
              )
              <LogoutOutlined style={{ color: "red" }} />
            </Button>
          </span>
        </Col>
      </Row>
      <ListSturcture
        className={oqclStatus}
        no={1}
        name="Master Carton Check List"
        component={
          <MasterCartonListOQC IMEICode={IMEICode} dataList2={dataList2} />
        }
      />
      <ListSturcture
        no={2}
        className={bicStatus}
        name="Box Items check"
        component={
          <BoxItemCheckOQC dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      <ListSturcture
        no={3}
        className={mcclStatus}
        name="Mono Carton Check List"
        component={
          <MonoCartonCheckList dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      <ListSturcture
        no={4}
        className={sbclStatus}
        name="Standee Box check List"
        component={
          <SandeeSingleTesting dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      {/* <ListSturcture
        name="Check for Sample"
        component={
          <CheckForSampleOQC dataList2={dataList2} IMEICode={IMEICode} />
        }
      /> */}
      <ListSturcture
        no={5}
        className={mdbibsStatus}
        name="Match device and box IMEI no on barcode sticker"
        component={
          <MatchDeviceAndBoxIMEIOQC dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      {showSaveCheckButton === true ? (
        <>
          <div
            style={{
              padding: "1rem 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => sendToCheck()}
              className="lineModalButtonSUbmit"
            >
              Send to Checked
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SondBoxOQCList;
