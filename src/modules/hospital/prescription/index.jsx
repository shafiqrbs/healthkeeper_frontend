import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
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
import { MODULES } from "@/constants";
import { IconArrowRight } from "@tabler/icons-react";
import Table from "../visit/_Table";

const module = MODULES.PRESCRIPTION;

export default function Index() {
	const { t } = useTranslation();
	const { ref, width } = useElementSize();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [tabValue, setTabValue] = useState("All");
	const form = useForm(getPrescriptionFormInitialValues(t));
	const { particularsData } = useParticularsData({ modeName: "Prescription" });
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const [patientReportData, setPatientReportData] = useState({
		basicInfo: {},
		dynamicFormData: {},
		investigationList: [],
	});

	const tabParticulars = particularsData?.map((item) => item.particular_type);
	const tabList = tabParticulars?.map((item) => item.name);

	const handleOpenViewOverview = () => {
		openOverview();
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
								<PatientReport
									tabValue={tabValue}
									onDataChange={setPatientReportData}
									formData={patientReportData}
									setFormData={setPatientReportData}
								/>
							</Grid.Col>
							<Grid.Col span={15}>
								<AddMedicineForm
									module={module}
									prescriptionForm={form}
									patientReportData={patientReportData}
									setPatientReportData={setPatientReportData}
								/>
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
