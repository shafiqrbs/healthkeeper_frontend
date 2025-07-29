import { useCallback, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Group, Menu, Tabs, Text } from "@mantine/core";
import { IconArrowRight, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import DetailsDrawer from "./__DetailsDrawer";
import OverviewDrawer from "./__OverviewDrawer";
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";

const data = [
	{
		id: 1,
		index: 1,
		created_at: "2025-01-15",
		created_by: "Dr. Smith",
		visit_no: "VIS-001",
		patient_id: "P001",
		patient_name: "John Doe",
		doctor_name: "Dr. Johnson",
		diseases: "Hypertension, Diabetes",
		total_amount: "150.00",
		payment_status: "paid",
	},
	{
		id: 2,
		index: 2,
		created_at: "2025-01-16",
		created_by: "Dr. Brown",
		visit_no: "VIS-002",
		patient_id: "P002",
		patient_name: "Jane Smith",
		doctor_name: "Dr. Davis",
		diseases: "Asthma",
		total_amount: "200.00",
		payment_status: "pending",
	},
	{
		id: 3,
		index: 3,
		created_at: "2025-01-17",
		created_by: "Dr. Garcia",
		visit_no: "VIS-003",
		patient_id: "P003",
		patient_name: "Mike Johnson",
		doctor_name: "Dr. Martinez",
		diseases: "Heart Disease",
		total_amount: "300.00",
		payment_status: "paid",
	},
	{
		id: 4,
		index: 4,
		created_at: "2025-01-18",
		created_by: "Dr. Lee",
		visit_no: "VIS-004",
		patient_id: "P004",
		patient_name: "Sarah Wilson",
		doctor_name: "Dr. Taylor",
		diseases: "Migraine",
		total_amount: "120.00",
		payment_status: "paid",
	},
	{
		id: 5,
		index: 5,
		created_at: "2025-01-19",
		created_by: "Dr. Rodriguez",
		visit_no: "VIS-005",
		patient_id: "P005",
		patient_name: "David Brown",
		doctor_name: "Dr. White",
		diseases: "Arthritis",
		total_amount: "180.00",
		payment_status: "pending",
	},
	{
		id: 6,
		index: 6,
		created_at: "2025-01-19",
		created_by: "Dr. Rodriguez",
		visit_no: "VIS-005",
		patient_id: "P005",
		patient_name: "David Brown",
		doctor_name: "Dr. White",
		diseases: "Arthritis",
		total_amount: "180.00",
		payment_status: "pending",
	},
	{
		id: 7,
		index: 7,
		created_at: "2025-01-19",
		created_by: "Dr. Rodriguez",
		visit_no: "VIS-005",
		patient_id: "P005",
		patient_name: "David Brown",
		doctor_name: "Dr. White",
		diseases: "Arthritis",
		total_amount: "180.00",
		payment_status: "pending",
	},
];

const tabs = ["all", "closed", "done", "inProgress", "returned"];

export default function Table() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [fetching, setFetching] = useState(false);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 34;
	const scrollViewportRef = useRef(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const form = useForm({
		initialValues: {
			keywordSearch: "",
		},
	});

	const [rootRef, setRootRef] = useState(null);
	const [value, setValue] = useState("all");
	const [controlsRefs, setControlsRefs] = useState({});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

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

	const handleView = (id) => {
		open();
	};

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const handlePrescription = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX);
	};

	const handleAdmission = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX);
	};

	return (
		<Box w="100%" bg="white" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("EmergencyInformation")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={value} onChange={setValue}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab) => (
								<Tabs.Tab value={tab} ref={setControlRef(tab)} className={filterTabsCss.tab} key={tab}>
									{t(tab)}
								</Tabs.Tab>
							))}
							<FloatingIndicator
								target={value ? controlsRefs[value] : null}
								parent={rootRef}
								className={filterTabsCss.indicator}
							/>
						</Tabs.List>
					</Tabs>
					<Button
						onClick={handleOpenViewOverview}
						size="xs"
						radius="es"
						rightSection={<IconArrowRight size={16} />}
						bg="var(--theme-success-color)"
						c="white"
					>
						{t("visitOverview")}
					</Button>
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} />
			</Box>
			<Box className="borderRadiusAll border-top-none" px="sm">
				<DataTable
					striped
					pinFirstColumn
					pinLastColumn
					stripedColor="var(--theme-tertiary-color-1)"
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
							render: (item) => (
								<Text fz="sm" onClick={() => handleView(item.id)} className="activate-link">
									{item.created_at}
								</Text>
							),
						},
						{
							accessor: "created_by",
							title: t("CreatedBy"),
							render: (item) => item.created_by || "N/A",
						},
						{ accessor: "visit_no", title: t("visitNo") },
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "patient_name", title: t("Name") },
						{ accessor: "doctor_name", title: t("doctor") },
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
										variant="filled"
										bg="var(--theme-primary-color-6)"
										c="white"
										size="xs"
										onClick={() => handlePrescription(values.id)}
										radius="es"
										rightSection={<IconArrowRight size={18} />}
									>
										{t("Prescription")}
									</Button>
									<Button
										variant="filled"
										bg="var(--theme-success-color)"
										c="white"
										size="xs"
										onClick={() => handleAdmission(values.id)}
										radius="es"
										rightSection={<IconArrowRight size={18} />}
										className="border-right-radius-none"
									>
										{t("Admission")}
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
												<IconDotsVertical height={18} width={18} stroke={1.5} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													// handleVendorEdit(values.id);
													// open();
												}}
											>
												{t("Edit")}
											</Menu.Item>
											<Menu.Item
												// onClick={() => handleDelete(values.id)}
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
					height={height - 344}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
				/>
			</Box>
			<DataTableFooter indexData={data} module="visit" />
			<DetailsDrawer opened={opened} close={close} />
			<OverviewDrawer opened={openedOverview} close={closeOverview} />
		</Box>
	);
}
