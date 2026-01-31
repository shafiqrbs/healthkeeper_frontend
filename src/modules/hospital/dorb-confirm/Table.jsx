import { useNavigate, useOutletContext } from "react-router-dom";
import {IconArrowRight, IconChevronUp, IconPrinter, IconSelector} from "@tabler/icons-react";
import {Badge, Box, Button, Flex, FloatingIndicator, Group, Tabs, Text} from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useTranslation } from "react-i18next";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import {capitalizeWords, formatDate, formatDateTimeAmPm} from "@utils/index";
import { useForm } from "@mantine/form";
import KeywordSearch from "@hospital-components/KeywordSearch";
import usePagination from "@hooks/usePagination";
import useAppLocalStore from "@hooks/useAppLocalStore";
import {getDataWithoutStore} from "@/services/apiService";
import {useSelector} from "react-redux";
import {modals} from "@mantine/modals";
import filterTabsCss from "@assets/css/FilterTabs.module.css";
import {useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import RefundFromBedBn from "@hospital-components/print-formats/refund/RefundFormBedBN";
import DrobFormBN from "@hospital-components/print-formats/dorb/DorbFormBN";

const module = MODULES.DISCHARGE;
const PER_PAGE = 25;
const ALLOWED_CONFIRMED_ROLES = ["doctor_ipd","doctor_rs_rp_confirm", "doctor_emergency", "admin_administrator"];
const ALLOWED_NURSE_ROLES = ["role_domain", "admin_administrator", "nurse_basic", "nurse_incharge", "admin_nurse"];



export default function Table() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { userRoles } = useAppLocalStore();
	const filterData = useSelector((state) => state.crud[module].filterData);
	const [rootRef, setRootRef] = useState(null);
	const [processTab, setProcessTab] = useState("paid");
	const [controlsRefs, setControlsRefs] = useState({});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });


	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: "",
			room_id: "",
		},
	});

	const { scrollRef, records, fetching, sortStatus, setSortStatus, page, total, perPage, handlePageChange } =
		usePagination({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.ADMISSION.INDEX_CONFIRM,
			filterParams: {
				name: filterData?.name,
				patient_mode: "ipd",
				process: 'discharged',
				release_mode: 'DORB',
				created: form.values.created,
				term: form.values.keywordSearch,
			},
			perPage: PER_PAGE,
			sortByKey: "created_at",
			direction: "desc",
		});

	const handleProcessConfirmation  = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Confirm"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handlePatientDischarge(id),
		});
	};

	const handlePatientDischarge = async (id) => {
		if (id) {
			const { data } = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.DISCHARGE_PROCESS}/${id}`,
			});
			navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.MANAGE}/${id}?tab=discharge`, {
				replace: true,
			});
		} else {
			showNotificationComponent(t("NoDataAvailable"), "red.6", "lightgray");
		}
	};

	const handlePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});
		setInvoicePrintData(res?.data);
	};
	useEffect(() => {
		if (invoicePrintData) {
			invoicePrint();
		}
	}, [invoicePrintData]);
	const processColorMap = { paid: "red", discharged: "green" , refund: "orange" , empty: "blue" };

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("Patient DORB")}
				</Text>

			</Flex>
			<Box>
				<KeywordSearch module={module} form={form} />
			</Box>
			<Box className="border-top-none">
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
						{
							accessor: "admission_date",
							title: t("Admission date"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDateTimeAmPm(item?.admission_date)}</Text>,
						},
						{ accessor: "room_name", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("IPD ID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "age", sortable: true, title: t("Age") },
						{
							accessor: "doctor_name",
							title: t("Doctor"),
							render: (item) => item?.doctor_name,
						},
						{
							accessor: "process",
							textAlign: "center",
							title: t("Process"),
							render: (item) => {
								const color = processColorMap[item.process] || ""; // fallback for unknown status
								return (
									<Badge size="xs" radius="sm" color={color}>
										{item.process}
									</Badge>
								);
							},
							cellsClassName: tableCss.statusBackground,
						},
						{
							accessor: "release_mode",
							title: t("RefMode"),
							render: (item) => capitalizeWords(item?.release_mode),
						},
						{
							accessor: "",
							title: t("Action"),
							render: (item) => (
								<Group onClick={(e) => e.stopPropagation()} gap={4} justify="right" wrap="nowrap">
									{userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
									(item.process?.toLowerCase() === "discharged" && !item.dorb_approved_by_id) && (
										<Button
											variant="filled"
											size="compact-xs"
											color="var(--theme-primary-color-6)"
											onClick={() => handleProcessConfirmation(item.uid)}
											rightSection={<IconArrowRight size={14} />}
										>
											{t("Confirm")}
										</Button>
									)}
									<Button
										variant="filled"
										size="compact-xs"
										color="red"
										onClick={() => handlePrint(item.uid)}
										leftSection={<IconPrinter size={14} />}
									>
										{t("Print")}
									</Button>
								</Group>
							)
						}
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 114}
					page={page}
					scrollViewportRef={scrollRef}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DrobFormBN data={invoicePrintData} ref={invoicePrintRef} />
		</Box>
	);
}
