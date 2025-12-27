import {Box, Text, Grid, Stack, Table, Radio} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
import InputForm from "@components/form-builders/InputForm";
import { IconCheck } from "@tabler/icons-react";


const GeneXpert = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	console.log(reportData);
//	const custom_report = diagnosticReport?.custom_report || {};

	const { mainAreaHeight } = useOutletContext();
	return (
		<Box>
			<Box mb="md" pt={'xs'}  fz={'md'} h={600}>
				<Table
					withColumnBorders
					verticalSpacing={6}
					horizontalSpacing={6}
					striped={false}
					highlightOnHover={false}
					style={{
						borderCollapse: "collapse",
						width: "100%",
						border: "1px solid var(--theme-tertiary-color-8)",
					}}  w="100%">
					<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Text>T-MTB Detected, Rif Resistance not Detected</Text>
						</Table.Th>
						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Text>RR-MTB Detected, Rif Resistance Detected</Text>
						</Table.Th>

						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Text>TI-MTB Detected, Rif Resistance </Text>
						</Table.Th>

						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Text>T-MTB Not Detected</Text>
						</Table.Th>

						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Text>INVALID/ERROR/NO RESULT</Text>
						</Table.Th>
					</Table.Tr>
					<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							{reportData?.gene_xpert_value === "not_detected" && (
							<Box ta={'center'}><IconCheck size="120px" color={'green'} /></Box>
							)}
						</Table.Th>
						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							{reportData?.gene_xpert_value === "detected" && (
								<Box ta={'center'}><IconCheck size="120px" color={'green'} /></Box>
							)}
						</Table.Th>

						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							{reportData?.gene_xpert_value === "indeterminate" && (
								<Box ta={'center'}><IconCheck size="120px" color={'green'} /></Box>
							)}
						</Table.Th>
						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							{reportData?.gene_xpert_value === "mtb_not_detected" && (
								<Box ta={'center'}><IconCheck size="120px" color={'green'} /></Box>
							)}
						</Table.Th>

						<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							{reportData?.gene_xpert_value === "invalid" && (
								<Box ta={'center'}><IconCheck size="120px" color={'green'} /></Box>
							)}
						</Table.Th>
					</Table.Tr>
				</Table>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
GeneXpert.displayName = "GeneXpert";
export default GeneXpert;
