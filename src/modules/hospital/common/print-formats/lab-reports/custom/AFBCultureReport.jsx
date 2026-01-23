import { Box, Text, Grid, Table } from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { formatDate } from "@utils/index";
import { IconCheck } from "@tabler/icons-react";
import {t} from "i18next";

const AFBCultureReport = forwardRef(({ reportData, report }, ref) => {
	return (
		<>
		<Box h={600} mt={'40'}>
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
						<Grid.Col span={3}>
							<strong>Test Date: </strong>{formatDate(reportData?.test_date)}
						</Grid.Col>
						<Grid.Col span={3}>
							<strong>Receive: </strong>{formatDate(reportData?.date_specimen_received)}
						</Grid.Col>
						<Grid.Col span={3}>
							<strong>Sample ID: </strong>{reportData?.sample_id}
						</Grid.Col>
						<Grid.Col span={3}>
							<strong>Lab Test ID: </strong>{reportData?.test_id}
						</Grid.Col>
					</Grid>
					<Grid columns={12}>
						<Grid.Col span={9}>
							<strong>Diagnosis: </strong>{reportData?.afb_diagnosis}
						</Grid.Col>
						<Grid.Col span={3}>
							<strong>Follow up: </strong>{formatDate(reportData?.follow_up_month)}
						</Grid.Col>
					</Grid>
				</Box>
				<Table style={{
					borderCollapse: "collapse",
					width: "100%",
					border: "1px solid var(--theme-tertiary-color-8)",
				}} className="customTable">
					<Table.Thead>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
							<Table.Th colSpan={4} />
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
								{reportData?.afb_contaminated == 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.negative == 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'green'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.positive == 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								<Text style={{ color: "red" }}><strong>{reportData?.atypical_mycobacteria_species}</strong></Text>
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_1 === 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_2 === 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_3 === 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
							<Table.Th ta="center">
								{reportData?.colonies_4 === 1 && (
									<Box ta={'center'}><IconCheck size="60px" color={'red'} /></Box>
								)}
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
				</Table>
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
									<Text c={reportData?.dst_mtb === 'detected' ? 'red.6' : 'green.6'} >{reportData?.dst_mtb}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_inh === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_inh}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_rif === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_rif}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_flq === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_flq}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_lfx === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_lfx}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_mfx === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_mfx}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_eth === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_eth}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_bdq === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_bdq}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_dlm === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_dlm}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_pa === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_pa}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_lzd === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_lzd}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_cfz === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_cfz}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_amk === 'R' ? 'red.6' : 'green.6'} >{reportData?.dst_amk}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_kan === 'R' ? 'red.6' : 'green.6'}>{reportData?.dst_kan}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_cap === 'R' ? 'red.6' : 'green.6'}>{reportData?.dst_cap}</Text>
								</Table.Th>
								<Table.Th style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
									<Text ta="center" c={reportData?.dst_others === 'R' ? 'red.6' : 'green.6'}>{reportData?.dst_others}</Text>
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
AFBCultureReport.displayName = "AFBCultureReport";
export default AFBCultureReport;
