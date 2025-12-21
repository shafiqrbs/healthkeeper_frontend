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
import {useMemo} from "@hello-pangea/dnd/src/use-memo-one";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const DailyCollectionServiceReports = forwardRef(({ records, preview = false }, ref) => {
	const { user } = useAppLocalStore();
	const { hospitalConfigData } = useHospitalConfigData();


	const formatMoney = (value) =>
		new Intl.NumberFormat("en-BD", {
			minimumFractionDigits: 0,
		}).format(value);

	const serviceFees = records?.serviceFees ?? [];
	const invoiceFilter = records?.filter || [];

	/* 1️⃣ Date-wise transformation */
	const dateWiseData = useMemo(() => {
		return Object.values(
			serviceFees.reduce((acc, item) => {
				const { report_date, name, total } = item;
				if (!acc[report_date]) {
					acc[report_date] = { report_date };
				}
				acc[report_date][name] = total;
				return acc;
			}, {})
		);
	}, [serviceFees]);

	/* 2️⃣ Dynamic columns */
	const columns = useMemo(() => {
		return [...new Set(serviceFees.map(item => item.name))];
	}, [serviceFees]);

	/* 3️⃣ Row-wise total */
	const dataWithRowTotal = useMemo(() => {
		return dateWiseData.map(row => {
			const rowTotal = columns.reduce(
				(sum, col) => sum + (row[col] ?? 0),
				0
			);
			return {
				...row,
				row_total: rowTotal,
			};
		});
	}, [dateWiseData, columns]);

	/* 4️⃣ Column-wise total */
	const columnTotals = useMemo(() => {
		return columns.reduce((acc, col) => {
			acc[col] = dataWithRowTotal.reduce(
				(sum, row) => sum + (row[col] ?? 0),
				0
			);
			return acc;
		}, {});
	}, [columns, dataWithRowTotal]);

	/* 5️⃣ Grand total */
	const grandTotal = useMemo(() => {
		return Object.values(columnTotals).reduce(
			(sum, val) => sum + val,
			0
		);
	}, [columnTotals]);

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
					<Table>
						{/* ===== HEADER ===== */}
						<Table.Thead bg="gray.1">
							<Table.Tr>
								<Table.Th w={120} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>Date</Table.Th>
								{columns.map((col) => (
									<Table.Th key={col} ta="right" fz={'xs'} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
										{col}
									</Table.Th>
								))}
								<Table.Th ta="right" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>Total</Table.Th>
							</Table.Tr>
						</Table.Thead>

						{/* ===== BODY ===== */}
						<Table.Tbody>
							{dataWithRowTotal.map((row) => (
								<Table.Tr key={row.report_date} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Table.Td style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
										<Text size="sm" fw={500}>
											{row.report_date}
										</Text>
									</Table.Td>

									{columns.map((col) => (
										<Table.Td key={col} ta="right" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
											{formatMoney(row[col] ?? 0)}
										</Table.Td>
									))}

									{/* Row total */}
									<Table.Td ta="right" fw={600}>
										{formatMoney(row.row_total)}
									</Table.Td>
								</Table.Tr>
							))}

							{/* ===== COLUMN TOTAL ===== */}
							<Table.Tr bg="gray.2" style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Td fw={700} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>Total</Table.Td>
								{columns.map((col) => (
									<Table.Td key={col} ta="right" fw={600} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
										{formatMoney(columnTotals[col])}
									</Table.Td>
								))}
								{/* Grand total */}
								<Table.Td ta="right" fw={800}  style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									{formatMoney(grandTotal)}
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>
			</Stack>
		</Box>
	);
});

DailyCollectionServiceReports.displayName = "DailyCollectionServiceReports";

export default DailyCollectionServiceReports;
