import { useRef } from "react";
import { CSVLink } from "react-csv";
import {
	Box,
	Flex,
	Text,
	Grid,
	Button
} from "@mantine/core";
import {
	IconChevronUp,
	IconPrinter,
	IconSelector
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import DataTableFooter from "@components/tables/DataTableFooter";
import ReportFilterSearch from "@hospital-components/ReportFilterSearch";
import BatchWiseStockReport from "@hospital-components/print-formats/reports/BatchWiseStockReport";

import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { formatDate } from "@/common/utils";
import tableCss from "@assets/css/Table.module.css";
import DepartmnentStockItemReport from "@hospital-components/print-formats/reports/BatchWiseStockReport";

const PER_PAGE = 200;

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Warehouse Name", key: "warehouse_name" },
	{ label: "Item Name", key: "name" },
	{ label: "Expired Date", key: "expired_date" },
	{ label: "Stock Quantity", key: "purchase_quantity" },
	{ label: "Indent Quantity", key: "indent_quantity" },
	{ label: "Remaining Quantity", key: "remaining_quantity" },
];

const module = MODULES.REPORT.BATCH_WISE_STOCK;

export default function DepartmentStockItem() {
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();

	const csvLinkRef = useRef(null);
	const reportPrintRef = useRef(null);

	const listData = useSelector(
		(state) => state?.crud[module]?.data
	);

	const printReport = useReactToPrint({
		content: () => reportPrintRef.current,
	});

	const form = useForm({
		initialValues: {
			start_date: null,
			end_date: null,
			stock_item_id: null,
			warehouse_id: null,
		},
	});

	const {
		scrollRef,
		records,
		fetching,
		sortStatus,
		setSortStatus,
		handleScrollToBottom,
	} = useInfiniteTableScroll({
		module,
		fetchUrl:
		PHARMACY_DATA_ROUTES.API_ROUTES.REPORT.DEPARTMENT_STOCK_REPORT,
		filterParams: {
			start_date: form.values.start_date,
			end_date: form.values.end_date,
			stock_item_id: form.values.stock_item_id,
			warehouse_id: form.values.warehouse_id,
		},
		perPage: PER_PAGE,
	});

	/* =========================
       CSV DATA
    ========================== */

	const csvData = records.map((item, index) => ({
		sn: index + 1,
		warehouse_name: item?.warehouse_name ?? "",
		name: item?.name ?? "",
		expired_date: item?.expired_date ?? "",
		quantity: item?.quantity ?? 0,
		issue_quantity: item?.issue_quantity ?? 0,
		remaining_quantity:
			(item?.quantity ?? 0) -
			(item?.issue_quantity ?? 0),
	}));

	const handleCSVDownload = () => {
		csvLinkRef.current?.link?.click();
	};

	/* =========================
       RENDER
    ========================== */

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			{/* Header */}
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("BatchWiseStock")}
				</Text>
			</Flex>

			{/* Filters */}
			<Box px="sm" mb="sm">
				<Grid columns={18} gutter="md">
					<Grid.Col span={16}>
						<ReportFilterSearch
							module={module}
							form={form}
							handleCSVDownload={handleCSVDownload}
							showPurchaseWiseCenterWarehouseStockItems={true}
							showWarehouse={true}
						/>
					</Grid.Col>

					<Grid.Col span={2} mt="xs">
						<Button
							size="xs"
							color="blue"
							leftSection={<IconPrinter size={16} />}
							onClick={printReport}
						>
							{t("Print")}
						</Button>
					</Grid.Col>
				</Grid>
			</Box>

			{/* Table */}
			<Box px="sm">
				<DataTable
					striped
					highlightOnHover
					pinFirstColumn
					pinLastColumn
					stripedColor="var(--theme-tertiary-color-1)"
					classNames={tableCss}
					records={records}
					fetching={fetching}
					height={mainAreaHeight - 100}
					loaderSize="xs"
					loaderColor="grape"
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: (
							<IconChevronUp
								size={14}
								color="var(--theme-tertiary-color-7)"
							/>
						),
						unsorted: (
							<IconSelector
								size={14}
								color="var(--theme-tertiary-color-7)"
							/>
						),
					}}
					columns={[
						{
							accessor: "sn",
							title: t("S/N"),
							ta: "right",
							render: (_, index) => index + 1,
							footer: `Total: ${records.length}`,
						},
						{ accessor: "warehouse_name", title: t("Warehouse") },
						{ accessor: "name", title: t("Item Name") },
						{ accessor: "expired_date", title: t("Expired Date") },
						{
							accessor: "quantity",
							title: t("Stock"),
							ta: "right",
							render: ({ quantity }) => Number(quantity) || 0
						},
						{
							accessor: "issue_quantity",
							title: t("Issue"),
							ta: "right",
							render: ({ issue_quantity }) => Number(issue_quantity) || 0
						},
						{
							accessor: "remaining_quantity",
							title: t("Remaining"),
							ta: "right",
							render: ({
										 quantity = 0,
										 issue_quantity = 0,
									 }) => quantity - issue_quantity,
						},
					]}
				/>
			</Box>

			{/* Footer */}
			<DataTableFooter
				indexData={listData}
				module={module}
			/>

			{/* CSV Export */}
			<CSVLink
				ref={csvLinkRef}
				data={csvData}
				headers={CSV_HEADERS}
				filename={`department-wise-stock-${formatDate(
					new Date()
				)}.csv`}
				style={{ display: "none" }}
			/>

			{/* Print */}
			{records.length > 0 && (
				<DepartmnentStockItemReport
					ref={reportPrintRef}
					data={records}
				/>
			)}
		</Box>
	);
}
