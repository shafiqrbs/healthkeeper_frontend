import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Group, Menu, Tabs, Text } from "@mantine/core";
import {
	IconAlertCircle,
	IconArrowRight,
	IconCheck,
	IconChevronUp,
	IconDotsVertical,
	IconSelector,
	IconX,
	IconPrinter,
	IconScript,
	IconPencil,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import DetailsDrawer from "../common/drawer/__DetailsDrawer";
import OverviewDrawer from "./__OverviewDrawer";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { deleteEntityData, showEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice";
import { formatDate, getLoggedInHospitalUser, getLoggedInUser, getUserRole } from "@/common/utils";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { useReactToPrint } from "react-to-print";
import { getDataWithoutStore } from "@/services/apiService";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import PatientUpdateDrawer from "@hospital-components/drawer/PatientUpdateDrawer";
import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";
import OPDPosBN from "@hospital-components/print-formats/opd/OPDPosBN";
import PrescriptionFullBN from "@hospital-components/print-formats/prescription/PrescriptionFullBN";

const tabs = [
	{ label: "All", value: "all" },
	{ label: "Prescription", value: "prescription" },
	{ label: "Non-prescription", value: "non-prescription" },
];

const PER_PAGE = 200;

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Created", key: "created" },
	{ label: "RoomNo", key: "visiting_room" },
	{ label: "InvoiceID", key: "invoice" },
	{ label: "PatientID", key: "patient_id" },
	{ label: "Name", key: "name" },
	{ label: "Mobile", key: "mobile" },
	{ label: "Patient", key: "patient_payment_mode_name" },
	{ label: "Total", key: "total" },
	{ label: "CreatedBy", key: "created_by" },
];

export default function Table({ module, height, closeTable, availableClose = false }) {
	const csvLinkRef = useRef(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const listData = useSelector((state) => state.crud[module].data);
	const hospitalConfig = getLoggedInHospitalUser();
	const prescriptionRef = useRef(null);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const [openedPatientUpdate, { open: openPatientUpdate, close: closePatientUpdate }] = useDisclosure(false);
	const [singlePatientData, setSinglePatientData] = useState({});
	const opdRoomIds = hospitalConfig?.particular_details?.opd_room_ids;

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});
	const handlePos = useReactToPrint({
		content: () => posRef.current,
	});

	const handleA4 = useReactToPrint({
		content: () => a4Ref.current,
	});

	const handlePrescriptionOption = useReactToPrint({
		content: () => prescriptionRef.current,
	});
	const [processTab, setProcessTab] = useState("all");
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});

	const [printData, setPrintData] = useState({});
	const [type, setType] = useState(null);

	const posRef = useRef(null);
	const a4Ref = useRef(null);
	const userRoles = getUserRole();

	useEffect(() => {
		if (type === "a4") {
			handleA4();
		} else if (type === "pos") {
			handlePos();
		} else if (type === "prescription") {
			handlePrescriptionOption();
		}
	}, [printData, type]);

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const user = getLoggedInUser();

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
		filterParams: {
			patient_mode: "opd",
			term: form.values.keywordSearch,
			room_id: form.values.room_id,
			prescription_mode: processTab,
			created: form.values.created,
			created_by_id:
				userRoles.includes("operator_manager") || userRoles.includes("admin_administrator")
					? undefined
					: user?.id,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const handleView = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const handleDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: {
				confirm: "Confirm",
				cancel: "Cancel",
			},
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDeleteSuccess(id),
		});
	};

	const handleDeleteSuccess = async (id) => {
		const resultAction = await dispatch(
			deleteEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.VISIT.DELETE}/${id}`,
				module,
				id,
			})
		);
		if (deleteEntityData.fulfilled.match(resultAction)) {
			dispatch(setRefetchData({ module, refetching: true }));
			notifications.show({
				color: SUCCESS_NOTIFICATION_COLOR,
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});
			navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("DeleteFailed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handlePrescription = async (prescription_id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescription_id}`);
	};

	const handleA4Print = async (id) => {
		const res = await getDataWithoutStore({ url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${id}` });
		setPrintData(res.data);
		setType("a4");
	};

	const handlePosPrint = async (id) => {
		const res = await getDataWithoutStore({ url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${id}` });
		setPrintData(res.data);
		setType("pos");
	};

	const handlePrescriptionPrint = async (prescription_id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${prescription_id}`,
		});

		setPrintData(res.data);
		setType("prescription");
	};

	const handleProcessPrescription = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleProcessConfirmation(id),
		});
	};

	const handleProcessConfirmation = async (id) => {
		const resultAction = await dispatch(
			showEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.SEND_TO_PRESCRIPTION}/${id}`,
				module,
				id,
			})
		).unwrap();
		const prescription_id = resultAction?.data?.data.id;
		if (prescription_id) {
			if (closeTable) closeTable();
			navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescription_id}`);
		} else {
			console.error(resultAction);
			showNotificationComponent(t("Something Went wrong , please try again"), "red.6", "lightgray");
		}
	};

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			created: formatDate(item?.created_at),
			visiting_room: item?.visiting_room ?? "",
			invoice: item?.invoice ?? "",
			patient_id: item?.patient_id ?? "",
			name: item?.name ?? "",
			mobile: item?.mobile ?? "",
			patient_payment_mode_name: item?.patient_payment_mode_name ?? "",
			total: item?.total ?? "",
			created_by: item?.created_by ?? "N/A",
		})) || [];

	const handleCSVDownload = () => {
		if (csvLinkRef?.current?.link) {
			csvLinkRef.current.link.click();
		}
	};

	const patientUpdate = async (e, id) => {
		e.stopPropagation();

		const { data } = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VIEW}/${id}`,
		});

		setSinglePatientData(data);

		setTimeout(() => openPatientUpdate(), 100);
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("VisitInformation")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={processTab} onChange={setProcessTab}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab) => (
								<Tabs.Tab
									value={tab.value}
									ref={setControlRef(tab)}
									className={filterTabsCss.tab}
									key={tab.value}
								>
									{t(tab.label)}
								</Tabs.Tab>
							))}
							<FloatingIndicator
								target={processTab ? controlsRefs[processTab] : null}
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
						{t("VisitOverview")}
					</Button>
					{availableClose ? (
						<Flex gap="xs" align="center">
							<Button
								onClick={closeTable}
								variant="outline"
								size="xs"
								radius="es"
								leftSection={<IconX size={16} />}
								color="var(--theme-delete-color)"
							>
								{t("Close")}
							</Button>
						</Flex>
					) : null}
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch module={module} form={form} handleCSVDownload={handleCSVDownload} />
			</Box>
			<Box className="border-top-none" px="sm">
				<DataTable
					striped
					highlightOnHover
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
					records={records}
					onRowClick={({ record }) => {
						handleView(record?.prescription_id);
					}}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (_, index) => index + 1,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDate(item?.created_at)}</Text>,
						},
						{ accessor: "visiting_room", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "patient_payment_mode_name", sortable: true, title: t("Patient") },
						{ accessor: "total", title: t("Total") },
						{
							accessor: "created_by",
							title: t("CreatedBy"),
							render: (item) => item?.created_by || "N/A",
						},
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => {
								return (
									<Flex justify="flex-end">
										{formatDate(new Date()) === formatDate(values?.created_at) && (
											<ActionIcon
												variant="transparent"
												onClick={(e) => patientUpdate(e, values?.id)}
											>
												<IconPencil size={18} color="var(--theme-success-color)" />
											</ActionIcon>
										)}
										<Group
											onClick={(e) => e.stopPropagation()}
											gap={4}
											justify="right"
											wrap="nowrap"
										>
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
														className="border-left-radius-none"
														variant="transparent"
														color="var(--theme-menu-three-dot)"
														radius="es"
														aria-label="Settings"
													>
														<IconDotsVertical height={18} width={18} stroke={1.5} />
													</ActionIcon>
												</Menu.Target>
												<Menu.Dropdown>
													<Menu.Item
														leftSection={
															<IconScript
																style={{
																	width: rem(14),
																	height: rem(14),
																}}
															/>
														}
														onClick={() => handleA4Print(values?.id)}
													>
														{t("A4Print")}
													</Menu.Item>
													<Menu.Item
														leftSection={
															<IconPrinter
																style={{
																	width: rem(14),
																	height: rem(14),
																}}
															/>
														}
														onClick={() => handlePosPrint(values?.id)}
													>
														{t("Pos")}
													</Menu.Item>
													{values?.prescription_id && (
														<>
															<Menu.Item
																leftSection={
																	<IconPrinter
																		style={{
																			width: rem(14),
																			height: rem(14),
																		}}
																	/>
																}
																onClick={() =>
																	handlePrescriptionPrint(values?.prescription_id)
																}
															>
																{t("Prescription")}
															</Menu.Item>
														</>
													)}
												</Menu.Dropdown>
											</Menu>
										</Group>
									</Flex>
								);
							},
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DataTableFooter indexData={listData} module="visit" />
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}

			<OverviewDrawer opened={openedOverview} close={closeOverview} />

			<OPDA4BN data={printData} ref={a4Ref} />
			<OPDPosBN data={printData} ref={posRef} />
			<PrescriptionFullBN data={printData} ref={prescriptionRef} />

			<PatientUpdateDrawer
				type="opd"
				opened={openedPatientUpdate}
				close={closePatientUpdate}
				data={singlePatientData}
			/>

			{/* Hidden CSV link for exporting current table rows */}
			<CSVLink
				data={csvData}
				headers={CSV_HEADERS}
				filename={`visits-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
		</Box>
	);
}
