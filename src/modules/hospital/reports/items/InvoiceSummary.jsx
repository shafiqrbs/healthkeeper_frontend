import { useRef } from "react";

import {
	ActionIcon,
	Box,
	Card,
	Flex,
	Grid,
	rem,
	ScrollArea,
	Table,
	Text,
} from "@mantine/core";
import {
	IconCoinTaka,
	IconFileTypePdf,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { capitalizeWords, formatDate } from "@/common/utils";
import { useForm } from "@mantine/form";
import { MODULES_CORE } from "@/constants";
import ReportFilterSearch from "@hospital-components/ReportFilterSearch";
import { useReactToPrint } from "react-to-print";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import DailySummaryReports from "@hospital-components/print-formats/reports/DailySummaryReports";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

export default function InvoiceSummary() {
	const { mainAreaHeight } = useMainAreaHeight();
	const { t } = useTranslation();
	const height = mainAreaHeight - 126;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});

	const { data: records } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_DAILY_SUMMARY,
		params: {
			invoice_mode: form.values.invoice_mode,
			start_date: form.values.start_date,
			end_date: form.values.end_date,
		},
	});

	const collectionSummaryData = records?.data?.summary[ 0 ] || {};
	const refundTotal = records?.data?.refundTotal || 0;

	const invoiceModeData = records?.data?.invoiceMode || [];
	const patientModeCollectionData = records?.data?.patientMode || [];
	const userCollectionData = records?.data?.userBase || [];
	const serviceData = records?.data?.services || [];
	const patientServiceModeData = records?.data?.patientServiceMode || [];
	const financialServices = records?.data?.financialServices || [];
	const summaryReportsRef = useRef(null);

	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});
	const handleCSVDownload = () => {
		handleHomeOverviewPrint();
	};

	const totalModeCount = patientModeCollectionData?.reduce(
		(sum, item) => sum + (item?.total_count ?? 0),
		0
	);
	const totalModeAmount = patientModeCollectionData?.reduce(
		(sum, item) => sum + (item?.total ?? 0),
		0
	);

	const totalInvoiceModeAmount = invoiceModeData?.reduce(
		(sum, item) => sum + (item?.sub_total ?? 0),
		0
	);

	const totalPatientServiceAmount = patientServiceModeData?.reduce((sum, item) => sum + (item.total ?? 0), 0);
	const totalPatientServiceCount = patientServiceModeData?.reduce((sum, item) => sum + parseInt(item.patient, 0), 0);
	const totalFinancialServiceAmount = financialServices?.reduce((sum, item) => sum + (item.sub_total ?? 0), 0);

	const totalUserAmount = userCollectionData?.reduce((sum, item) => sum + (item?.total ?? 0), 0);

	const totalServiceAmount = serviceData?.reduce((sum, item) => sum + (item.sub_total ?? 0), 0);

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
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
								<Flex align="center" gap="xs" w="120px">
									<IconCoinTaka color="var(--theme-primary-color-6)" />
									Total <Text fz="sm">{collectionSummaryData?.total || 0}</Text>
								</Flex>
								<Flex align="center" gap="xs" w="120px">
									<IconCoinTaka color="var(--theme-primary-color-6)" />
									Refund <Text fz="sm">{refundTotal?.refund || 0}</Text>
								</Flex>
								<Flex align="center" gap="xs" w="220px">
									<IconCoinTaka color="var(--theme-primary-color-6)" />
									Grand Total <Text fz="sm">{(collectionSummaryData?.total - refundTotal?.refund) || 0}</Text>
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
											{t("PaymentServiceBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead bg="var(--theme-secondary-color-0)">
									<Table.Tr py="xs">
										<Table.Td width={'70%'}>Particular</Table.Td>
										<Table.Td width={'15%'}>Patient</Table.Td>
										<Table.Td width={'15%'}>Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{patientServiceModeData && (
										patientServiceModeData?.map((item, index) => (
											<Table.Tr key={item.id || index}>
												<Table.Td width={"70%"}>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td width={"15%"}>{item?.patient}</Table.Td>
												<Table.Td width={"15%"}>{item?.total}</Table.Td>
											</Table.Tr>
										))
									)}
									<Table.Tr>
										<Table.Td>Total</Table.Td>
										<Table.Td>{totalPatientServiceCount}</Table.Td>
										<Table.Td>{totalPatientServiceAmount}</Table.Td>
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
											{t("TicketBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead>
									<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
										<Table.Td width={"70%"}>Patient Mode</Table.Td>
										<Table.Td width={"15%"}>Patient</Table.Td>
										<Table.Td width={"15%"}> Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{patientModeCollectionData &&
										patientModeCollectionData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td>{item?.total_count}</Table.Td>
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
										<Table.Td width={"15%"}> Refund</Table.Td>
										<Table.Td width={"15%"}> Total</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{invoiceModeData &&
										invoiceModeData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{capitalizeWords(item?.name == 'ipd' ? 'Admission' : item?.name)}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
												<Table.Td>{item?.refund}</Table.Td>
												<Table.Td>{item?.sub_total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td colSpan={3}>Total</Table.Td>
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
										<Table.Td width={"85%"}>Employee Name</Table.Td>
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
											{t("FinancialServiceGroupBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table style={{
								borderCollapse: "collapse",
								width: "100%",
							}}>
								<Table.Thead bg="var(--theme-secondary-color-0)">
									<Table.Tr py="xs">
										<Table.Td width={"70%"}>Particular</Table.Td>
										<Table.Td>Amount</Table.Td>
										<Table.Td>Refund</Table.Td>
										<Table.Td>Total</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{financialServices && (
										financialServices?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
												<Table.Td>{item?.refund}</Table.Td>
												<Table.Td>{item?.sub_total}</Table.Td>
											</Table.Tr>
										))
									)}
									<Table.Tr bg="var(--theme-primary-color-1)">
										<Table.Td colSpan={'3'}>Total</Table.Td>
										<Table.Td>{totalFinancialServiceAmount}</Table.Td>
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
										<Table.Td>Refund</Table.Td>
										<Table.Td>Total</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{serviceData &&
										serviceData?.map((item, index) => (
											<Table.Tr key={item.id || index} py="xs">
												<Table.Td>{item?.name}</Table.Td>
												<Table.Td>{item?.total_count}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
												<Table.Td>{item?.refund}</Table.Td>
												<Table.Td>{item?.sub_total}</Table.Td>
											</Table.Tr>
										))}
									<Table.Tr py="xs" bg="var(--theme-primary-color-1)">
										<Table.Td colSpan={'4'}>Total</Table.Td>
										<Table.Td>{totalServiceAmount}</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>

					</ScrollArea>
				</Box>
			</Box>
			{records?.data && (
				<DailySummaryReports ref={summaryReportsRef} records={records?.data || []} />
			)}
		</Box>
	);
}
