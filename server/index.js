const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var morgan = require("morgan");
const bodyParser = require("body-parser");
var crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const Users = require("./Model/users");
const upload = require("./Service/imageUpload");

const Websetting = require("./Model/Websetting");

const sendOtp = require("./controllers/sendOtp");

const PostApiData = require("./Model/PostApiData");
const UploadFiles = require("./Model/UploadFiles");
const MachineData = require("./Model/MachineData");
const IMEINumberLQC = require("./Model/IMEINumberLQC");
const IMEINumberLQCInternalVuales = require("./Model/IMEINumberLQCInternalVuales");
const VendorModel = require("./Model/VendorModel");
const VendorName = require("./Model/VendorSchamaNameModel");
const MaterialModel = require("./Model/MaterialModel");
const MaterialName = require("./Model/MaterialSchamaNameModel");
const SystemLogs = require("./Model/SystemLogs");
const CheckLotModel = require("./Model/CheckLotMaterialModel");
const SampleIdModel = require("./Model/SampleIdModel");
const ExcelJS = require("exceljs");
const HDFCData = require("./Model/HDFCData");
const BharatPeData = require("./Model/BharatPeData");
const Log = require("./Model/Log");

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { startOfWeek, endOfWeek } = require("date-fns");
const {
  loggerMiddleware,
  errorLogger,
} = require("./middleware/loggerMiddleware");

require("dotenv").config();

var multer = require("multer");
const Role = require("./Model/RoleManage");
const LineLogs = require("./Model/LineLogs");
const BatchData = require("./Model/BatchData");
const websetting = require("./Model/Websetting");
const MasterCarton = require("./Model/MasterCarton");
const SandBoxOQCL = require("./Model/SandBoxOQCL");
const PassedMachine = require("./Model/PassedMachine");
const SandBoxOQCLSingle = require("./Model/SandBoxOQCLSingle");
const ForReview = require("./Model/ReviewOQC");

const doc1Upload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

let app = express();
let port = process.env.PORT;

const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(express.static("files"));
// app.use("/", express.static("build"));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/images", express.static("images"));
app.use("/testingImages", express.static("testingImages"));

const {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} = require("date-fns");
const moment = require("moment");

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Database Connected!");
    server.listen(port, () => {
      console.log(`Server is up and running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

app.get("/", (_, res) => {
  return res.status(200).json({ message: "server is up and running..." });
});

app.post("/login", async (req, res) => {
  try {
    const users = await Users.find({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/checkUserEmail", async (req, res) => {
  let { smtpHost, smtpPort, smtpUsername, smtpPassword } = req.body;

  try {
    let otp = Math.floor(1000 + Math.random() * 9000);

    let newArr = {
      token: "",
    };

    const users = await Users.find({
      email: req.body.email,
    });

    if (users.length != 0) {
      const update = await Users.findByIdAndUpdate(users[0]._id, {
        otp,
      });

      newArr.token = users[0]._id;
    }

    sendOtp(
      "Techies Infotech",
      "harmanpreet.singh@iamtechie.com",
      req.body.email,
      "hosting_name",
      "renewal_date",
      "client_name",
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      otp
    );

    res.status(200).json(newArr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/verifyotp", async (req, res) => {
  try {
    const users = await Users.find({
      _id: req.body.token,
    });

    if (users.length != 0) {
      let enteredOTP = req.body.otp;
      let correctOTP = users[0].otp;

      if (enteredOTP == correctOTP) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/update_websetting", upload.single("image"), async (req, res) => {
  try {
    const {
      id,
      company_name,
      contact_email,
      carrer_email,
      watsapp_number,
      Contact_number,
      smtp_host,
      smtp_port,
      smtp_username,
      smtp_password,
      socialIcons,
    } = req.body;
    let websetting = await Websetting.findById(id);
    const imgLocation = req.file ? req.file.location : undefined;
    if (socialIcons) {
      const newSocialIcons = JSON.parse(socialIcons);
      const filteredSocialIcons = newSocialIcons.filter(
        (icon) => icon.icon_name && icon.social_url
      );
      if (filteredSocialIcons.length > 0) {
        if (websetting.socialIcons && websetting.socialIcons.length > 0) {
          websetting.socialIcons.push(...filteredSocialIcons);
        } else {
          websetting.socialIcons = filteredSocialIcons;
        }
      }
    }

    const updateObject = {
      company_name,
      contact_email,
      carrer_email,
      watsapp_number,
      Contact_number,
      smtp_host,
      smtp_port,
      smtp_username,
      smtp_password,
      img: imgLocation,
      loginimg: "null",
      socialIcons: websetting.socialIcons,
    };

    await Websetting.findByIdAndUpdate(id, updateObject);

    res.status(200).json({ status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/update_loginimage", async (req, res) => {
  try {
    await doc1Upload(req, res);
    await Websetting.findByIdAndUpdate(req.body.id, {
      loginimg: req.file.location,
    });

    res.status(200).json({ status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/update_logo", async (req, res) => {
  try {
    await doc1Upload(req, res);
    await Websetting.findByIdAndUpdate(req.body.id, {
      img: req.file.location,
    });

    res.status(200).json({ status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/deleteloginimg", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Websetting.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete(
  "/delete_social_icon/:websettingId/:socialIconId",
  async (req, res) => {
    try {
      const websettingId = req.params.websettingId;
      const socialIconId = req.params.socialIconId;
      const websetting = await Websetting.findById(websettingId);
      if (!websetting) {
        return res.status(404).json({ message: "Websetting not found" });
      }
      websetting.socialIcons = websetting.socialIcons.filter(
        (icon) => icon._id.toString() !== socialIconId
      );

      await websetting.save();

      res.status(200).json({ message: "Social icon deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Walnut Start

const checkAuthToken = async (token) => {
  const result = await websetting
    .find({
      token,
    })
    .sort({ _id: -1 })
    .limit(1);
  if (result.length == 0) {
    return false;
  } else {
    return true;
  }
};

app.get("/getData", async (req, res) => {
  try {
    const data = await MachineData.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/downloadData", loggerMiddleware, async (req, res) => {
  try {
    let status = await checkAuthToken(req.query.token);

    if (status) {
      const result = await MachineData.create({
        DataJson: JSON.stringify(req.query),
      });
      const file = `./download/${process.env.donwloadFIleLink}`;
      res.download(file);
    } else {
      res.status(500).json({ message: "Invalid Auth Token" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/downloadData/:name", async (req, res) => {
  try {
    let status = await checkAuthToken(req.query.token);

    if (status) {
      const result = await MachineData.create({
        DataJson: JSON.stringify(req.query),
      });

      const file = `./download/${req.params.name}`;
      res.download(file);
    } else {
      res.status(500).json({ message: "Invalid Auth Token" });
    }
    // res.status(200).json({ message: req.params.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/postlogin", async (req, res) => {
  try {
    const data = await User.find({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/postsignup", async (req, res) => {
  try {
    const users = await User.create(req.body);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const batchId = {
  bharatPe: "PCBA-BBID",
  hdfc: "PCBA-BID",
};

app.post("/saveResponse_new", async (req, res) => {
  try {
    const { batch_id, imei, publicKey, test_result } = req.body;
    if (!publicKey) {
      return res.status(400).json({ message: "Public Key is required" });
    }
    const status = await verifyToken(publicKey);
    if (status) {
      if (imei) {
        if (test_result == "pass") {
          await PassedMachine.create({
            imei,
          });
        }
      }
      let data = {};
      switch (true) {
        case batch_id?.includes(batchId.bharatPe):
          data = await BharatPeData.create(req.body);
          break;
        case batch_id?.includes(batchId.hdfc):
          data = await HDFCData.create(req.body);
          break;
        default:
          data = await PostApiData.create(req.body);
      }
      return res.status(201).json(data);
    } else {
      return res.status(400).json({ message: "Invalid Auth Token" });
    }
  } catch (error) {
    res.status(500).json({ message: error?.message || "Error adding data" });
  }
});

app.post("/saveResponse_JSON", async (req, res) => {
  try {
    const filePath = "./oldData.json";

    // Read the content of the JSON file
    const fileContent = await fs.readFile(filePath, "utf8");

    // Parse the JSON content
    const jsonData = JSON.parse(fileContent);

    jsonData.map((x) => {
      PostApiData.create({
        createdAt: x.createdAt.$date,
        updatedAt: x.createdAt.$date,
        ...JSON.parse(x.DataJson),
      });
    });

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/post-api-data", async (req, res) => {
  try {
    const result = await PostApiData.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/GetSingleDayData", async (req, res) => {
  try {
    let selectedDate = req.body.startDate;
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    const result = await PostApiData.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/GetCurentData", async (req, res) => {
  try {
    let selectedDate = new Date().toDateString();

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    const result = await PostApiData.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/saveResponse", loggerMiddleware, async (req, res) => {
  try {
    const { batch_id, imei, publicKey, test_result } = req.body;
    if (!publicKey) {
      return res.status(400).json({ message: "Public Key is required" });
    }
    const status = await verifyToken(publicKey);
    if (status) {
      if (imei) {
        if (test_result == "pass") {
          await PassedMachine.create({
            imei,
          });
        }
      }
      let data = {};
      switch (true) {
        case batch_id?.includes(batchId.bharatPe):
          data = await BharatPeData.create(req.body);
          break;
        case batch_id?.includes(batchId.hdfc):
          data = await HDFCData.create(req.body);
          break;
        default:
          data = await PostApiData.create(req.body);
      }
      return res.status(201).json(data);
    } else {
      return res.status(400).json({ message: "Invalid Auth Token" });
    }
  } catch (error) {
    res.status(500).json({ message: error?.message || "Error adding data" });
  }
});

app.post("/saveResponse_token", async (req, res) => {
  try {
    let status = await verifyToken(req.body.publicKey);

    if (status) {
      if (req.body.imei != undefined) {
        if (req.body.test_result == "pass") {
          const result = await PassedMachine.create({
            imei: req.body.imei,
          });
          const result2 = await PostApiData.create(req.body);
          res.status(200).json(result2);
        } else {
          const result2 = await PostApiData.create(req.body);
          res.status(200).json(result2);
        }
      } else {
        const result2 = await PostApiData.create(req.body);
        res.status(200).json(result2);
      }
    } else {
      res.status(500).json({ message: "Invalid Auth Token" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/CheckMachineStatus", async (req, res) => {
  try {
    const result = await PassedMachine.find({
      imei: req.body.imei,
    });

    if (result.length == 0) {
      res.status(200).json(false);
    } else {
      res.status(200).json(true);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getResponse", async (req, res) => {
  try {
    const data = await PostApiData.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getResponse/:id", async (req, res) => {
  try {
    const data = await PostApiData.find({ _id: req.params.id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get(
  "/downloadDataWithoutDate/:batch_id",
  loggerMiddleware,
  async (req, res) => {
    try {
      let data = [];
      const { batch_id } = req.params;
      switch (true) {
        case batch_id?.includes(batchId.bharatPe):
          data = await BharatPeData.find().lean().exec();
          break;
        case batch_id?.includes(batchId.hdfc):
          data = await HDFCData.find().lean().exec();
          break;
        default:
          data = await PostApiData.find().lean().exec();
      }

      // Create a new Excel workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Machine Data");

      // Add headers to the worksheet
      const headers = Object.keys(data[0]); // Assuming the data has at least one item
      worksheet.addRow(headers);

      // Add data rows to the worksheet
      data.forEach((item) => {
        const row = [];
        headers.forEach((header) => {
          row.push(item[header]);
        });
        worksheet.addRow(row);
      });

      // Set response headers for Excel file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=data_without_date.xlsx"
      );

      // Send the Excel file as the response
      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post(
  "/downloadDataWithDate/:batch_id",
  loggerMiddleware,
  async (req, res) => {
    try {
      let data = [];
      const { batch_id } = req.params;
      switch (true) {
        case batch_id?.includes(batchId.bharatPe):
          data = await BharatPeData.find({
            createdAt: {
              $gte: new Date(req.body.startDate),
              $lte: new Date(req.body.endDate),
            },
          });
          break;
        case batch_id?.includes(batchId.hdfc):
          data = await HDFCData.find({
            createdAt: {
              $gte: new Date(req.body.startDate),
              $lte: new Date(req.body.endDate),
            },
          });
          break;
        default:
          data = await PostApiData.find({
            createdAt: {
              $gte: new Date(req.body.startDate),
              $lte: new Date(req.body.endDate),
            },
          });
          break;
      }
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

app.post("/downloadDataToday/:batch_id", loggerMiddleware, async (req, res) => {
  let data = [];
  const { batch_id } = req.params;
  try {
    switch (true) {
      case batch_id?.includes(batchId.bharatPe):
        data = await BharatPeData.find({
          createdAt: {
            $gte: new Date(req.body.startDate),
          },
        });
        break;
      case batch_id?.includes(batchId.hdfc):
        data = await HDFCData.find({
          createdAt: {
            $gte: new Date(req.body.startDate),
          },
        });
        break;
      default:
        data = await PostApiData.find({
          createdAt: {
            $gte: new Date(req.body.startDate),
          },
        });
        break;
    }
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getPostResponse/:batch_id", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const results = parseInt(req.query.results) || 10;
  const { batch_id } = req.params;
  try {
    let data = [];
    let totalCount = 0;
    switch (true) {
      case batch_id?.includes(batchId.bharatPe):
        data = await BharatPeData.find()
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await BharatPeData.count();
        break;
      case batch_id?.includes(batchId.hdfc):
        data = await HDFCData.find()
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await HDFCData.count();
        break;
      default:
        data = await PostApiData.find()
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await PostApiData.count();
        break;
    }
    return res.status(200).json({ results: data, totalCount });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .json({ error: error?.message || "Error fetching post data" });
  }
});

app.post("/getPostResponseWithFilter/:batch_id", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const results = parseInt(req.query.results) || 10;
  const { batch_id } = req.params;

  try {
    let data = [];
    let totalCount = 0;
    switch (true) {
      case batch_id?.includes(batchId.bharatPe):
        data = await BharatPeData.find({
          imei: req.body.value,
        })
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await BharatPeData.count({
          imei: req.body.value,
        });
        break;
      case batch_id?.includes(batchId.hdfc):
        data = await HDFCData.find({
          imei: req.body.value,
        })
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await HDFCData.count({
          imei: req.body.value,
        });
        break;
      default:
        data = await PostApiData.find({
          imei: req.body.value,
        })
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await PostApiData.count({
          imei: req.body.value,
        });
    }
    return res.status(200).json({ results: data, totalCount });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/getPostResponseFilter/:batch_id", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const results = parseInt(req.query.results) || 10;
  const { batch_id } = req.params;
  try {
    let data = [];
    let totalCount = 0;
    switch (true) {
      case batch_id?.includes(batchId.bharatPe):
        data = await BharatPeData.find({
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        })
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await BharatPeData.count({
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        });
        break;
      case batch_id?.includes(batchId.hdfc):
        data = await HDFCData.find({
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        })
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await HDFCData.count({
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        });
        break;
      default:
        data = await PostApiData.find({
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        })
          .skip((page - 1) * results)
          .limit(results);
        totalCount = await PostApiData.count({
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate),
          },
        });
        break;
    }
    return res.status(200).json({ results: data, totalCount });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getPostResponseLoadTest", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const results = parseInt(req.query.results) || 10;

  try {
    const data = await PostApiData.find()
      .skip((page - 1) * results)
      .limit(results);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/deletePostResponse", async (req, res) => {
  try {
    const result = await PostApiData.findByIdAndDelete(req.body.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./download");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

var uploadPostData = multer({ storage: storage }).single("myfile");

app.post("/UploadFiles", async (req, res) => {
  try {
    uploadPostData(req, res, function (err) {
      if (err) {
        return res.end(err);
      }
      const result = UploadFiles.create({
        name: req.body.name,
        link: req.file.filename,
      });
      res.end("File is uploaded successfully!");
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./download");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

var storage2 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

var storage3 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./testingImages");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

var uploadPostData = multer({ storage: storage }).single("myfile");
var uploadPostData2 = multer({ storage: storage2 }).single("myfile");
var uploadTestingImages = multer({ storage: storage3 }).single("image");

app.get("/getUploadFiles", async (req, res) => {
  try {
    const result = await UploadFiles.find({});

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/deleteUploadFiles", async (req, res) => {
  try {
    const result = await UploadFiles.findByIdAndDelete(req.body.id);

    const filePath = `./download/${req.body.name}`;
    fs.unlink(filePath);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/CreateUser", async (req, res) => {
  try {
    uploadPostData2(req, res, function (err) {
      if (err) {
        return res.end(err);
      }
      const result = Users.create({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        image: req.file.filename,
      });
      res.end("File is uploaded successfully!");
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/GetUserList", async (req, res) => {
  try {
    const result = await Users.find({});

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/deleteUser", async (req, res) => {
  try {
    const result = await Users.findByIdAndDelete(req.body.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/UpdateUser", async (req, res) => {
  try {
    uploadPostData2(req, res, async function (err) {
      if (req.body.myfile === "false") {
        let user = await Users.findOneAndUpdate(
          { _id: req.body.id },
          {
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
          }
        );
        res.status(200).json(user);
      } else {
        let user = await Users.findOneAndUpdate(
          { _id: req.body.id },
          {
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            image: req.file.filename,
          }
        );
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Role start

app.post("/CreateRole", async (req, res) => {
  try {
    const result = await Role.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getRole", async (req, res) => {
  try {
    const result = await Role.find({});

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/deleteRole", async (req, res) => {
  try {
    const result = await Role.findByIdAndDelete(req.body.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/UpdateRole", async (req, res) => {
  try {
    uploadPostData2(req, res, async function (err) {
      let role = await Role.findOneAndUpdate(
        { _id: req.body.id },
        {
          name: req.body.name,
          access: req.body.access,
        }
      );
      res.status(200).json(role);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Role end

// Line Manage

app.post("/LoginLine", async (req, res) => {
  try {
    const result = await LineLogs.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/LogoutLine", async (req, res) => {
  try {
    let role = await LineLogs.findOneAndUpdate(
      { _id: req.body.id },
      {
        name: req.body.name,
        LogedOutTime: req.body.time,
        isLogedIn: false,
      }
    );
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Line Manage

// Batch Manage
app.post("/saveBatch", async (req, res) => {
  try {
    const result = await BatchData.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMasterCartonNumber", async (req, res) => {
  try {
    let result = await MasterCarton.find({
      batch_name: req.body.batch_name,
    });

    res.status(200).json(result.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getBatch", async (req, res) => {
  try {
    const currentDate = moment().startOf("day");

    const batch_data = await BatchData.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
      type: "OQC",
    });

    const testting = await SandBoxOQCL.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
    });

    const masterCarton = await MasterCarton.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
    });

    res.status(200).json({ batch_data, testting, masterCarton });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getBatchQH", async (req, res) => {
  try {
    const currentDate = moment(new Date(req.body.date)).startOf("day");

    const batch_data = await BatchData.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
      type: "OQC",
    });

    const testting = await SandBoxOQCL.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
    });

    const masterCarton = await MasterCarton.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
    });

    res.status(200).json({ batch_data, testting, masterCarton });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.post("/getBatchforExcel", async (req, res) => {
//   try {
//     const currentDate = moment().startOf("day");

//     const testting = await SandBoxOQCL.find({
//       createdAt: {
//         $gte: currentDate.toDate(),
//         $lt: moment(currentDate).endOf("day").toDate(),
//       },
//     });

//     const masterCarton = await MasterCarton.find({
//       createdAt: {
//         $gte: currentDate.toDate(),
//         $lt: moment(currentDate).endOf("day").toDate(),
//       },
//     });

// const uniqueUserIds = new Set(result.map((record) => record.user_id));
// const userNames = await Users.find({
//   _id: { $in: Array.from(uniqueUserIds) },
// }).lean(); // Use lean() to convert documents to plain objects

// const userNameMap = {};
// userNames.forEach((user) => {
//   userNameMap[user._id] = `${user.f_name} ${user.l_name}`;
// });

// const resultWithUsernames = result.map((record) => ({
//   ...record.toObject(), // Convert Mongoose document to plain object
//   username: userNameMap[record.user_id],
// }));

//     res.status(200).json({ testting, masterCarton });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.post("/deletBatch", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await BatchData.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Batch Manage

// MasterCarton
app.post("/AddMasterCarton", async (req, res) => {
  try {
    const result = await MasterCarton.create(req.body);

    const result2 = await BatchData.findOneAndUpdate(
      {
        batch_name: req.body.batch_name,
      },
      {
        total_no: req.body.total_no,
      }
    );

    res.status(200).json(result2);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMasterCarton", async (req, res) => {
  try {
    const result = await MasterCarton.find({
      batch_name: req.body.batch_name,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMasterCartonIMEI", async (req, res) => {
  try {
    const result = await MasterCarton.find({
      masterCartonNumber: req.body.imei,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/marked-checked", async (req, res) => {
  try {
    const result = await MasterCarton.findOneAndUpdate(
      {
        masterCartonNumber: req.body.imei,
      },
      {
        check_status: true,
      }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getMasterCartonAll", async (req, res) => {
  try {
    const result = await MasterCarton.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMasterCartonEMI", async (req, res) => {
  try {
    const result = await MasterCarton.find({
      masterCartonNumber: req.body.masterCartonNumber,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/deleteMasterCarton", async (req, res) => {
  try {
    const result = await MasterCarton.findByIdAndDelete(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/updateOQCTest", async (req, res) => {
  try {
    const check = await SandBoxOQCL.find({
      mc_imei_code: req.body.mc_imei_code,
    });

    if (check.length == 0) {
      const result = await SandBoxOQCL.create(req.body);
      res.status(200).json(result);
    } else {
      const result = await SandBoxOQCL.findOneAndUpdate(
        { mc_imei_code: req.body.mc_imei_code },
        req.body
      );
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/updateOQCTestSingle", async (req, res) => {
  try {
    const result = await MasterCarton.find({
      masterCartonNumber: req.body.mc_imei_code,
    });

    let details = result[0].details;

    details[0].mono_carton.map((x) => {
      if (x.imei === req.body.ref_id) {
        x.defect = req.body.totalDefeact;
      }
    });

    let result2 = await MasterCarton.findOneAndUpdate(
      {
        masterCartonNumber: req.body.mc_imei_code,
      },
      { details }
    );

    const check = await SandBoxOQCLSingle.find({
      mc_imei_code: req.body.mc_imei_code,
      ref_id: req.body.ref_id,
    });
    if (check.length == 0) {
      const result = await SandBoxOQCLSingle.create(req.body);
      res.status(200).json(result);
    } else {
      const result = await SandBoxOQCLSingle.findOneAndUpdate(
        { mc_imei_code: req.body.mc_imei_code, ref_id: req.body.ref_id },
        req.body
      );
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getOQCTestSingle", async (req, res) => {
  try {
    const result = await SandBoxOQCLSingle.find({
      mc_imei_code: req.body.mc_imei_code,
      ref_id: req.body.ref_id,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getOQCTest", async (req, res) => {
  try {
    const result = await SandBoxOQCL.find({
      mc_imei_code: req.body.mc_imei_code,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/uploadTestingImages", async (req, res) => {
  try {
    uploadTestingImages(req, res, function (err) {
      if (err) {
        return res.end("err");
      } else {
        res.status(200).json(req.file.filename);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MasterCarton

// Settings
app.post("/updateWebSetting", async (req, res) => {
  try {
    var result = await websetting.find().sort({ $natural: -1 }).limit(1);
    if (result.length != 0) {
      let id = result[0]["_id"];
      await websetting.findOneAndUpdate(
        { _id: id },
        {
          token: req.body.token,
        }
      );
      res.status(200).json(true);
    } else {
      const result = await websetting.create(req.body);
      res.status(200).json(true);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/updateAPIToken", async (req, res) => {
  try {
    var result = await websetting.find().sort({ $natural: -1 }).limit(1);
    if (result.length != 0) {
      let id = result[0]["_id"];
      await websetting.findOneAndUpdate(
        { _id: id },
        {
          token: req.body.token,
        }
      );
      res.status(200).json(true);
    } else {
      const result = await websetting.create(req.body);
      res.status(200).json(true);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getWebSetting", async (req, res) => {
  try {
    const result = await websetting.find({}).sort({ _id: -1 }).limit(1);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/generateKey", async (req, res) => {
  try {
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: "top secret",
        },
      },
      async (err, publicKey, privateKey) => {
        var result = await websetting.find().sort({ $natural: -1 }).limit(1);
        if (result.length != 0) {
          let id = result[0]["_id"];
          await websetting.findOneAndUpdate(
            { _id: id },
            {
              publicKey,
              privateKey,
            }
          );
          res.status(200).json(true);
        } else {
          const result = await websetting.create({
            publicKey,
            privateKey,
          });
          res.status(200).json(true);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const verifyToken = async (publicKey) => {
  const result = await websetting.find({}).sort({ _id: -1 }).limit(1);
  if (result.length != 0) {
    var privateKey = {
      key: result[0].privateKey,
      passphrase: "top secret",
    };
    var signer = crypto.createSign("sha256");
    var sign = signer.sign(privateKey, "base64");
    var verifier = crypto.createVerify("sha256");
    var ver = verifier.verify(publicKey, sign, "base64");
    return ver;
  }
};

app.post("/checkKeyTest", async (req, res) => {
  try {
    // res.status(200).json(req.body.publicKey);
    const result = await websetting.find({}).sort({ _id: -1 }).limit(1);

    if (result.length != 0) {
      var privateKey = {
        key: result[0].privateKey,
        passphrase: "top secret",
      };
      var publicKey = req.body.publicKey;

      var signer = crypto.createSign("sha256");

      var sign = signer.sign(privateKey, "base64");

      var verifier = crypto.createVerify("sha256");

      var ver = verifier.verify(publicKey, sign, "base64");

      res.status(200).json(ver);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/addForReview", async (req, res) => {
  try {
    const result = await ForReview.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getItemsForReview", async (req, res) => {
  try {
    const result = await ForReview.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.post("addForReview", async (req, res) => {
//   try {
//     const result = await ForReview.create(req.body);
//     res.status(200).json(true);
//   } catch (error) {
//     res.status(500).json({ error: "Error retrieving table data." });
//   }
// });

app.post("/empLogin", async (req, res) => {
  try {
    const result = await LineLogs.aggregate([
      {
        $lookup: {
          //searching collection name
          from: "users",
          //setting variable [searchId] where your string converted to ObjectId
          let: { searchId: { $toObjectId: "$user_id" } },
          //search query with our [searchId] value
          pipeline: [
            //searching [searchId] value equals your field [_id]
            { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
            { $project: { _id: 0, f_name: 1, l_name: 1 } },
          ],
          as: "UserDetail",
        },
      },
    ]);

    // result;

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// Settings

// Jitendra API

app.delete("/delete_batch", async (req, res) => {
  try {
    const { batch_id, batch_number, line_name } = req.body;
    const result = await BatchData.deleteOne({ _id: batch_id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Batch not found." });
    }
    const resultRef = await IMEINumberLQCInternalVuales.deleteMany({
      batch_number: batch_number,
      line_name: line_name,
    });
    const resultSecondTbl = await IMEINumberLQC.deleteMany({
      batch_number: batch_number,
      line_name: line_name,
    });
    res.status(200).json({
      message: "Items deleted successfully",
      deletedBatchCount: result.deletedCount,
      deletedRefCount: resultRef.deletedCount,
      deletedSecondTblCount: resultSecondTbl.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/saveIMEI", async (req, res) => {
  try {
    const {
      IMEI,
      line_name,
      type,
      batch_number,
      IMEI_status,
      user_id,
      Soundboxlinequalitychecklist,
    } = req.body;
    const primaryResult = await IMEINumberLQC.create({
      IMEI,
      line_name,
      type,
      batch_number,
      user_id,
      IMEI_status,
    });

    if (primaryResult) {
      const secondaryResult = await IMEINumberLQCInternalVuales.create({
        ref_IMEI: IMEI,
        line_name,
        type,
        batch_number,
        IMEI_status,
        user_id,
        Soundboxlinequalitychecklist,
      });

      res.status(200).json(secondaryResult);
    } else {
      res
        .status(500)
        .json({ message: "Primary table data could not be saved." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getIMEI", async (req, res) => {
  try {
    const result = await IMEINumberLQC.find({
      batch_number: req.body.batch_number,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/delete_IMEI", async (req, res) => {
  try {
    const { ids, ref_IMEI, batch_number } = req.body;
    const result = await IMEINumberLQC.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Batch not found." });
    }
    const resultRef = await IMEINumberLQCInternalVuales.deleteMany({
      ref_IMEI: { $in: ref_IMEI },
    });

    res
      .status(200)
      .json({ message: "Items deleted successfully", result, resultRef });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/saveSoundboxlinequalitychecklist", async (req, res) => {
  try {
    const postData = req.body;
    const { ref_IMEI, batch_number } = postData;
    const existingEntry = await IMEINumberLQCInternalVuales.findOne({
      ref_IMEI,
      batch_number,
    });
    if (existingEntry) {
      await IMEINumberLQCInternalVuales.findOneAndUpdate(
        { ref_IMEI, batch_number },
        postData,
        { new: true }
      );
    } else {
      const newEntry = new IMEINumberLQCInternalVuales(postData);
      await newEntry.save();
    }
    res.status(200).json({ message: "Table data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving table data." });
  }
});

app.get("/getSoundboxlinequalitychecklist", (req, res) => {
  const { IMEINumber } = req.query;

  IMEINumberLQCInternalVuales.find({ ref_IMEI: IMEINumber })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});
app.post("/getBatchList", async (req, res) => {
  try {
    const currentDate = moment().startOf("day");
    const pipeline = [
      {
        $match: {
          line_name: req.body.line,
          createdAt: {
            $gte: currentDate.toDate(),
            $lt: moment(currentDate).endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: "$batch_number",
          count: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
          Soundboxlinequalitychecklist: {
            $first: "$Soundboxlinequalitychecklist",
          },
        },
      },
    ];
    const result = await IMEINumberLQCInternalVuales.aggregate(pipeline);
    const batchCounts = result.map((item) => ({
      BatchID: item._id,
      NumberOfSoundBoxAdded: item.count,
      createdAt: item.createdAt,
      Soundboxlinequalitychecklist: item.Soundboxlinequalitychecklist,
    }));

    res.status(200).json(batchCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getIMEIList", async (req, res) => {
  try {
    const postData = req.body;
    const { line, BatchNumber } = postData;

    const existingEntry = await IMEINumberLQCInternalVuales.find({
      line_name: line,
      batch_number: BatchNumber,
    });

    if (existingEntry) {
      res.status(200).json(existingEntry);
    } else {
      res.status(404).json({ message: "Entry not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving table data." });
  }
});
app.post("/getIMEIListPH", async (req, res) => {
  try {
    const postData = req.body;
    const { line, BatchNumber, user_id } = postData;

    const existingEntry = await IMEINumberLQCInternalVuales.find({
      line_name: line,
      batch_number: BatchNumber,
      user_id: user_id,
    });

    if (existingEntry) {
      res.status(200).json(existingEntry);
    } else {
      res.status(404).json({ message: "Entry not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving table data." });
  }
});

var storage3 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./testingImages");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

var uploadTestingImages = multer({ storage: storage3 }).single("image");

app.post("/uploadTestingImages", async (req, res) => {
  try {
    uploadTestingImages(req, res, function (err) {
      if (err) {
        return res.end("err");
      } else {
        res.status(200).json(req.file.filename);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getAllDefectedSoundboxlinequalitychecklist", async (req, res) => {
  try {
    const { line_name } = req.query;
    const result = await IMEINumberLQCInternalVuales.find({
      line_name: line_name,
      "Soundboxlinequalitychecklist.status": "NOT OK",
    });
    const filteredResult = result.map((item) => ({
      ...item.toObject(),
      Soundboxlinequalitychecklist: item.Soundboxlinequalitychecklist.filter(
        (entry) => entry.status === "NOT OK"
      ),
    }));

    res.status(200).json(filteredResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/updateData", async (req, res) => {
  try {
    const { Soundboxlinequalitychecklist } = req.body;
    for (const item of Soundboxlinequalitychecklist) {
      await IMEINumberLQCInternalVuales.updateOne(
        { _id: item.id, "Soundboxlinequalitychecklist.lqcl": item.lqcl },
        {
          $set: {
            "Soundboxlinequalitychecklist.$.status": item.status,
            "Soundboxlinequalitychecklist.$.defect_category":
              item.defect_category,
            "Soundboxlinequalitychecklist.$.remarks": item.remarks,
            "Soundboxlinequalitychecklist.$.analysis_details":
              item.analysis_details,
          },
        }
      );
    }

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Error updating data" });
  }
});

app.get("/getAllDefectedSoundbox", async (req, res) => {
  try {
    const result = await IMEINumberLQCInternalVuales.find({
      "Soundboxlinequalitychecklist.status": "NOT OK",
    });
    const filteredResult = result.map((item) => ({
      ...item.toObject(),
      Soundboxlinequalitychecklist: item.Soundboxlinequalitychecklist.filter(
        (entry) => entry.status === "NOT OK"
      ),
    }));

    res.status(200).json(filteredResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/getAllCheckedSoundboxlist", async (req, res) => {
  try {
    const result = await IMEINumberLQCInternalVuales.find({});

    const filteredResult = result
      .map((item) => ({
        ...item.toObject(),
        Soundboxlinequalitychecklist: item.Soundboxlinequalitychecklist.filter(
          (entry) =>
            entry.analysis_details && entry.analysis_details.trim() !== ""
        ),
      }))
      .filter((item) => item.Soundboxlinequalitychecklist.length > 0);

    res.status(200).json(filteredResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getAllCheckedSoundboxlistPH", async (req, res) => {
  try {
    let startDate, endDate;

    const duration = req.query.duration;

    if (duration === "current_month") {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    } else if (duration === "current_year") {
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
    } else {
      startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    }

    const result = await IMEINumberLQCInternalVuales.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$Soundboxlinequalitychecklist",
      },
      {
        $match: {
          "Soundboxlinequalitychecklist.analysis_details": { $ne: "" },
          "Soundboxlinequalitychecklist.status": "OK",
        },
      },
      {
        $group: {
          _id: "$_id",
          Soundboxlinequalitychecklist: {
            $push: "$Soundboxlinequalitychecklist",
          },
          batch_number: { $first: "$batch_number" },
          line_name: { $first: "$line_name" },
          ref_IMEI: { $first: "$ref_IMEI" },
        },
      },
      {
        $match: {
          Soundboxlinequalitychecklist: { $gt: [] },
        },
      },
      {
        $project: {
          _id: 0,
          batch_number: 1,
          line_name: 1,
          ref_IMEI: 1,
          Soundboxlinequalitychecklist: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

// IQC form ApI Start Here...

app.post("/LoginSystem", async (req, res) => {
  try {
    const result = await SystemLogs.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/LogoutSystem", async (req, res) => {
  try {
    let role = await SystemLogs.findOneAndUpdate(
      { _id: req.body.id },
      {
        name: req.body.name,
        LogedOutTime: req.body.time,
        isLogedIn: false,
      }
    );
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/saveVendor", async (req, res) => {
  try {
    const { vendor_name } = req.body;
    if (!vendor_name) {
      return res.status(400).json({ message: "Vendor name is required." });
    }
    const newVendor = new VendorModel({ vendor_name });
    const result = await newVendor.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getVendorinchecked", async (req, res) => {
  try {
    const currentDate = moment().startOf("day");
    const result = await VendorModel.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getVendorincheckedHQ", async (req, res) => {
  try {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    const result = await VendorModel.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getVendor", async (req, res) => {
  try {
    const currentDate = moment().startOf("day");
    const result = await VendorModel.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete_vendor", async (req, res) => {
  try {
    const { id, vendor_name } = req.body;
    const result = await VendorModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Vendor not found." });
    }
    const resultRef = await MaterialModel.deleteMany({
      vendor_name: vendor_name,
    });
    res.status(200).json({
      message: "Items deleted successfully",
      deletedVendorCount: result.deletedCount,
      deletedRefCount: resultRef.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/saveVendorName", async (req, res) => {
  try {
    const { vendor_name } = req.body;
    if (!vendor_name) {
      return res.status(400).json({ message: "Vendor name is required." });
    }
    const newVendor = new VendorName({ vendor_name });
    const result = await newVendor.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getVendorName", async (req, res) => {
  try {
    const result = await VendorName.find({});
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/saveMaterial", async (req, res) => {
  try {
    const { material_name, material_Id, vendor_name } = req.body;
    if (!material_name || !material_Id || !vendor_name) {
      return res
        .status(400)
        .json({ message: "Both material_name and material_Id are required." });
    }
    const newMaterial = new MaterialModel({
      material_name: material_name,
      vendor_name: vendor_name,
      material_Id: material_Id.key,
    });
    const result = await newMaterial.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMaterialchecked", async (req, res) => {
  try {
    const currentDate = moment().startOf("day");
    const result = await MaterialModel.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
      vendor_name: req.body.vendor_name,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMaterial", async (req, res) => {
  try {
    const currentDate = moment().startOf("day");
    const result = await MaterialModel.find({
      createdAt: {
        $gte: currentDate.toDate(),
        $lt: moment(currentDate).endOf("day").toDate(),
      },
      vendor_name: req.body.vendor_name,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete_material", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await MaterialModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Material not found." });
    }
    res.status(200).json({
      message: "Items deleted successfully",
      deletedVendorCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/saveMaterialName", async (req, res) => {
  try {
    const postData = req.body;
    const { material_name, MaterialParameter, checked_qr_code } = postData;
    if (!postData) {
      return res.status(400).json({ message: "All Field are required." });
    }
    const newMaterial = await MaterialName.create({
      material_name,
      checked_qr_code,
      MaterialParameter,
    });

    res.status(200).json(newMaterial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getMaterialName", async (req, res) => {
  try {
    const result = await MaterialName.find({});
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/saveSample", async (req, res) => {
  try {
    const { Sample_id, material_id, vendor_name } = req.body;
    if (!Sample_id || !material_id || !vendor_name) {
      return res.status(400).json({ message: "All Data are required." });
    }

    const material = await MaterialName.findOne({ _id: material_id });
    if (!material) {
      return res
        .status(404)
        .json({ message: "Material not found with the given ID." });
    }

    const newSample = new SampleIdModel({
      Sample_id: Sample_id,
      material_id: material_id,
      vendor_name: vendor_name,
      material_name: material.material_name,
      checked_qr_code: material.checked_qr_code,
      MaterialParameter: material.MaterialParameter,
    });

    const savedSample = await newSample.save();
    res.status(200).json(savedSample);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getSample", async (req, res) => {
  try {
    const requestedDate = req.body.date;
    const startDate = new Date(requestedDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(requestedDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const result = await SampleIdModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      material_id: req.body.material_id,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/saveCheckLotMaterial", async (req, res) => {
  try {
    const lot_id = req.body.lot_id;
    let existingMaterial = await CheckLotModel.findOne({
      lot_id: lot_id,
    });

    if (existingMaterial) {
      Object.assign(existingMaterial, req.body);
      await existingMaterial.save();
      res.status(200).json(existingMaterial);
    } else {
      const newMaterial = await CheckLotModel.create(req.body);
      res.status(200).json(newMaterial);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getCheckLot", async (req, res) => {
  try {
    const requestedDate = req.body.date;
    const startDate = new Date(requestedDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(requestedDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const result = await CheckLotModel.find({
      updatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
      material_id: req.body.material_id,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getMaterialParameter", async (req, res) => {
  try {
    const result = await SampleIdModel.find({
      Sample_id: req.body.sample_id,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/saveMaterialParameter", async (req, res) => {
  try {
    const { parameter, spacification, inst_used, id, type, Sample_id } =
      req.body;
    const materialEntry = await MaterialName.findById(id);
    const materialSampleEntry = await SampleIdModel.findOne({
      material_id: id,
      Sample_id: Sample_id,
    });

    if (!materialEntry) {
      return res.status(404).json({ error: "Material entry not found" });
    }

    if (!materialSampleEntry) {
      return res.status(404).json({ error: "Material Id not found" });
    }

    const newMaterialParameter = {
      parameter,
      spacification: spacification,
      inst_used,
      actual: "",
      status: "OK",
      picture: "",
      remark: "",
      type,
    };

    materialEntry.MaterialParameter.push(newMaterialParameter);
    materialSampleEntry.MaterialParameter.push(newMaterialParameter);

    await materialEntry.save();
    await materialSampleEntry.save();

    res.status(200).json({ message: "Material parameter saved successfully" });
  } catch (error) {
    console.error("Error saving material parameter:", error);
    res.status(500).json({ error: "Error saving material parameter" });
  }
});

app.delete("/delete_parameter", async (req, res) => {
  try {
    const { id, parameter } = req.body;
    const resultRef = await MaterialName.updateMany(
      { _id: { $in: id } },
      { $pull: { MaterialParameter: { parameter: { $in: parameter } } } }
    );
    const resultfinalRef = await SampleIdModel.updateMany(
      { material_id: { $in: id } },
      { $pull: { MaterialParameter: { parameter: { $in: parameter } } } }
    );

    res.status(200).json({
      message: "MaterialParameter data deleted successfully",
      resultRef,
      resultfinalRef,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/updateParameters", async (req, res) => {
  try {
    const { MaterialParameter } = req.body;
    const bulkUpdateOps = [];

    for (const item of MaterialParameter) {
      const { parameter, sample_id } = item;
      const updateOp = {
        updateOne: {
          filter: {
            Sample_id: sample_id,
            "MaterialParameter.parameter": parameter,
          },
          update: { MaterialParameter },
        },
      };

      bulkUpdateOps.push(updateOp);
    }

    const result = await SampleIdModel.bulkWrite(bulkUpdateOps);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Table data updated successfully!" });
    } else {
      res.status(500).json({ error: "No records were updated." });
    }
  } catch (error) {
    console.error("Error updating table data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/updatematParameters", async (req, res) => {
  try {
    let materialParameters = req.body.MaterialParameter;
    if (!Array.isArray(materialParameters)) {
      materialParameters = [materialParameters];
    }

    const bulkUpdateOps = materialParameters.map((item) => {
      const {
        key,
        parameter,
        spacification,
        actual,
        status,
        picture,
        remark,
        sample_id,
        inst_used,
      } = item;

      return {
        updateOne: {
          filter: {
            Sample_id: sample_id,
            "MaterialParameter.parameter": parameter,
          },
          update: {
            $set: {
              "MaterialParameter.$.parameter": parameter,
              "MaterialParameter.$.spacification": spacification,
              "MaterialParameter.$.actual": actual,
              "MaterialParameter.$.status": status,
              "MaterialParameter.$.picture": picture,
              "MaterialParameter.$.remark": remark,
              "MaterialParameter.$.inst_used": inst_used,
            },
          },
        },
      };
    });

    const result = await SampleIdModel.bulkWrite(bulkUpdateOps);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Parameter(s) updated successfully!" });
    } else {
      res.status(500).json({ error: "No records were updated." });
    }
  } catch (error) {
    console.error("Error updating parameter:", error);
    res.status(500).json({ error: "Error updating parameter(s)." });
  }
});

app.put("/replaceMaterial", async (req, res) => {
  try {
    const materialId = req.body.material_id;
    const updatedData = req.body;

    const updatedMaterial = await MaterialName.findByIdAndUpdate(
      materialId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedMaterial) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found." });
    }

    res.status(200).json({
      success: true,
      message: "Material data updated successfully.",
      updatedMaterial,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/delete_SampleId", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await SampleIdModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Material not found." });
    }
    res.status(200).json({
      message: "Items deleted successfully",
      deletedVendorCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
app.get("/getAllDefectedmaterial", async (req, res) => {
  try {
    const result = await SampleIdModel.find({
      "MaterialParameter.status": "NOT OK",
    });
    const filteredResult = result.map((item) => ({
      ...item.toObject(),
      MaterialParameter: item.MaterialParameter.filter(
        (entry) => entry.status === "NOT OK"
      ),
    }));

    res.status(200).json(filteredResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/updateLot", async (req, res) => {
  try {
    const { lot_id, rejected_lot_remark } = req.body;
    const result = await CheckLotModel.findOneAndUpdate(
      { lot_id: lot_id },
      {
        rejected_lot_remark: rejected_lot_remark,
        rejected_status: true,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Lot not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating lot:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getrejectedLot", async (req, res) => {
  try {
    const result = await CheckLotModel.find({
      rejected_status: "true",
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getacceptedLot", async (req, res) => {
  try {
    const result = await CheckLotModel.find({
      rejected_status: "false",
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/updateRejectedStatus", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await CheckLotModel.findOneAndUpdate(
      { _id: id },
      {
        rejected_lot_remark: "This lot is Restored",
        rejected_status: false,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Lot not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating lot:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/update_QRfunctionality", async (req, res) => {
  try {
    const { Sample_id } = req.body.data;
    const result = await SampleIdModel.findOneAndUpdate(
      { Sample_id: Sample_id },
      { checked_qr_code: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Sample Id not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating QR functionality:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getLotAndDefectedMaterialOfThisWeek", async (req, res) => {
  try {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

    const lotResult = await CheckLotModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLotSize: { $sum: { $toInt: "$lot_size" } },
        },
      },
    ]);

    const totalLotSize = lotResult.length > 0 ? lotResult[0].totalLotSize : 0;

    const defectedMaterialResult = await SampleIdModel.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $unwind: "$MaterialParameter",
      },
      {
        $match: {
          "MaterialParameter.status": "NOT OK",
        },
      },
      {
        $group: {
          _id: null,
          totalDefectedItem: { $sum: 1 },
        },
      },
    ]);
    // Calculate the ratio as a percentage

    const totalDefectedItem =
      defectedMaterialResult.length > 0
        ? defectedMaterialResult[0].totalDefectedItem
        : 0;
    const ratioPercentage = (totalDefectedItem / totalLotSize) * 100;
    const roundedPercentage = Math.round(ratioPercentage * 100) / 100;

    res
      .status(200)
      .json({ totalLotSize, totalDefectedItem, roundedPercentage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getAddedSoundBoxListPH", async (req, res) => {
  try {
    let startDate, endDate;

    const duration = req.query.duration;

    if (duration === "current_month") {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    } else if (duration === "current_year") {
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
    } else {
      startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    }

    const lotResult = await IMEINumberLQCInternalVuales.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$batch_number",
          count: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    const batchCounts = lotResult.reduce(
      (total, item) => total + item.count,
      0
    );

    const totalDefectedItem = await IMEINumberLQCInternalVuales.countDocuments({
      status: "NOT OK",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const ratioPercentage = (totalDefectedItem / batchCounts) * 100;
    const roundedPercentage = Math.round(ratioPercentage * 100) / 100;

    res.status(200).json({ batchCounts, totalDefectedItem, roundedPercentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getRemarkItemListPH", async (req, res) => {
  try {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    const okStatusResult = await IMEINumberLQCInternalVuales.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startDate,
            $lte: endDate,
          },
          "Soundboxlinequalitychecklist.status": "OK",
          "Soundboxlinequalitychecklist.analysis_details": { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$ref_IMEI",
        },
      },
      {
        $group: {
          _id: null,
          distinctOkCount: { $sum: 1 },
        },
      },
    ]);

    const notOkStatusResult = await IMEINumberLQCInternalVuales.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startDate,
            $lte: endDate,
          },
          "Soundboxlinequalitychecklist.status": "NOT OK",
          "Soundboxlinequalitychecklist.analysis_details": { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$ref_IMEI",
        },
      },
      {
        $group: {
          _id: null,
          distinctNotOkCount: { $sum: 1 },
        },
      },
    ]);

    const workingFineCount =
      okStatusResult.length > 0 ? okStatusResult[0].distinctOkCount : 0;
    const totalDamagedItem =
      notOkStatusResult.length > 0
        ? notOkStatusResult[0].distinctNotOkCount
        : 0;

    const ratioPercentage = (totalDamagedItem / workingFineCount) * 100;
    const roundedPercentage = Math.round(ratioPercentage * 100) / 100;

    res.status(200).json({
      workingFineCount,
      totalDamagedItem,
      roundedPercentage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getBatchListPH", async (req, res) => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
  try {
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$batch_number",
          count: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
          line_name: { $first: "$line_name" },
          user_id: { $first: "$user_id" },
          Soundboxlinequalitychecklist: {
            $first: "$Soundboxlinequalitychecklist",
          },
        },
      },
    ];
    const result = await IMEINumberLQCInternalVuales.aggregate(pipeline);
    const batchCounts = result.map((item) => ({
      BatchID: item._id,
      NumberOfSoundBoxAdded: item.count,
      createdAt: item.createdAt,
      line_name: item.line_name,
      user_id: item.user_id,
      Soundboxlinequalitychecklist: item.Soundboxlinequalitychecklist,
    }));

    res.status(200).json(batchCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getBatchListAllPH", async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          type: "LQC",
        },
      },
      {
        $group: {
          _id: {
            batch_number: "$batch_number",
          },
          count: { $sum: 1 },
          line_name: { $first: "$line_name" },
          user_id: { $first: "$user_id" },
          createdAt: { $first: "$createdAt" },
          Soundboxlinequalitychecklist: {
            $first: "$Soundboxlinequalitychecklist",
          },
        },
      },
      {
        $project: {
          BatchID: "$_id.batch_number",
          NumberOfSoundBoxAdded: "$count",
          line_name: 1,
          user_id: 1,
          createdAt: 1,
          Soundboxlinequalitychecklist: 1,
          _id: 0,
        },
      },
    ];

    const result = await IMEINumberLQCInternalVuales.aggregate(pipeline);

    const uniqueUserIds = new Set(result.map((record) => record.user_id));
    const userNames = await Users.find({
      _id: { $in: Array.from(uniqueUserIds) },
    });

    const userNameMap = {};
    userNames.forEach((user) => {
      userNameMap.username = `"${user.f_name} ${user.l_name}"`;
    });

    const resultWithUsernames = result.map((record) => ({
      ...record,
      Usernames: userNameMap.username.replace(/"/g, ""),
    }));

    res.status(200).json(resultWithUsernames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/getLinelogsEmpPH", async (req, res) => {
  const { createdAt, line_name, batch_id } = req.body;

  try {
    const result = await IMEINumberLQCInternalVuales.find({
      line_name: line_name,
      batch_number: batch_id,
      createdAt: {
        $gte: new Date(createdAt),
        $lt: moment(createdAt).endOf("day").toDate(),
      },
    });

    const LineLogsdata = await LineLogs.find({
      $and: [
        { line_name: line_name },
        { type: "LQC" },
        {
          createdAt: {
            $gte: new Date(createdAt),
            $lt: moment(createdAt).endOf("day").toDate(),
          },
        },
      ],
    });

    const uniqueUserIds = new Set(result.map((record) => record.user_id));
    const userNames = await Users.find({
      _id: { $in: Array.from(uniqueUserIds) },
    });

    const userNameMap = {};
    userNames.forEach((user) => {
      userNameMap[user._id] = `${user.f_name} ${user.l_name}`;
    });
    const LineLogsdataWithCount = LineLogsdata.map((record) => {
      const { user_id } = record;
      return {
        ...record.toObject(),
        count: result.filter((item) => item.user_id === user_id).length,
        batch_id: batch_id,
        username: userNameMap[user_id] || "Unknown",
      };
    });

    res.status(200).json(LineLogsdataWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getAllDefectedSoundboxlinequalitychecklistPH", async (req, res) => {
  try {
    const { line_name } = req.query;
    const result = await IMEINumberLQCInternalVuales.find({
      "Soundboxlinequalitychecklist.status": "NOT OK",
    });
    const filteredResult = result.map((item) => ({
      ...item.toObject(),
      Soundboxlinequalitychecklist: item.Soundboxlinequalitychecklist.filter(
        (entry) => entry.status === "NOT OK"
      ),
    }));

    res.status(200).json(filteredResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/logs", async (req, res) => {
  try {
    const result = await Log.find({});
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .json({ error: error?.message || "Error fetching logs" });
  }
});

app.use(errorLogger);
