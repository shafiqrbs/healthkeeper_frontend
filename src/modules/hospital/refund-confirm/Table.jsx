import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Group, Menu, Modal, Tabs, Text } from "@mantine/core";
import {
	IconArrowRight,
	IconChevronUp,
	IconDotsVertical,
	IconSelector,
	IconX,
	IconPrinter,
	IconScript,
	IconPencil,
	IconRefresh,
	IconAdjustmentsCog,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { useDisclosure } from "@mantine/hooks";
import DetailsDrawer from "../common/drawer/__DetailsDrawer";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { showEntityData } from "@/app/store/core/crudThunk";
import { capitalizeWords, formatDateTimeAmPm, formatDate, getLoggedInHospitalUser } from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { modals } from "@mantine/modals";
import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";
import OPDPosBN from "@hospital-components/print-formats/opd/OPDPosBN";
import { useReactToPrint } from "react-to-print";
import { getDataWithoutStore } from "@/services/apiService";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import PrescriptionFullBN from "@hospital-components/print-formats/prescription/PrescriptionFullBN";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import PatientUpdateDrawer from "@hospital-components/drawer/PatientUpdateDrawer";
import { useAutoRefetch } from "@hooks/useAutoRefetch";
import OpdRoomModal from "@hospital-components/OpdRoomModal";
import OpdRoomStatusModal from "@hospital-components/OpdRoomStatusModal";
import {MODULES_CORE} from "@/constants";
import RefundFromBedBn from "@hospital-components/print-formats/refund/RefundFormBedBN";
import RefundFormInvestigationBN from "@hospital-components/print-formats/refund/RefundFormInvestigationBN";

const tabs = [
	{ label: "All", value: "all" },
	{ label: "Investigation", value: "investigation" },
	{ label: "Bill", value: "bill" },
];

const module = MODULES_CORE.REFUND_HISTORY;
const PER_PAGE = 100;
const ALLOWED_OPD_ROLES = ["doctor_opd","doctor_ipd", "admin_administrator"];
const ALLOWED_ADMIN_DOCTOR_ROLES = ["doctor_approve_opd", "admin_doctor",  "doctor_emergency",  "doctor_rs_rp_confirm","doctor_ipd",  "doctor_rs_rp_confirm", "operator_emergency"];

export default function Table({ module, height, closeTable, availableClose = false }) {
	const { mainAreaHeight } = useOutletContext();
	const [openedOpdRoom, { open: openOpdRoom, close: closeOpdRoom }] = useDisclosure(false);
	const { userRoles } = useAppLocalStore();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const listData = useSelector((state) => state.crud[module].data);
	const prescriptionRef = useRef(null);
	const [opened, { open, close }] = useDisclosure(false);
	const hospitalConfig = getLoggedInHospitalUser();
	const userId = hospitalConfig?.employee_id;

	const opdRoomId = hospitalConfig?.particular_details?.room_id;
	const opdRoomIds = hospitalConfig?.particular_details?.opd_room_ids;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: opdRoomId,
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

	const [rootRef, setRootRef] = useState(null);
	const [processTab, setProcessTab] = useState("all");
	const [controlsRefs, setControlsRefs] = useState({});

	const [printData, setPrintData] = useState({});
	const [type, setType] = useState(null);

	const posRef = useRef(null);
	const a4Ref = useRef(null);
	const [openedPatientUpdate, { open: openPatientUpdate, close: closePatientUpdate }] = useDisclosure(false);
	const [singlePatientData, setSinglePatientData] = useState({});
	const filterData = useSelector((state) => state.crud[module].filterData);

	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });

	const investigationPrintRef = useRef(null);
	const [investigationPrintData, setInvestigationPrintData] = useState(null);
	const investigationPrint = useReactToPrint({ content: () => investigationPrintRef.current });



	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const { refetchAll, scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } =
		useInfiniteTableScroll({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.INDEX,
			filterParams: {
				name: filterData?.name,
				patient_mode:processTab,
				term: form.values.keywordSearch,
				created: form.values.created,
			},
			perPage: PER_PAGE,
			sortByKey: "created_at",
		});

	// auto-refetch every 15 seconds
	const handlePageReload = () => {
		refetchAll();
	};

	const handleApprove = async (id) => {

		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Confirm"), cancel: t("Cancel") },
			confirmProps: { color: "blue" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleApproveConfirm(id),
		});
	}

	const handleApproveConfirm = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.APPROVE}/${id}`,
		});
		if(res.status === 200){
			refetchAll();
		}
	};

	const handlePrint = async (id,mode) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.PRINT}/${id}`,
		});
		if(mode === 'bill'){
			setInvoicePrintData(res?.data);
		}else{
			setInvestigationPrintData(res?.data);

		}
	};

	useEffect(() => {
		if(invoicePrintData){
			invoicePrint();
		}
	}, [invoicePrintData]);

	useEffect(() => {
		if(investigationPrintData){
			investigationPrint();
		}
	}, [investigationPrintData]);

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("Patient Refund")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={processTab} onChange={setProcessTab}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab, index) => (
								<Tabs.Tab
									value={tab.value}
									ref={setControlRef(tab)}
									className={filterTabsCss.tab}
									key={index}
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
				<KeywordSearch module={module} form={form} />
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
							textAlignment: "center",
							render: (_, index) => index + 1,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDateTimeAmPm(item?.created_at)}</Text>,
						},
						{ accessor: "visiting_room", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "gender", sortable: true, title: t("Gender") },

						{
							accessor: "process",
							title: t("Process"),
						},

						{
							accessor: "mode",
							title: t("Mode"),
							render: (item) => capitalizeWords(item?.mode),
						},

						{
							accessor: "approve_by",
							title: t("Approved By"),
						},

						{
							title: t(""),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => {
								return (
									<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
										{userRoles.some((role) => ALLOWED_ADMIN_DOCTOR_ROLES.includes(role)) && values.process === "In-progress" && (
											<Button
												variant="filled"
												bg="var(--theme-primary-color-6)"
												c="white"
												size="compact-xs"
												onClick={() =>handleApprove(values.id)}
												radius="es"
												fw={400}
												rightSection={<IconArrowRight size={18} />}
											>
												{t("Confirm")}
											</Button>
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
												{values.mode === "investigation" && (
												<Menu.Item
													leftSection={
														<IconPrinter
															style={{
																width: rem(14),
																height: rem(14),
															}}
														/>
													}
													onClick={() =>handlePrint(values?.id,'investigation')}
												>
													{t("Print")}
												</Menu.Item>
												)}
												{values.mode === "bill" && (
												<Menu.Item
													leftSection={
														<IconPrinter
															style={{
																width: rem(14),
																height: rem(14),
															}}
														/>
													}
													onClick={() =>handlePrint(values?.id,'bill')}
												>
													{t("Print")}
												</Menu.Item>
												)}
											</Menu.Dropdown>
										</Menu>
									</Group>
								);
							},
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
			<DataTableFooter indexData={listData} module="visit" />
			<RefundFromBedBn data={invoicePrintData} ref={invoicePrintRef} />
			<RefundFormInvestigationBN data={investigationPrintData} ref={investigationPrintRef} />
		</Box>
	);
}
