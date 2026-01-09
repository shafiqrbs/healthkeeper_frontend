import { useRef } from "react";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Flex, Text } from "@mantine/core";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";

import {PHARMACY_DATA_ROUTES} from "@/constants/routes";
import { useSelector } from "react-redux";
import { formatDate } from "@/common/utils";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { MODULES } from "@/constants";
import { useOutletContext } from "react-router-dom";
import ReportFilterSearch from "@hospital-components/ReportFilterSearch";

const PER_PAGE = 200;

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Warehouse", key: "warehouse_name" },
	{ label: "Item Name", key: "name" },
	{ label: "Opening quantity", key: "opening_quantity" },
	{ label: "Stock In", key: "total_in_quantity" },
	{ label: "Stock Out", key: "total_out_quantity" },
	{ label: "Closing quantity", key: "closing_quantity" },
];

const CSV_HEADERS_UPLOAD = [
	{ label: "S/N", key: "sn" },
	{ label: "Warehouse Name", key: "warehouse_name" },
	{ label: "WarehouseID", key: "warehouse_id" },
	{ label: "Item Name", key: "name" },
	{ label: "StockItemID", key: "stock_item_id" },
	{ label: "OpeningQuantity", key: "opening_quantity" },
	{ label: "ProductionDate", key: "production_date" },
	{ label: "ExpiredDate", key: "expired_date" },
];



const module = MODULES.REPORT.STOCK_SUMMERY;

export default function StockSummery() {
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
	const csvLinkRefForUpload = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state?.crud[module]?.data);

	const form = useForm({
		initialValues: {
			start_date: null,
			end_date: null,
            warehouse_id: null,
		},
	});

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } =
		useInfiniteTableScroll({
			module,
			fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.REPORT.STOCK_SUMMERY_REPORT,
            filterParams: {
                start_date: form.values.start_date ?? null,
                end_date: form.values.end_date ?? null,
				warehouse_id: form.values.warehouse_id ?? null,
            },
            perPage: PER_PAGE,
		});

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			warehouse_name: item?.warehouse_name ?? "",
			name: item?.name ?? "",
			opening_quantity: item?.opening_quantity ?? 0,
			total_in_quantity: item?.total_in_quantity ?? "",
			total_out_quantity: item?.total_out_quantity ?? "",
			closing_quantity: item?.closing_quantity ?? "",
		})) || [];

	const csvDataForUpload =
		records?.map((item, index) => ({
			sn: index + 1,
			warehouse_name: item?.warehouse_name ?? "",
			warehouse_id: item?.warehouse_id ?? "",
			name: item?.name ?? "",
			stock_item_id: item?.stock_item_id ?? "",
			opening_quantity: null,
			production_date: "2025-12-25",
			expired_date: "2025-12-25",
		})) || [];

	const handleCSVDownload = () => {
		if (csvLinkRef?.current?.link) {
			csvLinkRef.current.link.click();
		}
	};

	const handleCSVDownloadForUpload = () => {
		if (csvLinkRefForUpload?.current?.link) {
			csvLinkRefForUpload.current.link.click();
		}
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("StockSummery")}
				</Text>
			</Flex>
			<Box px="sm" mb="sm">
				<ReportFilterSearch
					module={module}
					form={form}
					handleCSVDownload={handleCSVDownload}
					handleCSVDownloadForUpload={handleCSVDownloadForUpload}
                    showWarehouse={true}
					downloadOpeningTemplate={true}
				/>
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
							ta: "right",
							render: (_, index) => index + 1,
							footer: `Total: ${records.length}`,
						},
						{ accessor: "warehouse_name", title: t("Warehouse") },
						{ accessor: "name", title: t("Item Name") },
						{
							accessor: "opening_quantity",
							title: t("OpeningQuantity"),
							textAlign: "right",
							render: ({ opening_quantity }) => opening_quantity ?? 0
						},
						{
							accessor: "total_in_quantity",
							title: t("StockIn"),
							textAlign: "right",
							render: ({ total_in_quantity }) => total_in_quantity ?? 0
						},
						{
							accessor: "total_out_quantity",
							title: t("StockOut"),
							textAlign: "right",
							render: ({ total_out_quantity }) => total_out_quantity ?? 0
						},
						{
							accessor: "closing_quantity",
							title: t("ClosingQuantity"),
							textAlign: "right",
							render: ({ closing_quantity }) => closing_quantity ?? 0
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 100}
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
			{/* Hidden CSV link for exporting current table rows */}
			<CSVLink
				data={csvData}
				headers={CSV_HEADERS}
				filename={`Stock-summery-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
			<CSVLink
				data={csvDataForUpload}
				headers={CSV_HEADERS_UPLOAD}
				filename={`Stock-opening-upload-template-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRefForUpload}
			/>
		</Box>
	);
}
