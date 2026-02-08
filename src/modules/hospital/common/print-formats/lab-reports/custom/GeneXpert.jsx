import {Box, Text, Grid, Stack, Table, Radio} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
import InputForm from "@components/form-builders/InputForm";
import { IconCheck } from "@tabler/icons-react";
import {formatDate} from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";

const GeneXpert = forwardRef(({reportData,report}) => {

	const { user } = useAppLocalStore();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	const { mainAreaHeight } = useOutletContext();
	const mt = reportData?.is_dst_genexpert == 1 ? 48 : 48;
	const boxHeight = reportData?.is_dst_genexpert == 1 ? 620 : 450;
	return (
		<>
			<Box h={boxHeight} mt={mt}>

				<Box mb="md"  fz={'md'} >
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
							<Table.Td colSpan={6} style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Box>
									<Grid columns={12}>
										<Grid.Col span={3}>
											<strong>Test: </strong>{formatDate(reportData?.test_date)}
										</Grid.Col>
										<Grid.Col span={3}>
											<strong>Reporting: </strong>{formatDate(reportData?.date_specimen_received)}
										</Grid.Col>
										<Grid.Col span={3}>
											<strong>Sample ID: </strong>{reportData?.sample_id}
										</Grid.Col>
										<Grid.Col span={3}>
											<strong>Lab Test ID: </strong>{reportData?.test_id}
										</Grid.Col>
									</Grid>
								</Box>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>T = MTB Detected, Rif Resistance not Detected</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>RR = MTB Detected, Rif Resistance Detected</Text>
							</Table.Th>

							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>TI = MTB Detected, Rif Resistance </Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>TT = MTB Trace Detected</Text>
							</Table.Th>

							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>N = MTB Not Detected</Text>
							</Table.Th>

							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>I = INVALID/ERROR/NO RESULT</Text>
							</Table.Th>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								{reportData?.gene_xpert_value === "not_detected" && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								{reportData?.gene_xpert_value === "detected" && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>

							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								{reportData?.gene_xpert_value === "indeterminate" && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								{reportData?.gene_xpert_value === "trace_detected" && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								{reportData?.gene_xpert_value === "mtb_not_detected" && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								{reportData?.gene_xpert_value === "invalid" && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
						</Table.Tr>
					</Table>
				</Box>
				{reportData?.is_dst_genexpert == 1 &&  (
				<Box mb="md"  fz={'md'} >
					<Box my="md">
						<Text size="sm" fw={500} mb="xs">
							<strong>Method Used:</strong>
						</Text>
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
									Proportion method (LJ)
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									Liquid (MGIT)
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									Line Probe Assay (LPA)
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									Xpert XDR
								</Table.Th>
							</Table.Tr>
							<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									{(reportData?.dst_method === 'lj')  && (
										<Box ta={'center'}><IconCheck size="24px" color={'green'} /></Box>
									)}
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									{(reportData?.dst_method === 'mgit')  && (
										<Box ta={'center'}><IconCheck size="24px" color={'green'} /></Box>
									)}
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									{(reportData?.dst_method === 'lpa')  && (
										<Box ta={'center'}><IconCheck size="24px" color={'green'} /></Box>
									)}
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									{(reportData?.dst_method === 'xdr')  && (
										<Box ta={'center'}><IconCheck size="24px" color={'green'} /></Box>
									)}
								</Table.Th>
							</Table.Tr>
						</Table>
					</Box>
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
							<Table.Td colSpan={'16'}><Box my="xs">
								<Text size="sm" fw={500}>
									Notation: (R= Resistance Detected; S= Resistance Not Detected/Susceptible; C= Contaminated; IN=
									Indeterminate/Non-interpretable; NA= Not Done)
								</Text>
							</Box>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>MTB</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>INH</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>RIF</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>FLQ</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>LFX</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>MFX</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>RTH</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>BDQ</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>DLM</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>PA</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>LZD</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>CFZ</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>AMK</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>KAN</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>CAP</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}>Others</Text>
							</Table.Th>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} c={reportData?.dst_mtb === 'detected' ? 'red.6' : 'green.6'} >{reportData?.dst_mtb}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_inh === 'R' ? 'red.8' : reportData?.dst_inh === 'S'? 'green.8':'black.6'} >{reportData?.dst_inh || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_rif === 'R' ? 'red.8' : reportData?.dst_rif === 'S'? 'green.8':'black.6'}>{reportData?.dst_rif || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_flq === 'R' ? 'red.8' : reportData?.dst_flq === 'S'? 'green.8':'black.6'}>{reportData?.dst_flq || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_lfx === 'R' ? 'red.8' : reportData?.dst_lfx === 'S'? 'green.8':'black.6'}>{reportData?.dst_lfx || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_mfx === 'R' ? 'red.8' : reportData?.dst_mfx === 'S'? 'green.8':'black.6'}>{reportData?.dst_mfx || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_eth === 'R' ? 'red.8' : reportData?.dst_eth === 'S'? 'green.8':'black.6'}>{reportData?.dst_eth || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_bdq === 'R' ? 'red.8' : reportData?.dst_bdq === 'S'? 'green.8':'black.6'}>{reportData?.dst_bdq || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_dlm === 'R' ? 'red.8' : reportData?.dst_dlm === 'S'? 'green.8':'black.6'} >{reportData?.dst_dlm || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_pa === 'R' ? 'red.8' : reportData?.dst_pa === 'S'? 'green.8':'black.6'}>{reportData?.dst_pa || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_lzd === 'R' ? 'red.8' : reportData?.dst_lzd === 'S'? 'green.8':'black.6'} >{reportData?.dst_lzd || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'}  ta="center" c={reportData?.dst_cfz === 'R' ? 'red.8' : reportData?.dst_cfz === 'S'? 'green.8':'black.6'} >{reportData?.dst_cfz || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_amk === 'R' ? 'red.8' : reportData?.dst_amk === 'S'? 'green.8':'black.6'} >{reportData?.dst_amk || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_kan === 'R' ? 'red.8' : reportData?.dst_kan === 'S'? 'green.8':'black.6'}>{reportData?.dst_kan || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_cap === 'R' ? 'red.8' : reportData?.dst_cap === 'S'? 'green.8':'black.6'}>{reportData?.dst_cap || '-'}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text fz={'xs'} ta="center" c={reportData?.dst_others === 'R' ? 'red.6' : 'green.6'}>{reportData?.dst_others}</Text>
							</Table.Th>
						</Table.Tr>
					</Table>
				</Box>
				)}
				<Box  pt={0}>
					<Text fw="bold" size="xs" mb="xs" mt={'md'}>
						{t("Comment")}
					</Text>
					{report?.comment && (
						<Box p="xs" bd="1px solid #ddd">
							<Text size="xs">{report?.comment || ""}</Text>
						</Box>
					)}
				</Box>
				{/* =============== Doctor Information and Signature ================ */}
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
					<Grid.Col span={4}/>
					<Grid.Col span={4}>
						<Box>
							<Text fw="bold" mb="sm" ta="center">
								Microbiologist
							</Text>
						</Box>
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col  ta="center"><strong>{t("Date & Time")}:</strong>{" "}{new Date().toLocaleString()}</Grid.Col>
				</Grid>
			</Box>
		</>
	);
});
GeneXpert.displayName = "GeneXpert";
export default GeneXpert;
