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
	{ label: "Created", key: "created_date" },
	{ label: "Item Name", key: "item_name" },
	{ label: "Mode", key: "mode" },
	{ label: "Opening Qty", key: "opening_quantity" },
	{ label: "Quantity", key: "quantity" },
	{ label: "Closing Qty", key: "closing_quantity" },
];

const module = MODULES.VISIT;

export default function StockItemHistory() {
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
            warehouse_id: null,
            stock_item_id: null,
		},
	});

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } =
		useInfiniteTableScroll({
			module,
			fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.PHARMACY_STOCK_HISTORY,
            filterParams: {
                stock_item_id: form.values.stock_item_id ?? null,
                warehouse_id: form.values.warehouse_id ?? null,
                start_date: form.values.start_date ?? null,
                end_date: form.values.end_date ?? null,
            },
            perPage: PER_PAGE,
		});

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
            created_date: formatDate(item?.created_date),
            item_name: item?.item_name ?? "",
            mode: item?.mode ?? "",
            opening_quantity: item?.opening_quantity ?? "",
            quantity: item?.quantity ?? "",
            closing_quantity: item?.closing_quantity ?? "",
		})) || [];

	const handleCSVDownload = () => {
		if (csvLinkRef?.current?.link) {
			csvLinkRef.current.link.click();
		}
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("StockItemHistory")}
				</Text>
			</Flex>
			<Box px="sm" mb="sm">
				<ReportFilterSearch
					module={module}
					form={form}
					handleCSVDownload={handleCSVDownload}
                    showStockItems={true}
                    showWarehouse={true}
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
						{
							accessor: "created_date",
							title: t("Created"),
							textAlignment: "right",
							render: (item) => formatDate(item?.created_date),
						},
						{ accessor: "item_name", title: t("Item Name") },
						{ accessor: "mode", title: t("Mode") },
						{ accessor: "opening_quantity", title: t("Opening Qty") },
						{ accessor: "quantity", title: t("Quantity") },
						{ accessor: "closing_quantity", title: t("Closing Qty") },
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
				filename={`stock-item-history-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
		</Box>
	);
}
