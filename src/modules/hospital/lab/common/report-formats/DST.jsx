import { Box, Stack, Table, Group, Text, ScrollArea, Radio } from "@mantine/core";
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
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";

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

// =============== DTS (Drug Susceptibility Testing) results ===============
export default function DST({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";

	const form = useForm({
		initialValues: {
			id: diagnosticReport?.particular?.id || 0,
			sample_type: custom_report?.sample_type || '',
			test_date: custom_report?.test_date ? new Date(custom_report.test_date) : null,
			lab_no: custom_report?.lab_no || "",
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
			comment: diagnosticReport?.comment || "",
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
						errorObject[key] = fieldErrors[key][0];
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

	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">

					{/* =============== method used =============== */}
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

					{/* =============== DTS results table =============== */}
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
								<Table.Tr >
									<Table.Td ta="center"><Text fw={600}>OTHERS</Text></Table.Td>
									<Table.Td ta="center" colspan={4}>
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
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
