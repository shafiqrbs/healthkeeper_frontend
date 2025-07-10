import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Group, Menu, Text } from "@mantine/core";
import { IconDotsVertical, IconEye, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";

import React, { useCallback, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

const data = [
	{
		id: 1,
		index: 1,
		created_at: "2025-01-15",
		created_by: "Dr. Smith",
		invoice_no: "INV-001",
		visit_no: "VIS-001",
		appointment: "2025-01-15 10:00 AM",
		patient_id: "P001",
		patient_name: "John Doe",
		doctor_name: "Dr. Johnson",
		referred_name: "Dr. Williams",
		diseases: "Hypertension, Diabetes",
		total_amount: "150.00",
		payment_status: "paid",
	},
	{
		id: 2,
		index: 2,
		created_at: "2025-01-16",
		created_by: "Dr. Brown",
		invoice_no: "INV-002",
		visit_no: "VIS-002",
		appointment: "2025-01-16 02:30 PM",
		patient_id: "P002",
		patient_name: "Jane Smith",
		doctor_name: "Dr. Davis",
		referred_name: "Dr. Wilson",
		diseases: "Asthma",
		total_amount: "200.00",
		payment_status: "pending",
	},
	{
		id: 3,
		index: 3,
		created_at: "2025-01-17",
		created_by: "Dr. Garcia",
		invoice_no: "INV-003",
		visit_no: "VIS-003",
		appointment: "2025-01-17 09:15 AM",
		patient_id: "P003",
		patient_name: "Mike Johnson",
		doctor_name: "Dr. Martinez",
		referred_name: "Dr. Anderson",
		diseases: "Heart Disease",
		total_amount: "300.00",
		payment_status: "paid",
	},
	{
		id: 4,
		index: 4,
		created_at: "2025-01-18",
		created_by: "Dr. Lee",
		invoice_no: "INV-004",
		visit_no: "VIS-004",
		appointment: "2025-01-18 11:45 AM",
		patient_id: "P004",
		patient_name: "Sarah Wilson",
		doctor_name: "Dr. Taylor",
		referred_name: "Dr. Thomas",
		diseases: "Migraine",
		total_amount: "120.00",
		payment_status: "paid",
	},
	{
		id: 5,
		index: 5,
		created_at: "2025-01-19",
		created_by: "Dr. Rodriguez",
		invoice_no: "INV-005",
		visit_no: "VIS-005",
		appointment: "2025-01-19 03:20 PM",
		patient_id: "P005",
		patient_name: "David Brown",
		doctor_name: "Dr. White",
		referred_name: "Dr. Harris",
		diseases: "Arthritis",
		total_amount: "180.00",
		payment_status: "pending",
	},
];

export default function VisitTable() {
	const { t } = useTranslation();
	const [fetching, setFetching] = useState(false);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 34;
	const scrollViewportRef = useRef(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const fetchData = async (pageNum = 1, append = false) => {
		if (!hasMore && pageNum > 1) return;

		setFetching(true);
	};

	const loadMoreRecords = useCallback(() => {
		// if (hasMore && !fetching) {
		// 	const nextPage = page + 1;
		// 	setPage(nextPage);
		// 	fetchData(nextPage, true);
		// } else if (!hasMore) {
		// 	console.info("No more records");
		// }
	}, [hasMore, fetching, page]);

	return (
		<Box w="100%" bg="white" py="xxs" style={{ borderRadius: "4px" }}>
			<Text px="sm" fw={600} fz="sm" pb="xs">
				{t("patientInformation")}
			</Text>
			<Box className="borderRadiusAll border-top-none">
				<DataTable
					striped
					stripedColor="var(--theme-secondary-color-1)"
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={data}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => item.index,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							render: (item) => item.created_at,
						},
						{ accessor: "created_by", title: t("CreatedBy") },
						{ accessor: "invoice_no", title: t("InvoiceNo") },
						{ accessor: "visit_no", title: t("visitNo") },
						{ accessor: "appointment", title: t("appointment") },
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "patient_name", title: t("Name") },
						{ accessor: "doctor_name", title: t("doctor") },
						{ accessor: "referred_name", title: t("referred") },
						{ accessor: "diseases", title: t("diseases") },
						{ accessor: "total_amount", title: t("Total") },
						{
							accessor: "payment_status",
							title: t("paymentStatus"),
							render: (item) => t(item.payment_status),
						},
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button
										variant="default"
										c="var(--theme-success-color)"
										size="xs"
										radius="es"
										leftSection={<IconEye size={18} />}
										className="border-right-radius-none"
									>
										{t("View")}
									</Button>
									<Menu
										position="bottom-end"
										offset={3}
										withArrow
										trigger="hover"
										openDelay={100}
										closeDelay={400}
									>
										<Menu.Target>
											<ActionIcon
												className="action-icon-menu border-left-radius-none"
												variant="default"
												radius="es"
												aria-label="Settings"
											>
												<IconDotsVertical
													height={18}
													width={18}
													stroke={1.5}
												/>
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													handleVendorEdit(values.id);
													open();
												}}
											>
												{t("Edit")}
											</Menu.Item>
											<Menu.Item onClick={() => handleDataShow(values.id)}>
												{t("Show")}
											</Menu.Item>
											<Menu.Item
												onClick={() => handleDelete(values.id)}
												bg="red.1"
												c="red.6"
												rightSection={
													<IconTrashX
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
											>
												{t("Delete")}
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>
							),
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 272}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
				/>
			</Box>
			<DataTableFooter indexData={data} module="visit" />
		</Box>
	);
}
