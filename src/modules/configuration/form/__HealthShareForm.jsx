import { useState } from "react";
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

const module = MODULES.HOSPITAL_CONFIG;

export default function __HealthShareForm({ height, id }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [saveCreateLoading, setSaveCreateLoading] = useState(false);

	const form = useForm({
		initialValues: {
			name: "",
			narration: "",
		},
		validate: {
			name: (value) => (value?.trim() ? null : t("SubGroupNameValidateMessage")),
			narration: (value) => (value?.trim() ? null : t("Narration")),
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

	const handleConfirmFormSubmit = async (values) => {
		const properties = ["name", "narration"];
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
						<Grid.Col span={6} fz="sm" pt="1px">
							{t("Name")}
						</Grid.Col>
						<Grid.Col span={6}>
							<InputForm
								tooltip={t("SubGroupNameValidateMessage")}
								label={""}
								placeholder={t("Name")}
								required={true}
								nextField={"narration"}
								name={"name"}
								form={form}
								id={"name"}
							/>
						</Grid.Col>
					</Grid>

					<Grid mt="xs" gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
						<Grid.Col span={6} fz="sm" pt="1px">
							{t("Narration")}
						</Grid.Col>
						<Grid.Col span={6}>
							<InputForm
								tooltip={t("Narration")}
								label={""}
								placeholder={t("Narration")}
								required={true}
								nextField={"EntityFormSubmit"}
								name={"narration"}
								form={form}
								id={"narration"}
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
