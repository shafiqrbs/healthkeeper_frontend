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

export default function InvoiceSummary() {
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);
	const height = mainAreaHeight - 156;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});

	const [controlsRefs, setControlsRefs] = useState({});
	const { data: records, isLoading } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_DAILY_SUMMARY,
		params: {
			start_date: form.values.start_date,
			end_date: form.values.end_date,
		},
	});

	const collectionSummaryData = records?.data?.summary[0] || {};
	const invoiceModeData = records?.data?.invoiceMode || [];
	const patientModeCollectionData = records?.data?.patientMode || [];
	const userCollectionData = records?.data?.userBase || [];
	const serviceGroups = records?.data?.serviceGroups || [];
	const serviceData = records?.data?.services || [];

	const summaryReportsRef = useRef(null);
	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});
	const handleCSVDownload = () => {
		handleHomeOverviewPrint();
	};

	const totalModeCount = patientModeCollectionData?.reduce(
		(sum, item) => sum + (item.patient ?? 0),
		0
	);
	const totalModeAmount = patientModeCollectionData?.reduce(
		(sum, item) => sum + (item.total ?? 0),
		0
	);

	const totalInvoiceModeAmount = invoiceModeData?.reduce(
		(sum, item) => sum + (item.total ?? 0),
		0
	);

	const totalUserCount = userCollectionData?.reduce(
		(sum, item) => sum + parseInt(item.total_count, 10),0);
	const totalUserAmount = userCollectionData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalServiceCount = serviceData?.reduce((sum, item) => sum + parseInt(item.total_count, 10),0);
	const totalServiceAmount = serviceData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalServieGroupCount = serviceGroups?.reduce(
		(sum, item) => sum + parseInt(item.total_count, 10),0);
	const totalServiceGroupAmount = serviceGroups?.reduce(
		(sum, item) => sum + (item.total ?? 0),
		0
	);

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
							<Flex
								justify="space-between"
								align="center"
								className="borderBottomDashed"
								py="3xs"
							>
								<Text>{t("Patient")}</Text>
								<Flex align="center" gap="xs" w="80px">
									<IconBed color="var(--theme-primary-color-6)" />
									<Text fz="sm">{collectionSummaryData?.patient || 0}</Text>
								</Flex>
							</Flex>
							<Flex justify="space-between" align="center" py="3xs">
								<Text>{t("Collection")}</Text>
								<Flex align="center" gap="xs" w="80px">
									<IconCoinTaka color="var(--theme-primary-color-6)" />
									<Text fz="sm">{collectionSummaryData?.total || 0}</Text>
								</Flex>
							</Flex>
						</Box>
						<Box className="borderRadiusAll">
							<Card padding="lg" radius="sm">
								<Card.Section
									h={32}
									withBorder
									component="div"
									bg="var(--theme-primary-color-7)"
								>
									<Flex align="center" h="100%" px="lg" justify="space-between">
										<Text pb={0} fz="sm" c="white" fw={500}>
											{t("TicketBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead>
									<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
										<Table.Td width={"70%"}>Patient Mode</Table.Td>
										<Table.Td width={"15%"}>Number of Patient</Table.Td>
										<Table.Td width={"15%"}> Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{patientModeCollectionData &&
										patientModeCollectionData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td>{item?.patient}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td>Total</Table.Td>
										<Table.Td>{totalModeCount}</Table.Td>
										<Table.Td>{totalModeAmount}</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>
						<Box className="borderRadiusAll">
							<Card padding="lg" radius="sm">
								<Card.Section
									h={32}
									withBorder
									component="div"
									bg="var(--theme-primary-color-7)"
								>
									<Flex align="center" h="100%" px="lg" justify="space-between">
										<Text pb={0} fz="sm" c="white" fw={500}>
											{t("InvoiceModeCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead>
									<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
										<Table.Td width={"85%"}>Invoice Mode</Table.Td>
										<Table.Td width={"15%"}> Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{invoiceModeData &&
										invoiceModeData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td>Total</Table.Td>
										<Table.Td>{totalInvoiceModeAmount}</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>
						<Box className="borderRadiusAll">
							<Card padding="lg" radius="sm">
								<Card.Section
									h={32}
									withBorder
									component="div"
									bg="var(--theme-primary-color-7)"
								>
									<Flex align="center" h="100%" px="lg" justify="space-between">
										<Text pb={0} fz="sm" c="white" fw={500}>
											{t("UserBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead bg="var(--theme-secondary-color-0)">
									<Table.Tr py="xs">
										<Table.Td width={"85%"}>Particular</Table.Td>
										<Table.Td>Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{userCollectionData &&
										userCollectionData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td>Total</Table.Td>
										<Table.Td>{totalUserAmount}</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>
						<Box className="borderRadiusAll">
							<Card padding="lg" radius="sm">
								<Card.Section
									h={32}
									withBorder
									component="div"
									bg="var(--theme-primary-color-7)"
								>
									<Flex align="center" h="100%" px="lg" justify="space-between">
										<Text pb={0} fz="sm" c="white" fw={500}>
											{t("ServiceBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead bg="var(--theme-secondary-color-0)">
									<Table.Tr py="xs">
										<Table.Td width={"70%"}>Particular</Table.Td>
										<Table.Td width={"15%"}>Number of service</Table.Td>
										<Table.Td>Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{serviceData &&
										serviceData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total_count}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td>Total</Table.Td>
										<Table.Td>{totalServiceCount}</Table.Td>
										<Table.Td>{totalServiceAmount}</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>
						<Box className="borderRadiusAll">
							<Card padding="lg" radius="sm">
								<Card.Section
									h={32}
									withBorder
									component="div"
									bg="var(--theme-primary-color-7)"
								>
									<Flex align="center" h="100%" px="lg" justify="space-between">
										<Text pb={0} fz="sm" c="white" fw={500}>
											{t("ServiceGroupBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead bg="var(--theme-secondary-color-0)">
									<Table.Tr py="xs">
										<Table.Td width={"85%"}>Particular</Table.Td>
										<Table.Td>Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{serviceGroups &&
										serviceGroups?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td>Total</Table.Td>
										<Table.Td>{totalServiceGroupAmount}</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>
					</ScrollArea><Box className="border-top-none" px="sm">
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
								<Flex
									justify="space-between"
									align="center"
									className="borderBottomDashed"
									py="3xs"
								>
									<Text>{t("Patient")}</Text>
									<Flex align="center" gap="xs" w="80px">
										<IconBed color="var(--theme-primary-color-6)" />
										<Text fz="sm">{collectionSummaryData?.patient || 0}</Text>
									</Flex>
								</Flex>
								<Flex justify="space-between" align="center" py="3xs">
									<Text>{t("Collection")}</Text>
									<Flex align="center" gap="xs" w="80px">
										<IconCoinTaka color="var(--theme-primary-color-6)" />
										<Text fz="sm">{collectionSummaryData?.total || 0}</Text>
									</Flex>
								</Flex>
							</Box>
							<Box className="borderRadiusAll">
								<Card padding="lg" radius="sm">
									<Card.Section
										h={32}
										withBorder
										component="div"
										bg="var(--theme-primary-color-7)"
									>
										<Flex align="center" h="100%" px="lg" justify="space-between">
											<Text pb={0} fz="sm" c="white" fw={500}>
												{t("TicketBaseCollections")}
											</Text>
										</Flex>
									</Card.Section>
								</Card>
								<Table>
									<Table.Thead>
										<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
											<Table.Td width={"70%"}>Patient Mode</Table.Td>
											<Table.Td width={"15%"}>Number of Patient</Table.Td>
											<Table.Td width={"15%"}> Amount</Table.Td>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{patientModeCollectionData &&
										patientModeCollectionData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td>{item?.patient}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
											<Table.Td>Total</Table.Td>
											<Table.Td>{totalModeCount}</Table.Td>
											<Table.Td>{totalModeAmount}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
							<Box className="borderRadiusAll">
								<Card padding="lg" radius="sm">
									<Card.Section
										h={32}
										withBorder
										component="div"
										bg="var(--theme-primary-color-7)"
									>
										<Flex align="center" h="100%" px="lg" justify="space-between">
											<Text pb={0} fz="sm" c="white" fw={500}>
												{t("InvoiceModeCollections")}
											</Text>
										</Flex>
									</Card.Section>
								</Card>
								<Table>
									<Table.Thead>
										<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
											<Table.Td width={"85%"}>Invoice Mode</Table.Td>
											<Table.Td width={"15%"}> Amount</Table.Td>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{invoiceModeData &&
										invoiceModeData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
											<Table.Td>Total</Table.Td>
											<Table.Td>{totalInvoiceModeAmount}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
							<Box className="borderRadiusAll">
								<Card padding="lg" radius="sm">
									<Card.Section
										h={32}
										withBorder
										component="div"
										bg="var(--theme-primary-color-7)"
									>
										<Flex align="center" h="100%" px="lg" justify="space-between">
											<Text pb={0} fz="sm" c="white" fw={500}>
												{t("UserBaseCollections")}
											</Text>
										</Flex>
									</Card.Section>
								</Card>
								<Table>
									<Table.Thead bg="var(--theme-secondary-color-0)">
										<Table.Tr py="xs">
											<Table.Td width={"85%"}>Particular</Table.Td>
											<Table.Td>Amount</Table.Td>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{userCollectionData &&
										userCollectionData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
											<Table.Td>Total</Table.Td>
											<Table.Td>{totalUserAmount}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
							<Box className="borderRadiusAll">
								<Card padding="lg" radius="sm">
									<Card.Section
										h={32}
										withBorder
										component="div"
										bg="var(--theme-primary-color-7)"
									>
										<Flex align="center" h="100%" px="lg" justify="space-between">
											<Text pb={0} fz="sm" c="white" fw={500}>
												{t("ServiceBaseCollections")}
											</Text>
										</Flex>
									</Card.Section>
								</Card>
								<Table>
									<Table.Thead bg="var(--theme-secondary-color-0)">
										<Table.Tr py="xs">
											<Table.Td width={"70%"}>Particular</Table.Td>
											<Table.Td width={"15%"}>Number of service</Table.Td>
											<Table.Td>Amount</Table.Td>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{serviceData &&
										serviceData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total_count}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
											<Table.Td>Total</Table.Td>
											<Table.Td>{totalServiceCount}</Table.Td>
											<Table.Td>{totalServiceAmount}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
							<Box className="borderRadiusAll">
								<Card padding="lg" radius="sm">
									<Card.Section
										h={32}
										withBorder
										component="div"
										bg="var(--theme-primary-color-7)"
									>
										<Flex align="center" h="100%" px="lg" justify="space-between">
											<Text pb={0} fz="sm" c="white" fw={500}>
												{t("ServiceGroupBaseCollections")}
											</Text>
										</Flex>
									</Card.Section>
								</Card>
								<Table>
									<Table.Thead bg="var(--theme-secondary-color-0)">
										<Table.Tr py="xs">
											<Table.Td width={"85%"}>Particular</Table.Td>
											<Table.Td>Amount</Table.Td>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{serviceGroups &&
										serviceGroups?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
											</Table.Tr>
										))}
										<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
											<Table.Td>Total</Table.Td>
											<Table.Td>{totalServiceGroupAmount}</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
						</ScrollArea>
					</Box>
				</Box>
				</Box>
			</Box>
			{records?.data && (
				<DailySummaryReports ref={summaryReportsRef}  records={records?.data || []} />
			)}
		</Box>
	);
}
