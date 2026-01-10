import {Box, Text, Grid, Group, Image, Table, Flex, Stack, Center, Card, Paper} from "@mantine/core";
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

const UserDailySummaryReports = forwardRef(({ records, preview = false }, ref) => {
	const { user } = useAppLocalStore();
	const { hospitalConfigData } = useHospitalConfigData();
	const collectionSummaryData = records?.summary[0] || [];
	const invoiceFilter = records?.filter || [];
	const userCollectionData = records?.userBase || [];
	const formatCurrency = (value) =>
		Number(value).toLocaleString("en-BD", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
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
						}}
					>
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
								<Table.Td colSpan={2}>
									<Center>
										<Text size="md" fw={600}>
											Daily Summary Reports: {invoiceFilter?.start_date} To{" "}
											{invoiceFilter?.end_date}
										</Text>
									</Center>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={2}>
									<Paper radius="md" p="md">
										<Stack gap="lg">
											{Object.entries(userCollectionData).map(([groupName, rows]) => {
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
																<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
																	<Table.Th>#</Table.Th>
																	<Table.Th>Name</Table.Th>
																	<Table.Th width={'100'} ta="right">Total</Table.Th>
																	<Table.Th width={'100'} ta="right">Refund</Table.Th>
																	<Table.Th width={'100'} ta="right">Sub Total</Table.Th>
																</Table.Tr>
															</Table.Thead>
															<Table.Tbody>
																{rows.map((row, index) => (
																	<Table.Tr key={index} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
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
																<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
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
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
			</Stack>
		</Box>
	);
});

UserDailySummaryReports.displayName = "UserDailySummaryReports";

export default UserDailySummaryReports;
