import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Group, Menu, rem, Tabs, Text } from "@mantine/core";
import {
	IconArrowNarrowRight,
	IconChevronUp,
	IconDotsVertical,
	IconFileText,
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
import { useSelector } from "react-redux";
import { formatDate, getUserRole } from "@/common/utils";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import IPDPrescriptionFullBN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullBN";
import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import AdmissionFormBN from "@hospital-components/print-formats/admission/AdmissionFormBN";

const PER_PAGE = 20;

const tabs = [
	{ label: "Confirmed", value: "confirmed" },
	{ label: "Admitted", value: "admitted" },
];

const ALLOWED_CONFIRMED_ROLES = ["doctor_ipd", "operator_emergency", "admin_administrator"];

export default function _Table({ module }) {
	const { t } = useTranslation();
	const confirmForm = useForm(getAdmissionConfirmFormInitialValues());
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 158;
	const [opened, { open, close }] = useDisclosure(false);
	const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});
	const filterData = useSelector((state) => state.crud[module].filterData);
	const navigate = useNavigate();
	const [selectedId, setSelectedId] = useState(null);
	const [processTab, setProcessTab] = useState("confirmed");
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const userRoles = getUserRole();
	const [printData, setPrintData] = useState(null);
	const admissionFormRef = useRef(null);
	const prescriptionRef = useRef(null);
	const billingInvoiceRef = useRef(null);
	const [billingPrintData, setBillingPrintData] = useState(null);
	const [admissionFormPrintData, setAdmissionFormPrintData] = useState(null);

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
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
		filterParams: {
			name: filterData?.name,
			patient_mode: "ipd",
			created: filterData.created,
			process: processTab,
			term: filterData.keywordSearch,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const handleView = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	const printPrescription = useReactToPrint({
		content: () => prescriptionRef.current,
	});

	const printBillingInvoice = useReactToPrint({
		content: () => billingInvoiceRef.current,
	});

	const printAdmissionForm = useReactToPrint({
		content: () => admissionFormRef.current,
	});

	const handleBillingInvoicePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setBillingPrintData(res.data);
		requestAnimationFrame(printBillingInvoice);
	};

	const handlePrescriptionPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${id}`,
		});
		setPrintData(res.data);
		requestAnimationFrame(printPrescription);
	};

	const handleAdmissionFormPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setAdmissionFormPrintData(res.data);
		requestAnimationFrame(printAdmissionForm);
	};

	return (
		<Box w="100%" bg="white" style={{ borderRadius: "4px" }}>
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
								<Text fz="xs" onClick={() => handleView(item.id)} className="activate-link">
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "gender", title: t("Gender") },
						{ accessor: "admit_consultant_name", title: t("Consultant") },
						{ accessor: "admit_unit_name", title: t("Unit") },
						{ accessor: "admit_department_name", title: t("Department") },
						{ accessor: "admit_doctor_name", title: t("Doctor") },
						{ accessor: "visiting_room", title: t("Cabin/Bed") },
						{
							accessor: "total",
							title: t("Amount"),
							render: (item) => t(item.total),
						},
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (item) => (
								<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
									{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
										item.process === "confirmed" && (
											<Button.Group>
												<Button
													variant="filled"
													onClick={() => handleAdmissionOverview(item.uid)}
													color="var(--theme-primary-color-6)"
													radius="xs"
													size={"compact-xs"}
													aria-label="Settings"
													rightSection={
														<IconArrowNarrowRight
															style={{ width: "70%", height: "70%" }}
															stroke={1.5}
														/>
													}
												>
													Process
												</Button>
											</Button.Group>
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
											{item?.prescription_id && (
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
														onClick={(e) => {
															e.stopPropagation();
															handlePrescriptionPrint(item?.prescription_id);
														}}
													>
														{t("Prescription")}
													</Menu.Item>
												</>
											)}

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
												{t("BillingInvoice")}
											</Menu.Item>
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
										</Menu.Dropdown>
									</Menu>
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
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DataTableFooter indexData={records} module="visit" />
			<ConfirmModal
				opened={openedConfirm}
				close={() => {
					closeConfirm();
					setSelectedId(null);
				}}
				form={confirmForm}
				selectedId={selectedId}
				module={module}
			/>
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
			{printData && <IPDPrescriptionFullBN data={printData} ref={prescriptionRef} />}
			{billingPrintData && <DetailsInvoiceBN data={billingPrintData} ref={billingInvoiceRef} />}
			{admissionFormPrintData && <AdmissionFormBN data={admissionFormPrintData} ref={admissionFormRef} />}
		</Box>
	);
}
