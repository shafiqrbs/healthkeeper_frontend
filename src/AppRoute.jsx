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
import PrescriptionIpd from "@modules/hospital/prescription/ipd";
import VisitIndex from "@modules/hospital/visit";
import ParticularIndex from "@modules/hospital/core/particular";
import BedIndex from "@modules/hospital/core/bed";
import AdviceIndex from "@modules/hospital/core/advice";
import CabinIndex from "@modules/hospital/core/cabin";
import ParticularModeIndex from "@modules/hospital/core/particular-mode";
import ParticularTypeIndex from "@modules/hospital/core/particular-type";
import CategoryIndex from "@modules/hospital/core/category";
import EmergencyIndex from "@modules/hospital/emergency";
import NotFound from "@components/layout/NotFound";
import CustomerIndex from "@modules/hospital/customer";
import MedicineIndex from "@modules/hospital/medicine";
import LabIndex from "@modules/hospital/lab";
import EpharmaIndex from "@modules/hospital/epharma";
import LabGroupIndex from "@modules/hospital/lab-group";
import RequisitionIndex from "@modules/hospital/requisition";
import InvestigationIndex from "@modules/hospital/core/investigation";
import ParticularMatrixIndex from "@modules/hospital/core/particular-matrix";
import OpdRoomIndex from "@modules/hospital/core/opd-room";
import DoctorDashboard from "@modules/hospital/doctor/dashboard";
import DoctorOpd from "@modules/hospital/doctor/opd";
import PharmacyIndex from "@modules/pharmacy/dashboard";
import PharmacyStockIndex from "@modules/pharmacy/stock";
import PharmacyRequisitionIndex from "@modules/pharmacy/requisition";
import BillingIndex from "@modules/hospital/billing";
import DoctorIndex from "@modules/hospital/core/doctor";
import NurseIndex from "@modules/hospital/core/nurse";
import LabUserIndex from "@modules/hospital/core/lab-user";
import DosageIndex from "@modules/hospital/core/medicine-dosage";
import ListIndex from "@modules/hospital/visit/list";
import ConfigurationIndex from "@modules/configuration";
import IpdIndex from "@modules/hospital/admission/ipd";
import IpdAdmissionIndex from "@modules/hospital/admission/ipdAdmission";
import IpdAdmittedIndex from "@modules/hospital/ipdAdmitted";
import UserIndex from "@/modules/core/user";
import SettingIndex from "@/modules/core/setting";
import TestRoute from "@components/layout/TestRoute";
import TreatmentTemplatesIndex from "@modules/hospital/core/treatmentTemplates";
import AdminLayout from "./common/components/layout/AdminLayout";
import TemplateIndex from "./modules/hospital/core/template";
import DoctorLayout from "@components/layout/DoctorLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function AppRoute() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Layout />}>
				<Route path="core/">
					<Route path="user" element={<UserIndex />} />
					<Route path="user/:id" element={<UserIndex mode="edit" />} />
					<Route path="setting" element={<SettingIndex />} />
					<Route path="setting/:id" element={<SettingIndex mode="edit" />} />

					<Route path="vendor" element={<VendorIndex />} />
					<Route path="vendor/:id" element={<VendorIndex mode="edit" />} />
				</Route>
				<Route path="/domain/">
					<Route path="" element={<DomainIndex />} />
					<Route path="edit/:id" element={<DomainIndex mode="edit" />} />
					<Route path="config/:id" element={<DomainConfigurationIndex />} />
					<Route path="user" element={<DomainUserIndex />} />
				</Route>
				<Route path="/pharmacy">
					<Route path="" element={<PharmacyIndex />} />
					<Route path="requisition" element={<PharmacyRequisitionIndex />} />
				</Route>

				<Route path="/pharmacy/core/">
					<Route path="stock" element={<PharmacyStockIndex />} />
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
					<Route path="ipd-admission">
						<Route
							index
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_ipd_admission"]}>
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
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_ipd_admitted"]}>
									<IpdAdmittedIndex />
								</ProtectedRoute>
							}
						/>
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

						<Route
							path=":prescriptionId"
							element={
								<ProtectedRoute
									roles={["doctor_opd", "admin_administrator", "doctor_ipd", "admin_doctor"]}
								>
									<PrescriptionOpd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="edit/:id"
							element={
								<ProtectedRoute roles={["role_domain", "admin_administrator", "doctor_prescription"]}>
									<PrescriptionIpd />
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
						path="lab-test"
						element={
							<ProtectedRoute roles={["lab_assistant", "admin_administrator", "lab_doctor"]}>
								<LabIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="lab-test/:id"
						element={
							<ProtectedRoute roles={["lab_assistant", "admin_administrator", "lab_doctor"]}>
								<LabIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="lab-test/:id/report/:reportId"
						element={
							<ProtectedRoute roles={["lab_assistant", "admin_administrator", "lab_doctor"]}>
								<LabIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="epharma"
						element={
							<ProtectedRoute roles={["pharmacy_operator","pharmacy_pharmacist","pharmacy_manager","admin_administrator"]}>
								<EpharmaIndex />
							</ProtectedRoute>
						}
					/>
					<Route
						path="epharma/:id"
						element={
							<ProtectedRoute roles={["pharmacy_operator","pharmacy_pharmacist","pharmacy_manager","admin_administrator"]}>
								<EpharmaIndex />
							</ProtectedRoute>
						}
					/>

					<Route path="lab-group-test" element={<LabGroupIndex />} />
					<Route path="medicine" element={<MedicineIndex />} />
					<Route path="medicine-requisition" element={<RequisitionIndex />} />
					<Route path="investigation" element={<InvestigationIndex />} />
					<Route path="billing" element={<BillingIndex />} />

					<Route
						path="doctor"
						element={
							<ProtectedRoute roles={["role_domain", "admin_administrator", "admin_doctor"]}>
								<DoctorLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<DoctorDashboard />} />
						<Route path="opd" element={<DoctorOpd />} />
						<Route path="emergency" element={<DoctorDashboard />} />
						<Route path="ipd" element={<DoctorDashboard />} />
						<Route path="requisition" element={<PharmacyRequisitionIndex />} />
					</Route>
				</Route>

				<Route path="/settings/">
					<Route path="hospital-config/:id" element={<HospitalConfigIndex />} />
				</Route>
				<Route
					path="/hospital/core/"
					element={
						<ProtectedRoute roles={["role_domain", "admin_administrator"]}>
							<AdminLayout />
						</ProtectedRoute>
					}
				>
					<Route path="treatment-templates" element={<TreatmentTemplatesIndex />} />
					<Route path="treatment-templates/:id" element={<TreatmentTemplatesIndex mode={"edit"} />} />
					<Route
						path="treatment-templates/:treatmentFormat/:id"
						element={<TreatmentTemplatesIndex mode="edit" />}
					/>
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
					<Route path="particular-type" element={<ParticularTypeIndex />} />x
					<Route path="category" element={<CategoryIndex />} />
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
