import {Box, Text, Grid, Stack, Table, Checkbox} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
import InputForm from "@components/form-builders/InputForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import {formatDate} from "@utils/index";
import {IconCheck} from "@tabler/icons-react";
const AFBCultureReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	console.log(report);
	const { mainAreaHeight } = useOutletContext();
	return (
		<Box h={600}>
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

			<Box id="prescription-table" mb="md" pt={'100'}  fz={'md'}>
				<Box mb='md'>
					<Grid columns={12}>
						<Grid.Col span={8}>
							<strong>Diagnosis: </strong>{reportData?.afb_diagnosis}
						</Grid.Col>
						<Grid.Col span={4}>
							<strong>Follow up: </strong>{formatDate(reportData?.follow_up_month)}
						</Grid.Col>
					</Grid>
				</Box>
				<Table style={{
					borderCollapse: "collapse",
					width: "100%",
				}} className="customTable">
					<Table.Thead>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th colSpan={4}/>
							<Table.Th colSpan={4} ta="center">
								Mycobacterium tuberculosis Complex
							</Table.Th>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th ta="center">Contaminated</Table.Th>
							<Table.Th ta="center">Negative</Table.Th>
							<Table.Th ta="center">Positive</Table.Th>
							<Table.Th ta="center">Atypical Mycobacteria (Species)</Table.Th>
							<Table.Th ta="center">{"<20=1-19 Colonies actual count"}</Table.Th>
							<Table.Th ta="center">{"1+=20-100 Colonies"}</Table.Th>
							<Table.Th ta="center">{"2+=>100-200 Colonies"}</Table.Th>
							<Table.Th ta="center">{"3+=>200 Colonies"}</Table.Th>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th ta="center">
								{reportData?.afb_contaminated}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.negative}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.positive}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.atypical_mycobacteria_species}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_1 === 1  && (
								<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_2 === 1  && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_3 === 1  && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_4 === 1  && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
				</Table>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
AFBCultureReport.displayName = "AFBCultureReport";
export default AFBCultureReport;
