import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	ActionIcon, Badge,
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
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords, formatDate } from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { modals } from "@mantine/modals";
import { errorNotification } from "@components/notification/errorNotification";
import PatientUpdateDrawer from "@hospital-components/drawer/PatientUpdateDrawer";
import usePagination from "@hooks/usePagination";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const PER_PAGE = 20;

const tabs = [
	{ label: "Admission", value: "admission" },
	{ label: "Billing", value: "billing" },
	{ label: "Admitted", value: "admitted" },
	{ label: "Revised", value: "revised" },
];

const ALLOWED_CONFIRMED_ROLES = [ "doctor_ipd", "operator_emergency", "admin_administrator" ];

export default function _Table({ module }) {
	const { mainAreaHeight } = useMainAreaHeight();
	const { userRoles } = useAppLocalStore();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const height = mainAreaHeight - 158;
	const [ openedActions, { open: openActions, close: closeActions } ] = useDisclosure(false);
	const [ rootRef, setRootRef ] = useState(null);
	const [ controlsRefs, setControlsRefs ] = useState({});
	const filterData = useSelector((state) => state.crud[ module ].filterData);
	const navigate = useNavigate();
	const [ processTab, setProcessTab ] = useState("admission");
	const [ selectedPrescriptionId, setSelectedPrescriptionId ] = useState(null);
	const billingInvoiceRef = useRef(null);
	const [ billingPrintData, setBillingPrintData ] = useState(null);
	const admissionFormRef = useRef(null);
	const [ admissionFormPrintData, setAdmissionFormPrintData ] = useState(null);
	const [ actionType, setActionType ] = useState("change");
	const [ drawerPatientId, setDrawerPatientId ] = useState(null);
	const [ openedPatientUpdate, { open: openPatientUpdate, close: closePatientUpdate } ] = useDisclosure(false);
	const [ singlePatientData, setSinglePatientData ] = useState({});

	// =============== form for action drawer fields ================
	const actionForm = useForm({
		initialValues: {
			change_mode: "",
			comment: "",
		},
	});

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: "",
			room_id: "",
		},
	});

	const setControlRef = (val) => (node) => {
		controlsRefs[ val ] = node;
		setControlsRefs(controlsRefs);
	};

	const handleAdmissionOverview = (id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.VIEW}/${id}`);
	};

	const { scrollRef, records, fetching, sortStatus, setSortStatus, page, total, perPage, handlePageChange } =
		usePagination({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX,
			filterParams: {
				name: filterData?.name,
				patient_mode: "ipd",
				ipd_mode: processTab,
				created: form.values.created,
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
						acc[ key ] = fieldErrors[ key ][ 0 ];
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
		}
	}

	// =============== handle drawer close with form reset ================
	const handleCloseActions = () => {
		actionForm.reset();
		setActionType("change");
		closeActions();
	};

	const processColorMap = {
		admitted: "red",
		paid: "green",
		ipd: "orange",
		billing: "blue",
		New: "cyan",
		revised: "yellow",
		canceled: "gray",
		closed: "purple"
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
								target={processTab ? controlsRefs[ processTab ] : null}
								parent={rootRef}
								className={filterTabsCss.indicator}
							/>
						</Tabs.List>
					</Tabs>
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} />
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
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							render: (item) => (
								<Text fz="xs" onClick={() => handleView(item.id)} className="activate-link">
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{
							accessor: "parent_invoice_mode",
							title: t("PatientMode"),
							render: (item) => capitalizeWords(item.parent_invoice_mode),
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "invoice", title: t("IPD ID") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "gender", title: t("Gender") },
						{ accessor: "admit_consultant_name", title: t("Consultant") },
						{ accessor: "admit_unit_name", title: t("Unit") },
						{ accessor: "admit_department_name", title: t("Department") },
						{ accessor: "admit_doctor_name", title: t("Doctor") },
						{ accessor: "room_name", title: t("Cabin/Bed") },
						{
							accessor: "total",
							title: t("Amount"),
							render: (item) => t(item.total),
						},
						{
							accessor: "process",
							textAlign: "center",
							title: t("Process"),
							render: (item) => {
								const color = processColorMap[ item.process ] || ""; // fallback for unknown status
								return (
									<Badge size="xs" radius="sm" color={color}>
										{item.process || 'empty'}
									</Badge>
								);
							},
							cellsClassName: tableCss.statusBackground,
						},
						{
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (item) => (
								<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
									{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
										(item.process?.toLowerCase() === "confirmed" ||
											item.process?.toLowerCase() === "billing") && (
											<Button
												variant="filled"
												onClick={() => {
													openActions();
													setDrawerPatientId(item.uid);
												}}
												color="red.6"
												radius="xs"
												size={"compact-xs"}
												aria-label="Settings"
											>
												{t("Actions")}
											</Button>
										)}
									{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
										item.process?.toLowerCase() === "confirmed" && (
											<Button.Group>
												<Button
													variant="filled"
													onClick={() => handleAdmissionOverview(item.uid)}
													color="var(--theme-primary-color-6)"
													radius="xs"
													size={"compact-xs"}
													aria-label="Settings"
												>
													Process
												</Button>
											</Button.Group>
										)}
									{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
										item.process?.toLowerCase() === "billing" && (
											<Button.Group>
												<Button
													variant="filled"
													onClick={() => handleAdmissionFormPrint(item.id)}
													color="var(--theme-secondary-color-6)"
													radius="xs"
													size={"compact-xs"}
													aria-label="Settings"
												>
													Print
												</Button>
											</Button.Group>
										)}
									{/*{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) && item.process?.toLowerCase() === "admitted" && (
										<Button.Group>
											<Button
												variant="filled"
												onClick={() => handleAdmissionFormPrint(item.id)}
												color="var(--theme-warning-color)"
												radius="xs"
												size={"compact-xs"}
												aria-label="Settings"
												leftSection={<IconPrinter style={{ width: "70%", height: "70%" }} stroke={1.5} />}
											>
												Invoice
											</Button>
										</Button.Group>
									)}
									*/}
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
													<IconFileText
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
												onClick={(e) => {
													e.stopPropagation();
													handleAdmissionFormPrint(item?.id);
												}}
											>
												{t("AdmissionForm")}
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
												onClick={(e) => {
													e.stopPropagation();
													handleBillingInvoicePrint(item?.id);
												}}
											>
												{t("AdmissionInvoice")}
											</Menu.Item>
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
					height={height + 50}
					scrollViewportRef={scrollRef}
					totalRecords={total}
					recordsPerPage={perPage}
					page={page}
					onPageChange={handlePageChange}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
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
			<PatientUpdateDrawer
				type="emergency"
				opened={openedPatientUpdate}
				close={closePatientUpdate}
				data={singlePatientData}
			/>
			{selectedPrescriptionId && (
				<DetailsDrawer opened={openedActions} close={closeActions} prescriptionId={selectedPrescriptionId} />
			)}
			{/* exp */}
			{/* {printData && <IPDPrescriptionFullBN data={printData} ref={prescriptionRef} />} */}
			{billingPrintData && <DetailsInvoiceBN data={billingPrintData} ref={billingInvoiceRef} />}
			{admissionFormPrintData && <AdmissionFormBN data={admissionFormPrintData} ref={admissionFormRef} />}
		</Box>
	);
}
