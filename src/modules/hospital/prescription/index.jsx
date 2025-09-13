import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Button, Flex, Grid, Modal, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import PatientReport from "../common/PatientReport";
import AddMedicineForm from "../common/AddMedicineForm";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { ERROR_NOTIFICATION_COLOR, MODULES } from "@/constants";
import { IconArrowRight } from "@tabler/icons-react";
import Table from "../visit/_Table";
import { getLoggedInUser } from "@/common/utils";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientReferredAction from "@modules/hospital/common/PatientReferredAction";
import DetailsDrawer from "./__DetailsDrawer";

const module = MODULES.PRESCRIPTION;

const PRESCRIPTION_HISTORY_LIST = [
	{
		id: 1,
		label: "Prescription 1",
		invoice: "1234567890",
	},
	{
		id: 2,
		label: "Prescription 2",
		invoice: "1234567890",
	},
	{
		id: 3,
		label: "Prescription 3",
		invoice: "1234567890",
	},
];

export default function Index() {
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [showHistory, setShowHistory] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const { ref } = useElementSize();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [tabValue, setTabValue] = useState("All");
	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const { prescriptionId } = useParams();
	const dispatch = useDispatch();
	const tabParticulars = particularsData?.map((item) => item.particular_type);
	const tabList = tabParticulars?.map((item) => item.name);

	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${prescriptionId}`,
	});

	const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
	const existingMedicines = initialFormValues?.medicines || [];

	const form = useForm(getPrescriptionFormInitialValues(t, {}));

	useEffect(() => {
		// Always reset the form when prescription data changes
		const updatedFormValues = getPrescriptionFormInitialValues(t, initialFormValues);
		form.setValues(updatedFormValues.initialValues);
		setMedicines(existingMedicines || []);
	}, [prescriptionData]);

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const handlePrescriptionUpdate = async (updatedMedicine) => {
		try {
			const createdBy = getLoggedInUser();

			const formValue = {
				is_completed: true,
				medicines: updatedMedicine || medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date()?.toISOString()?.split("T")[0],
				created_by_id: createdBy?.id,
				patient_report: {
					basic_info: form.values.basic_info || {},
					patient_examination: form.values.dynamicFormData,
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${prescriptionId}`,
				data: formValue,
				module,
			};

			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				successNotification(resultAction.payload.message, ERROR_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleViewPrescription = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	const handleHistoricalPrescription = (id) => {
		console.info(id);
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm" ref={ref}>
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid columns={24} gutter="les">
							<Grid.Col span={16}>
								<Stack gap={0} ta="left">
									<BaseTabs
										tabValue={tabValue}
										setTabValue={setTabValue}
										tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
									/>
								</Stack>
							</Grid.Col>
							<Grid.Col span={8}>
								<Flex mt={"xs"} gap="md" justify="flex-end" align="center" wrap="wrap">
									<PatientReferredAction form={form} invoiceId={prescriptionData?.data?.invoice_id} />
									<Button
										onClick={handleOpenViewOverview}
										size="xs"
										radius="es"
										rightSection={<IconArrowRight size={16} />}
										bg="var(--theme-success-color)"
										c="white"
									>
										{t("Visits")}
									</Button>
								</Flex>
							</Grid.Col>
							<Grid.Col span={7}>
								<PatientReport
									tabValue={tabValue}
									form={form}
									update={handlePrescriptionUpdate}
									prescriptionData={prescriptionData}
								/>
							</Grid.Col>
							<Grid.Col span={showHistory ? 13 : 17}>
								<AddMedicineForm
									module={module}
									form={form}
									medicines={medicines}
									setMedicines={setMedicines}
									update={handlePrescriptionUpdate}
									setShowHistory={setShowHistory}
								/>
							</Grid.Col>
							<Grid.Col display={showHistory ? "block" : "none"} span={4}>
								<ScrollArea
									pos="relative"
									h={mainAreaHeight - 68}
									bg="white"
									className="borderRadiusAll"
								>
									<Stack p="xs" gap="xs">
										{PRESCRIPTION_HISTORY_LIST.map((item) => (
											<Paper
												key={item.id}
												p="sm"
												radius="sm"
												style={{
													cursor: "pointer",
													border: "1px solid var(--mantine-color-gray-2)",
													transition: "all 0.2s ease",
												}}
												onClick={() => handleViewPrescription(item.id)}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor =
														"var(--mantine-color-gray-0)";
													e.currentTarget.style.borderColor = "var(--mantine-color-blue-3)";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = "transparent";
													e.currentTarget.style.borderColor = "var(--mantine-color-gray-2)";
												}}
											>
												<Box>
													<Text fw={600} fz="sm">
														{item.label}
													</Text>
													<Text fz="xs" c="dimmed">
														Invoice: {item.invoice}
													</Text>
												</Box>
											</Paper>
										))}
									</Stack>
								</ScrollArea>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
			<Modal opened={openedOverview} onClose={closeOverview} size="100%" centered withCloseButton={false}>
				<Table module={module} closeTable={closeOverview} height={mainAreaHeight - 220} availableClose />
			</Modal>

			<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
		</>
	);
}
