import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, ScrollArea, Stack, Grid, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { formatDate } from "@/common/utils";

export default function DiagnosticReport() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const [diagnosticReport, setDiagnosticReport] = useState([]);
	const { id, reportId } = useParams();
	const entity = diagnosticReport?.entity || {};
	const safe = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));

	const col1 = [
		{ label: "Name", value: safe(entity.name) },
		{ label: "Patient ID", value: safe(entity.patient_id) },
		{ label: "Health ID", value: safe(entity.health_id) },
		{ label: "Gender", value: safe(entity.gender) },
		{ label: "Mobile", value: safe(entity.mobile) },
	];

	const col2 = [
		{ label: "Address", value: safe(entity.address) },
		{ label: "Guardian", value: safe(entity.guardian_name) },
		{ label: "Guardian Mobile", value: safe(entity.guardian_mobile) },
		{ label: "Mode", value: safe(entity.mode_name) },
		{ label: "Payment Mode", value: safe(entity.payment_mode_name) },
	];

	const col3 = [
		{ label: "Room", value: safe(entity.room_name) },
		{ label: "Appointment", value: safe(entity.appointment ?? entity.appointment_date) },
		{ label: "Created", value: safe(entity.created) },
		{ label: "Prescription ID", value: safe(entity.prescription_id) },
		{ label: "Prescription Doctor", value: safe(entity.prescription_doctor_name) },
	];

	const col4 = [
		{ label: "Process", value: safe(entity.process) },
		{ label: "Invoice", value: safe(entity.invoice) },
		{ label: "Total", value: safe(entity.total) },
		{ label: "Sub Total", value: safe(entity.sub_total) },
		{ label: "Created By", value: safe(entity.created_by_name ?? entity.created_by_user_name) },
	];

	const columns = [col1, col2, col3, col4];

	useEffect(() => {
		if (id && reportId) {
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INDEX}/${id}/report/${reportId}`,
				});
				setDiagnosticReport(res?.data);
			})();
		}
	}, [id, reportId]);

	const handleDataTypeChange = () => {};

	console.log(diagnosticReport);

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("DiagnosticReportPrepared")}
				</Text>
			</Box>
			{reportId ? (
				<>
					<Box px="xs" py="sm">
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
					<ScrollArea scrollbars="y" type="never" h={mainAreaHeight}>
						<Box className="border-top-none" px="sm">
							<DataTable
								striped
								highlightOnHover
								pinFirstColumn
								stripedColor="var(--theme-tertiary-color-1)"
								classNames={{
									root: tableCss.root,
									table: tableCss.table,
									header: tableCss.header,
									footer: tableCss.footer,
									pagination: tableCss.pagination,
								}}
								records={diagnosticReport?.details || []}
								columns={[
									{
										accessor: "index",
										title: t("S/N"),
										textAlignment: "right",
										render: (_, index) => index + 1,
									},
									{
										accessor: "id",
										title: t("ID"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "id", val.target.value)
												}
												value={item?.id}
											/>
										),
									},
									// {
									// 	accessor: "config_id",
									// 	title: t("ConfigID"),
									// 	render: (item) => (
									// 		<TextInput
									// 			size="xs"
									// 			fz="xs"
									// 			onChange={(val) => handleDataTypeChange(item.id, "config_id", val.target.value)}
									// 			value={item?.config_id}
									// 		/>
									// 	),
									// },
									// {
									// 	accessor: "parent_id",
									// 	title: t("ParentID"),
									// 	render: (item) => (
									// 		<TextInput
									// 			size="xs"
									// 			fz="xs"
									// 			onChange={(val) => handleDataTypeChange(item.id, "parent_id", val.target.value)}
									// 			value={item?.parent_id}
									// 		/>
									// 	),
									// },
									{
										accessor: "name",
										title: t("Name"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "name", val.target.value)
												}
												value={item?.name}
											/>
										),
									},
									{
										accessor: "parent_name",
										title: t("ParentName"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "parent_name", val.target.value)
												}
												value={item?.parent_name}
											/>
										),
									},
									{
										accessor: "code",
										title: t("Code"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "code", val.target.value)
												}
												value={item?.code}
											/>
										),
									},
									{
										accessor: "sorting",
										title: t("Sorting"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "sorting", val.target.value)
												}
												value={item?.sorting}
											/>
										),
									},
									{
										accessor: "reference_value",
										title: t("ReferenceValue"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "reference_value", val.target.value)
												}
												value={item?.reference_value}
											/>
										),
									},
									{
										accessor: "sample_value",
										title: t("SampleValue"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "sample_value", val.target.value)
												}
												value={item?.sample_value}
											/>
										),
									},
									{
										accessor: "unit",
										title: t("Unit"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "unit", val.target.value)
												}
												value={item?.unit}
											/>
										),
									},
									{
										accessor: "status",
										title: t("Status"),
										render: (item) => (
											<TextInput
												size="xs"
												fz="xs"
												onChange={(val) =>
													handleDataTypeChange(item.id, "status", val.target.value)
												}
												value={item?.status}
											/>
										),
									},
									{
										accessor: "created_at",
										title: t("CreatedAt"),
										render: (item) => formatDate(item.created_at),
									},
								]}
								loaderSize="xs"
								loaderColor="grape"
								height={mainAreaHeight - 200}
								sortIcons={{
									sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
									unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
								}}
							/>
						</Box>
					</ScrollArea>
				</>
			) : (
				<Box bg="white" h={mainAreaHeight - 60}>
					No Test selected
				</Box>
			)}
		</Box>
	);
}
