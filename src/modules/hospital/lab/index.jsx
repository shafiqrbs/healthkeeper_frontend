import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, SegmentedControl, Stack, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import Test from "./Test";
import DiagnosticReport from "./DiagnosticReport";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useGetDataWithoutStore from "@/common/hooks/useDataWithoutStore";

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [processTab, setProcessTab] = useState("Current");

	const {
		data: diagnosticReport,
		isLoading: isDiagnosticReportLoading,
		refetch: refetchDiagnosticReport,
	} = useGetDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INDEX}/${id}`,
	});

	const entity = diagnosticReport?.data || {};
	const safe = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));
	const col1 = [
		{ label: "Patient ID", value: safe(entity.patient_id) },
		{ label: "Health ID", value: safe(entity.health_id) },
		{ label: "Prescription ID", value: safe(entity.invoice) },
	];

	const col2 = [
		{ label: "Name", value: safe(entity.name) },
		{ label: "Mobile", value: safe(entity.mobile) },
		{ label: "Gender", value: safe(entity.gender) },
	];

	const col3 = [
		{ label: "Pres. Created", value: safe(entity.prescription_created) },
		{ label: "Pres. ID", value: safe(entity.prescription_doctor_id) },
		{ label: "Doctor", value: safe(entity.prescription_doctor_name) },
	];

	const col4 = [
		{ label: "Process", value: safe(entity.process) },
		{ label: "Created By", value: safe(entity.created_by_name ?? entity.created_by_user_name) },
	];

	const columns = [col1, col2, col3, col4];

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" gutter="xs" columns={24}>
							<Grid.Col span={6} pos="relative" className="animate-ease-out">
								<Flex
									justify="space-between"
									align="center"
									px="sm"
									py="md"
									bg="var(--mantine-color-white)"
								>
									<Text fw={600} fz="sm">
										{t("ManageDiagnostic")}
									</Text>
									<SegmentedControl
										size="sm"
										color="var(--theme-primary-color-6)"
										data={["Current", "Archive"]}
										value={processTab}
										onChange={(value) => setProcessTab(value)}
									/>
								</Flex>
								<TabsWithSearch
									tabList={["list"]}
									tabPanels={[
										{
											tab: "list",
											component: (
												<Table
													selectedId={id}
													isOpenPatientInfo={isOpenPatientInfo}
													setIsOpenPatientInfo={setIsOpenPatientInfo}
												/>
											),
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={18} className="animate-ease-out">
								<Box bg="var(--theme-secondary-color-0)" p="sm">
									<Grid columns={24}>
										{columns.map((rows, colIdx) => (
											<Grid.Col key={colIdx} span={6}>
												<Stack gap={2}>
													{rows.map((row, idx) => (
														<Text key={idx} fz="sm">{`${row.label}: ${row.value}`}</Text>
													))}
												</Stack>
											</Grid.Col>
										))}
									</Grid>
								</Box>
								<Grid columns={18}>
									<Grid.Col span={4} className="animate-ease-out">
										<Test
											entity={entity}
											isLoading={isDiagnosticReportLoading}
											refetchDiagnosticReport={refetchDiagnosticReport}
										/>
									</Grid.Col>
									<Grid.Col span={14}>
										<DiagnosticReport refetchDiagnosticReport={refetchDiagnosticReport} />
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
