import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Result,
  Modal,
  Spin,
  Form,
  message,
  Input,
  Select,
  DatePicker,
  Table,
  Upload,
  Pagination,
  Space,
} from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  UploadOutlined,
  CheckOutlined,
  QuestionOutlined,
  QrcodeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { QrReader } from "react-qr-reader";

const CheckMaterialList = () => {
  const pageSize = 5;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [SystemLogedIn, setSystemLogedIn] = useState(false);
  const [SystemSelectedTime, setSystemSelectedTime] = useState(false);
  const [MaterialModel, setMaterialModel] = useState(false);

  const [startScan, setStartScan] = useState(false);

  const [exitModel1, setExitModel1] = useState(false);
  const { confirm } = Modal;
  const { material_id, material_name, vendor_name, date } = useParams();
  const [AddSample, setAddSample] = useState(false);
  const [RejectLot, setRejectLot] = useState(false);
  const [ViewResultModel, setViewResultModel] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [SampleId, setSampleId] = useState("");
  const [FinalSampleId, setFinalSampleId] = useState("");
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const navigate = useNavigate();
  const [SampleList, setSampleList] = useState([]);
  const [Activekey, setActivekey] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsParameter, setSelectedRowsParameter] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [MaterialParameter, setMaterialParameter] = useState([
    { parameter: undefined, spacification: undefined, inst_used: undefined },
  ]);
  const [ReplaceMaterialModel, setReplaceMaterialModel] = useState(false);
  const [checkLotData, setCheckLotData] = useState([]);
  const [LotReamrk, setLotReamrk] = useState("");
  const [LotId, setLOtId] = useState("");
  const [Rejected_status, setrejected_status] = useState("false");
  const [rejected_remark, setrejected_remark] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [isChecked, setChecked] = useState(false);
  const [parameterkey, setParameterKey] = useState("");
  const { Option } = Select;
  useEffect(() => {
    checkLineActive();
    getSample(material_id, date);
    getCheckLot(material_id, date);
    setFinalSampleId("");
  }, []);

  const totalItems = SampleList.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCloseexitModel1 = () => {
    setExitModel1(false);
  };
  const showMaterialModel = () => {
    setMaterialModel(true);
  };
  const handleCloseAddSample = () => {
    setAddSample(false);
  };
  const handleCloseRejectLot = () => {
    setRejectLot(false);
  };
  const handleCloseViewResultModel = () => {
    setViewResultModel(false);
  };
  const ReplaceMaterialModelCancel = () => {
    setReplaceMaterialModel(false);
  };

  const MaterialModelCancel = () => {
    setMaterialModel(false);
  };

  const AddNewParameter = () => {
    setMaterialModel(true);
  };
  const OpenViewResultModel = (sample_id) => {
    setViewResultModel(true);
    setFinalSampleId(sample_id);
    axios
      .post(process.env.REACT_APP_API_URL + "/getMaterialParameter", {
        sample_id,
      })
      .then((result) => {
        const data = result.data;
        if (data.length > 0) {
          const { _id, MaterialParameter, ...rest } = data[0];
          let newData = [];
          MaterialParameter.map((x, index) => {
            newData.push({
              key: index,
              id: x._id,
              type: x.type,
              tbl_id: rest._id,
              parameter: x.parameter,
              spacification: x.spacification,
              actual: x.actual,
              status: x.status,
              remark: x.remark,
              picture: x.picture,
              inst_used: x.inst_used,
              sample_id: rest.Sample_id,
            });
            setChecked(rest.checked_qr_code);
          });

          setTableData(newData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkLineActive = () => {
    setSystemLogedIn(selector.SystemLogin.isLogedIn);
    setSystemSelectedTime(new Date(selector.SystemLogin.system_login_time));
  };

  const handleCreateSampleId = () => {
    let SampleId = `sample_${new Date().getTime()}`;
    setSampleId(SampleId);
    setAddSample(true);
  };

  const handleRejectFullLot = () => {
    setRejectLot(true);
  };
  const handleSystemLogout = () => {
    setSystemLogedIn(false);
    let logObj = {
      id: selector.SystemLogin.system_id,
      time: new Date(),
    };
    axios
      .post(process.env.REACT_APP_API_URL + "/LogoutSystem", logObj)
      .then((result) => {
        dispatch(logoutActiveSystem());
        setExitModel1(false);
        navigate("/incoming_material");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLogout = () => {
    setExitModel1(true);
  };
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
        updateFileImage(Activekey, info.file.response);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleParameter = (key) => {
    setParameterKey(key);
  };
  const columns = [
    {
      title: "Sr No.",
      dataIndex: "1",
      key: "1",
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Parameter",
      dataIndex: "parameter",
      key: "parameter",
      render: (_, record) => {
        if (record.type === "text") {
          return (
            <Input
              onChange={(e) =>
                handleParameterChange(record.key, e.target.value)
              }
              value={record.parameter}
              readOnly={isInputDisabled}
              style={{ width: "200px" }}
            />
          );
        } else {
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="masterCartonAddButton"
                style={{ width: "unset", minWidth: "150px" }}
                onClick={() => {
                  setStartScan(true);
                  handleParameter(record.key);
                }}
              >
                {record.parameter} <QrcodeOutlined />
              </Button>
            </div>
          );
        }
      },
    },
    {
      title: "Spacification(mm)",
      dataIndex: "spacification",
      key: "spacification",
      render: (_, record) => (
        <Input
          onChange={(e) =>
            handleSpacificationChange(record.key, e.target.value)
          }
          value={record.spacification}
          readOnly={isInputDisabled}
        />
      ),
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (_, record) => (
        <Input
          onChange={(e) => handleActualChange(record.key, e.target.value)}
          value={record.actual}
        />
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          placeholder="Select Status"
          allowClear
          style={{ minWidth: "100px", textAlign: "center" }}
          onChange={(value) => handleStatusChange(record.key, value)}
          value={record.status}
        >
          <Option value="OK">OK</Option>
          <Option value="NOT OK">NOT OK</Option>
        </Select>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      render: (_, record) => (
        <TextArea
          onChange={(e) => handleRemarksChange(record.key, e.target.value)}
          value={record.remark}
        />
      ),
    },

    {
      title: "Pictures",
      dataIndex: "pictures",
      key: "picture",
      render: (_, record) => (
        <div style={{ paddingRight: "20px" }}>
          <Upload
            {...props}
            maxCount={1}
            value={record.picture}
            onClick={() => setActivekey(record.key)}
            onRemove={() => handleImageRemove(record.key)}
          >
            <Button icon={<UploadOutlined />}>Upload image</Button>
          </Upload>
        </div>
      ),
    },
    {
      title: "Ins used",
      dataIndex: "inst_used",
      key: "inst_used",
      render: (_, record) => (
        <Input
          onChange={(e) => handleInstrumentChange(record.key, e.target.value)}
          value={record.inst_used}
        />
      ),
    },
  ];

  const handleParameterChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].parameter = value;
    setTableData(updatedTableData);
  };
  const handleSpacificationChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].spacification = value;
    setTableData(updatedTableData);
  };

  const handleActualChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].actual = value;
    setTableData(updatedTableData);
  };

  const handleStatusChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].status = value;
    setTableData(updatedTableData);
  };

  const handleRemarksChange = (key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].remark = value;
    setTableData(updatedTableData);
  };

  function handleInstrumentChange(key, value) {
    const updatedTableData = [...tableData];
    updatedTableData[key].inst_used = value;
    setTableData(updatedTableData);
  }

  const handleImageRemove = (key) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].picture = "";
    setTableData(updatedTableData);
  };

  function updateFileImage(key, value) {
    form.setFieldsValue({
      [`picture_${key}`]: value,
    });
  }

  const handleSaveData = () => {
    const postData = tableData.map((item) => ({
      ...item,
      id: material_id,
      sample_id: FinalSampleId,
      parameter: item.parameter,
      spacification: item.spacification,
      inst_used: item.inst_used,
      actual: item.actual,
      status: item.status,
      picture: item.picture || form.getFieldValue(`picture_${item.key}`) || "",
      remark: item.remark,
    }));

    axios
      .post(process.env.REACT_APP_API_URL + "/updateParameters", {
        MaterialParameter: postData,
      })
      .then((response) => {
        getSample(material_id, date);
        OpenViewResultModel(FinalSampleId);
        setViewResultModel(false);
        setIsInputDisabled(true);
        message.success("Data saved successfully!");
      })
      .catch((error) => {
        message.error("Error saving data.");
      });
  };

  const getSample = (material_id, date) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getSample", {
        material_id,
        date,
      })
      .then((result) => {
        setSampleList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveSampleId = (Sample_id) => {
    const Sample_Id = Sample_id;
    const material_Id = material_id;
    axios
      .post(process.env.REACT_APP_API_URL + "/saveSample", {
        Sample_id: Sample_Id,
        material_id: material_Id,
        vendor_name: vendor_name,
      })
      .then((result) => {
        getSample(material_id, date);
        setAddSample(false);
        message.success("Data saved successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data.");
      });
  };

  const SaveLotMaterial = (values) => {
    values.material_id = material_id;
    values.rejected_status = Rejected_status;
    values.rejected_lot_remark = rejected_remark;
    axios
      .post(process.env.REACT_APP_API_URL + "/saveCheckLotMaterial", values)

      .then((result) => {
        getSample(material_id, date);
        setAddSample(false);
        getCheckLot(material_id, date);
        message.success("Data saved successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data.");
      });
  };
  const handleReplaceParameter = () => {
    setReplaceMaterialModel(true);
  };

  const handleRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRowKeys);
    const selectedParameter = selectedRows.map((row) => row.parameter);
    setSelectedRowsParameter(selectedParameter);
  };
  const handleDeleteSelected = () => {
    confirm({
      title: "Delete the Material Parameter",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const selectedIds = selectedRows;
        const selectedParameter = selectedRowsParameter;
        deleteItem(selectedIds, selectedParameter);
      },
    });
  };

  const deleteItem = (selectedIds, selectedParameter) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_parameter", {
        data: {
          id: material_id,
          parameter: selectedParameter,
        },
      })
      .then((response) => {
        setSelectedRows([]);
        setSelectedRowsParameter([]);
        form1.resetFields();
        OpenViewResultModel(FinalSampleId);
        message.success("Data Delete successfully!");
      })
      .catch((error) => {
        console.error("Error deleting items:", error);
      });
  };
  const handleSaveMaterialParameter = (values) => {
    values.id = material_id;
    values.Sample_id = FinalSampleId;
    axios
      .post(`${process.env.REACT_APP_API_URL}/saveMaterialParameter`, values)
      .then((result) => {
        form1.resetFields();
        setMaterialModel(false);
        OpenViewResultModel(FinalSampleId);
        message.success("Data saved successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data.");
      });
  };

  const handleSaveMaterial = (values) => {
    const postData = {
      MaterialParameter: values.MaterialParameter,
      material_name: values.material_name,
      material_id: material_id,
    };

    axios
      .put(`${process.env.REACT_APP_API_URL}/replaceMaterial`, postData)
      .then((result) => {
        console.log(result.data);
        if (result && result.data && result.data.success) {
          form2.resetFields();
          ReplaceMaterialModelCancel();
          message.success(result.data.message);
          setTimeout(() => {
            setMaterialParameter([
              {
                parameter: undefined,
                spacification: undefined,
                inst_used: undefined,
              },
            ]);
            setChecked(false);
          }, 1000);
        } else {
          message.error("Error saving data: Unexpected response format");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data: Network error or server issue");
      });
  };

  const handleAddMore = () => {
    setMaterialParameter([
      ...MaterialParameter,
      { parameter: undefined, spacification: undefined, inst_used: undefined },
    ]);
  };

  const handleRemove = (index) => {
    setMaterialParameter((prevmaterials) =>
      prevmaterials.filter((item, i) => i !== index)
    );
  };

  const getCheckLot = (material_id, date) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getCheckLot", {
        material_id,
        date,
      })
      .then((result) => {
        let NewData = result.data;
        NewData.map((x) => {
          const inspectedDate = moment(x.inspected_date);
          form.setFieldsValue({
            lot_id: x.lot_id,
            tolerence: x.tolerence,
            lot_size: x.lot_size,
            sample_size: x.sample_size,
            rejection_percentage: x.rejection_percentage,
            dwg_no: x.dwg_no,
            part_no: x.part_no,
            item_accepted_qty: x.item_accepted_qty,
            rejected_qty: x.rejected_qty,
            qc_inspector: x.qc_inspector,
            approved_by: x.approved_by,
            remarks: x.remarks,
            inspected_date: inspectedDate,
            invoice_number: x.invoice_number,
            component_value: x.component_value,
          });
          setLOtId(x.lot_id);
          setrejected_status(x.rejected_status);
          setrejected_remark(x.rejected_lot_remark);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (Id) => {
    confirm({
      title: "Delete the Smaple Id",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Sample Id?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItemSample(Id);
      },
    });
  };

  const deleteItemSample = (Id) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_SampleId", {
        data: {
          id: Id,
        },
      })
      .then((response) => {
        setSampleList((prevData) => prevData.filter((item) => item.key !== Id));
        getSample(material_id, date);
        getCheckLot(material_id, date);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddRemarksChange = (value) => {
    setLotReamrk(value);
  };
  const handleRejectLot = (lot_id) => {
    const rejected_lot_remark = LotReamrk;
    axios
      .post(process.env.REACT_APP_API_URL + "/updateLot", {
        lot_id: lot_id,
        rejected_lot_remark: rejected_lot_remark,
      })
      .then((result) => {
        setRejectLot(false);
        message.success("Data Update successfully!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Error saving data.");
      });
  };

  const handleEnableInputs = () => {
    setIsInputDisabled(false);
  };

  const handleCheck = () => {
    setChecked(!isChecked);
  };
  const AddQRParameter = (Sample_id) => {
    confirm({
      title: "Apply QR Functionality",
      icon: <QuestionOutlined />,
      content: "Are you sure to apply QR functionality in this form?",
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      onOk() {
        AddQR(Sample_id);
      },
    });
  };

  const AddQR = (Sample_id) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/update_QRfunctionality`, {
        data: {
          Sample_id: Sample_id,
        },
      })
      .then((response) => {
        setSampleList((prevData) =>
          prevData.filter((item) => item.key !== Sample_id)
        );
        getSample(material_id, date);
        getCheckLot(material_id, date);
      })
      .catch((error) => {
        console.error("Error updating QR functionality:", error);
      });
  };
  const handleDownloadReport = () => {
    const formData = form.getFieldsValue();
    const formattedFormData = {
      ...formData,
      inspected_date: formData.inspected_date.format("YYYY-MM-DD"),
    };
    const worksheet = XLSX.utils.json_to_sheet([formattedFormData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MaterialData");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAsExcel(excelBuffer, "material_data.xlsx");
  };

  const saveAsExcel = (buffer, fileName) => {
    const data = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
  };
  const handleShare = () => {
    const emailBody = `Hello! I'm sharing the material data report with you. Please find the attachment.`;

    const subject = "Material Data Report";
    const recipient = "";

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;
  };
  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    const formattedBatchList = SampleList.map((item) => {
      const {
        id,
        key,
        createdAt,
        picture,
        __v,
        _id,
        checked_qr_code,
        updatedAt,
        material_id,
        MaterialParameter,
        ...rest
      } = item;
      const flattenedMaterialParameters = MaterialParameter.map((param) => ({
        ...rest,
        CreatedDateTime: new Date(item.createdAt).toLocaleString(),
        UpdatedDateTime: new Date(item.updatedAt).toLocaleString(),
        Parameter_value: param.parameter,
        Parameter_spacification: param.spacification,
        Parameter_inst_used: param.inst_used,
        Parameter_status: param.status,
        Parameter_remark: param.remark ? param.remark : "NA",
        Parameter_actual: param.actual ? param.actual : "NA",
      }));

      return flattenedMaterialParameters;
    }).flat();

    const ws = XLSX.utils.json_to_sheet(formattedBatchList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sample_data.xlsx";
    a.click();
  };

  const handleScanQR = (data) => {
    setStartScan(false);
    messageApi.open({
      type: "success",
      content: "Scanned  Successfully",
    });

    tableData.map((item) => {
      if (item.key === parameterkey) {
        item.parameter = `IMEI PCBA :- ${data}`;
        item.type = "text";
      }
    });
  };

  return (
    <div>
      <Row>
        <Col span={11}>
          <span className="TopMenuTxt">Incoming Material Check </span>
        </Col>
        <Col span={13} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            <Button
              className="TopMenuButton"
              onClick={() => handleReplaceParameter()}
            >
              Replace Parameters
            </Button>
          </span>
          <span style={{ margin: "0 7px" }}>
            <Button
              className="TopMenuButton"
              onClick={() => handleCreateSampleId()}
            >
              Add New sample <PlusOutlined />
            </Button>
          </span>
          <span style={{ margin: "0 7px" }}>
            {SystemLogedIn === true ? (
              <span style={{ margin: "0 7px" }}>
                <Button
                  onClick={() => handleLogout()}
                  type="text"
                  style={{ backgroundColor: "#fff" }}
                  className="topLogoutBtn"
                >
                  ({SystemSelectedTime.toLocaleTimeString()})
                  <LogoutOutlined style={{ color: "red" }} />
                </Button>
              </span>
            ) : (
              <Button
                type="text"
                style={{ backgroundColor: "#fff" }}
                className="topLogoutBtn"
              >
                System Login
                <LoginOutlined style={{ color: "#4DDE4A" }} />
              </Button>
            )}
          </span>
        </Col>
      </Row>

      <Row style={{ marginBottom: "8px" }}>
        <Col span={24}>
          <div className="mainTitle"></div>
        </Col>
        <Col span={24}>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={SaveLotMaterial}
            autoComplete="off"
          >
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label="Material Name"
                  name="material_name"
                  initialValue={material_name}
                  rules={[
                    {
                      required: true,
                      message: "Please input the Material name!",
                    },
                  ]}
                >
                  <Select placeholder="Select Material Name" disabled></Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Lot-ID"
                  name="lot_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Lot Id!",
                    },
                  ]}
                >
                  <Input placeholder="Input Lot-ID..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Tolerence"
                  name="tolerence"
                  rules={[
                    {
                      required: true,
                      message: "Please input thetolerence!",
                    },
                  ]}
                >
                  <Input placeholder="Input Tolerence..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Inspected Date"
                  name="inspected_date"
                  rules={[
                    {
                      required: true,
                      message: "Please select the inspected date!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Lot Size"
                  name="lot_size"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Lot Size!",
                    },
                  ]}
                >
                  <Input placeholder="Input Lot Size..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Invoice Number/ Date"
                  name="invoice_number"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Invoice Number!",
                    },
                  ]}
                >
                  <Input placeholder="Input Lot Invoice Number..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Component Value"
                  name="component_value"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Component Value!",
                    },
                  ]}
                >
                  <Input placeholder="Input Lot Component Value..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Sample Size"
                  name="sample_size"
                  rules={[
                    {
                      required: true,
                      message: "Please input the sample size!",
                    },
                  ]}
                >
                  <Input placeholder="Input Sample Size..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Rejection %"
                  name="rejection_percentage"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Rejection %!",
                    },
                  ]}
                >
                  <Input placeholder="Input Rejection %..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Vendor Name"
                  name="vendor_name"
                  initialValue={vendor_name}
                  rules={[
                    {
                      required: true,
                      message: "Please input the Vendor Name!",
                    },
                  ]}
                >
                  <Input placeholder="Input Vendor Name..." disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Dwg No"
                  name="dwg_no"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Dwg No!",
                    },
                  ]}
                >
                  <Input placeholder="Input Dwg No..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Part No"
                  name="part_no"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Part No!",
                    },
                  ]}
                >
                  <Input placeholder="Input Part No..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Item Accepted Qty"
                  name="item_accepted_qty"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Item Accepted Qty!",
                    },
                  ]}
                >
                  <Input placeholder="Input Item Accepted Qty..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Rejected Qty"
                  name="rejected_qty"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Rejected Qty!",
                    },
                  ]}
                >
                  <Input placeholder="Input Rejected Qty..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="QC Inspector"
                  name="qc_inspector"
                  rules={[
                    {
                      required: true,
                      message: "Please input the QC Inspector!",
                    },
                  ]}
                >
                  <Input placeholder="Input QC Inspector..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Approved By"
                  name="approved_by"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Approved By!",
                    },
                  ]}
                >
                  <Input placeholder="Input Approved By..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Remarks"
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Remarks!",
                    },
                  ]}
                >
                  <Input placeholder="Input Remarks..." />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="lineModalButtonSUbmit"
                style={{ float: "right" }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <hr />
      <Row style={{ marginTop: "10px" }}>
        <Col span={6} style={{ marginTop: "10px" }}>
          <span className="TopMenuTxt">Checked Sample list</span>
        </Col>
        <Col span={18} style={{ textAlign: "right" }}>
          {SampleList.length !== 0 ? (
            <span style={{ margin: "0 7px" }}>
              <Button
                key="excelImport"
                type="primary"
                onClick={handleExcelImport}
                style={{ marginRight: "15px" }}
              >
                Sample Import <DownloadOutlined />
              </Button>
            </span>
          ) : (
            <span style={{ margin: "0 7px" }}>
              <Button
                key="excelImport"
                type="primary"
                onClick={handleExcelImport}
                style={{ marginRight: "15px" }}
                disabled
              >
                Sample Import <DownloadOutlined />
              </Button>
            </span>
          )}
          {LotId === "" ? (
            <>
              <span style={{ margin: "0 7px" }}>
                <Button
                  className="TopMenuButton1"
                  onClick={() => handleRejectFullLot()}
                  disabled
                >
                  Reject Full Lot
                </Button>
              </span>
              <span style={{ margin: "0 7px" }}>
                <Button
                  className="TopMenuButton2"
                  onClick={() => handleDownloadReport()}
                  disabled
                >
                  Download Report <DownloadOutlined />
                </Button>
              </span>
              <span style={{ margin: "0 7px" }}>
                <Button
                  className="TopMenuButton2"
                  onClick={() => handleShare()}
                  disabled
                >
                  Share <ShareAltOutlined />
                </Button>
              </span>
            </>
          ) : (
            <>
              <span style={{ margin: "0 7px" }}>
                <Button
                  className="TopMenuButton1"
                  onClick={() => handleRejectFullLot()}
                >
                  Reject Full Lot
                </Button>
              </span>
              <span style={{ margin: "0 7px" }}>
                <Button
                  className="TopMenuButton2"
                  onClick={() => handleDownloadReport()}
                >
                  Download Report <DownloadOutlined />
                </Button>
              </span>
              <span style={{ margin: "0 7px" }}>
                <Button
                  className="TopMenuButton2"
                  onClick={() => handleShare()}
                >
                  Share <ShareAltOutlined />
                </Button>
              </span>
            </>
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: ".5rem", marginBottom: "15px" }}>
        {SampleList.length !== 0 ? (
          SampleList.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          ).map((x) => (
            <Col
              span={24}
              style={{
                backgroundColor: x.MaterialParameter.some(
                  (item) => item.status === "NOT OK"
                )
                  ? "#ffe7e7"
                  : "white",
                marginBottom: "1rem",
              }}
              key={x._id}
            >
              <div style={{ padding: ".5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#606060",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <div>
                    <div>{x.Sample_id}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        className="lineModalButtonSUbmit2"
                        onClick={() => handleDelete(x._id)}
                        style={{ marginRight: "10px" }}
                      >
                        Delete
                      </Button>

                      <Button
                        className="ButtonSUbmit"
                        onClick={() => OpenViewResultModel(x.Sample_id)}
                      >
                        View Results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
        )}
      </Row>
      <Row justify="end" style={{ marginRight: "1rem" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Row>
      <Modal
        title="System Exit"
        visible={exitModel1}
        onCancel={handleCloseexitModel1}
        footer={null}
      >
        <Result
          status="logout"
          icon={<LogoutOutlined style={{ color: "#FF5C5C" }} />}
          subTitle={
            <span className="result-subtitle">
              Do you want to Logout from System?
              <br />
              <p style={{ marginTop: "10px" }}></p>
              Logout time:
              <Input
                style={{
                  width: "25%",
                  height: "30px",
                  borderRadius: 0,
                  margin: "0 7px",
                  textAlign: "center",
                }}
                value={new Date().toLocaleTimeString()}
                readOnly
              />
            </span>
          }
          extra={[
            <Button
              key="buy"
              onClick={handleCloseexitModel1}
              className="circular-button cancle"
            >
              Cancel
            </Button>,
            <Button
              key="buy"
              type="primary"
              onClick={handleSystemLogout}
              className="circular-button"
            >
              Ok
            </Button>,
          ]}
        />
      </Modal>
      <Modal
        title="Add Sample"
        visible={AddSample}
        onCancel={handleCloseAddSample}
        footer={null}
      >
        <Result
          status="Login"
          icon={<LoginOutlined style={{ color: "#4DDE4A" }} />}
          subTitle={
            <span className="result-subtitle">
              Sample Id:
              <Input
                style={{
                  width: "50%",
                  height: "30px",
                  borderRadius: 0,
                  margin: "0 7px",
                }}
                value={SampleId}
                readOnly
              />
            </span>
          }
          extra={[
            <Button
              key="buy"
              onClick={handleCloseAddSample}
              className="circular-button cancle"
            >
              Cancel
            </Button>,
            <Button
              key="buy"
              type="primary"
              onClick={() => handleSaveSampleId(SampleId)}
              className="circular-button"
            >
              Ok
            </Button>,
          ]}
        />
      </Modal>
      <Modal
        title="Reject Full Lot"
        visible={RejectLot}
        onCancel={handleCloseRejectLot}
        footer={null}
      >
        <Result
          status="Login"
          icon={
            <DeleteOutlined style={{ color: "#FF5C5C", fontSize: "40px" }} />
          }
          subTitle={
            <span className="result-subtitle" style={{ color: "#FF5C5C" }}>
              Are you sure you want to Reject Full Lot?
              <br />
              <p
                style={{
                  marginTop: "5px",
                  color: "#606060",
                  float: "left",
                  padding: "10px",
                }}
              >
                {" "}
                Remarks
              </p>
              <TextArea
                style={{
                  width: "100%",
                  height: "30px",
                  borderRadius: 0,
                  margin: "0 7px",
                }}
                onChange={(e) => handleAddRemarksChange(e.target.value)}
              />
            </span>
          }
          extra={[
            <Button
              key="buy"
              onClick={handleCloseRejectLot}
              className="circular-button cancle"
            >
              Cancel
            </Button>,
            <Button
              key="buy"
              type="primary"
              onClick={() => handleRejectLot(LotId)}
              className="circular-button"
            >
              Ok
            </Button>,
          ]}
        />
      </Modal>
      <Modal
        title="Checking for any default"
        visible={ViewResultModel}
        onCancel={handleCloseViewResultModel}
        footer={null}
        width={1400}
      >
        Sample ID:
        <br />
        <Input
          style={{
            width: "20%",
            height: "30px",
            borderRadius: 0,
            marginTop: "10px",
          }}
          value={FinalSampleId}
          readOnly
        />
        <Row
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Col span={24}>
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
                          // console.info('error');
                        }
                      }}
                    />
                  </div>
                  <Button onClick={() => setStartScan(false)}>close</Button>
                </div>
              </>
            )}
          </Col>
          {tableData.length === 0 ? (
            <Col span={24} style={{ backgroundColor: "#fff" }}>
              <Result
                icon={<img src="./SVG/noitem.svg" />}
                subTitle="No Item Found"
              />
            </Col>
          ) : (
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered={true}
              rowClassName={(record) =>
                record.status === "NOT OK" ? "not-ok-row" : ""
              }
              style={{ marginTop: "15px" }}
              rowSelection={{
                type: "checkbox",
                onChange: handleRowSelection,
              }}
            />
          )}

          <Button
            type="primary"
            loading={loading}
            className="lineModalButtonSUbmit2"
            onClick={handleCloseViewResultModel}
          >
            Close
          </Button>

          <Button
            type="primary"
            loading={loading}
            className="lineModalButtonSUbmit"
            onClick={AddNewParameter}
            style={{ width: "176px" }}
          >
            Add new Parameter
          </Button>
          {/* <Button
            type="primary"
            loading={loading}
            className="lineModalButtonSUbmit"
            onClick={() => AddQRParameter(FinalSampleId)}
            style={{ width: "176px" }}
          >
            Add QR Parameter
          </Button> */}
          <Button
            key="delete"
            type="primary"
            loading={loading}
            className="lineModalButtonSUbmit"
            onClick={handleDeleteSelected}
          >
            Delete
          </Button>

          <Button
            type="primary"
            loading={loading}
            className="lineModalButtonSUbmit"
            onClick={handleEnableInputs}
          >
            Edit
          </Button>
          <Button
            type="primary"
            loading={loading}
            className="lineModalButtonSUbmit"
            onClick={handleSaveData}
          >
            Save
          </Button>
        </Row>
      </Modal>
      <Modal open={MaterialModel} onCancel={MaterialModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Material Parameter</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form1}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleSaveMaterialParameter}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                          {
                            required: true,
                            message: "Please input Type",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select placeholder="Type" style={{ marginTop: "6px" }}>
                          <Select.Option value="text">Text</Select.Option>
                          <Select.Option value="qr">QR</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Parameter"
                        name="parameter"
                        rules={[
                          {
                            required: true,
                            message: "Please input Parameter",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter Parameter"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Specification"
                        name="spacification"
                        rules={[
                          {
                            required: true,
                            message: "Please input specification",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter specification"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Instrument"
                        name="inst_used"
                        rules={[
                          {
                            required: true,
                            message: "Please input Instrument",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter Instrument"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>

      <Modal
        open={ReplaceMaterialModel}
        onCancel={ReplaceMaterialModelCancel}
        footer={[]}
      >
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Replace Material Parameter</span>
              </Col>

              <Col span={24}>
                <Form
                  form={form2}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleSaveMaterial}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Material Name"
                        name="material_name"
                        initialValue={material_name}
                        rules={[
                          {
                            required: true,
                            message: "Please input material name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter material name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.List name="MaterialParameter">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Space
                                key={key}
                                style={{
                                  display: "flex",
                                  marginBottom: 8,
                                }}
                                align="baseline"
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, "type"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Type",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Type">
                                    <Select.Option value="text">
                                      Text
                                    </Select.Option>
                                    <Select.Option value="qr">QR</Select.Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "parameter"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Parameter",
                                    },
                                  ]}
                                >
                                  <Input
                                    className="myAntIpt2"
                                    placeholder="Parameter"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "spacification"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Spacification",
                                    },
                                  ]}
                                >
                                  <Input
                                    className="myAntIpt2"
                                    placeholder="Spacification"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "inst_used"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing Instrument",
                                    },
                                  ]}
                                >
                                  <Input
                                    className="myAntIpt2"
                                    placeholder="Instrument"
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add field
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Col>

                    {/* {MaterialParameter.map((item, index) => (
                      <React.Fragment key={index}>
                        <Col span={7}>
                          <Form.Item
                            label={`Parameter`}
                            name={["MaterialParameter", index, "parameter"]}
                            initialValue={item.parameter}
                            rules={[
                              {
                                required: true,
                                message: "Required*",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input
                              className="myAntIpt2"
                              placeholder="Enter Parameter"
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item
                            label={`Spacification(mm)`}
                            name={["MaterialParameter", index, "spacification"]}
                            initialValue={item.spacification}
                            rules={[
                              {
                                required: true,
                                message: "Required*",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input
                              className="myAntIpt2"
                              placeholder="Spacification"
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item
                            label={`Instrument`}
                            name={["MaterialParameter", index, "inst_used"]}
                            initialValue={item.inst_used}
                            rules={[
                              {
                                required: true,
                                message: "Required*",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input
                              className="myAntIpt2"
                              placeholder="Instrument"
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={3} style={{ marginTop: "-5px" }}>
                          {index === MaterialParameter.length - 1 && (
                            <Form.Item>
                              <Button
                                type="primary"
                                onClick={handleAddMore}
                                block
                                className="add-more-button"
                              >
                                <PlusOutlined style={{ marginLeft: "-5px" }} />
                              </Button>
                            </Form.Item>
                          )}
                          {index !== MaterialParameter.length - 1 && (
                            <Button
                              type="primary"
                              onClick={() => handleRemove(index)}
                              block
                              className="remove-button"
                            >
                              <DeleteOutlined style={{ marginLeft: "-5px" }} />
                            </Button>
                          )}
                        </Col>
                      </React.Fragment>
                    ))} */}

                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default CheckMaterialList;
