import {Box, Stack, Table, Group, Text, ScrollArea, Radio, Switch, Flex} from "@mantine/core";
import { useForm } from "@mantine/form";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import { formatDateForMySQL } from "@utils/index";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useEffect } from "react";
import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import { IconCheck, IconX } from "@tabler/icons-react";

const module = MODULES.LAB_TEST;

const xdr = [
	{ label: "Detected", value: "Detected" },
	{ label: "Not detected", value: "Not detected" },
];

const dstMethods = [
	{ label: "Proportion method (LJ)", value: "Proportion method (LJ)" },
	{ label: "Liquid (MGIT)", value: "Liquid (MGIT)" },
	{ label: "Line Probe Assay (LPA)", value: "Line Probe Assay (LPA)" },
	{ label: "Xpert XDR", value: "Xpert XDR" }
];

const notions = [
	{ label: "R", value: "R" },
	{ label: "S", value: "S" },
	{ label: "C", value: "C" },
	{ label: "I", value: "I" },
	{ label: "NA", value: "NA" },
];

const sampleTypes = [
	{ label: "Stool", value: "Stool" },
	{ label: "CSF", value: "CSF" },
	{ label: "Pleural Fluid", value: "Pleural Fluid" },
	{ label: "Pus", value: "Pus" },
	{ label: "Urine", value: "Urine" },
	{ label: "Gastric Lavage", value: "Gastric Lavage" },
	{ label: "Tissue", value: "Tissue" },
	{ label: "Ascitic Acid", value: "Ascitic Acid" },
	{ label: "Lipmphynode Tissue", value: "Lipmphynode Tissue" },
	{ label: "Body Fluid", value: "Body Fluid" },
	{ label: "FNAC Fluid", value: "FNAC Fluid" },
	{ label: "Synovial Fluid", value: "Synovial Fluid" },
	{ label: "Bronchoalvolar Lavage", value: "Bronchoalvolar Lavage" },
	{ label: "Sputum", value: "Sputum" }
];

// drug columns configuration - split into two rows

const drugColumnsRow1XDR = [
	{ key: "dst_mtb", label: "MTB" },
];

const drugColumnsRow1 = [
	{ key: "dst_inh", label: "INH" },
	{ key: "dst_rif", label: "RIF" },
	{ key: "dst_flq", label: "FLQ" },
	{ key: "dst_lfx", label: "LFX" },
];

const drugColumnsRow2 = [
	{ key: "dst_mfx", label: "MFX" },
	{ key: "dst_eth", label: "ETH" },
	{ key: "dst_bdq", label: "BDQ" },
	{ key: "dst_dlm", label: "DLM" },
	{ key: "dst_pa", label: "PA" },
];

const drugColumnsRow3 = [
	{ key: "dst_lzd", label: "LZD" },
	{ key: "dst_cfz", label: "CFZ" },
	{ key: "dst_amk", label: "AMK" },
	{ key: "dst_kan", label: "KAN" },
	{ key: "dst_cap", label: "CAP" },
];

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function GeneXpert({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};

	const form = useForm({
		initialValues: {
			gene_xpert_value: custom_report?.gene_xpert_value || 0,
			sample_type: custom_report?.sample_type || 'Stool',
			other_gene_xpert: custom_report?.other_gene_xpert || '',
			sample_id: custom_report?.sample_id || '',
			test_id: custom_report?.test_id || '',
			test_date: custom_report?.test_date
				? new Date(custom_report.test_date)
				: null,
			date_specimen_received: custom_report?.date_specimen_received
				? new Date(custom_report.date_specimen_received)
				: null,
			is_dst_genexpert: custom_report?.is_dst_genexpert || false,
			dst_method: custom_report?.dst_method || "",
			dst_id: custom_report?.dst_id || "",
			dst_mtb: custom_report?.dst_mtb || "",
			dst_inh: custom_report?.dst_inh || "",
			dst_rif: custom_report?.dst_rif || "",
			dst_flq: custom_report?.dst_flq || "",
			dst_lfx: custom_report?.dst_lfx || "",
			dst_mfx: custom_report?.dst_mfx || "",
			dst_eth: custom_report?.dst_eth || "",
			dst_bdq: custom_report?.dst_bdq || "",
			dst_dlm: custom_report?.dst_dlm || "",
			dst_pa: custom_report?.dst_pa || "",
			dst_lzd: custom_report?.dst_lzd || "",
			dst_cfz: custom_report?.dst_cfz || "",
			dst_amk: custom_report?.dst_amk || "",
			dst_kan: custom_report?.dst_kan || "",
			dst_cap: custom_report?.dst_cap || "",
			dst_others: custom_report?.dst_others || "",
		},
	});
	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values),
		});
	};

	async function handleConfirmModal(values) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.UPDATE}/${reportId}`,
				data: {
					json_content: {
						...values,
						test_date: formatDateForMySQL(values.test_date),
						date_specimen_received: formatDateForMySQL(values.date_specimen_received),
					},
					comment: values.comment,
				},
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[ key ] = fieldErrors[ key ][ 0 ];
					});
					console.error("Field Error occurred!", errorObject);
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				refetchDiagnosticReport();
				if (refetchLabReport && typeof refetchLabReport === "function") {
					refetchLabReport();
				}
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				return resultAction.payload?.data;
			}
			return false;
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	useEffect(() => {
		if (custom_report?.rif_result) {
			form.setFieldValue("rif_result", custom_report.rif_result);
		}
		if (custom_report?.rif_table_result) {
			form.setFieldValue("rif_table_result", custom_report.rif_table_result);
		}
	}, [ custom_report ]);


	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					<Group grow>
						{/* =============== genexpert site/hospital =============== */}

						<DatePickerForm
							name="test_date"
							id="test_date"
							nextField="comment"
							form={form}
							label="Test Date"
							placeholder="Select date"
						/>
						<DatePickerForm
							name="date_specimen_received"
							id="date_specimen_received"
							nextField="comment"
							form={form}
							label="Reporting Date"
							placeholder="Select receive date"
						/>
						<InputNumberForm
							name="sample_id"
							id="sample_id"
							nextField="id"
							form={form}
							label="Sample ID"
							placeholder="Enter Sample ID"
						/>
						<InputNumberForm
							name="test_id"
							id="test_id"
							nextField="id"
							form={form}
							label="Lab Test ID"
							placeholder="Enter Lab Test ID"
						/>

					</Group>
					<Group grow>
						{/* =============== lab no =============== */}
						<SelectForm
							name="sample_type"
							id="sample_type"
							form={form}
							dropdownValue={sampleTypes}
							placeholder="Select"
							label="Sample Type"
							clearable={true}
							allowDeselect={true}
							searchable={false}
							withCheckIcon={false}
						/>
						<InputForm
							name="other_gene_xpert"
							id="other_gene_xpert"
							form={form}
							label="Other Sample Type"
							placeholder="Enter sample type name"
						/>
					</Group>

					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Td colSpan={5} p={0}>
										<Radio.Group
											value={form.values?.gene_xpert_value}
											onChange={(value) => form.setFieldValue("gene_xpert_value", value)}
											style={{ width: "100%" }}
										>
											<Table withColumnBorders w="100%">
												<Table.Tr>
													<Table.Th>
														<Radio
															value="not_detected"
															label="T = MTB Detected, Rif Resistance not Detected"
														/>
													</Table.Th>
													<Table.Th>
														<Radio
															value="detected"
															label="RR = MTB Detected, Rif Resistance Detected"
														/>
													</Table.Th>

													<Table.Th>
														<Radio
															value="indeterminate"
															label="TI = MTB Detected, Rif Resistance Indeterminate"
														/>
													</Table.Th>
													<Table.Th>
														<Radio
															value="trace_detected"
															label="TT = MTB Trace Detected"
														/>
													</Table.Th>

													<Table.Th>
														<Radio value="mtb_not_detected" label="N = MTB Not Detected" />
													</Table.Th>

													<Table.Th>
														<Radio value="invalid" label="I = INVALID/ERROR/NO RESULT" />
													</Table.Th>
												</Table.Tr>
											</Table>
										</Radio.Group>
									</Table.Td>
								</Table.Tr>
							</Table.Thead>
						</Table>
					</Box>
					{/* =============== method used =============== */}

					<Box>
						<Switch
							name="is_dst_genexpert"
							id="is_dst_genexpert"
							onChange={(event) => form.setFieldValue("is_dst_genexpert", event.currentTarget.checked)}
							checked={form.values.is_dst_genexpert}
							label="DST Genexpert"
							size="md"
							thumbIcon={
								form.values.is_dst_genexpert ? (
									<IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
								) : (
									<IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
								)
							}
							className="cursor-pointer"
							styles={{ track: { cursor: 'pointer', border: "1px solid var(--mantine-color-gray-4)" } }}
						/>


					{/* =============== notation legend =============== */}

						{form.values.is_dst_genexpert && <>
							<Box my="md">
								<Flex gap="md">
									<Text size="sm" fw={500} mt="xs">
										Method Used:
									</Text>
									<SelectForm
										name='dst_method'
										id='dst_method'
										form={form}
										dropdownValue={dstMethods}
										placeholder="Select"
										clearable={true}
										allowDeselect={true}
										searchable={false}
										withCheckIcon={false}
									/>
								</Flex>
							</Box>
							{/* =============== notation legend =============== */}
							<Box my="xs">
								<Text size="sm" fw={500}>
									Notation: (R= Resistance Detected; S= Resistance Not Detected/Susceptible; C= Contaminated; IN=
									Indeterminate/Non-interpretable; NA= Not Done)
								</Text>
							</Box>
							<Box mb="md">
								<Table withColumnBorders withTableBorder withRowBorders>
									<Table.Tbody>
										{/* Row 1: Headings and Selects for row1 */}
										<Table.Tr>
											{drugColumnsRow1XDR.map((drug) => (
												<Table.Td key={drug.key} ta="center">
													<Text fw={600} size="sm" mb="xs">
														{drug.label}
													</Text>
													<SelectForm
														name={drug.key}
														id={drug.key}
														form={form}
														dropdownValue={xdr}
														placeholder="Select"
														clearable={true}
														allowDeselect={true}
														searchable={false}
														withCheckIcon={false}
													/>
												</Table.Td>
											))}
											{drugColumnsRow1.map((drug) => (
												<Table.Td key={drug.key} ta="center">
													<Text fw={600} size="sm" mb="xs">
														{drug.label}
													</Text>
													<SelectForm
														name={drug.key}
														id={drug.key}
														form={form}
														dropdownValue={notions}
														placeholder="Select"
														clearable={true}
														allowDeselect={true}
														searchable={false}
														withCheckIcon={false}
													/>
												</Table.Td>
											))}
										</Table.Tr>
										<Table.Tr>
											{drugColumnsRow2.map((drug) => (
												<Table.Td key={drug.key} ta="center">
													<Text fw={600} size="sm" mb="xs">
														{drug.label}
													</Text>
													<SelectForm
														name={drug.key}
														id={drug.key}
														form={form}
														dropdownValue={notions}
														placeholder="Select"
														clearable={true}
														allowDeselect={true}
														searchable={false}
														withCheckIcon={false}
													/>
												</Table.Td>
											))}
										</Table.Tr>
										{/* Row 2: Headings and Selects for row2 */}
										<Table.Tr>
											{drugColumnsRow3.map((drug) => (
												<Table.Td key={drug.key} ta="center">
													<Text fw={600} size="sm" mb="xs">
														{drug.label}
													</Text>
													<SelectForm
														name={drug.key}
														id={drug.key}
														form={form}
														dropdownValue={notions}
														placeholder="Select"
														clearable={true}
														allowDeselect={true}
														searchable={false}
														withCheckIcon={false}
													/>
												</Table.Td>
											))}
										</Table.Tr>
										<Table.Tr>
											<Table.Td ta="center">
												<Text fw={600}>OTHERS</Text>
											</Table.Td>
											<Table.Td ta="center" colSpan={4}>
												<InputForm
													name="dts_others"
													id="dts_others"
													form={form}
													placeholder="Enter Others"
												/>
											</Table.Td>
										</Table.Tr>
									</Table.Tbody>
								</Table>
							</Box>
						</>
						}
					</Box>

					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} submissionFunc={handleConfirmModal} handleSubmit={handleSubmit} />
		</Box>
	);
}
