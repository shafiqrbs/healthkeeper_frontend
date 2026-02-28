import {Box, Stack, Table, Group, Text, ScrollArea, Radio, Switch, Flex} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Checkbox } from "@mantine/core";
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
import InputNumberForm from "@components/form-builders/InputNumberForm";
import InputForm from "@components/form-builders/InputForm";
import { formatDateForMySQL } from "@utils/index";
import SelectForm from "@components/form-builders/SelectForm";
import { IconCheck, IconX } from "@tabler/icons-react";

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function SputumAFB({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};

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

	const form = useForm({
		initialValues: {
			sample_id: custom_report?.sample_id || '',
			test_id: custom_report?.test_id || '',
			test_date: custom_report?.test_date
				? new Date(custom_report.test_date)
				: null,
			date_specimen_received: custom_report?.date_specimen_received
				? new Date(custom_report.date_specimen_received)
				: null,
			afb_found: custom_report?.afb_found || "",
			afb_not_found: custom_report?.afb_not_found || "",
			afb_scanty: custom_report?.afb_scanty || "",

			afb_sample_found: custom_report?.afb_sample_found || "",
			afb_sample_not_found: custom_report?.afb_sample_not_found || "",
			afb_sample_scanty: custom_report?.afb_sample_scanty || "",

			afb_scanty_one: custom_report?.afb_scanty_one || 0,
			afb_scanty_two: custom_report?.afb_scanty_two || 0,
			afb_scanty_three: custom_report?.afb_scanty_three || 0,
			afb_sample_scanty_one: custom_report?.afb_sample_scanty_one || 0,
			afb_sample_scanty_two: custom_report?.afb_sample_scanty_two || 0,
			afb_sample_scanty_three: custom_report?.afb_sample_scanty_three || 0,
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
					{/* =============== results table =============== */}
					<Box my="md">

						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th ta="center"></Table.Th>
									<Table.Th>NO AFB FOUND</Table.Th>
									<Table.Th>SCANTY</Table.Th>
									<Table.Th>1+</Table.Th>
									<Table.Th>2+</Table.Th>
									<Table.Th>3+</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">Sample 1</Table.Th>
									{/*<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_found"
											id="afb_found"
											nextField="afb_not_found"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>*/}
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_not_found"
											id="afb_not_found"
											nextField="afb_scanty"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_scanty"
											id="afb_scanty"
											nextField="afb_scanty_one"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_one}
											onChange={(event) =>
												form.setFieldValue(
													"afb_scanty_one",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_two}
											onChange={(event) =>
												form.setFieldValue(
													"afb_scanty_two",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_three}
											onChange={(event) =>
												form.setFieldValue(
													"afb_scanty_three",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">Sample 2</Table.Th>
									{/*<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_sample_found"
											id="afb_sample_found"
											nextField="afb_sample_not_found"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>*/}
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_sample_not_found"
											id="afb_sample_not_found"
											nextField="afb_sample_scanty"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_sample_scanty"
											id="afb_sample_scanty"
											nextField="afb_sample_scanty_one"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_one}
											onChange={(event) =>
												form.setFieldValue(
													"afb_sample_scanty_one",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_two}
											onChange={(event) =>
												form.setFieldValue(
													"afb_sample_scanty_two",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_three}
											onChange={(event) =>
												form.setFieldValue(
													"afb_sample_scanty_three",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
								</Table.Tr>
							</Table.Thead>
						</Table>
					</Box>
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
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} submissionFunc={handleConfirmModal} handleSubmit={handleSubmit} />
		</Box>
	);
}
