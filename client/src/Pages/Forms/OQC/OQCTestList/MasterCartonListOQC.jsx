import { Button, Input, Select, Table, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const MasterCartonListOQC = ({ IMEICode, dataList2 }) => {
  const [dataList, setDataList] = useState([]);
  const [Activekey, setActivekey] = useState(0);
  const selector = useSelector((state) => state.persistedReducer);

  let { Option } = Select;

  const [messageApi, contextHolder] = message.useMessage();

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
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  useEffect(() => {
    getData();
  }, [dataList2]);

  const getData = () => {
    if (dataList2.length !== 0 && dataList2.oqcl.length !== 0) {
      setDataList(dataList2.oqcl);
    } else {
      setDataList([
        {
          id: 1,
          oqcl: "Bopp tape sticked nicely",
          status: { default: "ok", key: 1 },
          defect_category: { default: "1", key: 1 },
          pictures: { default: "", key: 1 },
          remarks: { default: "", key: 1 },
        },
        {
          id: 2,
          oqcl: "Box condition",
          status: { default: "ok", key: 2 },
          defect_category: { default: "1", key: 2 },
          pictures: { default: "", key: 2 },
          remarks: { default: "", key: 2 },
        },
        {
          id: 3,
          oqcl: "Box printing",
          status: { default: "ok", key: 3 },
          defect_category: { default: "1", key: 3 },
          pictures: { default: "", key: 3 },
          remarks: { default: "", key: 3 },
        },
        {
          id: 4,
          oqcl: "Master carton sticker scratches/printing/tear-off/contents",
          status: { default: "ok", key: 4 },
          defect_category: { default: "1", key: 4 },
          pictures: { default: "", key: 4 },
          remarks: { default: "", key: 4 },
        },
      ]);
    }
    console.log(dataList);
  };
  const updateStatus = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.status.default = value;
      }
    });
    setDataList(arr);
  };

  const updateDefect = (value, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.defect_category.default = value;
      }
    });
    setDataList(arr);
  };

  const updateFileImage = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.pictures.default = name;
      }
    });
    setDataList(arr);
  };

  const updateText = (name, key) => {
    let arr = dataList;
    arr.map((x) => {
      if (x.id === key) {
        x.remarks.default = name;
      }
    });
    setDataList(arr);
  };

  const columns = [
    {
      title: "Outgoing Quality Check list",
      dataIndex: "oqcl",
      key: "oqcl",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (true) {
          return (
            <Select
              placeholder="Select Status"
              allowClear
              defaultValue={status.default}
              style={{ minWidth: "100px", textAlign: "center" }}
              onChange={(value) => updateStatus(value, status.key)}
            >
              <Option value="ok">OK</Option>
              <Option value="notok">NOT OK</Option>
            </Select>
          );
        } else {
          return status;
        }
      },
    },
    {
      title: "Defect Category",
      dataIndex: "defect_category",
      key: "defect_category",
      render: (defect) => {
        return (
          <Select
            placeholder="Select Any Defect"
            allowClear
            defaultValue={defect.default}
            style={{ minWidth: "150px", textAlign: "center" }}
            onChange={(value) => updateDefect(value, defect.key)}
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
        return (
          <div style={{ paddingRight: "20px" }}>
            <Upload
              {...props}
              maxCount={1}
              onClick={() => setActivekey(data.key)}
            >
              <Button icon={<UploadOutlined />}>Upload image</Button>
            </Upload>
          </div>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (remarks) => {
        // console.log(remarks.default);
        return (
          <Input.TextArea
            defaultValue={remarks.default}
            onChange={(value) => updateText(value.target.value, remarks.key)}
          />
        );
      },
    },
  ];

  const handleSubmit = () => {
    dataList.map((x) => {
      if (x.status.default === "notok") {
        let reviewArr = {
          batch: selector.LineLogin.active_batch,
          line: selector.LineLogin.line_name,
          master_carton: IMEICode,
          defect_list_name: "Master Carton Check List",
          imei: "-",
          oqcl: x.oqcl,
          pictures: x.pictures.default,
          defect_category: x.defect_category.default,
          remarks: x.remarks.default,
        };

        axios
          .post(process.env.REACT_APP_API_URL + "/addForReview", reviewArr)
          .then((result) => {
            console.log(result.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    let dataObj = {
      mc_imei_code: IMEICode,
      oqcl: dataList,
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

  return (
    <div style={{ background: "#fff" }}>
      {contextHolder}
      <div style={{ background: "#fff" }}>
        <Table
          columns={columns}
          dataSource={dataList}
          pagination={{
            position: ["none", "none"],
          }}
          rowClassName={(record) => {
            return record.status.default === "notok" ? "not-ok-row" : "";
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem",
          }}
        >
          <div style={{ margin: "0 15px" }}>
            <Button className="lineModalButtonSUbmit2">Edit</Button>
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
    </div>
  );
};

export default MasterCartonListOQC;
