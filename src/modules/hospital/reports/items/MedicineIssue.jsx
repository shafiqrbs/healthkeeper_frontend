import { useRef, useMemo } from "react";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Flex, Text } from "@mantine/core";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";

import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import { formatDate } from "@/common/utils";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { MODULES } from "@/constants";
import { useOutletContext } from "react-router-dom";
import ReportFilterSearch from "@hospital-components/ReportFilterSearch";

const PER_PAGE = 200;
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

	// Process records: convert medicines object into dynamic columns
	const processedRecords = useMemo(() => {
		if (!records) return [];
		return records.map((r) => {
			const row = {
				patient_id: r.patient_id,
				room_no: r.room_no,
				customer_name: r.customer_name,
			};
			if (r.medicines) {
				Object.entries(r.medicines).forEach(([medName, qty]) => {
					row[medName] = qty;
				});
			}
			return row;
		});
	}, [records]);

	// Generate dynamic columns: find all unique medicine names across all records
	const medicineColumns = useMemo(() => {
		const meds = new Set();
		records?.forEach((r) => {
			if (r.medicines) {
				Object.keys(r.medicines).forEach((name) => meds.add(name));
			}
		});
		return Array.from(meds).map((name) => ({
			accessor: name,
			title: name,
		}));
	}, [records]);

	const columns = useMemo(() => {
		const baseColumns = [
			{ accessor: "patient_id", title: t("PatientId") },
			{ accessor: "room_no", title: t("RoomNo") },
			{ accessor: "customer_name", title: t("CustomerName") },
		];
		return [...baseColumns, ...medicineColumns];
	}, [medicineColumns, t]);

	// CSV headers
	const CSV_HEADERS = useMemo(
		() => columns.map((col) => ({ label: col.title, key: col.accessor })),
		[columns]
	);

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
					records={processedRecords}
					columns={columns}
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
				data={processedRecords}
				headers={CSV_HEADERS}
				filename={`medicine-issue-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
		</Box>
	);
}
