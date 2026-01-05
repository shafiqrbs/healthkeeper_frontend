import { Routes, Route } from "react-router-dom";
import Login from "@modules/auth/Login";
import Layout from "@components/layout/Layout";

import VendorIndex from "@modules/core/vendor/VendorIndex";
import DomainIndex from "@modules/domain/domain/DomainIndex";
import Sitemap from "@modules/sitemap/SitemapIndex";
import DomainConfigurationIndex from "@modules/domain/configuration/ConfigurationIndex";
import DomainUserIndex from "@modules/domain/master-user/DomainUserIndex";
import HospitalConfigIndex from "@modules/settings/HospitalConfigIndex";
import PrescriptionIndex from "@modules/hospital/prescription";
import PrescriptionOpd from "@modules/hospital/prescription/opd";
import VisitIndex from "@modules/hospital/visit";
import ParticularIndex from "@modules/hospital/core/particular";
import BedIndex from "@modules/hospital/core/bed";
import AdviceIndex from "@modules/hospital/core/advice";
import CabinIndex from "@modules/hospital/core/cabin";
import ParticularModeIndex from "@modules/hospital/core/particular-mode";
import ParticularTypeIndex from "@modules/hospital/core/particular-type";
import CategoryIndex from "@modules/hospital/core/category";
import StoreUserIndex from "@modules/hospital/core/store-user";
import StoreIndex from "@modules/core/store";
import EmergencyIndex from "@modules/hospital/emergency";
import VitalIndex from "@modules/hospital/patient-vital";
import NotFound from "@components/layout/NotFound";
import CustomerIndex from "@modules/hospital/customer";
import LabIndex from "@modules/hospital/lab";
import LabGroupIndex from "@modules/hospital/lab-group";
import FreePatientIndex from "@modules/hospital/free-patient";
import PatientWaiverIndex from "@modules/hospital/patient-waiver";
import PatientWaiverListIndex from "@modules/hospital/patient-waiver/waiver-list";
import PoliceCaseIndex from "@modules/hospital/police-case";
import LabInvestigationIndex from "@modules/hospital/lab/investigation";
import EpharmaIndex from "@modules/hospital/epharma";
import EpharmaIssueIndex from "@modules/hospital/epharma/issue";

import RequisitionIndex from "@modules/hospital/requisition";
import InvestigationIndex from "@modules/hospital/core/investigation";
import DashboardCoreIndex from "@modules/hospital/core/dashboard";
import ParticularMatrixIndex from "@modules/hospital/core/particular-matrix";
import OpdRoomIndex from "@modules/hospital/core/opd-room";
import DoctorDashboard from "@modules/hospital/doctor/dashboard";
import DoctorOpdIndex from "@modules/hospital/doctor/opd";
import PrescriptionBoardIndex from "@modules/hospital/prescription-board";
// import PharmacyIndex from "@modules/pharmacy/dashboard";
import PharmacyStockIndex from "@modules/pharmacy/stock";
import MedicineIndex from "@modules/pharmacy/medicine";
import GenericIndex from "@modules/pharmacy/generic";
import BillingIndex from "@modules/hospital/billing";
import BillingAdmissionIndex from "@modules/hospital/billing/admission";
import BillingIpdIndex from "@modules/hospital/billing/ipd";
import BillingRefundIndex from "@modules/hospital/billing/refund";
import BillingRefundHistoryIndex from "@modules/hospital/billing/refundHistory";
import BillingRefundIpdHistoryIndex from "@modules/hospital/billing/refundIpd";
import DoctorIndex from "@modules/hospital/core/doctor";
import NurseIndex from "@modules/hospital/core/nurse";
import LabUserIndex from "@modules/hospital/core/lab-user";
import DosageIndex from "@modules/hospital/core/medicine-dosage";
import ListIndex from "@modules/hospital/visit/list";
import ConfigurationIndex from "@modules/configuration";
import IpdIndex from "@modules/hospital/admission/ipdConfirm";
import IpdAdmissionIndex from "@modules/hospital/admission/ipdAdmission";
import AdmissionBedCabinIndex from "@modules/hospital/admission/bedCabin";
import IpdAdmittedIndex from "@modules/hospital/ipdAdmitted";
import UserIndex from "@modules/core/user";
import SettingIndex from "@modules/core/setting";
import TestRoute from "@components/layout/TestRoute";
import TreatmentTemplatesIndex from "@modules/hospital/core/treatmentTemplates";
import AdminLayout from "./common/components/layout/AdminLayout";
import TemplateIndex from "@modules/hospital/core/template";
import DoctorLayout from "@components/layout/DoctorLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import DischargeIndex from "@modules/hospital/discharge";
import FinalBillingIndex from "@modules/hospital/final-billing";
import PharmacyWorkorderIndex from "@modules/pharmacy/workorder";
import StoreIndentIndex from "@modules/pharmacy/store-indent";
import PharmacyWorkorderManage from "@modules/pharmacy/workorder/manage";
import IpdManageIndex from "@modules/hospital/ipdAdmitted/manage";
import DispenseIndex from "@modules/pharmacy/dispense";
import DispanseManage from "@modules/pharmacy/dispense/manage";
import StoreRequisitionIndex from "@modules/store/requisition";
import StoreRequisitionManage from "@modules/store/requisition/manage";
import StoreStockIndex from "@modules/store/stock";
import ReportsIndex from "@modules/hospital/reports";
import LoginJwt from "@modules/auth/LoginJwt.jsx";

function AppRoute() {
	return (
		<Routes>
			{/*<Route path="/login" element={<Login />} />*/}
			<Route path="/login" element={<LoginJwt />} />
			<Route path="/" element={<Layout />}>
				<Route path="core/">
					<Route path="user" element={<UserIndex />} />
					<Route path="user/:id" element={<UserIndex mode="edit" />} />
					<Route path="setting" element={<SettingIndex />} />
					<Route path="setting/:id" element={<SettingIndex mode="edit" />} />
					<Route path="store" element={<StoreIndex />} />
					<Route path="store/:id" element={<StoreIndex mode={"edit"} />} />
					<Route path="vendor" element={<VendorIndex />} />
					<Route path="vendor/:id" element={<VendorIndex mode="edit" />} />
				</Route>
				<Route path="/domain/">
					<Route path="" element={<DomainIndex />} />
					<Route path="edit/:id" element={<DomainIndex mode="edit" />} />
					<Route path="config/:id" element={<DomainConfigurationIndex />} />
					<Route path="user" element={<DomainUserIndex />} />
				</Route>

				<Route path="/pharmacy/core/">
					<Route
						path="medicine"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"pharmacy_operator",
									"pharmacy_pharmacist",
									"pharmacy_manager",
									"pharmacy_doctor",
								]}
							>
								<MedicineIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="medicine/:id"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"pharmacy_operator",
									"pharmacy_pharmacist",
									"pharmacy_manager",
									"pharmacy_doctor",
								]}
							>
								<MedicineIndex mode="edit" />
							</ProtectedRoute>
						}
					/>
					<Route
						path="generic"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"pharmacy_operator",
									"pharmacy_pharmacist",
									"pharmacy_manager",
									"pharmacy_doctor",
								]}
							>
								<GenericIndex />
							</ProtectedRoute>
						}
					/>
					<Route path="generic/:id" element={<GenericIndex mode="edit" />} />
					<Route path="stock" element={<PharmacyStockIndex />} />
					<Route path="workorder" element={<PharmacyWorkorderIndex />} />
					<Route path="store-indent" element={<StoreIndentIndex />} />
					<Route path="store-indent/:id" element={<StoreIndentIndex mode={"edit"} />} />
					<Route path="workorder/manage" element={<PharmacyWorkorderManage />} />
					<Route path="workorder/manage/:id" element={<PharmacyWorkorderManage mode="edit" />} />
					<Route path="dispense">
						<Route path="" element={<DispenseIndex />} />
						<Route path="manage" element={<DispanseManage />} />
						<Route path="manage/:id" element={<DispanseManage mode="edit" />} />
					</Route>
				</Route>
				<Route path="/store/">
					<Route path="requisition" element={<StoreRequisitionIndex />} />
					<Route path="requisition/manage" element={<StoreRequisitionManage />} />
					<Route path="requisition/manage/:id" element={<StoreRequisitionManage mode="edit" />} />
					<Route path="stock" element={<StoreStockIndex />} />
				</Route>

				<Route path="/hospital/">
					<Route path="visit">
						<Route
							index
							element={
								<ProtectedRoute
									roles={["role_domain", "admin_administrator", "operator_opd", "operator_manager"]}
								>
									<VisitIndex />
								</ProtectedRoute>
							}
						/>
						<Route path="list" element={<ListIndex />} />
					</Route>

					<Route path="ipd">
						<Route
							index
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_ipd"]}>
									<IpdIndex />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="discharge">
						<Route
							index
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_ipd"]}>
									<DischargeIndex />
								</ProtectedRoute>
							}
						/>
						<Route
							path=":dischargeId"
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_ipd"]}>
									<DischargeIndex />
								</ProtectedRoute>
							}
						/>
						<Route
							path=":dischargeId/:treatmentId"
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_ipd"]}>
									<DischargeIndex />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="bed-cabin">
						<Route
							index
							element={
								<ProtectedRoute
									roles={[
										"role_domain",
										"admin_administrator",
										"doctor_ipd_admission",
										"doctor_rs_rp_confirm",
										"doctor_ipd",
										"nurse_basic",
										"nurse_incharge",
										"operator_emergency",
									]}
								>
									<AdmissionBedCabinIndex />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="ipd-admission">
						<Route
							index
							element={
								<ProtectedRoute
									roles={[
										"role_domain",
										"admin_administrator",
										"doctor_ipd_admission",
										"operator_emergency",
									]}
								>
									<IpdAdmissionIndex />
								</ProtectedRoute>
							}
						/>
						<Route path=":id" element={<IpdAdmissionIndex />} />
					</Route>

					<Route path="ipd-admitted">
						<Route
							index
							element={
								<ProtectedRoute
									roles={[
										"role_domain",
										"admin_administrator",
										"doctor_ipd",
										"nurse_basic",
										"nurse_incharge",
									]}
								>
									<IpdAdmittedIndex />
								</ProtectedRoute>
							}
						/>
						<Route path="prescription/:id/:treatmentId" element={<IpdAdmittedIndex />} />
						<Route path="prescription/:id" element={<IpdAdmittedIndex />} />
						<Route path="manage/:id/:treatmentId" element={<IpdManageIndex />} />
						<Route path="manage/:id" element={<IpdManageIndex />} />
						<Route path=":id" element={<IpdAdmittedIndex />} />
					</Route>
					<Route
						path="emergency"
						element={
							<ProtectedRoute
								roles={["role_domain", "admin_administrator", "doctor_emergency", "operator_emergency"]}
							>
								<EmergencyIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="patient-vital"
						element={
							<ProtectedRoute
								roles={["role_domain", "admin_administrator", "doctor_emergency", "operator_emergency"]}
							>
								<VitalIndex />
							</ProtectedRoute>
						}
					/>
					<Route path="prescription">
						<Route
							index
							element={
								<ProtectedRoute
									roles={["role_domain", "doctor_ipd", "admin_administrator", "doctor_opd"]}
								>
									<PrescriptionIndex />
								</ProtectedRoute>
							}
						/>
						<Route
							path=":prescriptionId/:treatmentId"
							element={
								<ProtectedRoute
									roles={[
										"role_domain",
										"doctor_ipd",
										"admin_administrator",
										"doctor_opd",
										"doctor_emergency",
										"admin_doctor",
									]}
								>
									<PrescriptionOpd />
								</ProtectedRoute>
							}
						/>
						<Route
							path=":prescriptionId"
							element={
								<ProtectedRoute
									roles={[
										"role_domain",
										"doctor_ipd",
										"admin_administrator",
										"doctor_opd",
										"doctor_emergency",
										"admin_doctor",
									]}
								>
									<PrescriptionOpd />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="prescription-board">
						<Route
							index
							element={
								<ProtectedRoute
									roles={["role_domain", "doctor_ipd", "admin_administrator", "doctor_opd"]}
								>
									<PrescriptionBoardIndex />
								</ProtectedRoute>
							}
						/>
					</Route>

					<Route path="customer">
						<Route
							index
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "customer_index"]}>
									<CustomerIndex />
								</ProtectedRoute>
							}
						/>
						<Route
							path="edit/:id"
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "customer_edit"]}>
									<CustomerIndex mode="edit" />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route
						path="police-case"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"doctor_ipd",
									"doctor_emergency",
									"doctor_opd",
								]}
							>
								<PoliceCaseIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="police-case/:id"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"doctor_ipd",
									"doctor_emergency",
									"doctor_opd",
								]}
							>
								<PoliceCaseIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="free-patient"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"doctor_ipd",
									"doctor_emergency",
									"doctor_opd",
								]}
							>
								<FreePatientIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="patient-waiver"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"doctor_ipd",
									"doctor_emergency",
									"doctor_opd",
								]}
							>
								<PatientWaiverIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="patient-waiver/list"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"doctor_ipd",
									"doctor_emergency",
									"doctor_opd",
									"doctor_approve_opd",
									"doctor_approve_ipd",
									"doctor_ipd_confirm",
								]}
							>
								<PatientWaiverListIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="patient-waiver/:id"
						element={
							<ProtectedRoute
								roles={[
									"role_domain",
									"admin_administrator",
									"doctor_ipd",
									"doctor_emergency",
									"doctor_opd",
								]}
							>
								<PatientWaiverIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="lab-test"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_doctor",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabIndex />
							</ProtectedRoute>
						}
					/>

					<Route
						path="lab-test/report"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabInvestigationIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="lab-test/:id"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="lab-test/:id/report/:reportId"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabIndex />
							</ProtectedRoute>
						}
					/>

					<Route
						path="lab-group-report"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_doctor",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabGroupIndex />
							</ProtectedRoute>
						}
					/>

					<Route
						path="lab-group-report/:id"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabGroupIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="lab-group-report/:id/report/:reportId"
						element={
							<ProtectedRoute
								roles={[
									"lab_assistant",
									"admin_administrator",
									"doctor_lab",
									"lab_assistant",
									"lab_operator",
								]}
							>
								<LabGroupIndex />
							</ProtectedRoute>
						}
					/>

					<Route path="reports" element={<ReportsIndex />} />
					<Route
						path="epharma"
						element={
							<ProtectedRoute
								roles={[
									"pharmacy_operator",
									"pharmacy_pharmacist",
									"pharmacy_manager",
									"admin_administrator",
								]}
							>
								<EpharmaIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="epharma/issue"
						element={
							<ProtectedRoute
								roles={[
									"pharmacy_operator",
									"pharmacy_pharmacist",
									"pharmacy_manager",
									"admin_administrator",
								]}
							>
								<EpharmaIssueIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="epharma/issue/:id"
						element={
							<ProtectedRoute
								roles={[
									"pharmacy_operator",
									"pharmacy_pharmacist",
									"pharmacy_manager",
									"admin_administrator",
								]}
							>
								<EpharmaIssueIndex />
							</ProtectedRoute>
						}
					/>

					<Route path="medicine" element={<MedicineIndex />} />
					<Route path="medicine-requisition" element={<RequisitionIndex />} />
					<Route path="investigation" element={<InvestigationIndex />} />
					<Route
						path="billing"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
								]}
							>
								<BillingIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
								]}
							>
								<BillingIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing/:id/payment/:transactionId"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
								]}
							>
								<BillingIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing-ipd"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_emergency",
									"operator_manager",
								]}
							>
								<BillingIpdIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing-ipd/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_emergency",
									"operator_manager",
								]}
							>
								<BillingIpdIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing-ipd/:id/payment/:transactionId"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
								]}
							>
								<BillingIpdIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing-admission"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingAdmissionIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing-admission/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingAdmissionIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="billing-admission/:id/payment/:transactionId"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingAdmissionIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund-history"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundHistoryIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund-history/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundHistoryIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund-ipd-history"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundIpdHistoryIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund-ipd-history/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundIpdHistoryIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="refund/:id/payment/:transactionId"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<BillingRefundIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="final-billing"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<FinalBillingIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="final-billing/:id"
						element={
							<ProtectedRoute
								roles={[
									"admin_administrator",
									"admin_hospital",
									"billing_manager",
									"operator_opd",
									"operator_manager",
									"operator_emergency",
								]}
							>
								<FinalBillingIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="doctor"
						element={
							<ProtectedRoute roles={["role_domain", "admin_administrator", "admin_doctor"]}>
								<DoctorLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<DoctorDashboard />} />
						<Route path="opd" element={<DoctorOpdIndex />} />
						<Route path="opd/:prescriptionId" element={<DoctorOpdIndex />} />
						<Route path="emergency" element={<DoctorDashboard />} />
						<Route path="emergency/:prescriptionId" element={<DoctorDashboard />} />
						<Route path="ipd" element={<DoctorDashboard />} />
					</Route>
				</Route>

				<Route path="/settings/">
					<Route path="hospital-config/:id" element={<HospitalConfigIndex />} />
				</Route>
				<Route
					path="/hospital/core/"
					element={
						<ProtectedRoute roles={["role_domain", "admin_administrator", "admin_hospital"]}>
							<AdminLayout />
						</ProtectedRoute>
					}
				>
					<Route path="treatment-templates" element={<TreatmentTemplatesIndex />} />
					<Route path="treatment-templates/:id" element={<TreatmentTemplatesIndex mode={"edit"} />} />
					<Route
						path="treatment-templates/:treatmentFormat/:treatmentId"
						element={<TreatmentTemplatesIndex mode="edit" />}
					/>
					<Route path="dashboard" element={<DashboardCoreIndex />} />
					<Route path="investigation" element={<InvestigationIndex />} />
					<Route path="particular-matrix" element={<ParticularMatrixIndex />} />
					<Route path="investigation/:reportFormat/:id" element={<InvestigationIndex />} />
					<Route path="investigation/:id" element={<InvestigationIndex mode={"edit"} />} />
					<Route path="template" element={<TemplateIndex />} />
					<Route path="template/:name" element={<TemplateIndex mode={"details"} />} />
					<Route path="particular" element={<ParticularIndex />} />
					<Route path="particular/:id" element={<ParticularIndex mode={"edit"} />} />
					<Route path="opd-room" element={<OpdRoomIndex />} />
					<Route path="opd-room/:id" element={<OpdRoomIndex mode={"edit"} />} />
					<Route path="bed" element={<BedIndex />} />
					<Route path="bed/:id" element={<BedIndex mode={"edit"} />} />
					<Route path="advice" element={<AdviceIndex />} />
					<Route path="advice/:id" element={<AdviceIndex mode={"edit"} />} />
					<Route path="doctor" element={<DoctorIndex />} />
					<Route path="doctor/:id" element={<DoctorIndex mode={"edit"} />} />
					<Route path="nurse" element={<NurseIndex />} />
					<Route path="nurse/:id" element={<NurseIndex mode={"edit"} />} />
					<Route path="lab" element={<LabUserIndex />} />
					<Route path="lab/:id" element={<LabUserIndex mode={"edit"} />} />
					<Route path="dosage" element={<DosageIndex />} />
					<Route path="dosage/:id" element={<DosageIndex mode={"edit"} />} />
					<Route path="cabin" element={<CabinIndex />} />
					<Route path="cabin/:id" element={<CabinIndex mode={"edit"} />} />
					<Route path="particular-mode" element={<ParticularModeIndex />} />
					<Route path="particular-mode/:id" element={<ParticularModeIndex mode={"edit"} />} />
					<Route path="particular-type" element={<ParticularTypeIndex />} />x
					<Route path="category" element={<CategoryIndex />} />
					<Route path="store-user" element={<StoreUserIndex />} />
					<Route path="category/:id" element={<CategoryIndex mode={"edit"} />} />
				</Route>

				<Route path="sitemap" element={<Sitemap />} />
				<Route path="/configuration/">
					<Route index element={<ConfigurationIndex />} />
				</Route>
			</Route>
			<Route path="/test" element={<TestRoute />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default AppRoute;
