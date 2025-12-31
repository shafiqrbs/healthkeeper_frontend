import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import {
	ActionIcon,
	Box,
	Card,
	Flex,
	FloatingIndicator,
	Grid,
	rem,
	ScrollArea,
	Table,
	Tabs,
	Text,
	Button
} from "@mantine/core";
import {
	IconBed,
	IconChevronUp,
	IconCoinTaka,
	IconFileTypePdf, IconPrinter,
	IconSelector,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "@hospital-components/KeywordSearch";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import { capitalizeWords, formatDate } from "@/common/utils";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { MODULES, MODULES_CORE } from "@/constants";
import { useOutletContext } from "react-router-dom";
import ReportFilterSearch from "@hospital-components/ReportFilterSearch";
import { getDataWithoutStore } from "@/services/apiService";
import { useReactToPrint } from "react-to-print";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {useMemo} from "@hello-pangea/dnd/src/use-memo-one";
import DailyCollectionServiceReports from "@hospital-components/print-formats/reports/DailyCollectionServiceReports";

const PER_PAGE = 200;

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

const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

export default function DailyCollectionService({height:mainAreaHeight}) {

	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);
	const  height = mainAreaHeight-98;
	const summaryReportsRef = useRef(null);

	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});
	const handleCSVDownload = () => {
		handleHomeOverviewPrint();
	};

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			start_date: formatDate(new Date()),
			end_date: formatDate(new Date()),
		},
	});


	const [controlsRefs, setControlsRefs] = useState({});
	const { data: records, isLoading } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DAILY_COLLECTIION_SERVICE,
		params: {
			start_date: form.values.start_date,
			end_date: form.values.end_date,
		},
	});

	const formatMoney = (value) =>
		new Intl.NumberFormat("en-BD", {
			minimumFractionDigits: 0,
		}).format(value);
	const serviceFees = records?.data?.serviceFees ?? [];

	/* 1️⃣ Date-wise transformation */
	const dateWiseData = useMemo(() => {
		return Object.values(
			serviceFees.reduce((acc, item) => {
				const { report_date, name, total } = item;

				if (!acc[report_date]) {
					acc[report_date] = { report_date };
				}

				acc[report_date][name] = total;
				return acc;
			}, {})
		);
	}, [serviceFees]);

	/* 2️⃣ Dynamic columns */
	const columns = useMemo(() => {
		return [...new Set(serviceFees.map(item => item.name))];
	}, [serviceFees]);

	/* 3️⃣ Row-wise total */
	const dataWithRowTotal = useMemo(() => {
		return dateWiseData.map(row => {
			const rowTotal = columns.reduce(
				(sum, col) => sum + (row[col] ?? 0),
				0
			);

			return {
				...row,
				row_total: rowTotal,
			};
		});
	}, [dateWiseData, columns]);

	/* 4️⃣ Column-wise total */
	const columnTotals = useMemo(() => {
		return columns.reduce((acc, col) => {
			acc[col] = dataWithRowTotal.reduce(
				(sum, row) => sum + (row[col] ?? 0),
				0
			);
			return acc;
		}, {});
	}, [columns, dataWithRowTotal]);

	/* 5️⃣ Grand total */
	const grandTotal = useMemo(() => {
		return Object.values(columnTotals).reduce(
			(sum, val) => sum + val,
			0
		);
	}, [columnTotals]);

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Box className="border-top-none" px="sm">
				<Flex justify="space-between" align="center" px="sm">
					<Text fw={600} fz="sm" py="xs">
						{t("PatientTickets")}
					</Text>
				</Flex>
				<Box>
					<Box px="sm" mb="sm">
						<ReportFilterSearch
							module={module}
							form={form}
						/>
					</Box>
				</Box>
				<Grid columns={40} gutter={{ base: "xs" }}>
					<Grid.Col span={40}>
						<Card padding="lg" radius="sm">
							<Card.Section
								h={32}
								withBorder
								component="div"
								bg="var(--theme-primary-color-7)"
							>
								<Flex align="center" h="100%" px="lg" justify="space-between">
									<Text pb={0} fz="sm" c="white" fw={500}>
										{t("Daily Collection Fee & Service Charge")}
									</Text>
									<Button size="compact-md" variant="default" onClick={handleCSVDownload} rightSection={<IconPrinter size={14} />}>Print</Button>
								</Flex>
							</Card.Section>
						</Card>
					</Grid.Col>
				</Grid>

				<Box>
					<ScrollArea mt="sm" h={height}>
						<Table
							withColumnBorders
							striped
							highlightOnHover
							horizontalSpacing="sm"
							verticalSpacing="xs"
							fontSize="sm"
							stickyHeader
						>
							{/* ===== HEADER ===== */}
							<Table.Thead bg="gray.1">
								<Table.Tr>
									<Table.Th w={120}>Date</Table.Th>

									{columns.map((col) => (
										<Table.Th key={col} ta="right">
											{col}
										</Table.Th>
									))}

									<Table.Th ta="right">Total</Table.Th>
								</Table.Tr>
							</Table.Thead>

							{/* ===== BODY ===== */}
							<Table.Tbody>
								{dataWithRowTotal.map((row) => (
									<Table.Tr key={row.report_date}>
										<Table.Td>
											<Text size="sm" fw={500}>
												{row.report_date}
											</Text>
										</Table.Td>

										{columns.map((col) => (
											<Table.Td key={col} ta="right">
												{formatMoney(row[col] ?? 0)}
											</Table.Td>
										))}

										{/* Row total */}
										<Table.Td ta="right" fw={600} c="blue.7">
											{formatMoney(row.row_total)}
										</Table.Td>
									</Table.Tr>
								))}

								{/* ===== COLUMN TOTAL ===== */}
								<Table.Tr bg="gray.2">
									<Table.Td fw={700}>Total</Table.Td>

									{columns.map((col) => (
										<Table.Td key={col} ta="right" fw={600}>
											{formatMoney(columnTotals[col])}
										</Table.Td>
									))}

									{/* Grand total */}
									<Table.Td ta="right" fw={800} c="green.7">
										{formatMoney(grandTotal)}
									</Table.Td>
								</Table.Tr>
							</Table.Tbody>
						</Table>
					</ScrollArea>
				</Box>
			</Box>
			{records?.data && (
				<DailyCollectionServiceReports ref={summaryReportsRef} records={records?.data || []} />
			)}

		</Box>
	);
}
