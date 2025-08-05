import TextAreaForm from "@components/form-builders/TextAreaForm";
import { ActionIcon, Box, Button, Checkbox, Flex, Grid, Stack, Text } from "@mantine/core";
import { IconArrowsSplit2, IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Prescription from "@components/print-formats/a4/Prescription";
import PrescriptionPos from "@components/print-formats/pos/Prescription";
import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import { useHotkeys } from "@mantine/hooks";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function ActionButtons({ form, isSubmitting, handleSubmit }) {
	const prescriptionA4Ref = useRef(null);
	const prescriptionPosRef = useRef(null);
	const { t } = useTranslation();
	const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

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

	const handlePrintPrescriptionA4 = useReactToPrint({
		content: () => prescriptionA4Ref.current,
	});

	const handlePrescriptionPosPrint = useReactToPrint({
		content: () => prescriptionPosRef.current,
	});

	useHotkeys([
		["alt+s", handleSubmit],
		["alt+r", handleReset],
		["alt+4", handlePrintPrescriptionA4],
		["alt+p", handlePrescriptionPosPrint],
	]);

	return (
		<>
			<Stack gap={0} justify="space-between" mt="xs">
				<Box p="md" bg="white" className="borderRadiusAll">
					<Grid columns={24}>
						<Grid.Col span={12} bg="var(--theme-tertiary-color-1)" px="xs">
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
						{/*<Grid.Col span={8} px="xs" bg="var(--theme-tertiary-color-0)">
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
						</Grid.Col> */}
						<Grid.Col span={12} bg="var(--theme-tertiary-color-1)" px="xs">
							<Stack gap="xs" className="method-carousel">
								<PaymentMethodsCarousel
									selectPaymentMethod={selectPaymentMethod}
									paymentMethod={paymentMethod}
								/>
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
									<Flex gap="xs" align="center" justify="space-between">
										<Box bg="white" px="xs" py="les" className="borderRadiusAll">
											<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
												{t("Due")} ৳ {(20000).toLocaleString()}
											</Text>
										</Box>
										<Flex align="center" gap="xs">
											<InputNumberForm
												id="amount"
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
					<Button
						onClick={handlePrintPrescriptionA4}
						w="100%"
						bg="var(--theme-print-btn-color)"
						disabled={isSubmitting}
						type="button"
					>
						{t("a4Print")}
					</Button>
					<Button
						onClick={handlePrescriptionPosPrint}
						w="100%"
						bg="var(--theme-pos-btn-color)"
						disabled={isSubmitting}
						type="button"
					>
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
			<Prescription ref={prescriptionA4Ref} />
			<PrescriptionPos ref={prescriptionPosRef} />
		</>
	);
}
