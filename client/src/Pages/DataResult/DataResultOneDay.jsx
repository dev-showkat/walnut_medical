import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, DatePicker, Result, Row, Spin } from "antd";
import moment from "moment";
import BarChartData from "./components/BarChartData";
import dayjs from "dayjs";
import PieChartData from "./components/PieChartData";
import FailReasonBarChartData from "./components/FailReasonBarChartData";
import RetestBarChartData from "./components/RetestBarChartData";
import TimeOutAreaChartData from "./components/TimeOutAreaChartData";
import FrequencyBarChart from "./components/FrequencyBarChart";

const DataResultOneDay = () => {
  const [PassData, setPassData] = useState([]);
  const [FailData, setFailData] = useState([]);

  const [allData, setAllData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getData(new Date().toDateString());
  }, []);

  const getData = (startDate) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/GetSingleDayData`, {
        startDate,
      })
      .then((result) => {
        let data = result.data;

        removeDublicateTest(data);

        setAllData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDateChnage = (date, dateString) => {
    if (dateString !== "") {
      getData(dateString);
    }
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  const removeDublicateTest = (arr) => {
    let { passData, failData } = filterData(arr);

    setPassData(passData);
    setFailData(failData);
  };

  const filterData = (arr) => {
    let passData = arr.filter((x) => x.test_result === "pass");
    let failData = arr.filter((x) => x.test_result === "fail");

    let uniqueImeis = new Set();

    let failDataFilter = failData.filter((obj) => {
      if (!uniqueImeis.has(obj.imei)) {
        uniqueImeis.add(obj.imei);
        return true;
      }
      return false;
    });

    return {
      passData,
      failData: failDataFilter,
    };
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <DatePicker
              className="TopMenuButton2"
              disabledDate={disabledDate}
              onChange={(date, dateString) =>
                handleDateChnage(date, dateString)
              }
            />
          </div>
        </div>
        <Spin spinning={loading}>
          {allData.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Data Found Select Another Date"
            />
          ) : (
            <div style={{ marginTop: "25px" }}>
              <Row style={{ width: "100%" }}>
                <Col span={12}>
                  <Card
                    bordered={false}
                    style={{ margin: "1rem" }}
                    className="CardStyleDataRender"
                  >
                    <BarChartData PassData={PassData} FailData={FailData} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    bordered={false}
                    style={{ margin: "1rem" }}
                    className="CardStyleDataRender"
                  >
                    <PieChartData PassData={PassData} FailData={FailData} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false} style={{ margin: "2rem 1rem" }}>
                    <FailReasonBarChartData FailData={FailData} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false} style={{ margin: "2rem 1rem" }}>
                    <FrequencyBarChart PassData={PassData} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false} style={{ margin: "1rem" }}>
                    <RetestBarChartData allData={allData} FailData={FailData} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false} style={{ margin: "1rem" }}>
                    <TimeOutAreaChartData PassData={PassData} />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default DataResultOneDay;
