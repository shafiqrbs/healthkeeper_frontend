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
	Button, Title
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
import DailyOpdEmergencyIpdReports from "@hospital-components/print-formats/reports/DailyOpdEmergencyIpdReports";

const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

export default function DailyOpdEmergencyIpdPatient({height:mainAreaHeight}) {

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
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DAILY_OPD_EMERGENCY_IPD,
		params: {
			start_date: form.values.start_date,
			end_date: form.values.end_date,
		},
	});

	const getValue = (row, type, gender) => row?.[type]?.[gender] ?? 0;
	const reportData = records?.data?.entities ?? [];
	const deathData = records?.data?.deathData ?? [];

	const thStyle = {
		border: "1px solid var(--theme-tertiary-color-8)",
		textAlign: "center",
		fontWeight: 600,
	};

	const tdCenter = {
		border: "1px solid var(--theme-tertiary-color-8)",
		textAlign: "center",
	};

	const tdAgeStyle = {
		border: "1px solid var(--theme-tertiary-color-8)",
		fontWeight: 600,
		whiteSpace: "nowrap",
	};




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
							style={{
								border: "1px solid var(--theme-tertiary-color-8)",
								borderCollapse: "collapse",
							}}
						>
							{/* Table Header */}
							<thead>
							<tr style={{ backgroundColor: "var(--mantine-color-gray-1)" }}>
								<th rowSpan={2} style={thStyle}>Age Group</th>
								<th colSpan={2} style={thStyle}>OPD</th>
								<th colSpan={2} style={thStyle}>Emergency</th>
								<th colSpan={2} style={thStyle}>IPD</th>
							</tr>
							<tr style={{ backgroundColor: "var(--mantine-color-gray-1)" }}>
								<th style={thStyle}>Male</th>
								<th style={thStyle}>Female</th>
								<th style={thStyle}>Male</th>
								<th style={thStyle}>Female</th>
								<th style={thStyle}>Male</th>
								<th style={thStyle}>Female</th>
							</tr>
							</thead>

							{/* Table Body */}
							<tbody>
							{Object.entries(reportData).map(([ageKey, row]) => (
								<tr key={ageKey}>
									<td style={tdAgeStyle}>{ageKey.replaceAll("_", " ").toUpperCase()}</td>
									<td style={tdCenter}>{getValue(row, "opd", "male")}</td>
									<td style={tdCenter}>{getValue(row, "opd", "female")}</td>
									<td style={tdCenter}>{getValue(row, "emergency", "male")}</td>
									<td style={tdCenter}>{getValue(row, "emergency", "female")}</td>
									<td style={tdCenter}>{getValue(row, "ipd", "male")}</td>
									<td style={tdCenter}>{getValue(row, "ipd", "female")}</td>
								</tr>
							))}
							</tbody>

							{/* Table Footer with Totals */}
							<tfoot>
							<tr style={{ backgroundColor: "#f5f5f5", fontWeight: 600 }}>
								<td style={tdCenter}>TOTAL</td>
								<td style={tdCenter}>
									{Object.values(reportData).reduce((sum, r) => sum + getValue(r, "opd", "male"), 0)}
								</td>
								<td style={tdCenter}>
									{Object.values(reportData).reduce((sum, r) => sum + getValue(r, "opd", "female"), 0)}
								</td>
								<td style={tdCenter}>
									{Object.values(reportData).reduce((sum, r) => sum + getValue(r, "emergency", "male"), 0)}
								</td>
								<td style={tdCenter}>
									{Object.values(reportData).reduce((sum, r) => sum + getValue(r, "emergency", "female"), 0)}
								</td>
								<td style={tdCenter}>
									{Object.values(reportData).reduce((sum, r) => sum + getValue(r, "ipd", "male"), 0)}
								</td>
								<td style={tdCenter}>
									{Object.values(reportData).reduce((sum, r) => sum + getValue(r, "ipd", "female"), 0)}
								</td>
							</tr>
							</tfoot>
						</Table>
						<Title order={4} mb="xs" mt="xs">
							Death Report by Age Group
						</Title>
						<Table withBorder withColumnBorders striped highlightOnHover>
							<thead>
							<tr style={{ backgroundColor: "var(--mantine-color-gray-1)" }}>
								<th style={tdCenter}>Age Group</th>
								<th style={tdCenter}>Male</th>
								<th style={tdCenter}>Female</th>
								<th style={tdCenter}>Total</th>
							</tr>
							</thead>

							<tbody>
							{Object.entries(deathData).map(([ageKey, row,index]) => (
								<tr key={index}>
									<td style={tdAgeStyle}>{ageKey.replaceAll("_", " ").toUpperCase()}</td>
									<td style={tdCenter}>{row.male}</td>
									<td style={tdCenter}>{row.female}</td>
									<td style={tdCenter}>{(row.male ?? 0) + (row.female ?? 0)}</td>
								</tr>
							))}
							</tbody>
						</Table>
					</ScrollArea>

				</Box>
			</Box>
			{records?.data && (
				<DailyOpdEmergencyIpdReports ref={summaryReportsRef} records={records?.data || []} />
			)}

		</Box>
	);
}
