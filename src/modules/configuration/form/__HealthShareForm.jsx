import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, ScrollArea, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { useHotkeys } from "@mantine/hooks";
import { setValidationData } from "@/app/store/core/crudSlice.js";
import { showEntityData, storeEntityData } from "@/app/store/core/crudThunk.js";
import InputForm from "@components/form-builders/InputForm";
import { CONFIGURATION_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { successNotification } from "@/common/components/notification/successNotification";
import { errorNotification } from "@/common/components/notification/errorNotification";
import useDomainConfig from "@hooks/config-data/useDomainConfig";
import TextAreaForm from "@components/form-builders/TextAreaForm";

const module = MODULES.HOSPITAL_CONFIG;

export default function __HealthShareForm({ height, id }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { domainConfig } = useDomainConfig();
	const hospital_config = domainConfig?.hospital_config;
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);

	const form = useForm({
		initialValues: {
			x_auth_token: "",
			client_id: "",
			email: "",
			nid_url: "",
			patient_url: "",
			health_share_url: "",
			health_share_token: "",
			health_share_password: ""
		},
		validate: {
			x_auth_token: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			client_id: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			email: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			nid_url: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			health_share_url: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			health_share_token: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			health_share_password: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			patient_url: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
		},
	});

	const handlePurchaseFormSubmit = (values) => {
		if (!form.validate().hasErrors) {
			// dispatch(setValidationData(false));

			modals.openConfirmModal({
				title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
				children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
				labels: { confirm: t("Submit"), cancel: t("Cancel") },
				confirmProps: { color: "red" },
				onCancel: () => console.info("Canceled"),
				onConfirm: () => handleConfirmFormSubmit(values),
			});
		}
	};

	useEffect(() => {
		if (hospital_config) {
			form.setValues({
				health_share_url: hospital_config?.share_health?.health_share_url || "",
				email: hospital_config?.share_health?.email || "",
				health_share_password: hospital_config?.share_health?.health_share_password || "",
				x_auth_token: hospital_config?.share_health?.x_auth_token || "",
				client_id: hospital_config?.share_health?.client_id || "",
				nid_url: hospital_config?.share_health?.nid_url || "",
				health_share_token: hospital_config?.share_health?.health_share_token || "",
				patient_url: hospital_config?.share_health?.patient_url || "",

			});
		}
	}, [dispatch, hospital_config]);


	const handleConfirmFormSubmit = async (values) => {
		const properties = ["name", "narration"];
		properties.forEach((property) => {
			values[property] = values[property] === true || values[property] == 1 ? 1 : 0;
		});

		try {
			setSaveCreateLoading(true);

			const value = {
				url: `${CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.HEALTH_SHARE}`,
				data: values,
				module,
			};

			const resultAction = await dispatch(storeEntityData(value));
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					localStorage.setItem("domain-config-data", JSON.stringify(resultAction));
				}
			}
			successNotification(t("UpdateSuccessfully"));
			setTimeout(() => {
				setSaveCreateLoading(false);
			}, 500);
		} catch (error) {
			errorNotification("Error updating purchase config:" + error.message);
			setSaveCreateLoading(false);
		}
	};

	useHotkeys(
		[
			[
				"alt+p",
				() => {
					document.getElementById("HealthShareFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
			<form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
				<Box pt="xs" pl="xs">

					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("HealthShareUrl")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("HealthShareUrlValidateMessage")}
								label={""}
								placeholder={t("HealthShareUrl")}
								required={true}
								form={form}
								name={"health_share_url"}
								id={"health_share_url"}
								nextField={"email"}
							/>
						</Grid.Col>
					</Grid>

					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("Email")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("EmailValidateMessage")}
								label={""}
								placeholder={t("Email")}
								required={true}
								form={form}
								name={"email"}
								id={"email"}
								nextField={"password"}
							/>
						</Grid.Col>
					</Grid>
					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("Password")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("EmailValidateMessage")}
								label={""}
								placeholder={t("Password")}
								required={true}
								form={form}
								name={"health_share_password"}
								id={"health_share_password"}
								nextField={"client_id"}
							/>
						</Grid.Col>
					</Grid>
					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("ClientID")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("ClientIDValidateMessage")}
								label={""}
								placeholder={t("ClientID")}
								required={true}
								form={form}
								name={"client_id"}
								id={"client_id"}
								nextField={"health_share_token"}
							/>
						</Grid.Col>
					</Grid>

					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("HealthShareToken")}
						</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								tooltip={t("HealthShareTokenValidateMessage")}
								label={""}
								placeholder={t("HealthShareToken")}
								required={true}
								form={form}
								name={"health_share_token"}
								id={"health_share_token"}
								nextField={"x_auth_token"}
							/>
						</Grid.Col>
					</Grid>

					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("XAuthToken")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("XAuthTokenValidateMessage")}
								label={""}
								placeholder={t("XAuthToken")}
								required={true}
								form={form}
								name={"x_auth_token"}
								id={"x_auth_token"}
								nextField={"patient_url"}
							/>
						</Grid.Col>
					</Grid>

					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("PatientUrl")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("PatientUrlValidateMessage")}
								label={""}
								placeholder={t("PatientUrl")}
								required={true}
								form={form}
								name={"patient_url"}
								id={"patient_url"}
								nextField={"nid_url"}
							/>
						</Grid.Col>
					</Grid>
					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={3} fz="sm" >
							{t("NIDUrl")}
						</Grid.Col>
						<Grid.Col span={9}>
							<InputForm
								tooltip={t("NIDUrlValidateMessage")}
								label={""}
								placeholder={t("NIDUrl")}
								required={true}
								form={form}
								name={"nid_url"}
								id={"nid_url"}
							/>
						</Grid.Col>
					</Grid>
				</Box>

				<Button id="HealthShareFormSubmit" type="submit" style={{ display: "none" }}>
					{t("Submit")}
				</Button>
			</form>
		</ScrollArea>
	);
}
