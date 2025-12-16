import {Box, Text, Grid, Group, Image, Table, Flex, Stack, Center, Card} from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { formatDate } from "@/common/utils";
import useAppLocalStore from "@/common/hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import Rx from "@assets/images/rx.png";
import Barcode from "react-barcode";
import { IconPointFilled } from "@tabler/icons-react";
import { capitalizeWords } from "@utils/index";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const DailySummaryReports = forwardRef(({ records, preview = false }, ref) => {
	const { user } = useAppLocalStore();
	const { hospitalConfigData } = useHospitalConfigData();
	const collectionSummaryData = records?.summary[0] || [];
	const invoiceFilter = records?.filter || [];
	const invoiceModeData = records?.invoiceMode || [];
	const patientServiceModeData = records?.patientServiceMode || [];
	const patientModeCollectionData = records?.patientMode || [];
	const userCollectionData = records?.userBase || [];
	const serviceGroups = records?.serviceGroups || [];
	const serviceData = records?.services || [];
	const financialServices = records?.financialServices || [];

	const totalModeCount = patientModeCollectionData?.reduce((sum, item) => sum + (item.patient ?? 0), 0);
	const totalModeAmount = patientModeCollectionData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalInvoiceModeAmount = invoiceModeData?.reduce((sum, item) => sum + (item.total ?? 0), 0);
	const totalPatientServiceAmount = patientServiceModeData?.reduce((sum, item) => sum + (item.total ?? 0), 0);
	const totalPatientServiceCount = patientServiceModeData?.reduce((sum, item) => sum + parseInt(item.patient, 10),0);

	const totalUserCount = userCollectionData?.reduce((sum, item) => sum + (item.total_count ?? 0), 0);
	const totalUserAmount = userCollectionData?.reduce((sum, item) => sum + (item.total ?? 0), 0);


	const totalServiceCount = serviceData?.reduce(
		(sum, item) => sum + parseInt(item.total_count, 10),0
	);
	const totalServiceAmount = serviceData?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalFinancialServiceCount = financialServices?.reduce((sum, item) => sum + (item.total_count ?? 0), 0);
	const totalFinancialServiceAmount = financialServices?.reduce((sum, item) => sum + (item.total ?? 0), 0);

	const totalServieGroupCount = serviceGroups?.reduce((sum, item) => sum + (item.total_count ?? 0), 0);
	const totalServiceGroupAmount = serviceGroups?.reduce((sum, item) => sum + (item.total ?? 0), 0);


	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`@media print {
					table { border-collapse: collapse !important; }
					table, table th, table 
				}`}
				{`@media  {
					table { border-collapse: collapse !important; }
					table, table th, table td {  padding-top:0!important; padding-bottom:0!important; margin-top:0!important; margin-bottom:0!important; }
				}`}
			</style>
			<Stack
				ref={ref}
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				align="stretch"
				justify="space-between"
			>
				<Box>
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
						}}>
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={2}>
									<Box mb="sm">
										<Flex gap="md" justify="center">
											<Box>
												<Group ml="md" align="center" h="100%">
													<Image src={GLogo} alt="logo" width={60} height={60} />
												</Group>
											</Box>
											<Box>
												<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
													{hospitalConfigData?.organization_name || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mt="2">
													{hospitalConfigData?.address || ""}
												</Text>
												<Text ta="center" size="sm" c="gray" mb="2">
													{t("হটলাইন")} {hospitalConfigData?.hotline || ""}
												</Text>
											</Box>
											<Box>
												<Group mr="md" justify="flex-end" align="center" h="100%">
													<Image src={TBLogo} alt="logo" width={60} height={60} />
												</Group>
											</Box>
										</Flex>
									</Box>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={2} >
									<Center>
										<Text size="md" fw={600}>Daily Summary Reports: {invoiceFilter?.start_date} To {invoiceFilter?.end_date}</Text>
									</Center>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>
									<Center>
										<Text size="md" fw={600}>
											{t("TicketBaseCollections")}
										</Text>
									</Center>
								</Table.Td>
								<Table.Td>
									<Center>
										<Text size="md" fw={600}>{t("FinancialServiceCollections")}</Text>
									</Center>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td valign="top" width={"50%"}>
									<Table style={{
										borderCollapse: "collapse",
										width: "100%",
									}}>
										<Table.Thead bg="var(--theme-secondary-color-0)">
											<Table.Tr py="xs" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Td width={'88%'}>Particular</Table.Td>
												<Table.Td>Patient</Table.Td>
												<Table.Td>Amount</Table.Td>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{patientModeCollectionData && (
												patientModeCollectionData?.map((item, index) => (
													<Table.Tr key={item.id || index} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
														<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
														<Table.Td>{item?.patient}</Table.Td>
														<Table.Td>{item?.total}</Table.Td>
													</Table.Tr>
												))
											)}
											<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Td>Total</Table.Td>
												<Table.Td>{totalModeCount}</Table.Td>
												<Table.Td>{totalModeAmount}</Table.Td>
											</Table.Tr>
										</Table.Tbody>
									</Table>
									<Table style={{
										borderCollapse: "collapse",
										width: "100%",
									}}>
										<Table.Thead bg="var(--theme-secondary-color-0)">
											<Table.Tr py="xs" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Td width={'88%'}>Particular</Table.Td>
												<Table.Td>Patient</Table.Td>
												<Table.Td>Amount</Table.Td>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{patientServiceModeData && (
												patientServiceModeData?.map((item, index) => (
													<Table.Tr key={item.id || index} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
														<Table.Td>{capitalizeWords(item?.name)}</Table.Td>
														<Table.Td>{item?.patient}</Table.Td>
														<Table.Td>{item?.total}</Table.Td>
													</Table.Tr>
												))
											)}
											<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Td>Total</Table.Td>
												<Table.Td>{totalPatientServiceCount}</Table.Td>
												<Table.Td>{totalPatientServiceAmount}</Table.Td>
											</Table.Tr>
										</Table.Tbody>
									</Table>
								</Table.Td>
								<Table.Td valign="top" width={"50%"}>
									<Table style={{
										borderCollapse: "collapse",
										width: "100%",
									}}>
										<Table.Thead bg="var(--theme-secondary-color-0)">
											<Table.Tr py="xs" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Td width={'88%'}>Particular</Table.Td>
												<Table.Td>Amount</Table.Td>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{financialServices && (
												financialServices?.map((item, index) => (
													<Table.Tr key={item.id || index} py="xs" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
														<Table.Td>{item?.name}</Table.Td>
														<Table.Td>{item?.total}</Table.Td>
													</Table.Tr>
												))
											)}
											<Table.Tr bg="var(--theme-primary-color-1)" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
												<Table.Td>Total</Table.Td>
												<Table.Td>{totalFinancialServiceAmount}</Table.Td>
											</Table.Tr>
										</Table.Tbody>
									</Table>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colspan={2}>
									<Center>
										<Text size="md" fw={600}>
											{t("ServiceCollections")}
										</Text>
									</Center>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td valign="top" colspan={2}>
									<Table>
										<Table.Thead bg="var(--theme-secondary-color-0)">
											<Table.Tr py="xs">
												<Table.Td width={'60%'}>Particular</Table.Td>
												<Table.Td width={'20%'}>Number of service</Table.Td>
												<Table.Td>Amount</Table.Td>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{serviceData && (
												serviceData?.map((item, index) => (
													<Table.Tr key={item.id || index} py="xs">
														<Table.Td>{item?.name}</Table.Td>
														<Table.Td>{item?.total_count}</Table.Td>
														<Table.Td>{item?.total}</Table.Td>
													</Table.Tr>
												))
											)}
											<Table.Tr bg="var(--theme-primary-color-1)">
												<Table.Td>Total</Table.Td>
												<Table.Td>{totalServiceCount}</Table.Td>
												<Table.Td>{totalServiceAmount}</Table.Td>
											</Table.Tr>
										</Table.Tbody>
									</Table>
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
			</Stack>
		</Box>
	);
});

DailySummaryReports.displayName = "DailySummaryReports";

export default DailySummaryReports;
