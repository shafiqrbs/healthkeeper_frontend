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
	{ label: "Item Name", key: "name" },
	{ label: "Quantity", key: "quantity" },
	{ label: "Status", key: "process" },
	{ label: "Warehouse", key: "warehouse_name" },
	{ label: "Customer Name", key: "customer_name" },
	{ label: "Invoice No", key: "invoice" },
];

const module = MODULES.REPORT.MEDICINE_ISSUE;

export default function MedicineIssue() {
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
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
			fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.REPORT.MEDICINE_ISSUE_REPORT,
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
            created_date: formatDate(item?.created_date),
			name: item?.name ?? "",
			quantity: item?.quantity ?? "",
            process: item?.process ?? "",
			warehouse_name: item?.warehouse_name ?? "",
			customer_name: item?.customer_name ?? "",
			invoice: item?.invoice ?? "",
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
					{t("MedicineIssue")}
				</Text>
			</Flex>
			<Box px="sm" mb="sm">
				<ReportFilterSearch
					module={module}
					form={form}
					handleCSVDownload={handleCSVDownload}
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
						{ accessor: "name", title: t("Item Name") },
						{ accessor: "quantity", title: t("Quantity") },
						{ accessor: "process", title: t("Status") },
						{ accessor: "warehouse_name", title: t("Warehouse") },
						{ accessor: "customer_name", title: t("CustomerName") },
						{ accessor: "invoice", title: t("InvoiceNo") },
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
				filename={`medicine-issue-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
		</Box>
	);
}
