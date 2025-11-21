import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Button, Flex, FloatingIndicator, Group, Tabs, Text } from "@mantine/core";
import { IconArrowNarrowRight, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "@hospital-components/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import { formatDate, getUserRole } from "@/common/utils";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import IPDPrescriptionFullBN from "@hospital-components/print-formats/ipd/IPDPrescriptionFullBN";
import DetailsInvoiceBN from "@hospital-components/print-formats/billing/DetailsInvoiceBN";
import { modals } from "@mantine/modals";
import FreeServiceFormBN from "@hospital-components/print-formats/billing/FreeServiceFormBN";

const PER_PAGE = 20;

const tabs = [
	{ label: "OPD Investigation", value: "opd_investigation" },
	{ label: "IPD Investigation", value: "ipd_investigation" },
	{ label: "IPD Room/Bed", value: "ipd_room" },
];

const ALLOWED_CONFIRMED_ROLES = [
	"doctor_ipd",
	"doctor_emergency",
	"doctor_ipd",
	"admin_doctor",
	"doctor_approve_opd",
	"doctor_approve_ipd",
	"doctor_ipd_confirm",
	"admin_administrator",
];

export default function _Table({ module }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 158;
	const [opened, { open, close }] = useDisclosure(false);
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});
	const filterData = useSelector((state) => state.crud[module].filterData);
	const navigate = useNavigate();
	const [processTab, setProcessTab] = useState("opd_investigation");
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const userRoles = getUserRole();
	const [printData, setPrintData] = useState(null);
	const prescriptionRef = useRef(null);
	const billingInvoiceRef = useRef(null);
	const [billingPrintData, setBillingPrintData] = useState(null);

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const handlePatientForm = (id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.FREE_PATIENT.UPDATE}/${id}`, { replace: true });
	};
	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.INDEX,
		filterParams: {
			name: filterData?.name,
			mode: processTab,
			//	term: filterData.keywordSearch,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const handleView = (id) => {
		setSelectedPrescriptionId(id);
		setTimeout(() => open(), 10);
	};

	const printBillingInvoice = useReactToPrint({
		content: () => billingInvoiceRef.current,
	});

	const handleWaiverPrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setBillingPrintData(res.data);
		requestAnimationFrame(printBillingInvoice);
	};

	const handleIndentApproved = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmApproved(id),
		});
	};

	const handleConfirmApproved = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_WAIVER.APPROVE}/${id}`,
		});
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientFreeWaivers")}
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
									{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) && (
										<Button.Group>
											<Button
												variant="filled"
												onClick={() => handlePatientForm(item.uid)}
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
											<Button
												variant="filled"
												onClick={() => handleIndentApproved(item.uid)}
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
												Approve
											</Button>
											<Button
												variant="filled"
												onClick={() => handleWaiverPrint(item.invoice_uid)}
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
												Print
											</Button>
										</Button.Group>
									)}
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
			<DataTableFooter indexData={records} module="waiver" />
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
			{printData && <IPDPrescriptionFullBN data={printData} ref={prescriptionRef} />}
			{billingPrintData && <FreeServiceFormBN data={billingPrintData} ref={billingInvoiceRef} />}
		</Box>
	);
}
