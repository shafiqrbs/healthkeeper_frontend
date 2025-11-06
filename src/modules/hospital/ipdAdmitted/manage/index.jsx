import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import { Box, Flex, Grid, LoadingOverlay, Stack, Text } from "@mantine/core";
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
import Medicine from "@modules/hospital/ipdAdmitted/common/tabs/Medicine";
import Investigation from "@modules/hospital/ipdAdmitted/common/tabs/Investigation";

const module = MODULES.E_FRESH;

const TAB_ITEMS = ["E-Fresh", "Investigation", "Medicine"];

export default function Index() {
	const [records, setRecords] = useState([]);
	const [customerId, setCustomerId] = useState();
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	const [opened, { close }] = useDisclosure(false);
	const [showHistory, setShowHistory] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const [tabValue, setTabValue] = useState("All");
	const [baseTabValue, setBaseTabValue] = useState("");
	const { particularsData } = useParticularsData({ modeName: "E-Fresh Order" });

	const tabParticulars = particularsData?.map((item) => ({
		particular_type: item.particular_type,
		ordering: item?.ordering ?? 0,
	}));

	const tabList = [...(tabParticulars?.sort((a, b) => a?.ordering - b?.ordering) || [])]?.map(
		(item) => item?.particular_type?.name
	);

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
				<Grid w="100%" columns={24} gutter="xs">
					<Grid.Col span={3}>
						<Stack py="xs" bg="white" h={mainAreaHeight - 16} gap={0}>
							{TAB_ITEMS.map((tabItem, index) => (
								<Box
									key={index}
									mx={8}
									className={`cursor-pointer`}
									variant="default"
									onClick={() => setBaseTabValue(tabItem)}
									bg={baseTabValue === tabItem ? "gray.1" : "#ffffff"}
								>
									<Text
										c={baseTabValue === tabItem ? "var(--theme-primary-color-8)" : "black"}
										size="sm"
										py="xxxs"
										pl="xxxs"
										fw={500}
									>
										{t(tabItem)}
									</Text>
								</Box>
							))}
						</Stack>
					</Grid.Col>
					<Grid.Col w="100%" span={showHistory ? 17 : 21}>
						{baseTabValue === "E-Fresh" && (
							<Stack w="100%" gap={0}>
								<BaseTabs
									tabValue={tabValue}
									setTabValue={setTabValue}
									tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
								/>
								<Flex gap="xs" w="100%">
									<Box w="40%">
										<PatientReport
											extraHeight={246}
											tabValue={tabValue}
											form={form}
											prescriptionData={prescriptionData}
											modeName="E-Fresh Order"
										/>
									</Box>
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
								</Flex>
							</Stack>
						)}
						{baseTabValue === "Medicine" && <Medicine />}
						{baseTabValue === "Investigation" && <Investigation />}
						{!baseTabValue && (
							<Flex bg="white" align="center" justify="center" w="100%" h="100%">
								<Text size="sm" c="dimmed">
									No item selected
								</Text>
							</Flex>
						)}
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
