import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import { Box, Grid, LoadingOverlay, Stack, ActionIcon, Tooltip } from "@mantine/core";
import { IconX, IconChevronRight } from "@tabler/icons-react";
import PatientReport from "@hospital-components/PatientReport";
import AddMedicineForm from "./AddMedicineForm.jsx";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure } from "@mantine/hooks";
import { MODULES } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import DetailsDrawer from "@/modules/hospital/common/drawer/__IPDDetailsDrawer";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";

const module = MODULES.ADMISSION;

export default function AdmissionPrescription() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const ipdId = searchParams.get("ipd");
	const [opened, { close }] = useDisclosure(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showPatientReport, setShowPatientReport] = useState(true);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const [tabValue, setTabValue] = useState("All");
	const { particularsData } = useParticularsData({ modeName: "Admission" });
	const { mainAreaHeight } = useOutletContext();
	const tabParticulars = particularsData?.map((item) => ({
		particular_type: item.particular_type,
		ordering: item?.ordering ?? 0,
	}));
	const tabList = [...(tabParticulars?.sort((a, b) => a?.ordering - b?.ordering) || [])]?.map(
		(item) => item?.particular_type?.name
	);

	const [records, setRecords] = useState([]);
	const [customerId, setCustomerId] = useState();

	const { data: prescriptionData, isLoading } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${id}`,
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
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.PATIENT_PRESCRIPTION}/${customerId}/${id}`,
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

	const getAddMedicineFormSpan = () => {
		if (!showPatientReport) {
			return showHistory ? 20 : 24;
		}
		return showHistory ? 13 : 17;
	};

	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			<Tooltip
				label={
					showPatientReport
						? t("hidePatientReport") || "Hide Patient Report"
						: t("showPatientReport") || "Show Patient Report"
				}
				position={showPatientReport ? "left" : "right"}
			>
				<ActionIcon
					variant="filled"
					color={showPatientReport ? "red" : "blue"}
					size="xl"
					radius="xl"
					onClick={() => setShowPatientReport(!showPatientReport)}
					style={{
						position: "fixed",
						top: "50%",
						left: showPatientReport ? "calc(7/24 * 100% + 40px)" : "76px",
						transform: "translateY(-50%)",
						zIndex: 99,
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
					}}
				>
					{showPatientReport ? <IconX size={18} /> : <IconChevronRight size={18} />}
				</ActionIcon>
			</Tooltip>
			<Grid columns={24} gutter="les">
				<Grid.Col span={24}>
					<Stack gap={0} ta="left">
						<BaseTabs
							tabWidth="150px"
							tabValue={tabValue}
							setTabValue={setTabValue}
							tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
						/>
					</Stack>
				</Grid.Col>
				{showPatientReport && (
					<Grid.Col span={7}>
						<PatientReport
							tabValue={tabValue}
							form={form}
							prescriptionData={prescriptionData}
							modeName="Admission"
						/>
					</Grid.Col>
				)}
				<Grid.Col span={getAddMedicineFormSpan()}>
					<AddMedicineForm
						module={module}
						form={form}
						medicines={medicines}
						hasRecords={hasRecords}
						setMedicines={setMedicines}
						setShowHistory={setShowHistory}
						prescriptionData={prescriptionData}
						tabParticulars={tabParticulars}
						showBaseItems={false}
						baseHeight={mainAreaHeight}
					/>
				</Grid.Col>
				{hasRecords && (
					<Grid.Col display={showHistory ? "block" : "none"} span={4}>
						<PatientPrescriptionHistoryList historyList={records} />
					</Grid.Col>
				)}
			</Grid>
			{id && <DetailsDrawer opened={opened} close={close} ipdId={ipdId} prescriptionId={id} />}
		</Box>
	);
}
