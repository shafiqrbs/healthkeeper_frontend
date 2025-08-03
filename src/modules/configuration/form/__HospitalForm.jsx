import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { Box, ScrollArea, Button, Text, Flex, Stack, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { showEntityData, updateEntityData, storeEntityData } from "@/app/store/core/crudThunk.js";
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import InputCheckboxForm from "@components/form-builders/InputCheckboxForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { DROPDOWNS } from "@/app/store/core/utilitySlice";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { MODULES } from "@/constants";
import { getHospitalFormInitialValues } from "../helpers/request";
import { CONFIGURATION_ROUTES } from "@/constants/appRoutes";
import useDomainConfig from "@hooks/config-data/useDomainConfig";
import {parseDateValue} from "@utils/index";

const module = MODULES.HOSPITAL_CONFIG;

export default function __HospitalForm({ height, id }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const { domainConfig } = useDomainConfig();
	const hospital_config = domainConfig?.hospital_config;
	console.log(hospital_config);

	const form = useForm(getHospitalFormInitialValues());

	const handleFormSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmFormSubmit(values),
		});
	};

	useEffect(() => {
		if (hospital_config) {
			form.setValues({
				opd_select_doctor: hospital_config?.opd_select_doctor || 0,
				special_discount_doctor: hospital_config?.special_discount_doctor || 0,
				special_discount_investigation: hospital_config?.special_discount_investigation || 0,

			});
		}
	}, [dispatch, hospital_config]);


	const handleConfirmFormSubmit = async (values) => {
		const properties = ["opd_select_doctor", "special_discount_doctor", "special_discount_investigation"];

		properties.forEach((property) => {
			values[property] = values[property] === true || values[property] == 1 ? 1 : 0;
		});

		try {
			setSaveCreateLoading(true);

			const value = {
				url: `${CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.CREATE}/${id}`,
				data: values,
				module,
			};

			// await dispatch(updateEntityData(value));
			await dispatch(storeEntityData(value));

			const resultAction = await dispatch(
				showEntityData({
					url: `${CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.INDEX}/${id}`,
					module,
				})
			);
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					localStorage.setItem("hospital-config", JSON.stringify(resultAction.payload.data.data));
				}
			}

			notifications.show({
				color: "teal",
				title: t("UpdateSuccessfully"),
				icon: <IconCheck style={{ width: "18px", height: "18px" }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setTimeout(() => {
				setSaveCreateLoading(false);
			}, 700);
		} catch (error) {
			console.error("Error updating purchase config:", error);

			notifications.show({
				color: "red",
				title: t("UpdateFailed"),
				icon: <IconX style={{ width: "18px", height: "18px" }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setSaveCreateLoading(false);
		}
	};

	useHotkeys(
		[
			[
				"alt+p",
				() => {
					document.getElementById("PurchaseFormSubmit").click();
				},
			],
		],
		[]
	);

	const [voucherSalesReturnData, setVoucherSalesReturnData] = useState(null);

	const { data: voucherDropdownData } = useGlobalDropdownData({
		path: DROPDOWNS.VOUCHER.PATH,
		params: { "dropdown-type": DROPDOWNS.VOUCHER.TYPE },
		utility: DROPDOWNS.VOUCHER.UTILITY,
	});

	return (
		<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
			<form onSubmit={form.onSubmit(handleFormSubmit)}>
				<Stack gap="les" mt="xs">
					<InputCheckboxForm
						tooltip="Select opd doctor"
						label={t("OpdSelectDoctor")}
						field="opd_select_doctor"
						name="opd_select_doctor"
						form={form}
					/>
					<InputCheckboxForm
						tooltip="Select special discount doctor"
						label={t("SpecialDiscountDoctor")}
						field="special_discount_doctor"
						name="special_discount_doctor"
						form={form}
					/>
					<InputCheckboxForm
						tooltip="Select special discount investigation"
						label={t("SpecialDiscountInvestigation")}
						field="special_discount_investigation"
						name="special_discount_investigation"
						form={form}
					/>
				</Stack>

				{/* ======================= some demo components for reusing purposes ======================= */}
				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("Select")}
					</Grid.Col>
					<Grid.Col span={12}>
						<SelectForm
							tooltip={t("ChooseVoucherSalesReturn")}
							label=""
							placeholder={t("ChooseVoucherSalesReturn")}
							name="voucher_sales_return_id"
							form={form}
							dropdownValue={voucherDropdownData}
							id="voucher_sales_return_id"
							searchable={true}
							value={voucherSalesReturnData}
							changeValue={setVoucherSalesReturnData}
						/>
					</Grid.Col>
				</Grid>

				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("Text")}
					</Grid.Col>
					<Grid.Col span={12}>
						<InputForm tooltip="" label="" placeholder="Text" name="text" form={form} id="text" />
					</Grid.Col>
				</Grid>
				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("Number")}
					</Grid.Col>
					<Grid.Col span={12}>
						<InputNumberForm
							tooltip=""
							label=""
							placeholder="Number"
							name="number"
							form={form}
							id="number"
						/>
					</Grid.Col>
				</Grid>

				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("DatePicker")}
					</Grid.Col>
					<Grid.Col span={12}>
						<DatePickerForm
							tooltip={t("FinancialEndDateTooltip")}
							label=""
							placeholder={t("FinancialEndDate")}
							required={false}
							nextField="capital_investment_id"
							form={form}
							name="financial_end_date"
							id="financial_end_date"
							leftSection={<IconCalendar size={16} opacity={0.5} />}
							rightSectionWidth={30}
							closeIcon={true}
						/>
					</Grid.Col>
				</Grid>

				<Button id="HospitalFormSubmit" type="submit" style={{ display: "none" }}>
					{t("Submit")}
				</Button>
			</form>
		</ScrollArea>
	);
}
