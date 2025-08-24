import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid } from "@mantine/core";
import PatientReport from "../common/PatientReport";
import AddMedicineForm from "../common/AddMedicineForm";
import Form from "./form/_Form";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@/common/hooks/useParticularsData";
import { useElementSize } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";

const module = MODULES.PRESCRIPTION;

export default function Index() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [patientData, setPatientData] = useState({});
	const [patientReportData, setPatientReportData] = useState({
		basicInfo: {},
		dynamicFormData: {},
		investigationList: [],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { ref, width } = useElementSize();

	const [tabValue, setTabValue] = useState("All");

	const { particularsData } = useParticularsData({ modeName: "Prescription" });

	const tabParticulars = particularsData?.map((item) => item.particular_type);
	const tabList = tabParticulars?.map((item) => item.name);

	const handlePrescriptionSubmit = async (prescriptionData) => {
		if (!patientData || Object.keys(patientData).length === 0) {
			showNotificationComponent(t("Please select a patient first"), "red", "lightgray", true, 1000, true);
			return;
		}

		if (!prescriptionData.medicines || prescriptionData.medicines.length === 0) {
			showNotificationComponent(t("Please add at least one medicine"), "red", "lightgray", true, 1000, true);
			return;
		}

		setIsSubmitting(true);

		try {
			const createdBy = JSON.parse(localStorage.getItem("user"));

			const filteredAdvise = {
				advise: prescriptionData.adviseForm?.advise || "",
				followUpDate: prescriptionData.adviseForm?.followUpDate || null,
			};

			const formValue = {
				// patient_id: patientData.id,
				// patient_name: patientData.name,
				// patient_mobile: patientData.mobile,
				// patient_id_number: patientData.patientId,
				medicines: prescriptionData.medicines,
				advise: filteredAdvise?.advise || "",
				follow_up_date: filteredAdvise?.followUpDate || null,
				prescription_date: new Date().toISOString().split("T")[0],
				created_by_id: createdBy?.id,
				patient_report: {
					basic_info: prescriptionData.patientReportData?.basicInfo || {},
					patient_examination: {
						...(prescriptionData.patientReportData?.dynamicFormData || {}),
						investigation: prescriptionData.patientReportData?.investigationList || [],
					},
				},
				...prescriptionData.prescriptionForm,
			};

			console.log("Final submission data:", formValue);

			const data = {
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.CREATE,
				data: formValue,
				module,
			};

			const resultAction = await dispatch(storeEntityData(data));

			if (storeEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
			} else {
				showNotificationComponent(t("Prescription saved successfully"), "green", "lightgray", true, 1000, true);
				setRefetchData({ module, refetching: true });
				// Reset forms and data
				form.reset();
				setPatientData({});
				setPatientReportData({
					basicInfo: {},
					dynamicFormData: {},
					investigationList: [],
				});
				return true; // Indicate successful submission
			}
		} catch (error) {
			console.error("Error submitting prescription:", error);
			showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
			return false; // Indicate failed submission
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={25}>
							<Grid.Col span={isOpenPatientInfo ? 8 : 3} pos="relative" className="animate-ease-out">
								<Form
									form={form}
									isOpenPatientInfo={isOpenPatientInfo}
									setIsOpenPatientInfo={setIsOpenPatientInfo}
									setPatientData={setPatientData}
								/>
							</Grid.Col>
							<Grid.Col span={isOpenPatientInfo ? 17 : 22} className="animate-ease-out">
								<Grid columns={25} gutter="les">
									<Grid.Col span={25}>
										<BaseTabs
											tabValue={tabValue}
											setTabValue={setTabValue}
											tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
											width={width}
										/>
									</Grid.Col>
									<Flex ref={ref}>
										<Grid.Col span={9}>
											<PatientReport
												patientData={patientData}
												tabValue={tabValue}
												onDataChange={setPatientReportData}
												formData={patientReportData}
												setFormData={setPatientReportData}
											/>
										</Grid.Col>
										<Grid.Col span={16}>
											<AddMedicineForm
												onSubmit={handlePrescriptionSubmit}
												isSubmitting={isSubmitting}
												patientData={patientData}
												prescriptionForm={form}
												patientReportData={patientReportData}
												setPatientReportData={setPatientReportData}
											/>
										</Grid.Col>
									</Flex>
								</Grid>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
