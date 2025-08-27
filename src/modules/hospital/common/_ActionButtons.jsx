import TextAreaForm from "@components/form-builders/TextAreaForm";
import {Box, Button, Divider, Flex, Grid, Stack, Text} from "@mantine/core";
import { IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Prescription from "@components/print-formats/a4/Prescription";
import PrescriptionPos from "@components/print-formats/pos/Prescription";
import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import { useHotkeys } from "@mantine/hooks";
import Prescription2 from "@components/print-formats/a4/Prescription2";
import Prescription3 from "@components/print-formats/a4/Prescription3";
import useHospitalConfigData from "@/common/hooks/config-data/useHospitalConfigData";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function ActionButtons({ form, isSubmitting, handleSubmit, type = "prescription" }) {
	const prescriptionA4Ref = useRef(null);
	const prescriptionPosRef = useRef(null);
	const { t } = useTranslation();
	const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

	const { hospitalConfigData } = useHospitalConfigData();

	// compute dynamic due/return based on configured fee and entered amount
	const configuredDueAmount = Number(hospitalConfigData?.[`${type}_fee`]?.[`${type}_fee_price`] ?? 0);
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
				<Box p="sm" pl={'md'} pr={'md'} bg="white">
					<Grid columns={24}>
						<Grid.Col span={12} bg="var(--theme-tertiary-color-0)" px="xs">
							<TextAreaForm
								form={form}
								placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its"
								label={t("remark")}
								tooltip={t("enterRemark")}
								showRightSection={false}
								name="remark"
								style={{ input: { height: "80px" } }}
							/>
						</Grid.Col>
						<Grid.Col span={6} bg="var(--theme-secondary-color-0)" px="xs" pt={"md"}>
							{/*<Stack>
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
							</Stack>*/}
							<Box>
								<Flex gap="xss" align="center" justify="space-between">
									<Text fz="xs">{t("Name")}</Text>
									<Box px="xs">
										<Text fz="xs" fw={600} style={{ textWrap: "nowrap" }}>
											{form.values?.name}
										</Text>
									</Box>
								</Flex>
								<Flex gap="xss" align="center" justify="space-between">
									<Text fz="xs">{t("MobileNo")}</Text>
									<Box px="xs">
										<Text fz="xs" fw={600} style={{ textWrap: "nowrap" }}>
											{form.values?.mobile}
										</Text>
									</Box>
								</Flex>
								<Flex gap="xss" align="center" justify="space-between">
									<Text fz="xs">{t("Gender")}</Text>
									<Box px="xs">
										<Text fz="xs" fw={600} style={{ textWrap: "nowrap" }}>
											{form.values?.gender}
										</Text>
									</Box>
								</Flex>
								<Flex gap="xss" align="center" justify="space-between">
									<Text fz="xs">{t("Age")}</Text>
									<Box px="xs">
										<Text fz="xs" fw={600} style={{ textWrap: "nowrap" }}>
											{form.values.day} Days {form.values.month} Month {form.values.year} Year
										</Text>
									</Box>
								</Flex>
							</Box>

						</Grid.Col>
						<Grid.Col span={6} bg="var(--theme-primary-color-0)" px="xs">
							<Stack gap="0" className="method-carousel">
								{hospitalConfigData?.is_multi_payment ? (
									<PaymentMethodsCarousel
										selectPaymentMethod={selectPaymentMethod}
										paymentMethod={paymentMethod}
									/>
								) : null}
								<Flex gap="xss" align="center" justify="space-between">
									<Text>{t("Fee")}</Text>
									<Box px="xs" py="les">
										<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
											৳ {Number(displayAmount || 0).toLocaleString()}
										</Text>
									</Box>
								</Flex>
								<Flex align="center" justify="space-between">
									<Text>Receive</Text>
									<Box w={"100"}>
										<InputNumberForm
											id="amount"
											form={form}
											tooltip={t("enterAmount")}
											placeholder={t("Amount")}
											name="amount"
											required
										/>
									</Box>
								</Flex>
								<Flex align="center" justify="space-between">
									<Text>{t(displayLabelKey)}</Text>
									<Box px="xs" py="les">
										<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
											৳ {Number(displayAmount || 0).toLocaleString()}
										</Text>
									</Box>
								</Flex>
							</Stack>
						</Grid.Col>
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
								(alt + 1)
							</Text>
						</Stack>
					</Button>
					<Button w="100%" bg="var(--theme-hold-btn-color)" disabled={isSubmitting}>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Hold")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 2)
							</Text>
						</Stack>
					</Button>
					<Button w="100%" bg="var(--theme-prescription-btn-color)" disabled={isSubmitting}>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("prescription")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 3)
							</Text>
						</Stack>
					</Button>
					<Button
						onClick={handlePrintPrescriptionA4}
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
					</Button>
					<Button
						onClick={handlePrescriptionPosPrint}
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
						onClick={handleSubmit}
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
			<Prescription ref={prescriptionA4Ref} />
			<Prescription2 ref={prescriptionA4Ref} />
			<Prescription3 ref={prescriptionA4Ref} />
			<PrescriptionPos ref={prescriptionPosRef} />
		</>
	);
}
