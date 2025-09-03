import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Button, Flex, Grid, Modal } from "@mantine/core";
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

const module = MODULES.PRESCRIPTION;

export default function Index() {
	const { t } = useTranslation();
	const { ref, width } = useElementSize();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [tabValue, setTabValue] = useState("All");
	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const { prescriptionId } = useParams();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const dispatch = useDispatch();
	const tabParticulars = particularsData?.map((item) => item.particular_type);
	const tabList = tabParticulars?.map((item) => item.name);

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const handlePrescriptionUpdate = async ({ medicines = [] }) => {
		try {
			const createdBy = getLoggedInUser();

			const formValue = {
				is_completed: true,
				medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date().toISOString().split("T")[0],
				created_by_id: createdBy?.id,
				patient_report: {
					basic_info: form.values.basicInfo || {},
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

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm" ref={ref}>
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid columns={24} gutter="les">
							<Grid.Col span={24}>
								<Flex gap="les" align="center">
									<Box p="xs" bg="var(--theme-primary-color-0)" style={{ borderRadius: "4px" }}>
										<Button
											onClick={handleOpenViewOverview}
											size="xs"
											radius="es"
											rightSection={<IconArrowRight size={16} />}
											bg="var(--theme-success-color)"
											c="white"
										>
											{t("VisitTable")}
										</Button>
									</Box>
									<BaseTabs
										tabValue={tabValue}
										setTabValue={setTabValue}
										tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
										width={width - 218}
									/>
								</Flex>
							</Grid.Col>
							<Grid.Col span={9}>
								<PatientReport tabValue={tabValue} form={form} update={handlePrescriptionUpdate} />
							</Grid.Col>
							<Grid.Col span={15}>
								<AddMedicineForm module={module} form={form} update={handlePrescriptionUpdate} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
			<Modal opened={openedOverview} onClose={closeOverview} size="100%" centered>
				<Table module={module} closeTable={closeOverview} height={mainAreaHeight - 220} />
			</Modal>
		</>
	);
}
