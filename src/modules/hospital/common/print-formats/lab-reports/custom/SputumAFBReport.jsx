import {Box, Text, Grid, Stack, Table, Checkbox} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
import InputForm from "@components/form-builders/InputForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import {formatDate} from "@utils/index";
import {IconCheck} from "@tabler/icons-react";
const SputumAFBReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	console.log(reportData);
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
				<Table style={{
					borderCollapse: "collapse",
					width: "100%",
				}} className="customTable">
					<Table.Thead>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th ta="center"/>
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
								{reportData?.afb_not_found}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_scanty}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_scanty_one === true  && (
									<Box ta={'center'}><IconCheck size="42px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_scanty_two === true  && (
									<Box ta={'center'}><IconCheck size="42px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_scanty_three === true  && (
									<Box ta={'center'}><IconCheck size="42px" color={'green'} /></Box>
								)}
							</Table.Th>
						</Table.Tr>
						<Table.Tr>
							<Table.Th ta="center">Sample 2</Table.Th>
							{/*<Table.Th ta="center">
								{reportData?.afb_sample_found}
							</Table.Th>*/}
							<Table.Th ta="center">
								{reportData?.afb_sample_not_found}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_sample_scanty}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_sample_scanty_one === true  && (
									<Box ta={'center'}><IconCheck size="42px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_sample_scanty_two === true  && (
									<Box ta={'center'}><IconCheck size="42px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.afb_sample_scanty_three === true  && (
									<Box ta={'center'}><IconCheck size="42px" color={'green'} /></Box>
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
SputumAFBReport.displayName = "SputumAFBReport";
export default SputumAFBReport;
