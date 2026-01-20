import { Box, Text, Grid, Table } from "@mantine/core";
import { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import { formatDate } from "@utils/index";
import { IconCheck } from "@tabler/icons-react";

const SputumAFBReport = forwardRef(({ reportData, report }, ref) => {
	return (
		<>
			<Box h={500}>
				<style>
					{`@media print {
					#prescription-table table { border-collapse: collapse !important; }
					#prescription-table table, #prescription-table table th, #prescription-table table td { border: 1px solid #807e7e !important; }
				}`}
					{`@media  {
					#prescription-table table { border-collapse: collapse !important;border: 1px solid #807e7e !important; }
					#prescription-table table, #prescription-table table th, #prescription-table table td {  padding-top:0!important; padding-bottom:0!important; margin-top:0!important; margin-bottom:0!important; }
				}`}
				</style>
				<Box id="prescription-table" mb="md" pt={'xs'} fz={'md'}>
					<Box mb='md'>
						<Grid columns={12}>
							<Grid.Col span={4}>
								<strong>Test Date: </strong>{formatDate(reportData?.test_date)}
							</Grid.Col>
							<Grid.Col span={4}>
								<strong>Sample ID: </strong>{reportData?.sample_id}
							</Grid.Col>
							<Grid.Col span={4}>
								<strong>Lab Test ID: </strong>{reportData?.test_id}
							</Grid.Col>
						</Grid>
					</Box>
					<Table style={{
						borderCollapse: "collapse",
						width: "100%",
					}} className="customTable">
						<Table.Thead>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th ta="center" />
								<Table.Th ta="center">NO AFB FOUND</Table.Th>
								<Table.Th ta="center">SCANTY</Table.Th>
								<Table.Th ta="center">1+</Table.Th>
								<Table.Th ta="center">2+</Table.Th>
								<Table.Th ta="center">3+</Table.Th>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th ta="center">Sample 1</Table.Th>
								{/*<Table.Th ta="center">
								{reportData?.afb_found}
							</Table.Th>*/}
								<Table.Th ta="center">
									<Text style={{ color: "green" }}><strong>{reportData?.afb_not_found}</strong></Text>
								</Table.Th>
								<Table.Th ta="center" >
									<Text style={{ color: "red" }}><strong>{reportData?.afb_scanty}</strong></Text>
								</Table.Th>
								<Table.Th ta="center">
									{(reportData?.afb_scanty_one === true || reportData?.afb_scanty_one === 1) && (
										<Box ta={'center'}><IconCheck size="42px" color={'red'} /></Box>
									)}
								</Table.Th>
								<Table.Th ta="center">
									{(reportData?.afb_scanty_two === true || reportData?.afb_scanty_two === 1) && (
										<Box ta={'center'}><IconCheck size="42px" color={'red'} /></Box>
									)}
								</Table.Th>
								<Table.Th ta="center">
									{(reportData?.afb_scanty_three === true || reportData?.afb_scanty_three === 1) && (
										<Box ta={'center'}><IconCheck size="42px" color={'red'} /></Box>
									)}
								</Table.Th>
							</Table.Tr>
							<Table.Tr>
								<Table.Th ta="center">Sample 2</Table.Th>
								{/*<Table.Th ta="center">
								{reportData?.afb_sample_found}
							</Table.Th>*/}
								<Table.Th ta="center">
									<Text style={{ color: "green" }}><strong>{reportData?.afb_sample_not_found}</strong></Text>
								</Table.Th>
								<Table.Th ta="center">
									<Text style={{ color: "red" }}><strong>{reportData?.afb_sample_scanty}</strong></Text>
								</Table.Th>
								<Table.Th ta="center">
									{(reportData?.afb_sample_scanty_one === true || reportData?.afb_sample_scanty_one === 1) && (
										<Box ta={'center'}><IconCheck size="42px" color={'red'} /></Box>
									)}
								</Table.Th>
								<Table.Th ta="center">
									{(reportData?.afb_sample_scanty_two === true || reportData?.afb_sample_scanty_two === 1) && (
										<Box ta={'center'}><IconCheck size="42px" color={'red'} /></Box>
									)}
								</Table.Th>
								<Table.Th ta="center">
									{(reportData?.afb_sample_scanty_three === true || reportData?.afb_sample_scanty_three === 1) && (
										<Box ta={'center'}><IconCheck size="42px" color={'red'} /></Box>
									)}
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
					</Table>
				</Box>
				{/* =============== Doctor Information and Signature ================ */}

				<Box pt={0}>
					<Text fw="bold" size="xs" mb="xs" mt={'md'}>
						{t("Comment")}
					</Text>
					{report?.comment && (
						<Box p="xs" bd="1px solid #ddd">
							<Text size="xs">{report?.comment || ""}</Text>
						</Box>
					)}
				</Box>

			</Box>
			<Box p="md" pt={0} pb={0}>
				<Grid columns={12} gutter="xs">
					<Grid.Col span={4}>
						<Box>
							<Text fw="bold" ta="center">
								Medical Technologist
							</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={4} />
					<Grid.Col span={4}>
						<Box>
							<Text fw="bold" mb="sm" ta="center">
								Microbiologist
							</Text>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
		</>
	);
});
SputumAFBReport.displayName = "SputumAFBReport";
export default SputumAFBReport;
