import React, { useState } from "react";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard";
import LoginNew from "./Pages/User/Auth/LoginNew";
import ForgotPassword from "./Pages/User/Auth/ForgotPassword";
import OtpVerify from "./Pages/User/Auth/OtpVerify";
import ChangePasword from "./Pages/User/Auth/ChangePasword";
import Websetting from "./Pages/Websetting/Websetting";
import LayoutMain from "./Pages/LayoutMain";
import PostDataShow from "./Pages/PostData/PostDataShow";
import UploadData from "./Pages/UploadData/UploadData";
import ManageUser from "./Pages/User/UserAndRole/ManageUser";
import ManageRole from "./Pages/User/UserAndRole/ManageRole";
import MasterCartonOQC from "./Pages/Forms/OQC/MasterCartonOQC";
import CheckedOQC from "./Pages/Forms/OQC/CheckedOQC";
import ReviewStatusOQC from "./Pages/Forms/OQC/ReviewStatusOQC";
import AddMasterCartonOQC from "./Pages/Forms/OQC/AddMasterCartonOQC";
import SondBoxOQCList from "./Pages/Forms/OQC/SondBoxOQCList";
import SoundBoxLQCList from "./Pages/Forms/LQC/SoundBoxLQCList";
import ReviewStatusLQC from "./Pages/Forms/LQC/ReviweStatusLQC";
import AddSoundLQC from "./Pages/Forms/LQC/AddSoundLQC";
import SoundBoxLineChekList from "./Pages/Forms/LQC/SoundBoxLineChekList";
import SoundBoxLQCCcjekList from "./Pages/Forms/LQC/SoundBoxLQCCheckList";
import CheckListedSoundBoxLQC from "./Pages/Forms/LQC/CheckListedSoundBoxLQC";
import MonoCartonSingleTesting from "./Pages/Forms/OQC/OQCTestList/MonoCartonSingleTesting";
import MasterCartonCheckListOQC from "./Pages/Forms/OQC/Checked/MasterCartonCheckListOQC";
import Dashboard_qh from "./Pages/Forms/QuailtyHead/Dashboard_qh";
import MasterCartonBatchList_qc from "./Pages/Forms/QuailtyHead/MasterCartonBatchList_qc";
import EmployeeLoginList_qh from "./Pages/Forms/QuailtyHead/EmployeeLoginList_qh";
import ListedMaterCarton_qh from "./Pages/Forms/QuailtyHead/ListedMaterCarton_qh";
import SoundBoxOutgoingQualityChecklist_qh from "./Pages/Forms/QuailtyHead/SoundBoxOutgoingQualityChecklist_qh";
import Review_qh from "./Pages/Forms/QuailtyHead/Review_qh";
import Incoming_materiallist from "./Pages/Forms/IQC/Incoming_materiallist";
import AddMaterialList from "./Pages/Forms/IQC/AddMaterialList";
import CheckMaterialList from "./Pages/Forms/IQC/CheckMaterialList";
import IQCChecked from "./Pages/Forms/IQC/IQCChecked";
import IQCCheckedMaterail from "./Pages/Forms/IQC/IQCCheckedMaterial";
import ReviewStatusIQC from "./Pages/Forms/IQC/ReviewStatusIQC";
import RejectedMaterial from "./Pages/Forms/IQC/RejectedMaterial";
import ShowDefectedItemList from "./Pages/Forms/Rework/ShowDefectedItemList";
import ReworkCheckList from "./Pages/Forms/Rework/ReworkCheckList";
import QrTest from "./test/QrTest";
import ReviewStatusIQCQH from "./Pages/Forms/QuailtyHead/ReviewStatusIQCQH";
import IQCCheckedHQ from "./Pages/Forms/QuailtyHead/IQCCheckedHQ";
import Dashboard_ph from "./Pages/Forms/ProductionHead/Dashboard_ph";
import SoundBoxLQCCheckListPH from "./Pages/Forms/ProductionHead/SoundBoxLQCCheckListPH";
import CheckListedSoundBoxLQCPH from "./Pages/Forms/ProductionHead/CheckListedSoundBoxLQCPH";
import SoundBoxLineChekListPH from "./Pages/Forms/ProductionHead/SoundBoxLineChekListPH";
import ReviewStatusLQCPH from "./Pages/Forms/ProductionHead/ReviweStatusLQCPH";
import SoundBoxLQCCcjekListAllPH from "./Pages/Forms/ProductionHead/SoundBoxLQCCheckListAllPH";
import ReworkCheckListPH from "./Pages/Forms/ProductionHead/ReworkCheckListPH";
import AcceptedMaterial from "./Pages/Forms/IQC/AcceptedMaterial";
import EmployeeLoginDetailsPH from "./Pages/Forms/ProductionHead/EmployeeLoginDetailsPH";
import CheckListedSingleSoundBoxLQCPH from "./Pages/Forms/ProductionHead/CheckListedSingleSoundBoxLQCPH";
import PostDataShowRead from "./Pages/PostData/PostDataShowRead";
import PostDataApiLoadTest from "./Pages/PostData/PostDataApiLoadTest";
import DataResultDashboard from "./Pages/DataResult/DataResultDashboard";
const routerAdmin = createHashRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<LoginNew />}></Route>
      <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
      <Route path="/otpVerify" element={<OtpVerify />}></Route>
      <Route path="/changePassword" element={<ChangePasword />}></Route>
      <Route path="/QrTest" element={<QrTest />}></Route>

      <Route element={<LayoutMain />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ManageUser" element={<ManageUser />} />
        <Route path="/ManageRole" element={<ManageRole />} />
        <Route path="/settings" element={<Websetting />} />
        <Route path="/PostDataShow/:batch_id" element={<PostDataShow />} />
        <Route path="PostApiRead" element={<PostDataShowRead />} />
        <Route path="PostDataApiLoadTest" element={<PostDataApiLoadTest />} />
        <Route path="FileUpload" element={<UploadData />} />
        {/* Form Start */}
        {/* OQC */}
        <Route path="MasterCartonOQC" element={<MasterCartonOQC />} />
        <Route path="CheckedOQC" element={<CheckedOQC />} />
        <Route path="ReviewStatusOQC" element={<ReviewStatusOQC />} />
        <Route path="AddMasterCartonOQC" element={<AddMasterCartonOQC />} />
        <Route
          path="MasterCartonListOQC"
          element={<MasterCartonCheckListOQC />}
        />
        <Route path="SondBoxOQCList/:imei" element={<SondBoxOQCList />} />
        <Route
          path="MonoCartonSingleTesting/:imei/:id"
          element={<MonoCartonSingleTesting />}
        />
        {/* OQC */}
        {/* LQC */}
        <Route path="sound_box" element={<SoundBoxLQCList />} />
        <Route path="lqc_reviewStatus" element={<ReviewStatusLQC />} />
        <Route path="AddSoundLQC/:batch_number" element={<AddSoundLQC />} />
        <Route
          path="line_quality_check_list/:IMEI_number/:batch_number"
          element={<SoundBoxLineChekList />}
        />
        <Route path="/Check_list" element={<SoundBoxLQCCcjekList />} />
        <Route
          path="/Check_listed_soundbox/:batch_number"
          element={<CheckListedSoundBoxLQC />}
        />
        <Route path="/rework_soundbox" element={<ShowDefectedItemList />} />
        <Route path="/rework_checklist" element={<ReworkCheckList />} />
        {/* LQC */}
        {/* IQC Form Start Here */}
        <Route path="/incoming_material" element={<Incoming_materiallist />} />
        <Route
          path="/AddMaterialIQC/:vendor_name"
          element={<AddMaterialList />}
        />
        <Route
          path="/check_Material/:material_id/:material_name/:vendor_name/:date"
          element={<CheckMaterialList />}
        />
        <Route path="/IQC_checked" element={<IQCChecked />} />
        <Route
          path="/Iqc_checkedMaterail/:vendor_name"
          element={<IQCCheckedMaterail />}
        />
        <Route path="iqc_reviewStatus" element={<ReviewStatusIQC />} />
        <Route path="iqc_rejectedmaterial" element={<RejectedMaterial />} />
        <Route path="iqc_acceptedmaterial" element={<AcceptedMaterial />} />
        {/* IQC Form End Here */}
        {/* QH */}
        <Route path="/Dashboard_qh" element={<Dashboard_qh />} />
        <Route
          path="/MasterCartonBatchList_qc"
          element={<MasterCartonBatchList_qc />}
        />
        <Route
          path="/EmployeeLoginList_qh"
          element={<EmployeeLoginList_qh />}
        />
        <Route
          path="/ListedMaterCarton_qh"
          element={<ListedMaterCarton_qh />}
        />
        <Route
          path="/SoundBoxOutgoingQualityChecklist_qh"
          element={<SoundBoxOutgoingQualityChecklist_qh />}
        />
        <Route path="/Review_qh" element={<Review_qh />} />
        //Update By Jitendra Singh Start Here
        <Route path="iqc_reviewStatusHQ" element={<ReviewStatusIQCQH />} />
        <Route path="/IQC_checkedHQ" element={<IQCCheckedHQ />} />
        {/* QH */}
        //Update By Jitendra Singh End Here
        {/* PH */}
        <Route path="/dashboard_ph" element={<Dashboard_ph />} />
        //Update By Jitendra Singh Start Here
        <Route
          path="/Check_listed_soundboxPH/:batch_number/:line_name"
          element={<CheckListedSoundBoxLQCPH />}
        />
        <Route path="/LQC_checkedPH" element={<SoundBoxLQCCheckListPH />} />
        <Route
          path="/LQC_checkedAllPH"
          element={<SoundBoxLQCCcjekListAllPH />}
        />
        <Route
          path="line_quality_check_listPH/:IMEI_number/:batch_number"
          element={<SoundBoxLineChekListPH />}
        />
        <Route path="lqc_reviewStatusPH" element={<ReviewStatusLQCPH />} />
        <Route path="rework_checklistPH" element={<ReworkCheckListPH />} />
        <Route
          path="getEmployee_deatils/:batch_id/:line_name/:date"
          element={<EmployeeLoginDetailsPH />}
        />
        <Route
          path="/Check_listed_Single_soundboxPH/:batch_number/:line_name/:user_id"
          element={<CheckListedSingleSoundBoxLQCPH />}
        />
        {/* PH} */}
        //Update By Jitendra Singh End Here
        {/* Form End */}
        {/* Data Processing Start */}
        <Route path="/ResultDashboard" element={<DataResultDashboard />} />
        {/* Data Processing End */}
      </Route>
    </Route>
  )
);

const RouterCom = () => {
  const [activeRoutes, setActiveRoutes] = useState(routerAdmin);

  return (
    <div>
      <RouterProvider router={activeRoutes} />
    </div>
  );
};

export default RouterCom;
