import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import {
	ActionIcon, Badge,
	Box,
	Card, Divider,
	Flex,
	FloatingIndicator,
	Grid, Group, Paper,
	rem,
	ScrollArea, Stack,
	Table,
	Tabs,
	Text,
} from "@mantine/core";
import {
	IconBed,
	IconChevronUp,
	IconCoinTaka,
	IconFileTypePdf,
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
import DailyOverview from "@modules/home/common/DailyOverview";
import SummaryReports from "@modules/hospital/reports/sales-summary/SummaryReports";
import InvoiceSummaryReports from "@modules/hospital/reports/sales-summary/InvoiceSummaryReports";
import { t } from "i18next";
import DailySummaryReports from "@hospital-components/print-formats/reports/DailySummaryReports";
import UserDailySummaryReports from "@hospital-components/print-formats/reports/UserDailySummaryReports";

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

export default function UserDailyInvoiceSummary() {
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[ module ].data);
	const height = mainAreaHeight - 156;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});

	const [ controlsRefs, setControlsRefs ] = useState({});
	const { data: records, isLoading } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.USER_DAILY_INVOICE_SUMMARY,
		params: {
			invoice_mode: form.values.invoice_mode,
			start_date: form.values.start_date,
			end_date: form.values.end_date,
		},
	});

	const collectionSummaryData = records?.data?.summary[ 0 ] || {};
	const userCollectionData = records?.data?.userBase || [];
	const summaryReportsRef = useRef(null);
	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});
	console.log(userCollectionData)
	const handleCSVDownload = () => {
		handleHomeOverviewPrint();
	};

	const formatCurrency = (value) =>
		Number(value).toLocaleString("en-BD", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientTickets")}
				</Text>
			</Flex>
			<Box px="sm" mb="sm">
				<ReportFilterSearch
					module={module}
					form={form}
					handleCSVDownload={handleCSVDownload}
				/>
			</Box>
			<Box className="border-top-none" px="sm">
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
										{t("CollectionOverview")}
									</Text>
									<ActionIcon
										onClick={handleCSVDownload}
										variant="default"
										c={"green.8"}
										size="md"
										aria-label="Filter"
									>
										<IconFileTypePdf style={{ width: rem(16) }} stroke={1.2} />
									</ActionIcon>
								</Flex>
							</Card.Section>
						</Card>
					</Grid.Col>
				</Grid>
				<Box ref={summaryReportsRef}>
					<ScrollArea mt="sm" h={height}>
						<Box className="borderRadiusAll" mt="3xs" px="xs">
							<Flex justify="space-between" align="center" py="3xs">
								<Text>{t("Grand Collection Amount")}</Text>
								<Flex align="center" gap="xs" w="80px">
									<IconCoinTaka color="var(--theme-primary-color-6)" />
									<Text fz="sm">{collectionSummaryData?.total || 0}</Text>
								</Flex>
							</Flex>
						</Box>
						<Box className="borderRadiusAll">
							<Paper radius="md" p="md" shadow="sm">
								<Stack gap="lg">
									{Object.entries(userCollectionData).map(([ groupName, rows ]) => {
										const total = rows.reduce((sum, r) => sum + r.total, 0);
										const refund = rows.reduce((sum, r) => sum + r.refund, 0);
										const subTotal = rows.reduce((sum, r) => sum + r.sub_total, 0);
										return (
											<Paper key={groupName} withBorder radius="md" p="xs">
												<Group justify="space-between" mb="xs">
													<Text fw={600} size="sm">
														{groupName}
													</Text>
												</Group>
												<Table>
													<Table.Thead>
														<Table.Tr>
															<Table.Th width={'50'}>#</Table.Th>
															<Table.Th>Name</Table.Th>
															<Table.Th width={'120'} ta="right">Total</Table.Th>
															<Table.Th width={'120'} ta="right">Refund</Table.Th>
															<Table.Th width={'120'} ta="right">Sub Total</Table.Th>
														</Table.Tr>
													</Table.Thead>
													<Table.Tbody>
														{rows.map((row, index) => (
															<Table.Tr key={index}>
																<Table.Td>{index + 1}</Table.Td>
																<Table.Td>{row.name}</Table.Td>
																<Table.Td ta="right">
																	{formatCurrency(row.total)}
																</Table.Td>
																<Table.Td ta="right">
																	{formatCurrency(row.refund)}
																</Table.Td>
																<Table.Td ta="right" fw={500}>
																	{formatCurrency(row.sub_total)}
																</Table.Td>
															</Table.Tr>
														))}
													</Table.Tbody>
													<Table.Tfoot>
														<Table.Tr>
															<Table.Th colSpan={2} ta="right">
																Group Total
															</Table.Th>
															<Table.Th ta="right">
																{formatCurrency(total)}
															</Table.Th>
															<Table.Th ta="right">
																{formatCurrency(refund)}
															</Table.Th>
															<Table.Th ta="right">
																{formatCurrency(subTotal)}
															</Table.Th>
														</Table.Tr>
													</Table.Tfoot>
												</Table>
											</Paper>
										);
									})}
								</Stack>
							</Paper>
						</Box>
					</ScrollArea>
				</Box>
			</Box>
			{records?.data && (
				<UserDailySummaryReports ref={summaryReportsRef} records={records?.data || []} />
			)}
		</Box>
	);
}
