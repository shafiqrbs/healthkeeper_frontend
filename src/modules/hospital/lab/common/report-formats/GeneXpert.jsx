import { Box, Stack, Table, Group, Text, ScrollArea, Radio, Switch } from "@mantine/core";
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

const notions = [
	{ label: "R", value: "R" },
	{ label: "S", value: "S" },
	{ label: "C", value: "C" },
	{ label: "IN", value: "IN" },
	{ label: "NA", value: "NA" },
];

// drug columns configuration - split into two rows
const drugColumnsRow1 = [
	{ key: "dts_mtb", label: "MTB" },
	{ key: "dts_inh", label: "INH" },
	{ key: "dts_rif", label: "RIF" },
	{ key: "dts_flq", label: "FLQ" },
	{ key: "dts_lfx", label: "LFX" },
];

const drugColumnsRow2 = [
	{ key: "dts_mfx", label: "MFX" },
	{ key: "dts_eth", label: "ETH" },
	{ key: "dts_bdq", label: "BDQ" },
	{ key: "dts_dlm", label: "DLM" },
	{ key: "dts_pa", label: "PA" },
];

const drugColumnsRow3 = [
	{ key: "dts_lzd", label: "LZD" },
	{ key: "dts_cfz", label: "CFZ" },
	{ key: "dts_amk", label: "AMK" },
	{ key: "dts_kan", label: "KAN" },
	{ key: "dts_cap", label: "CAP" },
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
			sample_type: custom_report?.sample_type || 'Sputum',
			sample_id: custom_report?.sample_id || '',
			test_id: custom_report?.test_id || '',
			test_date: custom_report?.test_date
				? new Date(custom_report.test_date)
				: null,
			dts_method: custom_report?.dts_method || "lj",
			dts_id: custom_report?.dts_id || "",
			dts_mtb: custom_report?.dts_mtb || "",
			dts_inh: custom_report?.dts_inh || "",
			dts_rif: custom_report?.dts_rif || "",
			dts_flq: custom_report?.dts_flq || "",
			dts_lfx: custom_report?.dts_lfx || "",
			dts_mfx: custom_report?.dts_mfx || "",
			dts_eth: custom_report?.dts_eth || "",
			dts_bdq: custom_report?.dts_bdq || "",
			dts_dlm: custom_report?.dts_dlm || "",
			dts_pa: custom_report?.dts_pa || "",
			dts_lzd: custom_report?.dts_lzd || "",
			dts_cfz: custom_report?.dts_cfz || "",
			dts_amk: custom_report?.dts_amk || "",
			dts_kan: custom_report?.dts_kan || "",
			dts_cap: custom_report?.dts_cap || "",
			dts_others: custom_report?.dts_others || "",
			is_dst_genexpert: custom_report?.is_dst_genexpert || false,
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
			}
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

						{/* =============== reference laboratory specimen id =============== */}
						<InputNumberForm
							name="test_id"
							id="test_id"
							nextField="id"
							form={form}
							label="Lab Test ID"
							placeholder="Enter Lab Test ID"
						/>
						<InputNumberForm
							name="sample_id"
							id="sample_id"
							nextField="id"
							form={form}
							label="Sample ID"
							placeholder="Enter Sample ID"
						/>
					</Group>
					<Group grow>
						{/* =============== lab no =============== */}
						<InputForm
							name="sample_type"
							id="sample_type"
							form={form}
							label="Sample Type"
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
					</Box>
					{form.values.is_dst_genexpert && <>
						<Box my="md">
							<Text size="sm" fw={500} mb="xs">
								Method Used:
							</Text>
							<Radio.Group
								value={form.values?.dts_method}
								onChange={(value) => form.setFieldValue("dts_method", value)}
								style={{ width: "100%" }}
							>
								<Table withColumnBorders withTableBorder w="100%">
									<Table.Tr>
										<Table.Th>
											<Radio value="lj" label="Proportion method (LJ)" />
										</Table.Th>
										<Table.Th>
											<Radio value="mgit" label="Liquid (MGIT)" />
										</Table.Th>
										<Table.Th>
											<Radio value="lpa" label="Line Probe Assay (LPA)" />
										</Table.Th>
										<Table.Th>
											<Radio value="xdr" label="Xpert XDR" />
										</Table.Th>
									</Table.Tr>
								</Table>
							</Radio.Group>
						</Box>
						{/* =============== notation legend =============== */}
						<Box my="xs">
							<Text size="sm" fw={500}>
								Notation: (R= Resistance Detected; S= Resistance Not Detected; C= Contaminated; IN=
								Indeterminate/Non-interpretable; NA= Not Done)
							</Text>
						</Box>
						<Box mb="md">
							<Table withColumnBorders withTableBorder withRowBorders>
								<Table.Tbody>
									{/* Row 1: Headings and Selects for row1 */}
									<Table.Tr>
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
						</Box></>}
					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
