import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Button, Flex, Grid, Modal, LoadingOverlay } from "@mantine/core";
import PatientReport from "@hospital-components/PatientReport";
import AddMedicineForm from "@hospital-components/AddMedicineForm";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { ERROR_NOTIFICATION_COLOR, MODULES } from "@/constants";
import Table from "./Table";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientReferredAction from "@hospital-components/PatientReferredAction";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import { errorNotification } from "@components/notification/errorNotification";

const module = MODULES.PRESCRIPTION;

export default function Index() {
	const { user } = useAppLocalStore();
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [showHistory, setShowHistory] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const { ref } = useElementSize();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [tabValue, setTabValue] = useState("Chief Complaints");
	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const { prescriptionId } = useParams();
	const dispatch = useDispatch();
	const [updatedResponse, setUpdatedResponse] = useState({});

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
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${prescriptionId}`,
	});

	const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
	const existingMedicines = initialFormValues?.medicines || [];
	const form = useForm(getPrescriptionFormInitialValues(t, {}));

	useEffect(() => {
		// Always reset the form when prescription data changes
		const updatedFormValues = getPrescriptionFormInitialValues(t, initialFormValues);
		form.setValues(updatedFormValues.initialValues);
		form.setValues({ is_vital: !!prescriptionData?.data?.is_vital });
		form.setValues({ weight: prescriptionData?.data?.weight || "" });
		setMedicines(existingMedicines || []);
		setCustomerId(prescriptionData?.data?.customer_id);
	}, [prescriptionData]);

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const fetchData = async () => {
		try {
			const result = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.PATIENT_PRESCRIPTION}/${customerId}/${prescriptionId}`,
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

	const handlePrescriptionUpdate = async (updatedMedicine, updatedDynamicFormData = null) => {
		try {
			const createdBy = user;
			const formValue = {
				is_completed: true,
				medicines: updatedMedicine || medicines,
				advise: form.values.advise || "",
				weight: form.values.weight || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date()?.toISOString()?.split("T")[0],
				created_by_id: createdBy?.id,
				exEmergency: form.values.exEmergency || [],
				instruction: form.values.instruction || "",
				patient_report: {
					basic_info: form.values.basic_info || {},
					patient_examination: updatedDynamicFormData || form.values.dynamicFormData,
					order: tabParticulars.map((item, index) => ({
						[item.slug]: index,
					})),
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${prescriptionId}`,
				data: formValue,
				module,
			};

			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				errorNotification(resultAction.payload.message, ERROR_NOTIFICATION_COLOR);
			} else {
				setUpdatedResponse(resultAction.payload?.data?.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md" pos="relative">
					<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
					<Flex w="100%" gap="sm" ref={ref}>
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid columns={24} gutter="les">
							<Grid.Col span={17}>
								<BaseTabs
									tabValue={tabValue}
									setTabValue={setTabValue}
									tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
								/>
							</Grid.Col>
							<Grid.Col span={7}>
								<Flex mt={"xs"} gap="xs" justify="flex-end" align="center" wrap="wrap">
									<PatientReferredAction form={form} invoiceId={prescriptionData?.data?.invoice_id} />
									<Button
										onClick={handleOpenViewOverview}
										size="compact-xs"
										radius="es"
										py="sm"
										h={36}
										bg="var(--theme-success-color)"
										c="white"
									>
										{t("Prescriptions")}
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
									hasRecords={hasRecords}
									setMedicines={setMedicines}
									update={handlePrescriptionUpdate}
									setShowHistory={setShowHistory}
									prescriptionData={prescriptionData}
									tabParticulars={tabParticulars}
									updatedResponse={updatedResponse}
								/>
							</Grid.Col>
							{hasRecords && (
								<Grid.Col display={showHistory ? "block" : "none"} span={4}>
									<PatientPrescriptionHistoryList historyList={records} />
								</Grid.Col>
							)}
						</Grid>
					</Flex>
				</Box>
			)}
			<Modal opened={openedOverview} onClose={closeOverview} size="100%" centered withCloseButton={false}>
				<Table module={module} closeTable={closeOverview} height={mainAreaHeight - 220} availableClose />
			</Modal>

			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
		</>
	);
}
