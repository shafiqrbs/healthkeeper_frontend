import {Box, Text, Grid, Group, Image, Table, Flex, Stack, Center, Card, Title, ScrollArea} from "@mantine/core";
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
import {useMemo} from "@hello-pangea/dnd/src/use-memo-one";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const DailyOpdEmergencyIpdReports = forwardRef(({ records, preview = false }, ref) => {
	const { user } = useAppLocalStore();
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (row, type, gender) => row?.[type]?.[gender] ?? 0;
	const reportData = records?.entities ?? [];
	const deathData = records?.deathData ?? [];
	const invoiceFilter = records?.filter || [];

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
							padding:"16px"
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
										<Text size="md" fw={600}>Daily Collection Service Reports: {invoiceFilter?.start_date} To {invoiceFilter?.end_date}</Text>
									</Center>
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
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
				</Box>
			</Stack>
		</Box>
	);
});

DailyOpdEmergencyIpdReports.displayName = "DailyOpdEmergencyIpdReports";

export default DailyOpdEmergencyIpdReports;
