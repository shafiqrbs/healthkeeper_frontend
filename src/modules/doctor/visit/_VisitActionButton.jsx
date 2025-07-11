import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { ActionIcon, Button, Checkbox, Flex, Grid, Image, Stack, Text } from "@mantine/core";
import { IconArrowsSplit2, IconCirclePlusFilled, IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { Carousel } from "@mantine/carousel";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { useState } from "react";

export default function VisitActionButton({ form }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// =============== handle form submission ================
	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };

				const formValue = {
					...form.values,
					created_by_id: Number(createdBy?.id),
					visit_date: new Date().toLocaleDateString("en-CA", options),
					amount: form.values.amount || 0,
					is_confirm: form.values.isConfirm || false,
					sms_alert: form.values.smsAlert || false,
				};

				const data = {
					url: "doctor/visit",
					data: formValue,
					module: "visit",
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(
						resultAction.payload.message,
						"red",
						"lightgray",
						true,
						1000,
						true
					);
				} else {
					showNotificationComponent(
						t("Visit saved successfully"),
						"green",
						"lightgray",
						true,
						1000,
						true
					);
					form.reset();
				}
			} catch (error) {
				console.error("Error submitting visit:", error);
				showNotificationComponent(
					t("Something went wrong"),
					"red",
					"lightgray",
					true,
					1000,
					true
				);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	// =============== handle form reset ================
	const handleReset = () => {
		form.reset();
	};

	return (
		<Stack gap="xxxs" justify="space-between">
			<Grid columns={24}>
				<Grid.Col span={8}>
					<TextAreaForm
						form={form}
						placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its"
						label={t("remark")}
						tooltip={t("enterRemark")}
						showRightSection={false}
						name="remark"
					/>
				</Grid.Col>
				<Grid.Col span={8}>
					<Stack>
						<InputForm
							form={form}
							label={t("referredName")}
							placeholder={t("name")}
							name="referredName"
							tooltip={t("enterPatientReferredName")}
							rightSection={
								<IconCirclePlusFilled
									color="var(--theme-primary-color-6)"
									size="24px"
								/>
							}
						/>
						<InputForm
							form={form}
							label={t("marketingEx")}
							placeholder="101"
							name="marketingEx"
							tooltip={t("enterPatientMarketingEx")}
							rightSection={
								<IconCirclePlusFilled
									color="var(--theme-primary-color-6)"
									size="24px"
								/>
							}
						/>
					</Stack>
				</Grid.Col>
				<Grid.Col span={8}>
					<Carousel slideGap="xs" align="start" slideSize="20%">
						{PAYMENT_METHODS.map((method) => (
							<Carousel.Slide key={method.value}>
								<Image src={method.icon} alt={method.label} mih={40} />
								<Text>{method.label}</Text>
							</Carousel.Slide>
						))}
					</Carousel>
					<Flex justify="space-between">
						<Flex align="center" gap="xs">
							Is Confirm{" "}
							<Checkbox
								checked={form.values.isConfirm}
								onChange={(event) =>
									form.setFieldValue("isConfirm", event.currentTarget.checked)
								}
								color="var(--theme-success-color)"
							/>
						</Flex>
						<Flex align="center" gap="xs">
							SMS Alert{" "}
							<Checkbox
								checked={form.values.smsAlert}
								onChange={(event) =>
									form.setFieldValue("smsAlert", event.currentTarget.checked)
								}
								color="var(--theme-success-color)"
							/>
						</Flex>
					</Flex>
					<Flex gap="xs" align="center">
						<Text>{t("Due")} ৳ 200000</Text>
						<InputNumberForm form={form} placeholder={t("amount")} name="amount" />
						<ActionIcon color="var(--theme-success-color)">
							<IconArrowsSplit2 size={16} />
						</ActionIcon>
					</Flex>
				</Grid.Col>
			</Grid>
			<Button.Group>
				<Button
					w="100%"
					bg="var(--theme-reset-btn-color)"
					leftSection={<IconRestore size={16} />}
					onClick={handleReset}
					disabled={isSubmitting}
				>
					{t("reset")}
				</Button>
				<Button w="100%" bg="var(--theme-hold-btn-color)" disabled={isSubmitting}>
					{t("Hold")}
				</Button>
				<Button w="100%" bg="var(--theme-prescription-btn-color)" disabled={isSubmitting}>
					{t("prescription")}
				</Button>
				<Button w="100%" bg="var(--theme-print-btn-color)" disabled={isSubmitting}>
					{t("a4Print")}
				</Button>
				<Button w="100%" bg="var(--theme-pos-btn-color)" disabled={isSubmitting}>
					{t("Pos")}
				</Button>
				<Button
					w="100%"
					bg="var(--theme-save-btn-color)"
					onClick={handleSubmit}
					loading={isSubmitting}
					disabled={isSubmitting}
				>
					{t("Save")}
				</Button>
			</Button.Group>
		</Stack>
	);
}
