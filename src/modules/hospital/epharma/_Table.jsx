import { useNavigate, useParams } from "react-router-dom";
import { IconPrinter, IconChevronUp, IconSelector, IconArrowRight, IconBarcode } from "@tabler/icons-react";
import { Box, Flex, Text, Button } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useEffect, useRef, useState } from "react";
import { MODULES } from "@/constants";
import { formatDate, getUserRole } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import tableCss from "@assets/css/Table.module.css";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import KeywordSearch from "@hospital-components/KeywordSearch";
import DataTableFooter from "@components/tables/DataTableFooter";

import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import Barcode from "react-barcode";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import { useReactToPrint } from "react-to-print";
import { getDataWithoutStore } from "@/services/apiService";

const module = MODULES.LAB_TEST;
const PER_PAGE = 500;

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

const tabs = [
	{ label: "All", value: "all" },
	{ label: "New", value: "New" },
	{ label: "In-progress", value: "In-progress" },
	{ label: "Confirm", value: "Confirm" },
	{ label: "Done", value: "Done" },
];

export default function _Table({ height }) {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const csvLinkRef = useRef(null);
	const [selectedPatientId, setSelectedPatientId] = useState(id);
	const [processTab, setProcessTab] = useState("all");
	const [controlsRefs, setControlsRefs] = useState({});
	const listData = useSelector((state) => state.crud[module].data);
	const form = useForm();
	const barCodeRef = useRef(null);
	const [barcodeValue, setBarcodeValue] = useState("");
	const labReportRef = useRef(null);
	const [labReportData, setLabReportData] = useState(null);


	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.EPHARMA.INDEX,
		filterParams: {
			term: form.values.keywordSearch,
			created: form.values.created,
			process: processTab,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
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

	const [printData, setPrintData] = useState({});
	const a4Ref = useRef(null);

	const handlePrint = async (id) => {
		/*const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.EPHARMA.INDEX}/${id}`,
		});
		console.log(res);
		setLabReportData(res?.data);
		requestAnimationFrame(printLabReport);*/
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientMedicineIssue")}
				</Text>
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
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", sortable: true, title: t("Mobile") },
						{ accessor: "process", sortable: true, title: t("Process") },
						{ accessor: "delivered_by", sortable: true, title: t("DeliveredBy") },
						{
							accessor: "delivered_date",
							title: t("DeliveredDate"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDate(item?.delivered_date)}</Text>,
						},
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => {
								return (
									<Flex justify="flex-end" gap="2">
										{values?.process === "Done" && (
											<Button
												onClick={() => handlePrint(values?.uid)}
												size="compact-xs"
												fz={"xs"}
												fw={"400"}
												leftSection={<IconPrinter size={14} />}
												color="var(--theme-print-btn-color)"
											>
												{t("Print")}
											</Button>
										)}
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
			<DataTableFooter indexData={listData} module="Patients" />
			<OPDA4BN data={printData} ref={a4Ref} />

			{/* Hidden CSV link for exporting current table rows */}
			<CSVLink
				data={csvData}
				headers={CSV_HEADERS}
				filename={`visits-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
			<Box display="none">
				<Box ref={barCodeRef}>
					<Barcode fontSize="10" width="1" height="30" value={barcodeValue || "BARCODETEST"} />
				</Box>
			</Box>
			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Box>
	);
}
