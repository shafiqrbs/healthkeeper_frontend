import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	FloatingIndicator,
	Grid,
	Group,
	Menu,
	Tabs,
	Text,
} from "@mantine/core";
import {
	IconArrowRight,
	IconDotsVertical,
	IconPencil,
	IconPrinter,
	IconScript,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import DetailsDrawer from "./__DetailsDrawer";
import OverviewDrawer from "./__OverviewDrawer";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { showEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import {formatDate, getLoggedInHospitalUser} from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import CompactDrawer from "@components/drawers/CompactDrawer";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { modals } from "@mantine/modals";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { getDataWithoutStore } from "@/services/apiService";
import PatientUpdateDrawer from "@hospital-components/drawer/PatientUpdateDrawer";
import EmergencyA4BN from "@hospital-components/print-formats/emergency/EmergencyA4BN";
import EmergencyPosBN from "@hospital-components/print-formats/emergency/EmergencyPosBN";
import Prescription from "@hospital-components/print-formats/prescription/PrescriptionFullBN";
import { useReactToPrint } from "react-to-print";
import VitalUpdateDrawer from "@hospital-components/drawer/VitalUpdateDrawer";

const PER_PAGE = 200;
const tabs = [
	{ label: "All", value: "all" },
	{ label: "Admission", value: "admission" },
	{ label: "Prescription", value: "prescription" },
	{ label: "Non-prescription", value: "non-prescription" },
];
const ALLOWED_DOCTOR_ROLES = ["doctor_emergency", "admin_administrator"];

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Created", key: "created" },
	{ label: "CreatedBy", key: "created_by" },
	{ label: "PatientID", key: "patient_id" },
	{ label: "Name", key: "name" },
	{ label: "Mobile", key: "mobile" },
	{ label: "Total", key: "total" },
];

export default function Table({ module }) {
	const csvLinkRef = useRef(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module]?.data);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 34;
	const [selectedId, setSelectedId] = useState(null);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const [openedAdmission, { open: openAdmission, close: closeAdmission }] = useDisclosure(false);
	const { user, userRoles } = useAppLocalStore();
	const [processTab, setProcessTab] = useState("all");
	const [openedPatientUpdate, { open: openPatientUpdate, close: closePatientUpdate }] =
		useDisclosure(false);
	const [singlePatientData, setSinglePatientData] = useState({});
	// removed unused 'today'
	const hospitalConfig = getLoggedInHospitalUser();
	const opdRoomIds = hospitalConfig?.particular_details?.opd_room_ids;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const referredForm = useForm({
		initialValues: {
			referred_mode: "admission",
			admission_comment: "",
		},
		validate: {
			admission_comment: hasLength({ min: 1 }),
		},
	});

	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});
	const [printData, setPrintData] = useState({});
	const [type, setType] = useState(null);
	const posRef = useRef(null);
	const a4Ref = useRef(null);
	const prescriptionRef = useRef(null);
	const handlePos = useReactToPrint({
		content: () => posRef.current,
	});
	const handleA4 = useReactToPrint({
		content: () => a4Ref.current,
	});
	const handlePrescriptionOption = useReactToPrint({
		content: () => prescriptionRef.current,
	});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};
	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } =
		useInfiniteTableScroll({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
			filterParams: {
				patient_mode: "emergency",
				term: form.values?.keywordSearch,
				room_id: form.values?.room_id,
				room_ids: opdRoomIds,
				prescription_mode: processTab,
				created: form.values.created,
			},
			perPage: PER_PAGE,
			sortByKey: "created_at",
			direction: "desc",
		});

	const handleView = () => {
		open();
	};

	const handleOpenViewOverview = () => {
		openOverview();
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
			navigate(
				`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescription_id}`
			);
		} else {
			console.error(resultAction);
			showNotificationComponent(
				t("Something Went wrong , please try again"),
				"red.6",
				"lightgray"
			);
		}
	};

	const handlePrescription = async (prescription_id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX}/${prescription_id}`);
	};

	const handleSendToAdmission = (id) => {
		setSelectedId(id);
		openAdmission();
		// navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX);
	};

	async function handleConfirmSubmission(values) {
		try {
			const value = {
				url: `${MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.REFERRED}/${selectedId}`,
				data: { ...values },
				module,
			};
			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					referredForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				referredForm.reset();
				setSelectedId(null);
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const handleAdmission = () => {
		handleConfirmSubmission(referredForm.values);
		closeAdmission();
	};

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			created: formatDate(item?.created_at),
			created_by: item?.created_by || "N/A",
			patient_id: item?.patient_id || "",
			name: item?.name || "",
			mobile: item?.mobile || "",
			total: item?.total || "",
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

	useEffect(() => {
		if (type === "a4") {
			handleA4();
		} else if (type === "pos") {
			handlePos();
		} else if (type === "prescription") {
			handlePrescriptionOption();
		}
	}, [printData, type]);

	const handleA4Print = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${id}`,
		});
		setPrintData(res.data);
		setType("a4");
	};

	const handlePosPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX}/${id}`,
		});
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

	return (
		<Box w="100%" bg="var(--mantine-color-white)" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("EmergencyInformation")}
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
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} module={module} handleCSVDownload={handleCSVDownload} />
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
					records={records}
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
								<Text
									fz="xs"
									onClick={() => handleView(item.id)}
									className="activate-link text-nowrap"
								>
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{
							accessor: "created_by",
							title: t("CreatedBy"),
							render: (item) => item.created_by || "N/A",
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "total", title: t("Total") },
						{
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Flex justify="flex-end">
									<Group gap={4} justify="right" wrap="nowrap">
										{userRoles.some((role) =>
											ALLOWED_DOCTOR_ROLES.includes(role)
										) && (
											<>
												{["New", "In-progress"].includes(values?.process) &&
													values?.process !== "Closed" &&
													!values?.referred_mode &&
													(values?.prescription_id ? (
														<Button
															miw={124}
															variant="filled"
															bg="var(--theme-primary-color-4)"
															c="white"
															fw={"400"}
															size="compact-xs"
															onClick={() =>
																handlePrescription(
																	values.prescription_id
																)
															}
															radius="es"
															rightSection={
																<IconArrowRight size={18} />
															}
														>
															{t("Prescription")}
														</Button>
													) : (
														<Button
															miw={124}
															variant="filled"
															bg="var(--theme-primary-color-6)"
															c="white"
															size="compact-xs"
															onClick={() =>
																handleProcessPrescription(values.id)
															}
															radius="es"
															fw={"400"}
															rightSection={
																<IconArrowRight size={18} />
															}
															className="border-right-radius-none"
														>
															{t("Prescription")}
														</Button>
													))}
											</>
										)}

										{values.process === "New" && !values.referred_mode && (
											<Button
												variant="filled"
												bg="var(--theme-success-color)"
												c="white"
												size="compact-xs"
												onClick={() => handleSendToAdmission(values.id)}
												radius="es"
												fw={"400"}
												rightSection={<IconArrowRight size={18} />}
												className="border-right-radius-none"
											>
												{t("Admission")}
											</Button>
										)}

										{formatDate(new Date()) ===
											formatDate(values?.created_at) && (
											<ActionIcon
												variant="transparent"
												onClick={(e) => patientUpdate(e, values?.id)}
											>
												<IconPencil
													size={18}
													color="var(--theme-success-color)"
												/>
											</ActionIcon>
										)}

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
													variant="transparent"
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
																handlePrescriptionPrint(
																	values?.prescription_id
																)
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
							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 118}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
				/>
			</Box>
			<DataTableFooter indexData={listData} module="emergency" />
			<DetailsDrawer opened={opened} close={close} />
			<OverviewDrawer opened={openedOverview} close={closeOverview} />

			<CompactDrawer
				opened={openedAdmission}
				close={closeAdmission}
				save={handleAdmission}
				position="right"
				size="30%"
				keepMounted={false}
				bg="var(--mantine-color-white)"
				title={t("Admission")}
				form={referredForm}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("AdmissionComment")}
							form={referredForm}
							name="admission_comment"
							mt={0}
							id="comment"
							showRightSection={false}
							required
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>

			{/* Hidden CSV link for exporting current table rows */}
			<CSVLink
				data={csvData}
				headers={CSV_HEADERS}
				filename={`emergency-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>

			<PatientUpdateDrawer
				type="emergency"
				opened={openedPatientUpdate}
				close={closePatientUpdate}
				data={singlePatientData}
			/>
			<OverviewDrawer opened={openedOverview} close={closeOverview} />
			<EmergencyA4BN data={printData} ref={a4Ref} />
			<EmergencyPosBN data={printData} ref={posRef} />
			<Prescription data={printData} ref={prescriptionRef} />
		</Box>
	);
}
