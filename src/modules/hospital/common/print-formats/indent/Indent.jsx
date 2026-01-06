import { Box, Text, Grid, Group, Image, Table, Flex } from "@mantine/core";
import React, { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import {capitalizeWords} from "@utils/index";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const Indent = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

	const patientInfo = data || {};
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	console.log(patientInfo?.stock_transfer_items);

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
				h={PAPER_HEIGHT}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				fz={12}
			>
				<Box  mb="lg" h={950} >
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
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"3"}>
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
								<Table.Td
									colSpan={3}
								>
									<Text fw="bold" pt={'md'} fz={'xl'}  ta={'center'}>INDENT</Text>
									<Flex gap="md" justify="center">
										<Text fw="bold" ta="left">
											Created:{patientInfo && patientInfo.invoice_date && patientInfo.invoice_date}
										</Text>
										<Text fw="bold" ta="left">
											{t("Department")}: {patientInfo && patientInfo.to_warehouse && patientInfo.to_warehouse}
										</Text>
									</Flex>
								</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th ta={'center'}>{t("S/N")}</Table.Th>
								<Table.Th>{t("Category")}</Table.Th>
								<Table.Th>{t("MedicineName")}</Table.Th>
								<Table.Th>{t("ExpiryDate")}</Table.Th>
								<Table.Th>{t("RequisitionQuantity")}</Table.Th>
								<Table.Th>{t("ActualQuantity")}</Table.Th>
							</Table.Tr>
							{patientInfo?.stock_transfer_items?.map((item, index) => (
								<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td ta={'center'} w={'50'}>{index + 1}.</Table.Td>
									<Table.Td>{getValue(capitalizeWords(item?.name))}</Table.Td>
									<Table.Td>{getValue(item?.ExpiryDate, "0")}</Table.Td>
									<Table.Td>{getValue(item?.stock_quantity, "0")}</Table.Td>
									<Table.Td>{getValue(item?.stock_quantity, "0")}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Box>
				<Box  bottom={'20'}  ta="center">
					<Box p="md" pt={0} pb={0}>
						<Grid columns={12} gutter="xs">
							<Grid.Col span={4}>
								<Text fw="bold" mb="sm" ta="center">
									Requisition By
								</Text>
							</Grid.Col>
							<Grid.Col span={4}>
								<Text fw="bold" mb="sm" ta="center">
									Department Head
								</Text>
							</Grid.Col>
							<Grid.Col span={4}>
								<Box>
									<Text fw="bold" mb="sm" ta="center">
										Store Incharge
									</Text>
								</Box>
							</Grid.Col>
							<Grid.Col span={4}>
								<Box>
									<Text fw="bold" mb="sm" ta="center">
										Store Officer
									</Text>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
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

Indent.displayName = "Indent";

export default Indent;
