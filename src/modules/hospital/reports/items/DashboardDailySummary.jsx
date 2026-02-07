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
import { useReactToPrint } from "react-to-print";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import InvoiceSummaryReports from "@modules/hospital/reports/sales-summary/InvoiceSummaryReports";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

export default function DashboardDailySummary() {
	const { mainAreaHeight } = useMainAreaHeight();
	const { t } = useTranslation();
	const height = mainAreaHeight - 98;
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});

	const { data: records } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_DAILY_SUMMARY,
		params: {
			start_date: form.values.start_date,
			end_date: form.values.end_date,
		},
	});
	const collectionSummaryData = records?.data?.summary[ 0 ] || {};
	const invoiceModeData = records?.data?.invoiceMode || [];
	const patientModeCollectionData = records?.data?.patientMode || [];
	const userCollectionData = records?.data?.userBase || [];
	const patientServiceModeData = records?.data?.patientServiceMode || [];
	const summaryReportsRef = useRef(null);
	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});
	const handleCSVDownload = () => {
		handleHomeOverviewPrint();
	};

	const totalModeCount = patientModeCollectionData?.reduce(
		(sum, item) => sum + (item.total_count ?? 0),
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

	const totalPatientServiceAmount = patientServiceModeData?.reduce((sum, item) => sum + (item.total ?? 0), 0);
	const totalPatientServiceCount = patientServiceModeData?.reduce((sum, item) => sum + parseInt(item.patient, 10), 0);

	const totalUserAmount = userCollectionData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("PatientTickets")}
				</Text>
			</Flex>
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
											{t("PaymentServiceBaseCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead bg="var(--theme-secondary-color-0)">
									<Table.Tr py="xs">
										<Table.Td width={'70%'}>Particular</Table.Td>
										<Table.Td>Patient</Table.Td>
										<Table.Td>Amount</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{patientServiceModeData && (
										patientServiceModeData?.map((item, index) => (
											<Table.Tr key={item.id || index}>
												<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
												<Table.Td>{item?.patient}</Table.Td>
												<Table.Td>{item?.total}</Table.Td>
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
											{t("InvoiceModeCollections")}
										</Text>
									</Flex>
								</Card.Section>
							</Card>
							<Table>
								<Table.Thead>
									<Table.Tr py="xs" bg="var(--theme-secondary-color-0)">
										<Table.Td width={"70%"}>Invoice Mode</Table.Td>
										<Table.Td> Amount</Table.Td>
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
										<Table.Td width={"70%"}>Particular</Table.Td>
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


					</ScrollArea>
				</Box>
			</Box>
			{records?.data && (
				<InvoiceSummaryReports ref={summaryReportsRef} data={records?.data || []} />
			)}

		</Box>
	);
}
