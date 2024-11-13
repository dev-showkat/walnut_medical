import { SearchOutlined } from "@ant-design/icons";
import { Table, Button, Input, Space, Spin, DatePicker, Dropdown } from "antd";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { useDownloadExcel } from "react-export-table-to-excel";
import qs from "qs";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";

const PostDataShow = () => {
  const [ApiData, setApiData] = useState([]);
  const searchInput = useRef(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [tableFilterType, setTableFilterType] = useState("");
  const [tableFilterValue, setTableFilterValue] = useState("");
  const { batch_id } = useParams();
  const { RangePicker } = DatePicker;

  const handleSearch = (selectedKeys, confirm, dataIndex, close) => {
    setApiData([]);
    getData(1, dataIndex, selectedKeys[0]);
  };

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
          placeholder={`Search ${dataIndex}`}
          onKeyUp={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            setTableFilterType(dataIndex);
            setTableFilterValue(e.target.value);
          }}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys, confirm, dataIndex, close)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setTableFilterValue("");
              setTableFilterType("");
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

    let itemNumber =
      tableParams.pagination.current * tableParams.pagination.pageSize -
      tableParams.pagination.pageSize +
      1;

    data.map(
      ({
        _id,
        audio,
        appdl,
        audio_current,
        audio_voltage,
        app_install,
        batch_id,
        bms,
        configdl,
        createdAt,
        custom_1,
        custom_2,
        custom_3,
        custom_4,
        fail_reason,
        file_list,
        full_char_current,
        full_char_voltage,
        file_cleanup,
        imei,
        ledblue,
        ledgreen,
        ledred,
        low_batt_current,
        low_batt_voltage,
        memfree,
        memid,
        memtotal,
        memused,
        prdappver,
        pdp_status,
        resourcedl,
        sim,
        standby_current,
        test_result,
        test_time,
        test_zig,
        ver_app,
        ver_sdk,
      }) => {
        newArr.push({
          action: _id,
          no: itemNumber,
          imei,
          prdappver,
          sim,
          pdp_status,
          ver_app,
          ver_sdk,
          memid,
          memfree,
          memused,
          memtotal,
          audio,
          audio_voltage,
          audio_current,
          full_char_voltage,
          full_char_current,
          low_batt_voltage,
          low_batt_current,
          bms,
          standby_current,
          ledred,
          ledgreen,
          ledblue,
          appdl,
          resourcedl,
          configdl,
          file_list,
          test_time,
          file_cleanup,
          custom_1,
          custom_2,
          custom_3,
          custom_4,
          test_zig,
          app_install,
          batch_id,
          test_result,
          fail_reason,
          datetime: new Date(createdAt).toLocaleString(),
        });
        itemNumber++;
      }
    );
    setApiData(newArr);
  };

  useEffect(() => {
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
    setStartDate("");
    setEndDate("");
    setTableFilterValue("");
    setTableFilterType("");
    setApiData([]);
    if (tableParams.pagination.current === 1) {
      getData();
    }
  }, [batch_id]);

  useEffect(() => {
    setApiData([]);
    getData();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setApiData([]);
    }
  };

  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  const getData = () => {
    if (!startDate && !endDate && !tableFilterValue) {
      filterDataWithoutDate();
    } else {
      if (startDate && endDate) {
        filterDataByDate();
      } else {
        tableFilterValue && getDataWithFilter();
      }
    }
  };

  const getDataWithFilter = () => {
    setLoading(true);
    axios
      .post(
        `${
          process.env.REACT_APP_API_URL
        }/getPostResponseWithFilter/${batch_id}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`,
        {
          type: tableFilterType,
          value: tableFilterValue,
        }
      )
      .then((result) => {
        let data = result.data.results;
        let totalCount = result.data.totalCount;
        renderData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      })
      .catch((err) => {});
  };

  const filterDataWithoutDate = () => {
    setLoading(true);
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/getPostResponse/${batch_id}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
      .then((result) => {
        let data = result.data.results;
        let totalCount = result.data.totalCount;
        renderData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      })
      .catch((err) => {});
  };

  const filterDataByDate = () => {
    setLoading(true);
    axios
      .post(
        `${
          process.env.REACT_APP_API_URL
        }/getPostResponseFilter/${batch_id}?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`,
        {
          startDate,
          endDate,
        }
      )
      .then((result) => {
        let data = result.data.results;
        let totalCount = result.data.totalCount;
        renderData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      })
      .catch((err) => {});
  };

  const handleDateChnage = (date, string) => {
    setStartDate(string[0]);
    setEndDate(string[1]);
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
      title: "Prdappver",
      dataIndex: "prdappver",
      key: "prdappver",
    },
    {
      title: "Sim",
      dataIndex: "sim",
      key: "sim",
    },
    {
      title: "PDP Status",
      dataIndex: "pdp_status",
      key: "pdp_status",
    },
    {
      title: "Ver App",
      dataIndex: "ver_app",
      key: "ver_app",
    },
    {
      title: "Ver SDK",
      dataIndex: "ver_sdk",
      key: "ver_sdk",
    },

    {
      title: "Mem Id",
      dataIndex: "memid",
      key: "memid",
    },
    {
      title: "Mem Free",
      dataIndex: "memfree",
      key: "memfree",
    },
    {
      title: "Mem Used",
      dataIndex: "memused",
      key: "memused",
    },
    {
      title: "Mem Total",
      dataIndex: "memtotal",
      key: "memtotal",
    },
    {
      title: "Audio",
      dataIndex: "audio",
      key: "audio",
    },
    {
      title: "Audio Current",
      dataIndex: "audio_current",
      key: "audio_current",
    },
    {
      title: "Audio Voltage",
      dataIndex: "audio_voltage",
      key: "audio_voltage",
    },
    {
      title: "Full Char Current",
      dataIndex: "full_char_current",
      key: "full_char_current",
    },
    {
      title: "Full Char Voltage",
      dataIndex: "full_char_voltage",
      key: "full_char_voltage",
    },
    {
      title: "Low Batt Current",
      dataIndex: "low_batt_current",
      key: "low_batt_current",
    },
    {
      title: "Low Batt Voltage",
      dataIndex: "low_batt_voltage",
      key: "low_batt_voltage",
    },
    {
      title: "BMS",
      dataIndex: "bms",
      key: "bms",
    },
    {
      title: "Standby Current",
      dataIndex: "standby_current",
      key: "standby_current",
    },
    {
      title: "Led Red",
      dataIndex: "ledred",
      key: "ledred",
    },
    {
      title: "Led Green",
      dataIndex: "ledgreen",
      key: "ledgreen",
    },
    {
      title: "Led Blue",
      dataIndex: "ledblue",
      key: "ledblue",
    },
    {
      title: "Appdl",
      dataIndex: "appdl",
      key: "appdl",
    },
    {
      title: "Resourcedl",
      dataIndex: "resourcedl",
      key: "resourcedl",
    },
    {
      title: "Configdl",
      dataIndex: "configdl",
      key: "configdl",
    },
    {
      title: "File List",
      dataIndex: "file_list",
      key: "file_list",
    },
    {
      title: "Test Time",
      dataIndex: "test_time",
      key: "test_time",
    },
    {
      title: "File Cleanup",
      dataIndex: "file_cleanup",
      key: "file_cleanup",
    },
    {
      title: "Custom 1",
      dataIndex: "custom_1",
      key: "custom_1",
    },
    {
      title: "Custom 2",
      dataIndex: "custom_2",
      key: "custom_2",
    },
    {
      title: "Custom 3",
      dataIndex: "custom_3",
      key: "custom_3",
    },
    {
      title: "Custom 4",
      dataIndex: "custom_4",
      key: "custom_4",
    },
    {
      title: "Test Zig",
      dataIndex: "test_zig",
      key: "test_zig",
    },
    {
      title: "App Install",
      dataIndex: "app_install",
      key: "app_install",
    },
    {
      title: "Batch ID",
      dataIndex: "batch_id",
      key: "batch_id",
    },
    {
      title: "Test Result",
      dataIndex: "test_result",
      key: "test_result",
    },

    {
      title: "Fail Reason",
      dataIndex: "fail_reason",
      key: "fail_reason",
    },
    {
      title: "Date & Time",
      dataIndex: "datetime",
      key: "datetime",
    },
  ];

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Web User",
    Sheet: "Web User",
  });

  const handleExcelImport = () => {
    if (startDate === "" && endDate === "") {
      downloadDataWithoutDate();
    } else {
      downloadDataWithDate();
    }
  };

  const downloadThis = (data, name) => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    let newApidata = data.filter((x) => x);

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
    a.download = `${name}.xlsx`;
    a.click();
  };

  const makeArrofRawData = (data, name) => {
    let newArr = [];
    let itemNumber =
      tableParams.pagination.current * tableParams.pagination.pageSize -
      tableParams.pagination.pageSize +
      1;

    data.map(
      ({
        _id,
        apn,
        appdl,
        app_install,
        audio,
        audio_voltage,
        audio_current,
        batch_id,
        bms,
        certs,
        configdl,
        createdAt,
        custom_1,
        custom_2,
        custom_3,
        custom_4,
        fail_reason,
        file_cleanup,
        file_list,
        full_char_voltage,
        full_char_current,
        imei,
        ip_address,
        key1,
        key2,
        key3,
        key4,
        key5,
        ledred,
        ledgreen,
        ledblue,
        low_batt_voltage,
        low_batt_current,
        memid,
        memfree,
        memused,
        memtotal,
        pdp_status,
        prdappver,
        publicKey,
        resourcedl,
        readtime,
        rssi,
        rtc,
        sha_app,
        sha_config,
        sha_res,
        sim,
        standby_current,
        test_result,
        test_time,
        test_zig,
        token,
        unzip_app,
        unzip_res,
        unzip_config,
        ver_app,
        ver_res,
        ver_sdk,
        writetime,
      }) => {
        newArr.push({
          action: _id,
          no: itemNumber,
          apn,
          appdl,
          app_install,
          audio,
          audio_current,
          audio_voltage,
          batch_id,
          bms,
          certs,
          configdl,
          custom_1,
          custom_2,
          custom_3,
          custom_4,
          fail_reason,
          file_cleanup,
          file_list,
          full_char_current,
          full_char_voltage,
          imei,
          ip_address,
          key1,
          key2,
          key3,
          key4,
          key5,
          ledblue,
          ledgreen,
          ledred,
          low_batt_current,
          low_batt_voltage,
          memfree,
          memid,
          memtotal,
          memused,
          prdappver,
          pdp_status,
          publicKey,
          readtime,
          resourcedl,
          rssi,
          rtc,
          sha_app,
          sha_config,
          sha_res,
          sim,
          standby_current,
          test_result,
          test_time,
          test_zig,
          token,
          unzip_app,
          unzip_config,
          unzip_res,
          ver_app,
          ver_res,
          ver_sdk,
          writetime,
          datetime: new Date(createdAt).toLocaleString(),
        });
        itemNumber++;
      }
    );
    downloadThis(newArr, name);
  };

  const downloadDataWithoutDate = async () => {
    try {
      // Make a GET request to the specified endpoint with 'arraybuffer' responseType
      setLoading2(true);
      const response = await axios.get(
        `
        ${process.env.REACT_APP_API_URL}/downloadDataWithoutDate/${batch_id}`,
        { responseType: "arraybuffer" }
      );
      // Create a Blob from the binary data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Use FileSaver to save the Blob as a file
      saveAs(blob, "Post_Report_full.xlsx");
      setLoading2(false);
    } catch (error) {}
  };

  const downloadDataWithDate = () => {
    setLoading2(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/downloadDataWithDate/${batch_id}`,
        {
          startDate,
          endDate,
        }
      )
      .then((result) => {
        let data = result.data;
        makeArrofRawData(data, `Post_Report_${startDate}_to_${endDate}`);
        setLoading2(false);
      })
      .catch((err) => {});
  };

  const handleTodayOnlyImport = () => {
    setLoading2(true);
    let startDate = new Date().toLocaleDateString();
    axios
      .post(`${process.env.REACT_APP_API_URL}/downloadDataToday/${batch_id}`, {
        startDate,
      })
      .then((result) => {
        let data = result.data;
        makeArrofRawData(data, `Post_Report_${startDate}`);
        setLoading2(false);
      })
      .catch((err) => {});
  };

  const onMenuClick = (e) => {
    if (e.key == 1) {
      handleExcelImport();
    }
    if (e.key == 2) {
      handleTodayOnlyImport();
    }
  };

  const items = [
    {
      key: "1",
      label: "Full Report",
    },
    {
      key: "2",
      label: "Today Only Report",
    },
  ];

  return (
    <Spin spinning={loading2}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {ApiData?.length > 0 && (
            <Dropdown.Button
              className="TopMenuButton3"
              onClick={() => handleExcelImport()}
              menu={{
                items,
                onClick: onMenuClick,
              }}
            >
              Download Report
            </Dropdown.Button>
          )}
        </div>
        <div>
          <RangePicker
            className="TopMenuButton2"
            onChange={(date, string) => handleDateChnage(date, string)}
            style={{ width: "220px" }}
          />
          <Button
            className="TopMenuButton2"
            onClick={() => {
              getData();
            }}
            style={{ width: "unset" }}
          >
            <SearchOutlined />
          </Button>
        </div>
      </div>

      <div style={{ marginTop: "25px" }}>
        <Table
          columns={columns}
          dataSource={ApiData}
          scroll={{ x: 7000 }}
          rowKey={(record) => record.action}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
    </Spin>
  );
};

export default PostDataShow;
