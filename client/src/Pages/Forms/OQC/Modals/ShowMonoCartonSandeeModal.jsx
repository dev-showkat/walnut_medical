import { Button, Col, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";

const ShowMonoCartonSandeeModal = ({
  showViewCartonModal,
  handleViewCartonCancel,
  MonoCartonList,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataListStan, setDataListStan] = useState([]);

  useEffect(() => {
    setShowModal(showViewCartonModal);
  }, [showViewCartonModal]);

  useEffect(() => {
    if (MonoCartonList.length != 0) {
      console.log(MonoCartonList)
      setDataList(MonoCartonList[0].mono_carton);
      setDataListStan(MonoCartonList[0].mono_carton);
      setDataListStan(MonoCartonList[0].standee);
    }
  }, [MonoCartonList]);

  const cancelModuleFun = () => {

    setShowModal(false);
    handleViewCartonCancel();
  };

  return (
    <Modal open={showModal} onCancel={cancelModuleFun} footer={[]}>
      <div style={{ padding: "30px" }}>
        <Row>
          <Col span={24} style={{ marginBottom: "30px" }}>
            <span className="popupTitle">
              Mono Carton/Standee Box IMEI Code
            </span>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {dataList.map((x, i) => {
                  return (
                    <React.Fragment>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "5px 0",
                        }}
                      >
                        <div>Mono Carton {x.id}</div>
                        <div>{x.imei}</div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {dataListStan.map((x, i) => {
                  return (
                    <React.Fragment>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "5px 0",
                        }}
                      >
                        <div>Standee{x.id}</div>
                        <div>{x.imei}</div>
                      </div>
                    </React.Fragment>
                  );
                })}

              </div>
            </div>
          </Col>

          <Col span={24} style={{ padding: "2rem  3rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div>
                <Button
                  className="lineModalButtonSUbmit"
                  onClick={() => cancelModuleFun()}
                >
                  OK
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ShowMonoCartonSandeeModal;
