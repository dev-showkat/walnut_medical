import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Spin,
  DatePicker,
} from "antd";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";

import { DownloadOutlined } from "@ant-design/icons";

const PostDataShowRead = () => {
  const [ApiData, setApiData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const searchInput = useRef(null);

  const [loading, setLoading] = useState(false);

  const { RangePicker } = DatePicker;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  useEffect(() => {
    getData();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text,
  });

  const renderData = (data) => {
    let newArr = [];
    data.map((x, i) => {
      let jData = x;
      newArr.push({
        action: x._id,
        no: i + 1,
        imei: jData.imei == undefined ? "none" : jData.imei,
        audio_current:
          jData.audio_current == undefined ? "none" : jData.audio_current,
        audio_voltage:
          jData.audio_voltage == undefined ? "none" : jData.audio_voltage,
        fail_reason:
          jData.fail_reason == undefined ? "none" : jData.fail_reason,
        file_cleanup:
          jData.file_cleanup == undefined ? "none" : jData.file_cleanup,
        full_char_current:
          jData.full_char_current == undefined
            ? "none"
            : jData.full_char_current,
        full_char_voltage:
          jData.full_char_voltage == undefined
            ? "none"
            : jData.full_char_voltage,
        ledblue: jData.ledblue == undefined ? "none" : jData.ledblue,
        ledgreen: jData.ledgreen == undefined ? "none" : jData.ledgreen,
        ledred: jData.ledred == undefined ? "none" : jData.ledred,
        low_batt_current:
          jData.low_batt_current == undefined ? "none" : jData.low_batt_current,
        low_batt_voltage:
          jData.low_batt_voltage == undefined ? "none" : jData.low_batt_voltage,
        sim: jData.sim == undefined ? "none" : jData.sim,
        standby_current:
          jData.standby_current == undefined ? "none" : jData.standby_current,
        test_result:
          jData.test_result == undefined ? "none" : jData.test_result,
        datetime: new Date(x.createdAt).toLocaleString(),
      });
    });

    setApiData(newArr);
  };

  const getData = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API_URL + "/getPostResponse")
      .then((result) => {
        renderData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },

    {
      title: "IMEI",
      dataIndex: "imei",
      key: "imei",
      ...getColumnSearchProps("imei"),
    },

    {
      title: "Audio Current",
      dataIndex: "audio_current",
      key: "audio_current",
      ...getColumnSearchProps("audio_current"),
    },

    {
      title: "Audio Voltage",
      dataIndex: "audio_voltage",
      key: "audio_voltage",
      ...getColumnSearchProps("audio_voltage"),
    },

    {
      title: "Fail Reason",
      dataIndex: "fail_reason",
      key: "fail_reason",
      ...getColumnSearchProps("fail_reason"),
    },

    {
      title: "File Cleanup",
      dataIndex: "file_cleanup",
      key: "file_cleanup",
      ...getColumnSearchProps("file_cleanup"),
    },

    {
      title: "Full Char Current",
      dataIndex: "full_char_current",
      key: "full_char_current",
      ...getColumnSearchProps("full_char_current"),
    },

    {
      title: "Full Char Voltage",
      dataIndex: "full_char_voltage",
      key: "full_char_voltage",
      ...getColumnSearchProps("full_char_voltage"),
    },

    {
      title: "Led Blue",
      dataIndex: "ledblue",
      key: "ledblue",
      ...getColumnSearchProps("ledblue"),
    },
    {
      title: "Led Green",
      dataIndex: "ledgreen",
      key: "ledgreen",
      ...getColumnSearchProps("ledgreen"),
    },
    {
      title: "Led Red",
      dataIndex: "ledred",
      key: "ledred",
      ...getColumnSearchProps("ledred"),
    },
    {
      title: "Low Batt Current",
      dataIndex: "low_batt_current",
      key: "low_batt_current",
      ...getColumnSearchProps("low_batt_current"),
    },
    {
      title: "Low Batt Voltage",
      dataIndex: "low_batt_voltage",
      key: "low_batt_voltage",
      ...getColumnSearchProps("low_batt_voltage"),
    },

    {
      title: "Sim",
      dataIndex: "sim",
      key: "sim",
      ...getColumnSearchProps("sim"),
    },
    {
      title: "Standby Current",
      dataIndex: "standby_current",
      key: "standby_current",
      ...getColumnSearchProps("standby_current"),
    },
    {
      title: "Test Result",
      dataIndex: "test_result",
      key: "test_result",
      ...getColumnSearchProps("test_result"),
    },

    {
      title: "Date & Time",
      dataIndex: "datetime",
      key: "datetime",
      ...getColumnSearchProps("writetime"),
    },
  ];

  const tableRef = useRef(null);

  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    let newApidata = ApiData.filter((x) => x);

    const formattedBatchList = newApidata.map((item) => {
      const { action, ...rest } = item;
      return {
        ...rest,
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "post_api_data.xlsx";
    a.click();
  };

  const handleDelete = (id) => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/deletePostResponse", { id })
      .then((result) => {
        setLoading(false);
        console.log(result.data);
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterDataByDate = () => {
    if (startDate === "" && endDate === "") {
      getData();
    } else {
      setLoading(true);
      axios
        .post(process.env.REACT_APP_API_URL + "/getPostResponseFilter", {
          startDate,
          endDate,
        })
        .then((result) => {
          renderData(result.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDateChnage = (date, string) => {
    setStartDate(string[0]);
    setEndDate(string[1]);
  };

  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Button
              className="TopMenuButton2"
              onClick={() => handleExcelImport()}
            >
              Download Report <DownloadOutlined />
            </Button>
          </div>
          <div>
            <RangePicker
              className="TopMenuButton2"
              onChange={(date, string) => handleDateChnage(date, string)}
              style={{ width: "220px" }}
            />
            <Button
              className="TopMenuButton2"
              onClick={() => filterDataByDate()}
              style={{ width: "unset" }}
            >
              <SearchOutlined />
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            ref={tableRef}
            columns={columns}
            dataSource={ApiData}
            scroll={{ x: 2500 }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default PostDataShowRead;
