import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Flex,
	FloatingIndicator,
	Group,
	Menu,
	rem,
	Select,
	Stack,
	Tabs,
	Text,
	Textarea,
} from "@mantine/core";
import {
	IconChevronUp,
	IconDotsVertical,
	IconFileText,
	IconPencil,
	IconPrinter,
	IconSelector,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "@hospital-components/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import ConfirmModal from "../confirm/__ConfirmModal";
import { getAdmissionConfirmFormInitialValues } from "../helpers/request";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import IPDPrescriptionFullBN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullBN";
import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import useVendorDataStoreIntoLocalStorage from "@hooks/local-storage/useVendorDataStoreIntoLocalStorage";
import { setInsertType } from "@/app/store/core/crudSlice";
import { modals } from "@mantine/modals";
import { errorNotification } from "@components/notification/errorNotification";
import PatientUpdateDrawer from "@hospital-components/drawer/PatientUpdateDrawer";
import { CSVLink } from "react-csv";

const PER_PAGE = 20;

const tabs = [
	{ label: "Bed/Cabin", value: "all" },
	{ label: "Empty", value: "empty" },
	{ label: "Occupied", value: "occupied" },
];

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Created", key: "created" },
	{ label: "Name", key: "name" },
	{ label: "Status", key: "status" },
	{ label: "Gender", key: "gender" },
	{ label: "IPD", key: "ipd" },
];

const ALLOWED_CONFIRMED_ROLES = ["doctor_ipd", "operator_emergency", "admin_administrator"];

export default function _Table({ module }) {
	const csvLinkRef = useRef(null);
	const { userRoles } = useAppLocalStore();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const confirmForm = useForm(getAdmissionConfirmFormInitialValues());
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 158;
	const [openedActions, { open: openActions, close: closeActions }] = useDisclosure(false);
	const [openedRoomBedTransfer, { open: openRoomBedTransfer, close: closeRoomBedTransfer }] = useDisclosure(false);
	const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});
	const listData = useSelector((state) => state.crud[module]?.data);
	const navigate = useNavigate();
	const [selectedId, setSelectedId] = useState(null);
	const [processTab, setProcessTab] = useState("all");
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [printData, setPrintData] = useState(null);
	const admissionFormRef = useRef(null);
	const prescriptionRef = useRef(null);
	const billingInvoiceRef = useRef(null);
	const [billingPrintData, setBillingPrintData] = useState(null);
	const [admissionFormPrintData, setAdmissionFormPrintData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [actionType, setActionType] = useState("change");
	const [actionFormData, setActionFormData] = useState(null);
	const [drawerPatientId, setDrawerPatientId] = useState(null);
	const [openedPatientUpdate, { open: openPatientUpdate, close: closePatientUpdate }] = useDisclosure(false);
	const [singlePatientData, setSinglePatientData] = useState({});
	const [selectedRoom, setSelectedRoom] = useState({});

	// =============== form for action drawer fields ================
	const actionForm = useForm({
		initialValues: {
			change_mode: "",
			comment: "",
		},
	});

	const roomTransferForm = useForm({
		initialValues: {
			comment: "",
			room_id: "",
		},
	});

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const handleAdmissionOverview = (id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.VIEW}/${id}`);
	};

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.BED_CABIN.INDEX,
		filterParams: {
			mode: processTab,
			term: form.values.keywordSearch,
		},
		perPage: PER_PAGE,
		sortByKey: "updated_at",
		direction: "desc",
	});

	const handleView = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	const printBillingInvoice = useReactToPrint({
		content: () => billingInvoiceRef.current,
	});

	const printAdmissionForm = useReactToPrint({
		content: () => admissionFormRef.current,
	});

	const handleBillingInvoicePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.ADMISSION_VIEW}/${id}`,
		});
		setBillingPrintData(res.data);
		requestAnimationFrame(printBillingInvoice);
	};

	const handleAdmissionFormPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.ADMISSION_VIEW}/${id}`,
		});
		setAdmissionFormPrintData(res.data);
		requestAnimationFrame(printAdmissionForm);
	};

	const patientUpdate = async (e, id) => {
		e.stopPropagation();

		const { data } = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VIEW}/${id}`,
		});
		setSinglePatientData(data);
		setTimeout(() => openPatientUpdate(), 100);
	};

	const roomBedTransfer = async (e, id, item) => {
		e.stopPropagation();

		const { data } = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INTERNAL_TRANSFER}/${id}`,
		});

		setSelectedRoom({ ...item, availableRooms: data });

		setTimeout(() => openRoomBedTransfer(), 100);
	};

	const handleActionSubmit = () => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(),
		});
	};

	async function handleConfirmModal() {
		setIsLoading(true);
		try {
			const actionData = {
				change_mode: actionType ?? "change",
				comment: actionForm.values.comment,
			};

			const payload = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.CHANGE}/${drawerPatientId}`,
				data: actionData,
				module,
			};

			const resultAction = await dispatch(updateEntityData(payload));

			// ❌ Validation error
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload?.errors;

				if (fieldErrors) {
					const errorObject = Object.keys(fieldErrors).reduce((acc, key) => {
						acc[key] = fieldErrors[key][0];
						return acc;
					}, {});
					form.setErrors(errorObject);
				}
				return;
			}
			// ✅ Success
			if (updateEntityData.fulfilled.match(resultAction)) {
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error?.message || t("SomethingWentWrong"), ERROR_NOTIFICATION_COLOR);
		} finally {
			setDrawerPatientId(null);
			closeActions();
			setIsLoading(false);
		}
	}

	// =============== handle drawer close with form reset ================
	const handleCloseActions = () => {
		actionForm.reset();
		setActionType("change");
		closeActions();
	};

	const handleCloseRoomBedTransfer = () => {
		closeRoomBedTransfer();
		setSelectedRoom({ availableRooms: [] });
	};

	const handleRoomTransferSubmit = async (values) => {
		try {
			const payload = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INTERNAL_TRANSFER_PROCESS}/${selectedRoom?.admission_id}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(payload));
			if (updateEntityData.rejected.match(resultAction)) {
				errorNotification(resultAction.payload?.message || t("SomethingWentWrong"), ERROR_NOTIFICATION_COLOR);

			}
		} catch (error) {
			errorNotification(error?.message || t("SomethingWentWrong"), ERROR_NOTIFICATION_COLOR);
		} finally {
			closeRoomBedTransfer();
			setSelectedRoom({ availableRooms: [] });
			actionForm.reset();
			successNotification(t("RoomTransferSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
		}
	};

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			created: formatDate(item?.admission_date),
			name: item?.display_name || "",
			gender: item?.gender_mode_name || "",
			status: item?.is_booked === 1 ? "Occupied" : "Empty",
			ipd: item?.invoice || "",
		})) || [];
	const handleCSVDownload = () => {
		if (csvLinkRef?.current?.link) {
			csvLinkRef.current.link.click();
		}
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("AdmissionInformation")}
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
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} handleCSVDownload={handleCSVDownload} />
				<CSVLink
					data={csvData}
					headers={CSV_HEADERS}
					filename={`bed-cabin-${formatDate(new Date())}.csv`}
					style={{ display: "none" }}
					ref={csvLinkRef}
				/>
			</Box>
			<Box className="borderRadiusAll border-top-none" px="sm">
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
						if (!record?.prescription_id) return "";
						handleView(record?.prescription_id);
					}}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (_, index) => index + 1,
						},
						{ accessor: "display_name", title: t("Name") },
						{ accessor: "gender_mode_name", title: t("Gender") },
						{ accessor: "payment_mode_name", title: t("PaymentMode") },
						{
							accessor: "is_booked",
							title: t("Status"),
							textAlignment: "right",
							render: (item) => (item.is_booked === 1 ? "Occupied" : "Empty"),
						},
						{
							accessor: "admission_date",
							title: t("Created"),
							textAlignment: "right",
							render: (item) => formatDate(item.admission_date),
						},
						{ accessor: "invoice", title: t("IPD") },
						{ accessor: "customer_name", title: t("Name") },
						{ accessor: "admission_day", title: t("Admission") },
						{ accessor: "consume_day", title: t("Consume") },
						{ accessor: "payment_day", title: t("Consume") },
						{ accessor: "remaining_day", title: t("Remaining") },
						{
							accessor: "process",
							title: t("Process"),
							render: (item) => t(item.process),
						},
						{
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (item) => (
								<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">

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

											{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
												item.process?.toLowerCase() === "admitted" && (
													<>
														<Menu.Item
															leftSection={
																<IconPencil
																	style={{
																		width: rem(14),
																		height: rem(14),
																	}}
																/>
															}
															onClick={(e) => patientUpdate(e, item?.id)}
														>
															{t("PatientUpdate")}
														</Menu.Item>
														<Menu.Item
															leftSection={
																<IconPencil
																	style={{
																		width: rem(14),
																		height: rem(14),
																	}}
																/>
															}
															onClick={(e) =>
																roomBedTransfer(e, item?.admission_id, item)
															}
														>
															{t("Room/Bed Transfer")}
														</Menu.Item>
													</>
												)}
										</Menu.Dropdown>
									</Menu>
								</Group>
							),
						},
					]}
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
			<DataTableFooter indexData={listData} module="bed/cabin" />
			<ConfirmModal
				opened={openedConfirm}
				close={() => {
					closeConfirm();
					setSelectedId(null);
					setActionFormData(null);
				}}
				form={confirmForm}
				selectedId={selectedId}
				module={module}
				actionFormData={actionFormData}
			/>

			<GlobalDrawer opened={openedActions} close={handleCloseActions} title={t("Actions")} size="25%">
				<Box mt="sm">
					<Box component="form" onSubmit={actionForm.onSubmit(handleActionSubmit)} noValidate>
						<Stack gap="md">
							<Select
								label={t("RequestFor")}
								placeholder={t("SelectRequestFor")}
								data={[
									{ value: "change", label: t("Change Room/Cabin") },
									{ value: "change_day", label: t("Change Day") },
									{ value: "cancel", label: t("Cancel") },
								]}
								value={actionType}
								onChange={(value) => {
									setActionType(value);
									actionForm.reset();
								}}
							/>

							<Divider />
							<Stack h={mainAreaHeight - 166} justify="space-between">
								<Box>
									<Textarea
										label={t("Comment")}
										placeholder={t("EnterComment")}
										name="comment"
										{...actionForm.getInputProps("comment")}
										minRows={3}
									/>
								</Box>
								<Button type="submit">{t("Submit")}</Button>
							</Stack>
						</Stack>
					</Box>
				</Box>
			</GlobalDrawer>
			{/* ========== room / bed transfer drawer ========= */}
			<GlobalDrawer
				opened={openedRoomBedTransfer}
				close={handleCloseRoomBedTransfer}
				title={t("Room/Bed Transfer")}
				size="25%"
			>
				<Box mt="sm">
					<Box component="form" onSubmit={roomTransferForm.onSubmit(handleRoomTransferSubmit)} noValidate>
						<Text fw={500} fz="sm" my="xs">
							<strong>Current Room/Cabin:</strong> {selectedRoom?.display_name}
						</Text>
						<Divider />
						<Stack mt="xs" gap="md">
							<Select
								label={t("Room/Cabin")}
								placeholder={t("SelectRequestFor")}
								data={selectedRoom?.availableRooms?.map((room) => ({
									value: room.id?.toString(),
									label: room.name,
								}))}
								value={roomTransferForm.values.room_id}
								onChange={(value) => {
									roomTransferForm.setFieldValue("room_id", value);
								}}
							/>

							<Stack h={mainAreaHeight - 190} justify="space-between">
								<Box>
									<Textarea
										label={t("Comment")}
										placeholder={t("EnterComment")}
										name="comment"
										{...roomTransferForm.getInputProps("comment")}
										minRows={3}
									/>
								</Box>
								<Button type="submit">{t("Submit")}</Button>
							</Stack>
						</Stack>
					</Box>
				</Box>
			</GlobalDrawer>
			<PatientUpdateDrawer
				type="emergency"
				opened={openedPatientUpdate}
				close={closePatientUpdate}
				data={singlePatientData}
			/>
			{selectedPrescriptionId && (
				<DetailsDrawer opened={openedActions} close={closeActions} prescriptionId={selectedPrescriptionId} />
			)}
			{printData && <IPDPrescriptionFullBN data={printData} ref={prescriptionRef} />}
			{billingPrintData && <DetailsInvoiceBN data={billingPrintData} ref={billingInvoiceRef} />}
			{admissionFormPrintData && <AdmissionFormBN data={admissionFormPrintData} ref={admissionFormRef} />}
		</Box>
	);
}
