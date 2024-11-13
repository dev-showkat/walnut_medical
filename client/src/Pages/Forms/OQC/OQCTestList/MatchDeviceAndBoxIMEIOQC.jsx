import {
  LogoutOutlined,
  QrcodeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Upload,
  message,
} from "antd";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { QrReader } from "react-qr-reader";

import axios from "axios";

const MatchDeviceAndBoxIMEIOQC = ({ dataList2 }) => {
  const [IMEICode, setIMEICode] = useState();
  const selector = useSelector((state) => state.persistedReducer);
  const parms = useParams();
  const [dataList, setDataList] = useState([]);
  const [Activekey, setActivekey] = useState(0);
  const [startScan, setStartScan] = useState(false);
  const [startScanModal, setStartScanModal] = useState(false);

  const [activeImei, setActiveImei] = useState("");

  const navigate = useNavigate();

  let { Option } = Select;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setIMEICode(parms.imei);
    getData();
  }, []);

  const props = {
    name: "image",
    action: `${process.env.REACT_APP_API_URL}/uploadTestingImages`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        updateFileImage(info.file.response, Activekey);
      } else if (info.file.status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
  };

  const getData = () => {
    if (dataList2.mdbibs !== undefined && dataList2.mdbibs.length !== 0) {
      setDataList(dataList2.mdbibs);
    } else {
      axios
        .post(process.env.REACT_APP_API_URL + "/getMasterCartonEMI", {
          masterCartonNumber: parms.imei,
        })
        .then((result) => {
          let dataFound = result.data;
          if (dataFound.length !== 0) {
            let WholeData = dataFound[0].details[0];
            let mono_carton = WholeData.mono_carton;
            let standee = WholeData.standee;

            console.log(WholeData);

            let newData = [];

            mono_carton.map((x, i) => {
              newData.push({
                id: x.id,
                sno: `Mono Carton ${x.id}`,
                scanimei: `IMEI code will autofill`,
                imei: x.imei,
                status: { default: "ok", key: x.id },
                scan: x.imei,
              });
            });

            standee.map((x, i) => {
              newData.push({
                id: x.id,
                sno: `Standee Box ${x.id}`,
                scanimei: `IMEI code will autofill`,
                imei: x.imei,
                status: { default: "ok", key: x.id },
                scan: x.imei,
              });
            });

            setDataList(newData);
          }
        });
    }
  };

  const updateDefect = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.defect_category.default = value;
      }
    });
    setDataList(arr);
  };

  const updateFileImage = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.pictures.default = name;
      }
    });
    setDataList(arr);
  };

  const updateText = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.remarks.default = name;
      }
    });
    setDataList(arr);
  };

  const updateStatus = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id == key) {
        x.status.default = value;
      }
    });

    setDataList(arr);
  };

  const columns = [
    {
      title: "S No.",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "IMEI Code",
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: "After scanning IMEI Code",
      dataIndex: "scanimei",
      key: "scanimei",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <Select
            placeholder="Select Status"
            allowClear
            style={{ minWidth: "100px", textAlign: "center" }}
            defaultValue={status.default}
            onChange={(value) => updateStatus(value, status.key)}
          >
            <Option value="ok">OK</Option>
            <Option value="notok">NOT OK</Option>
          </Select>
        );
      },
    },
    {
      title: "Scan Here",
      dataIndex: "scan",
      key: "scan",
      render: (imei) => {
        return (
          <Button
            style={{
              backgroundColor: "#5B7690",
              color: "#fff",
              border: "none",
            }}
            onClick={() => openScanerFun(imei)}
          >
            Scan Barcode <QrcodeOutlined />
          </Button>
        );
      },
    },
  ];

  const handleSubmit = () => {
    dataList.map((x) => {
      if (x.status.default === "notok") {

        console.log(x)






        let reviewArr = {
          batch: selector.LineLogin.active_batch,
          line: selector.LineLogin.line_name,
          master_carton: IMEICode,
          defect_list_name: "Match device and box IMEI no on barcode sticker",
          imei: x.imei,
          oqcl: x.sno,

        };

        axios
          .post(process.env.REACT_APP_API_URL + "/addForReview", reviewArr)
          .then((result) => {
            // console.log(result.data);
          })
          .catch((err) => {
            console.log(err);
          });



      }
    })

    let dataObj = {
      mc_imei_code: IMEICode,
      mdbibs: dataList,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/updateOQCTest", dataObj)
      .then((result) => {
        getData();

        messageApi.open({
          type: "success",
          content: "Saved",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openScanerFun = (imei) => {
    setActiveImei(imei);
    setStartScanModal(true);
    setStartScan(true);
  };

  const handleScanQR = (data) => {
    setStartScanModal();
    messageApi.open({
      type: "success",
      content: "Scanned  Successfully",
    });

    dataList.map((x) => {
      if (x.imei === activeImei) {
        if (x.imei === data) {
          x.scanimei = data;
        }
      }
    });

    BatchModelCancel();
  };

  const handleScanQRErr = (err) => {
    messageApi.open({
      type: "error",
      content: "device not found",
    });
    console.log(err);

    BatchModelCancel();
    // let data = "864180051473820";

    // dataList.map((x) => {
    //   if (x.imei === activeImei) {
    //     if (x.imei === data) {
    //       x.scanimei = data;
    //     }
    //   }
    // });
  };

  const BatchModelCancel = () => {
    setStartScan(false);
    setTimeout(() => {
      setStartScanModal(false);
    }, 500);
  };

  return (
    <div>
      {contextHolder}
      <Modal open={startScanModal} onCancel={BatchModelCancel} footer={[]}>
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Master Carton Items</span>
            </Col>

            <Col>
              {startScan && (
                <>
                  <div>
                    <div
                      style={{
                        width: "300px",
                      }}
                    >
                      <QrReader
                        constraints={{
                          facingMode: "environment",
                        }}
                        onResult={(result, error) => {
                          if (!!result) {
                            handleScanQR(result.text);
                          }

                          if (!!error) {
                            // console.log(error);
                          }
                        }}
                      />
                    </div>
                    <Button onClick={() => setStartScan(!startScan)}>
                      close
                    </Button>
                  </div>
                </>
              )}
            </Col>

            <Col span={24} style={{ padding: "2rem  3rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div>
                  <Button
                    className="lineModalButtonSUbmit2"
                    onClick={() => BatchModelCancel()}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button className="lineModalButtonSUbmit">OK</Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* {startScan && (
        <>
          <div>
            <div
              style={{
                width: "300px",
              }}
            >
              <QrReader
                constraints={{
                  facingMode: "environment",
                }}
                onResult={(result, error) => {
                  if (!!result) {
                    handleScanQR(result.text);
                  }

                  if (!!error) {
                    // console.info('error');
                  }
                }}
              />
            </div>
            <Button onClick={() => setStartScan(!startScan)}>close</Button>
          </div>
        </>
      )} */}
      <Row style={{ marginTop: "2rem", backgroundColor: "#fff" }}>
        <Col span={24}>
          <div>
            <Table
              columns={columns}
              dataSource={dataList}
              pagination={{
                position: ["none", "none"],
                pageSize: 50,
              }}
              rowClassName={(record) => {
                return record.status.default === "notok" ? "not-ok-row" : "";
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ margin: "0 15px" }}>
                {/* <Button
                  className="lineModalButtonSUbmit2"
                  onClick={() => navigate(`/SondBoxOQCList/${parms.imei}`)}
                >
                  Back
                </Button> */}
              </div>
              <div>
                <Button
                  className="lineModalButtonSUbmit"
                  onClick={() => handleSubmit()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MatchDeviceAndBoxIMEIOQC;
