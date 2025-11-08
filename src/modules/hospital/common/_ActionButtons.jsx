import TextAreaForm from "@components/form-builders/TextAreaForm";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useEffect, useState } from "react";
import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import { useHotkeys } from "@mantine/hooks";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function ActionButtons({
	form,
	isSubmitting,
	handleSubmit,
	type = "opd_ticket",
	handlePosPrint,
	handleA4Print,
	children,
}) {
	const { hospitalConfigData: globalConfig } = useHospitalConfigData();
	const hospitalConfigData = globalConfig?.hospital_config;

	const { t } = useTranslation();
	const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
	const [configuredDueAmount, setConfiguredDueAmount] = useState(0);

	useEffect(() => {
		const price =
			form.values.patient_payment_mode_id !== "30" // only for general payment will be applicable
				? 0
				: Number(hospitalConfigData?.[`${type}_fee`]?.[`opd_ticket_fee_price`] ?? 0);
		setConfiguredDueAmount(price);
		form.setFieldValue("amount", price);
	}, [form.values.patient_payment_mode_id, hospitalConfigData, type]);

	const enteredAmount = Number(form?.values?.amount ?? 0);
	const remainingBalance = configuredDueAmount - enteredAmount;
	const isReturn = remainingBalance < 0;
	const displayLabelKey = isReturn ? "Return" : "Due";
	const displayAmount = Math.abs(remainingBalance);

	const selectPaymentMethod = (method) => {
		form.setFieldValue("paymentMethod", method.value);
		setPaymentMethod(method);
	};

	// =============== handle form reset ================
	const handleReset = () => {
		form.reset();
		setPaymentMethod(PAYMENT_METHODS[0]);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};

	const handleFinalSubmission = async () => {
		const res = await handleSubmit();
		console.log(res);
	};

	useHotkeys([
		["alt+s", handleFinalSubmission],
		["alt+r", handleReset],
		["alt+shift+p", handleA4Print],
		["alt+p", handlePosPrint],
	]);

	return (
		<>
			<Stack gap={0} justify="space-between" mt="xs">
				<Box p="sm" pl={"md"} pr={"md"} bg="var(--mantine-color-white)">
					<Grid columns={24}>
						<Grid.Col span={8} bg="var(--theme-primary-color-0)" px="xs">
							<Flex gap="xss" align="center" justify="space-between">
								<Text>{t("Fee")}</Text>
								<Box px="xs" py="les">
									<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
										৳ {Number(configuredDueAmount || 0).toLocaleString()}
									</Text>
								</Box>
							</Flex>
						</Grid.Col>
						<Grid.Col span={8} bg="var(--theme-primary-color-0)" px="xs">
							<Flex align="center" justify="space-between">
								<Box w="100%">
									<InputNumberForm
										id="amount"
										form={form}
										tooltip={t("enterAmount")}
										placeholder={t("Amount")}
										name="amount"
									/>
								</Box>
							</Flex>
						</Grid.Col>
						<Grid.Col span={8} bg="var(--theme-primary-color-0)" px="xs">
							<Flex align="center" justify="space-between">
								<Text>{t(displayLabelKey)}</Text>
								<Box px="xs" py="les">
									<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
										৳ {Number(displayAmount || 0).toLocaleString()}
									</Text>
								</Box>
							</Flex>
						</Grid.Col>
						<Stack gap="0" className="method-carousel">
							{hospitalConfigData?.is_multi_payment ? (
								<PaymentMethodsCarousel
									selectPaymentMethod={selectPaymentMethod}
									paymentMethod={paymentMethod}
								/>
							) : null}
						</Stack>
						{/* </Grid.Col> */}
					</Grid>
				</Box>
			</Stack>
			<Box pl={"xs"} pr={"xs"}>
				<Button.Group>
					<Button
						w="100%"
						bg="var(--theme-reset-btn-color)"
						leftSection={<IconRestore size={16} />}
						onClick={handleReset}
						disabled={isSubmitting}
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("reset")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + r)
							</Text>
						</Stack>
					</Button>
					{/* <Button w="100%" bg="var(--theme-hold-btn-color)" disabled={isSubmitting}>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Hold")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + h)
							</Text>
						</Stack>
					</Button> */}
					<Button
						w="100%"
						onClick={handleA4Print}
						bg="var(--theme-prescription-btn-color)"
						disabled={isSubmitting}
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("prescription")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + shift + p)
							</Text>
						</Stack>
					</Button>
					{/* <Button
						onClick={handleA4Print}
						w="100%"
						bg="var(--theme-print-btn-color)"
						disabled={isSubmitting}
						type="button"
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("a4Print")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 4)
							</Text>
						</Stack>
					</Button> */}
					<Button
						id="EntityFormSubmit"
						onClick={handlePosPrint}
						w="100%"
						bg="var(--theme-pos-btn-color)"
						disabled={isSubmitting}
						type="button"
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Pos")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + p)
							</Text>
						</Stack>
					</Button>
					<Button
						w="100%"
						bg="var(--theme-save-btn-color)"
						onClick={handleFinalSubmission}
						loading={isSubmitting}
						disabled={isSubmitting}
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Save")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + s)
							</Text>
						</Stack>
					</Button>
				</Button.Group>
			</Box>

			{/* ===================== prescription templates here ====================== */}
			{children}
		</>
	);
}
