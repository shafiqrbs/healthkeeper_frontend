import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import { Box, Flex, Grid, LoadingOverlay, Stack } from "@mantine/core";
import PatientReport from "@hospital-components/PatientReport";
import AddMedicineForm from "../common/AddMedicineForm";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure } from "@mantine/hooks";
import { MODULES } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import DetailsDrawer from "@/modules/hospital/common/drawer/__IPDDetailsDrawer";
import { useOutletContext, useParams } from "react-router-dom";
import Navigation from "@components/layout/Navigation";

const module = MODULES.E_FRESH;

export default function Index() {
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	const [opened, { close }] = useDisclosure(false);
	const [showHistory, setShowHistory] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const [tabValue, setTabValue] = useState("All");
	const { particularsData } = useParticularsData({ modeName: "E-Fresh Order" });

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

	console.log(tabParticulars);

	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			<Flex w="100%" gap="xs" p="16px">
				<Navigation module="home" mainAreaHeight={mainAreaHeight} />
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
						<PatientReport
							tabValue={tabValue}
							form={form}
							prescriptionData={prescriptionData}
							modeName="E-Fresh Order"
						/>
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
			</Flex>

			{id && <DetailsDrawer opened={opened} close={close} prescriptionId={id} />}
		</Box>
	);
}
