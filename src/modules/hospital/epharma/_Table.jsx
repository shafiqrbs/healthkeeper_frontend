import { IconPrinter, IconChevronUp, IconSelector,IconEye } from "@tabler/icons-react";
import {Box, Flex, Text, Button, ScrollArea, Table} from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useRef, useState } from "react";
import { MODULES } from "@/constants";
import {formatDate, formatDateTime, formatDateTimeAmPm} from "@utils/index";
import tableCss from "@assets/css/Table.module.css";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import KeywordSearch from "@hospital-components/KeywordSearch";

import OPDA4BN from "@hospital-components/print-formats/opd/OPDA4BN";
import { CSVLink } from "react-csv";
import Barcode from "react-barcode";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import usePagination from "@hooks/usePagination";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import {useDisclosure} from "@mantine/hooks";
import {getDataWithoutStore} from "@/services/apiService";

const module = MODULES.LAB_TEST;
const PER_PAGE = 50;

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

export default function _Table({ height }) {
	const { t } = useTranslation();
	const csvLinkRef = useRef(null);
	const [processTab, setProcessTab] = useState("all");
	const form = useForm();
	const barCodeRef = useRef(null);
	const [barcodeValue, setBarcodeValue] = useState("");
	const [invoiceDetailsOpened, { open: openInvoiceDetails, close: closeInvoiceDetails }] = useDisclosure(false);
	const [selectedInvoice, setSelectedInvoice] = useState({});

	const { records, fetching, sortStatus, setSortStatus, total, perPage, page, handlePageChange } = usePagination({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.EPHARMA.INDEX,
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
		filterParams: {
			term: form.values.keywordSearch,
			created: form.values.created,
			process: processTab,
		},
	});

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
	const handleDetailsView = async (transaction) => {
		setSelectedInvoice(transaction);
		requestAnimationFrame(openInvoiceDetails);
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
						{ accessor: "barcode", sortable: false, title: t("Barcode") },
						{ accessor: "invoice", sortable: false, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: false, title: t("PatientID") },
						{ accessor: "name", sortable: false, title: t("Name") },
						{ accessor: "mobile", sortable: false, title: t("Mobile") },
						{ accessor: "process", sortable: false, title: t("Process") },
						{ accessor: "delivered_by", sortable: false, title: t("DeliveredBy") },
						{
							accessor: "delivered_date",
							title: t("DeliveredDate"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDateTimeAmPm(item?.delivered_date)}</Text>,
						},
						{
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => {
								return (
									<Flex justify="flex-end" gap="2">
										{values?.process === "Done" && (
											<Button
												onClick={() => handleDetailsView(values)}
												size="compact-xs"
												fz={"xs"}
												fw={"400"}
												leftSection={<IconEye size={14} />}
												color="var(--theme-print-btn-color)"
											>
												{t("Show")}
											</Button>
										)}
									</Flex>
								);
							},
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 100}
					page={page}
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
			<GlobalDrawer
				size="50%"
				opened={invoiceDetailsOpened}
				close={closeInvoiceDetails}
				title={t("InvoiceDetails")}
			>
				<ScrollArea>
					<Table mt="sm" striped highlightOnHover withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("S/N")}</Table.Th>
								<Table.Th>{t("ItemName")}</Table.Th>
								<Table.Th>{t("Quantity")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{selectedInvoice?.sales_items?.map((item, index) => (
								<Table.Tr key={index}>
									<Table.Td>{index + 1}</Table.Td>
									<Table.Td>{item.name}</Table.Td>
									<Table.Td>{item?.quantity}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</ScrollArea>
			</GlobalDrawer>
		</Box>
	);
}
