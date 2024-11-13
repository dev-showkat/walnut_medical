import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Result, Row, Select, Table, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

const ReviewStatusOQC = () => {
  const [masterCartonList, setMasterCartonList] = useState([]);
  const [Activekey, setActivekey] = useState(0);
  const { Option } = Select;
  const selector = useSelector((state) => state.persistedReducer);

  useEffect(() => {
    getMasterCartons();
  }, []);

  const props = {
    name: "image",
    action: `${process.env.REACT_APP_API_URL}/uploadTestingImages`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        updateFileImage(info.file.response, Activekey);
      } else if (info.file.status === "error") {
      }
    },
  };

  const getMasterCartons = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItemsForReview")
      .then((result) => {
        const newArr = result.data.map((x) => {
          let Defect_status = "";
          if (x.defect_category === "2") {
            Defect_status = "Functional";
          } else if (x.defect_category === "3") {
            Defect_status = "Aesthetic";
          } else if (x.defect_category === "4") {
            Defect_status = "Missing category";
          } else {
            Defect_status = "Other";
          }

          return {
            batch: x.batch,
            line: x.line,
            master_carton: x.master_carton,
            defect_list_name: x.defect_list_name,
            Defect_Category_status: Defect_status,
            imei: x.imei,
            oqcl: x.oqcl,
            pictures: x.pictures,
            defect_category: x.defect_category,
            remarks: x.remarks,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          };
        });

        setMasterCartonList(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteMasterCarton", { id })
      .then((result) => {
        getMasterCartons();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDefect = (value, key) => {
    let arr = masterCartonList;
    arr.map((x) => {
      if (x.id === key) {
        x.defect_category.default = value;
      }
    });
    setMasterCartonList(arr);
  };

  const updateFileImage = (name, key) => {
    let arr = masterCartonList;
    arr.map((x) => {
      if (x.id === key) {
        x.pictures.default = name;
      }
    });
    setMasterCartonList(arr);
  };

  const columns = [
    {
      title: "Batch Number",
      dataIndex: "batch",
      key: "batch",
    },
    {
      title: "Line Number",
      dataIndex: "line",
      key: "line",
    },
    {
      title: "Master Carton",
      dataIndex: "master_carton",
      key: "master_carton",
    },
    {
      title: "Defected list Name",
      dataIndex: "defect_list_name",
      key: "defect_list_name",
    },
    {
      title: "IMEI Code",
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: "Outgoing Quality Check list",
      dataIndex: "oqcl",
      key: "oqcl",
    },

    {
      title: "Defect Category",
      dataIndex: "defect_category",
      key: "defect_category",
      render: (defect) => {
        // console.log(defect);
        return (
          <Select
            disabled
            placeholder="Select Any Defect"
            allowClear
            style={{ minWidth: "150px", textAlign: "center" }}
            defaultValue={defect}
          >
            <Option value="1">Select Any Defect</Option>
            <Option value="2">Functional</Option>
            <Option value="3">Aesthetic</Option>
            <Option value="4">Missing category</Option>
            <Option value="5">Other</Option>
          </Select>
        );
      },
    },
    {
      title: "Pictures",
      dataIndex: "pictures",
      key: "pictures",
      render: (data) => {
        console.log(data);
        return (
          <div style={{ paddingRight: "20px", textAlign: "center" }}>
            {/* <Upload
              {...props}
              maxCount={1}
              onClick={() => setActivekey(data.key)}
            >
              <Button icon={<UploadOutlined />}>Upload image</Button>
            </Upload> */}
            <Image
              width={70}
              height={70}
              style={{ borderRadius: "50%" }}
              src={`${process.env.REACT_APP_API_URL}/testingImages/${data}`}
            />
            {/* <EyeOutlined /> */}
          </div>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
  ];
  const handleExcelImport = () => {
    // Create a workbook
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    const formattedBatchList = masterCartonList.map((item) => {
      const { createdAt, pictures, defect_category, updatedAt, ...rest } = item;

      return {
        ...rest,
        DateTime: new Date(item.createdAt).toLocaleString(),
        UpdatedDateTime: new Date(item.updatedAt).toLocaleString(),
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedBatchList);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a download link for the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a click to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "Review_data_list_oqc.xlsx";
    a.click();
  };
  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={12}>
          <span className="TopMenuTxt">Review Status</span>
        </Col>

        <Col span={12} style={{ textAlign: "right" }}>
          <span className="TopMenuTxt" style={{ marginRight: "15px" }}>
            <Button
              key="excelImport"
              type="primary"
              onClick={handleExcelImport}
              style={{ marginRight: "15px" }}
            >
              Export Report <DownloadOutlined />
            </Button>
          </span>
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

      <Row
        style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1rem" }}
      >
        <Col span={24}>
          {masterCartonList.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          ) : (
            <Table
              style={{ textAlign: "center" }}
              columns={columns}
              dataSource={masterCartonList}
              scroll={{
                x: 1300,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReviewStatusOQC;
