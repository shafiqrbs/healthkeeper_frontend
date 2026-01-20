import {Box, Text, Grid, Stack, Table, Radio} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
import InputForm from "@components/form-builders/InputForm";
import { IconCheck } from "@tabler/icons-react";
import {formatDate} from "@utils/index";

const DSTReport = forwardRef(({reportData,report}) => {

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	const { mainAreaHeight } = useOutletContext();
	return (
		<>
			<Box h={500}>
				<Box mb='md' pt={'xs'} >
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
									Notation: (R= Resistance Detected; S= Resistance Not Detected; C= Contaminated; IN=
									Indeterminate/Non-interpretable; NA= Not Done)
								</Text>
							</Box>
							</Table.Td>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>MTB</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>INH</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>RIF</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>FLQ</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>LFX</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>MFX</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>RTH</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>BDQ</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>DLM</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>PA</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>LZD</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>CFZ</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>AMK</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>KAN</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>CAP</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>Others</Text>
							</Table.Th>
						</Table.Tr>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_mtb}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_inh}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_rif}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_flq}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_lfx}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_mfx}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_eth}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_bdq}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_dlm}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_pa}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_lzd}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_cfz}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_amk}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_kan}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_cap}</Text>
							</Table.Th>
							<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
								<Text>{report?.dst_others}</Text>
							</Table.Th>
						</Table.Tr>
					</Table>
				</Box>
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
			</Box>
		</>
	);
});
DSTReport.displayName = "DSTReport";
export default DSTReport;
