import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import {ActionIcon, Badge, Box, Button, Flex, FloatingIndicator, Group, Menu, Modal, Tabs, Text} from "@mantine/core";
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
import {setFilterData} from "@/app/store/core/crudSlice";
import IPDDetailsDrawer from "@hospital-components/drawer/__IPDDetailsDrawer";
import ConfirmModal from "@modules/hospital/admission/confirm/__ConfirmModal";
import {getAdmissionConfirmFormInitialValues} from "@modules/hospital/admission/helpers/request";
import usePagination from "@hooks/usePagination";

const tabs = [
	{ label: "All", value: "all" },
	{ label: "OPD", value: "opd" },
	{ label: "Emergency", value: "emergency" },
	{ label: "IPD", value: "ipd" },
];

const PER_PAGE = 100;
const ALLOWED_OPD_ROLES = ["doctor_opd","doctor_ipd", "admin_administrator"];
const ALLOWED_ADMIN_DOCTOR_ROLES = ["operator_emergency", "doctor_ipd_confirm", "admin_doctor", "admin_administrator"];
export default function Table({ module, height, closeTable, availableClose = false }) {
	const { mainAreaHeight } = useOutletContext();
	const [openedOpdRoom, { open: openOpdRoom, close: closeOpdRoom }] = useDisclosure(false);
	const confirmForm = useForm(getAdmissionConfirmFormInitialValues());
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
	const [selectedId, setSelectedId] = useState(null);

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

	const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
	const filterData = useSelector((state) => state.crud[module].filterData);

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



	const { records, fetching,refetchAll, sortStatus, setSortStatus, total, perPage, page, handlePageChange } = usePagination({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.PATIENT_ARCHIVE.INDEX,
		filterParams: {
			name: filterData?.name,
			patient_mode:processTab,
			term: form.values.keywordSearch,
			created: form.values.created,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
	});

	const handleReadmission = (id) => {
		setSelectedId(id);
		openConfirm();
	};
	const processColorMap = {
		admitted: "red",
		paid: "green",
		discharged: "orange",
		empty: "gray",
		Done: "blue",
		New: "cyan",
		refund: "yellow",
		released: "gray",
		closed: "purple"
	};
	const handleConfirmClose = () => {
		closeConfirm();
		setSelectedId(null);
		dispatch(setFilterData({ module: "bed", data: { keywordSearch: "" } }));
		dispatch(setFilterData({ module: "cabin", data: { keywordSearch: "" } }));
	};


	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientArchive")}
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
							render: (item) => formatDate(item?.created_at),
						},
						{ accessor: "room_name", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "gender", sortable: true, title: t("Gender") },
						{
							accessor: "patient_payment_mode_name",
							sortable: true,
							title: t("Patient"),
						},
						{
							accessor: "process",
							textAlign: "center",
							title: t("Process"),
							render: (item) => {
								const color = processColorMap[item.process] || ""; // fallback for unknown status
								return (
									<Badge size="xs" radius="sm" color={color}>
										{item.process || 'empty'}
									</Badge>
								);
							},
							cellsClassName: tableCss.statusBackground,
						},

						{
							title: t(""),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => {
								return (
									<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
										{userRoles.some((role) => ALLOWED_ADMIN_DOCTOR_ROLES.includes(role)) && (values.process === "paid" || values.process === "discharged")  && (
											<Button
												variant="filled"
												bg="red"
												c="white"
												size="compact-xs"
												onClick={() =>handleReadmission(values.uid)}
												radius="es"
												fw={400}
												rightSection={<IconArrowRight size={18} />}
											>
												{t("Re-admission")}
											</Button>
										)}
									</Group>
								);
							},
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height + 50}
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
			<DataTableFooter indexData={listData} module="visit" />
			{selectedPrescriptionId && (
				<DetailsDrawer opened={opened} close={close} prescriptionId={selectedPrescriptionId} />
			)}
			<ConfirmModal
				opened={openedConfirm}
				close={handleConfirmClose}
				form={confirmForm}
				selectedId={selectedId}
				isReadmission={true}
				module={module}
			/>
		</Box>
	);
}
