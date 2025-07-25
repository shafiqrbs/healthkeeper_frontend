import TextAreaForm from "@components/form-builders/TextAreaForm";
import { ActionIcon, Box, Button, Checkbox, Flex, Grid, Image, Stack, Text } from "@mantine/core";
import { IconArrowsSplit2, IconCirclePlusFilled, IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { Carousel } from "@mantine/carousel";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useDispatch } from "react-redux";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";
import { notifications } from "@mantine/notifications";
import { setRefetchData } from "@/app/store/core/crudSlice";

export default function ActionButtons({ form, module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
	const [referredNameKey, setReferredNameKey] = useState(100);
	const [marketingExKey, setMarketingExKey] = useState(10);

	// =============== handle form submission ================
	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
					visit_date: new Date().toLocaleDateString("en-CA", options),
					amount: form.values.amount || 0,
					is_confirm: form.values.isConfirm || false,
					sms_alert: form.values.smsAlert || false,
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.VISIT.CREATE,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
				} else {
					showNotificationComponent(t("Visit saved successfully"), "green", "lightgray", true, 1000, true);
					setRefetchData({ module, refetching: true });
					form.reset();
				}
			} catch (error) {
				console.error("Error submitting visit:", error);
				showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				notifications.show({
					title: "Error",
					message: "Please fill all the fields",
					color: "red",
					position: "top-right",
				});
			}
		}
	};

	const selectPaymentMethod = (method) => {
		form.setFieldValue("paymentMethod", method.value);
		setPaymentMethod(method);
	};

	// =============== handle form reset ================
	const handleReset = () => {
		form.reset();
		setPaymentMethod(PAYMENT_METHODS[0]);
		setReferredNameKey((prev) => prev + 1);
		setMarketingExKey((prev) => prev + 1);
	};

	return (
		<Stack gap={0} justify="space-between" mt="xs">
			<Box p="md" bg="white" className="borderRadiusAll">
				<Grid columns={24}>
					<Grid.Col span={8} bg="var(--theme-tertiary-color-1)" px="xs">
						<TextAreaForm
							form={form}
							placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its"
							label={t("remark")}
							tooltip={t("enterRemark")}
							showRightSection={false}
							name="remark"
							style={{ input: { height: "114px" } }}
						/>
					</Grid.Col>
					<Grid.Col span={8} px="xs" bg="var(--theme-tertiary-color-0)">
						<Stack>
							<SelectForm
								key={referredNameKey}
								form={form}
								label={t("referredName")}
								tooltip={t("enterPatientReferredName")}
								placeholder="Dr. Holand"
								name="referredName"
								id="referredName"
								nextField="referredName"
								value={form.values.referredName}
								disabled
								dropdownValue={["Dr. Rahim Khan", "MBBS Kamruzzaman"]}
								rightSection={<IconCirclePlusFilled color="var(--theme-primary-color-6)" size="24px" />}
							/>
							<SelectForm
								key={marketingExKey}
								form={form}
								label={t("marketingEx")}
								placeholder="Mr. Doland Rak"
								name="marketingEx"
								disabled
								dropdownValue={["Mr. Rahim", "Mr. Karim"]}
								value={form.values.marketingEx}
								tooltip={t("enterPatientMarketingEx")}
								rightSection={<IconCirclePlusFilled color="var(--theme-primary-color-6)" size="24px" />}
							/>
						</Stack>
					</Grid.Col>
					<Grid.Col span={8} bg="var(--theme-tertiary-color-1)" px="xs">
						<Stack gap="xs" className="method-carousel">
							<Carousel
								height={50}
								align="start"
								slideSize="20%"
								bg="var(--theme-tertiary-color-0)"
								py="les"
								loop
							>
								{PAYMENT_METHODS.map((method) => (
									<Carousel.Slide key={method.id} onClick={() => selectPaymentMethod(method)}>
										<Stack
											bd={
												paymentMethod.id === method.id
													? "2px solid var(--theme-secondary-color-8)"
													: "2px solid transparent"
											}
											h="100%"
											justify="space-between"
											align="center"
											gap="0"
											className="cursor-pointer"
										>
											<Image src={method.icon} alt={method.label} w={30} />
											<Text fz="xxs">{method.label}</Text>
										</Stack>
									</Carousel.Slide>
								))}
							</Carousel>
							<Box>
								<Flex justify="space-between" mb="xxxs">
									<Flex fz="sm" align="center" gap="xs">
										Is Confirm{" "}
										<Checkbox
											checked={form.values.isConfirm}
											onChange={(event) =>
												form.setFieldValue("isConfirm", event.currentTarget.checked)
											}
											color="var(--theme-success-color)"
										/>
									</Flex>
									<Flex fz="sm" align="center" gap="xs">
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
									<Box bg="white" px="xs" py="les" className="borderRadiusAll">
										<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
											{t("Due")} ৳ {(20000).toLocaleString()}
										</Text>
									</Box>
									<InputNumberForm
										label=""
										form={form}
										tooltip={t("enterAmount")}
										placeholder={t("Amount")}
										name="amount"
										required
									/>
									<ActionIcon color="var(--theme-success-color)">
										<IconArrowsSplit2 size={16} />
									</ActionIcon>
								</Flex>
							</Box>
						</Stack>
					</Grid.Col>
				</Grid>
			</Box>
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
