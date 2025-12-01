import {Box, Text, Grid, Group, Image, Table, Flex} from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import { getLoggedInUser } from "@/common/utils";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const Indent = forwardRef(({ data, preview = false }, ref) => {
	const user = getLoggedInUser();

	const patientInfo = data || {};
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	console.log(patientInfo);

	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`@media print {
					table { border-collapse: collapse !important; }
					table, table th, table td { border: 1px solid #807e7e !important; }
				}`}
			</style>
			<Box
				ref={ref}
				p="md"
				w={PAPER_WIDTH}
				h={PAPER_HEIGHT}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				bd="1px solid black"
			>
				<Box pos="relative" mb="lg">
					<Table
						style={{
							borderCollapse: "collapse",
							width: "100%",
							border: "1px solid var(--theme-tertiary-color-8)",
						}}
						className="customTable"
					>
						<Table.Tbody>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td colSpan={"6"}>
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
								<Table.Td colspan={6} style={{ textAlign: "center",fontSize:"20px", fontWeight:'blod' }}>INDENT</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>{t("Created")}</Table.Td>
								<Table.Td> {patientInfo && patientInfo.invoice_date && patientInfo.invoice_date}</Table.Td>
								<Table.Td>{t("Store")}</Table.Td>
								<Table.Td>{patientInfo && patientInfo.to_warehouse && patientInfo.to_warehouse}</Table.Td>
								<Table.Td>  {t("Process")}</Table.Td>
								<Table.Td> {patientInfo && patientInfo.process && patientInfo.process}</Table.Td>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>{t("CreatedBy")}</Table.Td>
								<Table.Td colspan={2}> {patientInfo && patientInfo.created_by && patientInfo.created_by}</Table.Td>
								<Table.Td>{t("ApprovedBy")}</Table.Td>
								<Table.Td colspan={2}>{patientInfo && patientInfo.approved_by && patientInfo.approved_by}</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
					<Table style={{
						borderCollapse: "collapse",
						width: "100%",
						border: "1px solid var(--theme-tertiary-color-8)",
					}} className="customTable">
						<Table.Thead>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th>{t("S/N")}</Table.Th>
								<Table.Th>{t("MedicineName")}</Table.Th>
								<Table.Th>{t("Quantity")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{patientInfo?.stock_transfer_items?.map((item, index) => (
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td>{index+1}.</Table.Td>
								<Table.Td>{getValue(item?.name)}</Table.Td>
								<Table.Td>{getValue(item?.stock_quantity, "0")}</Table.Td>
							</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Box>
				<Box ta="center">
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
