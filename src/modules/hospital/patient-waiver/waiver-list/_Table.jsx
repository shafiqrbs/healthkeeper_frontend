import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Button, Flex, FloatingIndicator, Group, Stack, Table, Tabs, Text, Checkbox } from "@mantine/core";
import { IconArrowNarrowRight, IconChevronUp, IconSelector, IconPrinter } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "@hospital-components/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import FreeServiceFormBN from "@hospital-components/print-formats/billing/FreeServiceFormBN";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { successNotification } from "@components/notification/successNotification";
import { SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { setRefetchData } from "@/app/store/core/crudSlice";

const PER_PAGE = 20;

const tabs = [
	{ label: "OPD Investigation", value: "opd_investigation" },
	{ label: "IPD Investigation", value: "ipd_investigation" },
	{ label: "IPD Room/Bed", value: "ipd_room" },
];

const ALLOWED_PRINT_ROLES = [
	"doctor_opd",
	"doctor_ipd",
	"doctor_emergency",
	"admin_doctor",
	"doctor_approve_opd",
	"doctor_approve_ipd",
	"doctor_ipd_confirm",
	"admin_administrator",
];

const ALLOWED_CONFIRMED_ROLES = ["doctor_ipd_confirm", "admin_administrator"];

const ALLOWED_APPROVED_ROLES = ["doctor_approve_opd", "doctor_approve_ipd", "admin_administrator"];

export default function _Table({ module }) {
	const [selectedRecords, setSelectedRecords] = useState([]);
	const dispatch = useDispatch();
	// Mantine + React Hooks
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 158;

	// Drawer states
	const [opened, { open, close }] = useDisclosure(false);
	const [approveOpen, { open: openApprove, close: closeApprove }] = useDisclosure(false);

	// Tab indicator refs
	const rootRef = useRef(null);
	const controlsRefs = useRef({});

	// Auth & Redux
	const { userRoles } = useAppLocalStore();
	const { filterData } = useSelector((state) => state.crud[module]);

	// Table & Modal states
	const [processTab, setProcessTab] = useState("opd_investigation");
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

	// Waiver full object (patient info + particulars)
	const [waiverData, setWaiverData] = useState(null);
	const [selectedWaiverList, setSelectedWaiverList] = useState({});

	// Print handling
	const billingInvoiceRef = useRef(null);
	const [billingPrintData, setBillingPrintData] = useState(null);

	const printBillingInvoice = useReactToPrint({
		content: () => billingInvoiceRef.current,
	});

	// Form state
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	// Assign tab indicator refs safely
	const setControlRef = (key) => (el) => {
		if (el) {
			controlsRefs.current[key] = el;
		}
	};

	// Clean drawer closing
	const handleCloseApproveModal = () => {
		closeApprove();
		setSelectedWaiverList({});
		setWaiverData(null);
	};

	// Fetch PRINT VIEW data + open modal
	const handleOpenApproveModal = async (item) => {
		setSelectedWaiverList(item);

		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.PRINT}/${item.uid}`,
		});

		setWaiverData(res?.data || null);

		openApprove();
	};

	// Approve action
	const handleConfirmApproved = async () => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.APPROVE}/${selectedWaiverList.uid}`,
			params: {
				ids: selectedRecords || [],
			},
		});

		if (res.status == 200) {
			dispatch(
				setRefetchData({
					module,
					refetching: true,
				})
			);
			handleCloseApproveModal();
			successNotification(t("ApprovedSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
		}
	};

	// Infinite scroll table loading
	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.INDEX,
		filterParams: {
			mode: processTab,
			created: form.values.created,
			term: form.values.keywordSearch,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	// Drawer opening for prescription view
	const handleView = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	// Print waiver (PDF-like print)
	const handleWaiverPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.PRINT}/${id}`,
		});

		setBillingPrintData(res.data);
		requestAnimationFrame(printBillingInvoice);
	};

	const handleSelectRecord = (event, uid) => {
		if (event.currentTarget.checked) {
			setSelectedRecords([...selectedRecords, uid]);
		} else {
			setSelectedRecords(selectedRecords.filter((id) => id !== uid));
		}
	};

	useEffect(() => {
		if (!waiverData?.invoice_particular) return;

		setSelectedRecords(
			waiverData.invoice_particular.reduce((acc, { is_waiver, id }) => {
				if (is_waiver) acc.push(id);
				return acc;
			}, [])
		);
	}, [waiverData?.invoice_particular]);

	return (
		<Box w="100%" bg="var(--mantine-color-white)" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientFreeWaivers")}
				</Text>

				<Tabs mt="xs" variant="none" value={processTab} onChange={setProcessTab}>
					<Tabs.List ref={rootRef} className={filterTabsCss.list}>
						{tabs.map((tab) => (
							<Tabs.Tab key={tab.value} value={tab.value} ref={setControlRef(tab.value)} className={filterTabsCss.tab}>
								{t(tab.label)}
							</Tabs.Tab>
						))}

						<FloatingIndicator
							target={processTab ? controlsRefs.current[processTab] : null}
							parent={rootRef.current}
							className={filterTabsCss.indicator}
						/>
					</Tabs.List>
				</Tabs>
			</Flex>

			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} />
			</Box>

			<Box className="borderRadiusAll border-top-none" px="sm">
				<DataTable
					records={records}
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
					onRowClick={({ record }) => {
						if (!record?.prescription_id) return alert("NoPrescriptionGenerated");
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
							render: (item) => (
								<Text fz="xs" className="activate-link">
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "gender", title: t("Gender") },
						{ accessor: "created_by_name", title: t("Created By") },
						{ accessor: "checked_by_name", title: t("Checked By") },
						{ accessor: "approved_by_name", title: t("Approved By") },
						{ accessor: "visiting_room", title: t("Cabin/Bed") },
						{
							accessor: "total",
							title: t("Amount"),
							render: (item) => t(item.total),
						},
						{
							title: t("Action"),
							textAlign: "right",
							render: (item) => (
								<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right">
									<Button.Group>
										{userRoles.some((r) => ALLOWED_CONFIRMED_ROLES.includes(r)) && !item.checked_by_name && (
											<Button
												variant="filled"
												onClick={() => handleOpenApproveModal(item)}
												color="var(--theme-primary-color-6)"
												radius="xs"
												size="compact-xs"
												rightSection={<IconArrowNarrowRight stroke={1.5} />}>
												Checked
											</Button>
										)}

										{userRoles.some((r) => ALLOWED_APPROVED_ROLES.includes(r)) &&
											item.checked_by_name &&
											!item.approved_by_name && (
												<Button
													variant="filled"
													onClick={() => handleOpenApproveModal(item)}
													color="var(--theme-primary-color-6)"
													radius="xs"
													size="compact-xs"
													rightSection={<IconArrowNarrowRight stroke={1.5} />}
												>
													Approve
												</Button>
											)}

										{userRoles.some((r) => ALLOWED_PRINT_ROLES.includes(r)) && (
											<Button
												variant="filled"
												onClick={() => handleWaiverPrint(item.uid)}
												color="var(--theme-secondary-color-6)"
												radius="xs"
												size="compact-xs"
												leftSection={<IconPrinter stroke={1.2} />}
											>
												Print
											</Button>
										)}
									</Button.Group>
								</Group>
							),
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
						sorted: <IconChevronUp size={14} />,
						unsorted: <IconSelector size={14} />,
					}}
				/>
			</Box>

			<DataTableFooter indexData={records} module="waiver" />

			{selectedPrescriptionId && <DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />}

			{billingPrintData && <FreeServiceFormBN data={billingPrintData} ref={billingInvoiceRef} />}

			<GlobalDrawer opened={approveOpen} close={handleCloseApproveModal} title={t("Approve")}>
				<Box>
					<Stack h={mainAreaHeight - 62} justify="space-between">
						<Box>
							<Text size="lg" fw={600} my="xs">
								{t("ApproveThisWaiver")}
							</Text>

							{waiverData && (
								<Box mb="md" p="sm" style={{ border: "1px solid #eee", borderRadius: 6 }}>
									<Text size="sm">
										<strong>{t("Name")}:</strong> {waiverData?.name || "N/A"}
									</Text>
									<Text size="sm">
										<strong>{t("PatientID")}:</strong> {waiverData?.patient_id}
									</Text>
									<Text size="sm">
										<strong>{t("Mobile")}:</strong> {waiverData?.mobile}
									</Text>
									<Text size="sm">
										<strong>{t("Gender")}:</strong> {waiverData?.gender}
									</Text>
									<Text size="sm">
										<strong>{t("Invoice")}:</strong> {waiverData?.invoice}
									</Text>
									<Text size="sm">
										<strong>{t("Date")}:</strong> {waiverData?.created}
									</Text>
								</Box>
							)}

							{waiverData?.invoice_particular?.length > 0 ? (
								<Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs" fontSize="sm">
									<Table.Thead>
										<Table.Tr>
											<Table.Th/>
											<Table.Th>#</Table.Th>
											<Table.Th>{t("Item")}</Table.Th>
											<Table.Th>{t("Qty")}</Table.Th>
											<Table.Th>{t("Price")}</Table.Th>
											<Table.Th>{t("Total")}</Table.Th>
										</Table.Tr>
									</Table.Thead>

									<Table.Tbody>
										{waiverData?.invoice_particular?.map((p, idx) => (
											<Table.Tr key={idx}>
												<Table.Td>
													<Checkbox
														onChange={(event) => handleSelectRecord(event, p.id)}
														checked={selectedRecords.includes(p.id)}
													/>
												</Table.Td>
												<Table.Td>{idx + 1}</Table.Td>
												<Table.Td>{p.item_name || "N/A"}</Table.Td>
												<Table.Td>{p.quantity ?? 0}</Table.Td>
												<Table.Td>{p.price ?? 0}</Table.Td>
												<Table.Td>{p.sub_total ?? 0}</Table.Td>
											</Table.Tr>
										))}
									</Table.Tbody>
								</Table>
							) : (
								<Text size="sm" c="dimmed">
									{t("NoDataFound")}
								</Text>
							)}
						</Box>

						<Button mt="lg" fullWidth onClick={handleConfirmApproved}>
							{!waiverData?.checked_by_id ? t("Check") : t("Approve")}
						</Button>
					</Stack>
				</Box>
			</GlobalDrawer>
		</Box>
	);
}
