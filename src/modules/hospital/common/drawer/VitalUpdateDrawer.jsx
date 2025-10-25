import InputForm from "@components/form-builders/InputForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { successNotification } from "@components/notification/successNotification";
import {setInsertType, setRefetchData} from "@/app/store/core/crudSlice";
import { errorNotification } from "@components/notification/errorNotification";

const module = MODULES.VISIT;

export default function VitalUpdateDrawer({ opened, close, data }) {
	const dispatch = useDispatch();
	console.log(data);
	const form = useForm({
		initialValues: {
			bp: "",
			pulse: "",
			sat_with_O2: "",
			sat_without_O2: "",
			respiration: "",
			temperature: "",
		},
		validate: {
			bp: (value) => {
				if (!value) return "BP is required";
				return null;
			},
			pulse: (value) => {
				if (!value) return "Pulse is required";
				return null;
			},
			/*satWithO2: (value) => {
				if (!value) return "Sat With O2 is required";
				return null;
			},
			satWithoutO2: (value) => {
				if (!value) return "Sat Without O2 is required";
				return null;
			},
			respiration: (value) => {
				if (!value) return "Respiration is required";
				return null;
			},*/
		},
	});

	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	useEffect(() => {
		form.setFieldValue("bp", data?.bp || "");
		form.setFieldValue("pulse", data?.pulse || "");
		form.setFieldValue("sat_with_O2", data?.sat_with_O2 || "");
		form.setFieldValue("sat_without_O2", data?.sat_without_O2 || "");
		form.setFieldValue("respiration", data?.respiration || "");
		form.setFieldValue("temperature", data?.temperature || "");
	}, [data]);

	async function handleSubmit(values) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VITAL_UPDATE}/${data?.id}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;

				// Check if there are field validation errors and dynamically set them
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
					});
					// Display the errors using your form's `setErrors` function dynamically
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				dispatch(setRefetchData({ module, refetching: true }))
				setTimeout(() => {
					// form.reset();
					dispatch(setInsertType({ insertType: "create", module }));
					close(); // close the drawer
				}, 700);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<GlobalDrawer opened={opened} close={close} title="Vital Update" size="35%">
			<Box component="form" onSubmit={form.onSubmit(handleSubmit)} pt="lg">
				<Stack mih={mainAreaHeight - 100} justify="space-between">
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("BP")}</Text>
						</Grid.Col>
						<Grid.Col span={7}>
							<InputForm
								form={form}
								label=""
								tooltip={t("EnterBP")}
								placeholder="120/80"
								name="bp"
								id="bp"
								nextField="pulse"
								value={form.values.bp}
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							mm of HG
						</Grid.Col>

						<Grid.Col span={6}>
							<Text fz="sm">{t("Pulse")}</Text>
						</Grid.Col>
						<Grid.Col span={7}>
							<InputForm
								form={form}
								label=""
								placeholder="Pulse"
								tooltip={t("EnterPulse")}
								name="pulse"
								id="pulse"
								nextField="sat_with_O2"
								min={0}
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							Beat/Minute
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="sm">{t("SatWithO2")}</Text>
						</Grid.Col>
						<Grid.Col span={7}>
							<InputNumberForm
								form={form}
								label=""
								placeholder={t("SatWithO2")}
								tooltip={t("EnterSatWithO2")}
								name="sat_with_O2"
								id="sat_with_O2"
								nextField="sat_without_O2"
								min={0}
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							%
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="sm">{t("SatWithoutO2")}</Text>
						</Grid.Col>
						<Grid.Col span={7}>
							<InputNumberForm
								form={form}
								label=""
								placeholder={t("EnterSatWithoutO2")}
								tooltip={t("EnterSatWithoutO2")}
								name="sat_without_O2"
								id="sat_without_O2"
								nextField="respiration"
								min={0}
								max={31}
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							%
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="sm">{t("Respiration")}</Text>
						</Grid.Col>
						<Grid.Col span={7}>
							<InputForm
								form={form}
								label=""
								tooltip={t("12-20")}
								placeholder="EnterRespiration"
								name="respiration"
								id="respiration"
								nextField="temperature"
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							Breath/Minute
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="sm">{t("Temperature")}</Text>
						</Grid.Col>
						<Grid.Col span={7}>
							<InputNumberForm
								form={form}
								label=""
								tooltip={t("36.5-37.5")}
								placeholder="EnterTemperature"
								name="temperature"
								id="temperature"
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							°F
						</Grid.Col>
					</Grid>

					<Flex gap="xs" justify="flex-end">

						<Button type="button" variant={'outline'} color="var(--theme-tertiary-color-6)" onClick={close}>
							{t("Cancel")}
						</Button>
						<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
							{t("Save")}
						</Button>
					</Flex>
				</Stack>
			</Box>
		</GlobalDrawer>
	);
}
