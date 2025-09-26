import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import { Box, Grid, Stack } from "@mantine/core";
import PatientReport from "./PatientReport";
import AddMedicineForm from "./AddMedicineForm.jsx";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure } from "@mantine/hooks";
import { ERROR_NOTIFICATION_COLOR, MODULES } from "@/constants";
import { getLoggedInUser } from "@/common/utils";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";

const module = MODULES.ADMISSION;

export default function AdmissionPrescription({ selectedPrescriptionId }) {
	const [opened, { open, close }] = useDisclosure(false);
	const [showHistory, setShowHistory] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const [tabValue, setTabValue] = useState("All");
	const { particularsData } = useParticularsData({ modeName: "Admission" });
	const dispatch = useDispatch();
	const tabParticulars = particularsData?.map((item) => item.particular_type);
	const tabList = tabParticulars?.map((item) => item.name);

	const [records, setRecords] = useState([]);
	const [customerId, setCustomerId] = useState();

	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${selectedPrescriptionId}`,
	});

	const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
	const existingMedicines = initialFormValues?.medicines || [];

	const form = useForm(getPrescriptionFormInitialValues(t, {}));

	useEffect(() => {
		// Always reset the form when prescription data changes
		const updatedFormValues = getPrescriptionFormInitialValues(t, initialFormValues);
		form.setValues(updatedFormValues.initialValues);
		setMedicines(existingMedicines || []);
		setCustomerId(prescriptionData?.data?.customer_id);
	}, [prescriptionData]);

	const fetchData = async () => {
		try {
			const result = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.PATIENT_PRESCRIPTION}/${customerId}/${selectedPrescriptionId}`,
			});
			setRecords(result?.data || []);
		} catch (err) {
			console.error("Unexpected error:", err);
		}
	};

	useEffect(() => {
		if (customerId) {
			fetchData();
		}
	}, [customerId]);

	const hasRecords = records && records.length > 0;

	const handleAdmissionPrescriptionUpdate = async (updatedMedicine) => {
		try {
			const createdBy = getLoggedInUser();

			const formValue = {
				is_completed: true,
				medicines: updatedMedicine || medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date()?.toISOString()?.split("T")[0],
				created_by_id: createdBy?.id,
				exEmergency: form.values.exEmergency || [],
				instruction: form.values.instruction || "",
				patient_report: {
					basic_info: form.values.basic_info || {},
					patient_examination: form.values.dynamicFormData,
					order: tabParticulars.map((item, index) => ({
						[item.slug]: index,
					})),
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${selectedPrescriptionId}`,
				data: formValue,
				module: "prescription",
			};

			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				successNotification(resultAction.payload.message, ERROR_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box>
			<Grid columns={24} gutter="les">
				<Grid.Col span={24}>
					<Stack gap={0} ta="left">
						<BaseTabs
							tabValue={tabValue}
							setTabValue={setTabValue}
							tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
						/>
					</Stack>
				</Grid.Col>
				<Grid.Col span={7}>
					<PatientReport tabValue={tabValue} form={form} prescriptionData={prescriptionData} />
				</Grid.Col>
				<Grid.Col span={showHistory ? 13 : 17}>
					<AddMedicineForm
						module={module}
						form={form}
						medicines={medicines}
						hasRecords={hasRecords}
						setMedicines={setMedicines}
						setShowHistory={setShowHistory}
						prescriptionData={prescriptionData}
						tabParticulars={tabParticulars}
					/>
				</Grid.Col>
				{hasRecords && (
					<Grid.Col display={showHistory ? "block" : "none"} span={4}>
						<PatientPrescriptionHistoryList historyList={records} />
					</Grid.Col>
				)}
			</Grid>
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
		</Box>
	);
}
