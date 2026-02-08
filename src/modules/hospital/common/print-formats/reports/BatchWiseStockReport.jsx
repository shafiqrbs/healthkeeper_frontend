import { Box, Text, Grid, Group, Image, Table, Flex } from "@mantine/core";
import React, { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import {capitalizeWords, formatDate} from "@utils/index";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const BatchWiseStockReport = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

//	const data = data || {};
	const { hospitalConfigData } = useHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`
					.customTable {
					  border-collapse: collapse !important;
					  border-spacing: 0 !important;
					  margin: 0 !important;
					  
					}
					
					.customTable th,
					.customTable td {
					  padding: 0 !important;
					  margin: 0 !important;
					  line-height: 1.8;
					  padding-left: 8px !important;
					  
					
					}
					
					@media print {
					  .customTable,
					  .customTable th,
					  .customTable td {
						border: 1px solid #807e7e !important;
						padding-left: 8px !important;
					  }
					}
				`}
			</style>
			<style>
				{`@media print {
					table { border-collapse: collapse !important; }
					table, table th, table td { border: 1px solid #807e7e !important; }
				}`}
			</style>
			<Box
				pos="relative"
				ref={ref}
				p="md"
				w={PAPER_WIDTH}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				fz={12}
			>
				<Box  mb="lg">
					<Table
						style={{
							margin: 0,
							padding: 0,
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>

							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"7"}>
									<Box>
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
								<Table.Td style={{ border: "1px solid var(--theme-tertiary-color-8)" }}
									colSpan={7}
								>
									<Text fw="bold" fz={'xl'}  ta={'center'}>Batch wise stock Report</Text>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td colSpan={5} style={{ height: 16 }}>&nbsp;</Table.Td>
							</Table.Tr>
					</Table>
					<Table
						style={{
							padding: 0,
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>
						<Table.Thead>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th ta={'center'}>{t("S/N")}</Table.Th>
								<Table.Th>{t("Warehouse Name")}</Table.Th>
								<Table.Th>{t("Name")}</Table.Th>
								<Table.Th w={'80'}>{t("Expired Date")}</Table.Th>
								<Table.Th w={'80'}>{t("StockQuantity")}</Table.Th>
								<Table.Th w={'80'}>{t("IndentQuantity")}</Table.Th>
								<Table.Th w={'80'}>{t("RemainingQuantity")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{data?.map((item, index) => (
								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td ta={'center'} w={'50'}>{index + 1}.</Table.Td>
									<Table.Td>{getValue(item?.warehouse_name)}</Table.Td>
									<Table.Td>{getValue(item?.name)}</Table.Td>
									<Table.Td>{getValue(item?.expired_date)}</Table.Td>
									<Table.Td>{getValue(item?.purchase_quantity, "0")}</Table.Td>
									<Table.Td>{getValue(item?.indent_quantity, "0")}</Table.Td>
									<Table.Td>{getValue(item?.purchase_quantity-item?.indent_quantity, "0")}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Box>
				<Box  bottom={'20'}  ta="center">
					{/*<Box p="md" pt={'50'} pb={0}>
						<Grid columns={12} gutter="xs">
							<Grid.Col span={3}>
								--------------------------------
								<Text fw="bold" mb="sm" ta="center">
									Requisition By
								</Text>
							</Grid.Col>
							<Grid.Col span={3}>
								--------------------------------
								<Text fw="bold" mb="sm" ta="center">
									Department Head
								</Text>
							</Grid.Col>
							<Grid.Col span={3}>
								<Box>
									--------------------------------
									<Text fw="bold" mb="sm" ta="center">
										Store In-charge
									</Text>
								</Box>
							</Grid.Col>
							<Grid.Col span={3}>
								<Box>
									--------------------------------
									<Text fw="bold" mb="sm" ta="center">
										Store Officer
									</Text>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>*/}
					<Text size="xs" c="gray" mt="xs">
						<strong>{t("প্রিন্ট")}: </strong>
						{user?.name}
					</Text>
					<Text fz={8}>
						{t("প্রিন্টের সময়")}: {new Date().toLocaleString()}
					</Text>
				</Box>
			</Box>
		</Box>
	);
});

BatchWiseStockReport.displayName = "BatchWiseStockReport";

export default BatchWiseStockReport;
