import { Box, Button, Flex, Grid, NumberInput, Stack, Text } from "@mantine/core";
import { IconRestore } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { useEffect, useRef, useState } from "react";
import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import IPDDetailsDrawer from "./drawer/__IPDDetailsDrawer";
import { useReactToPrint } from "react-to-print";
import AdmissionInvoiceBN from "@hospital-components/print-formats/admission/AdmissionInvoiceBN";

const LOCAL_STORAGE_KEY = "patientFormData";

export default function IpdActionButtons({
	form,
	isSubmitting,
	entities,
	handleSubmit,
	type = "prescription",
	handlePosPrint,
	item,
	children,
}) {
	const ipdRef = useRef(null);
	const [printData, setPrintData] = useState(null);

	const isOpdRedirect = item?.parent_patient_mode_slug === "opd";
	const { hospitalConfigData } = useHospitalConfigData();
	const { t } = useTranslation();
	const [quantity, setQuantity] = useState(3);
	const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
	const [configuredDueAmount, setConfiguredDueAmount] = useState(0);
	const [openedDetails, { open: openDetails, close: closeDetails }] = useDisclosure(false);

	const subTotal = quantity * entities?.[0]?.price;
	const enteredAmount = Number(subTotal + entities?.[1]?.price);
	const remainingBalance = configuredDueAmount - enteredAmount;
	const isReturn = remainingBalance < 0;
	const displayLabelKey = "Due";
	const displayAmount = Math.abs(remainingBalance);

	useEffect(() => {
		form.setFieldValue("days", quantity);
	}, [quantity]);

	console.log(subTotal);

	useEffect(() => {
		let price = Number(hospitalConfigData?.hospital_config?.[`${type}_fee`]?.[`${type}_fee_price`]);
		price = isOpdRedirect ? 0 : enteredAmount;
		setConfiguredDueAmount(enteredAmount);
		form.setFieldValue("amount", enteredAmount);
	}, [form.values.patient_payment_mode_id, hospitalConfigData, type]);

	const printIPD = useReactToPrint({
		content: () => ipdRef.current,
	});
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

	const handleIPDDetails = async () => {
		await handleSubmit(true);
		if (!form.validate().hasErrors) {
			openDetails();
		}
	};

	const handleIPDPrint = async () => {
		const res = await handleSubmit(true);
		if (!form.validate().hasErrors) {
			setPrintData(res?.data);
			requestAnimationFrame(printIPD);
		}
	};

	useHotkeys([
		["alt+s", handleSubmit],
		["alt+r", handleReset],
		["alt+shift+p", handleIPDPrint],
		["alt+p", handlePosPrint],
	]);

	return (
		<>
			<Stack gap={0} justify="space-between" mt="xs">
				<Box py="sm" px="md" bg="var(--mantine-color-white)">
					<Grid columns={24}>
						<Grid.Col span={12} bg="var(--theme-tertiary-color-0)" px="xs">
							<Grid columns={24} my="xs" bg={"var(--theme-primary-color-1)"} px="xs" gutter="xs">
								<Grid.Col span={12}>
									<Text fz="sm">Particular</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text fz="sm">Quantity</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Text fz="sm">Price</Text>
								</Grid.Col>
								<Grid.Col span={4}>
									<Flex justify="space-between" align="center">
										<Text fz="sm">Total</Text>
									</Flex>
								</Grid.Col>
							</Grid>
							{entities?.map((entity, index) => (
								<Grid
									key={entity?.id}
									columns={24}
									my="0"
									bg={"var(--theme-tertiary-color-0)"}
									px="xs"
									gutter="xs"
								>
									<Grid.Col span={12}>
										<Text fz="xs">{entity?.item_name}</Text>
									</Grid.Col>
									<Grid.Col span={4}>
										{index === 0 ? (
											<NumberInput
												onChange={setQuantity}
												mt="-sm"
												size="xs"
												fz="xs"
												py="xs"
												value={quantity}
												readOnly
											/>
										) : (
											<Text fz="xs">{entity?.quantity}</Text>
										)}
									</Grid.Col>
									<Grid.Col span={4}>
										<Text fz="xs">{entity?.price}</Text>
									</Grid.Col>
									<Grid.Col span={4}>
										<Flex justify="space-between" align="center">
											{index === 0 ? (
												<Text fz="xs">{subTotal}</Text>
											) : (
												<Text fz="xs">{entity?.sub_total}</Text>
											)}
										</Flex>
									</Grid.Col>
								</Grid>
							))}
						</Grid.Col>
						<Grid.Col span={6} bg="var(--theme-primary-color-0)" px="xs">
							<Stack gap="0" className="method-carousel">
								<Box bg="var(--theme-secondary-color-0)" p="xs">
									<Text fw={600} fz="sm">
										{t("BillSummary")}
									</Text>
								</Box>
								{hospitalConfigData?.is_multi_payment ? (
									<PaymentMethodsCarousel
										selectPaymentMethod={selectPaymentMethod}
										paymentMethod={paymentMethod}
									/>
								) : null}
								<Flex gap="xss" align="center" justify="space-between">
									<Text>{t("TotalAmount")}</Text>
									<Box px="xs" py="les">
										<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
											৳ {Number(enteredAmount || 0).toLocaleString()}
										</Text>
									</Box>
								</Flex>
								{/*<Flex align="center" justify="space-between">
									<Text>Receive</Text>
									<Box w="100px">
										<InputNumberForm
											disabled={isOpdRedirect}
											id="amount"
											form={form}
											tooltip={t("EnterAmount")}
											placeholder={t("Amount")}
											name="amount"
										/>
									</Box>
								</Flex>*/}
								<Flex align="center" justify="space-between">
									<Text>{t(displayLabelKey)}</Text>
									<Box px="xs" py="les">
										<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
											৳ {Number(enteredAmount || 0).toLocaleString()}
										</Text>
									</Box>
								</Flex>
							</Stack>
						</Grid.Col>
						<Grid.Col span={6} bg="var(--theme-secondary-color-0)" px="xs" pt="md">
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
									<Text fz="xs">{t("PatientMode")}</Text>
									<Box px="xs">
										<Text fz="xs" fw={600} style={{ textWrap: "nowrap" }}>
											{item?.parent_patient_mode_name || "N/A"}
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
					</Grid>
					<Box mt={"md"}>
						<Button.Group>
							<Button
								w="100%"
								bg="var(--theme-reset-btn-color)"
								leftSection={<IconRestore size={16} />}
								onClick={handleReset}
								disabled={isSubmitting}
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("Reset")}</Text>
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
								onClick={handleIPDDetails}
								bg="var(--theme-prescription-btn-color)"
								disabled={isSubmitting}
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("Preview")}</Text>
									<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
										(alt + shift + p)
									</Text>
								</Stack>
							</Button>
							{/* <Button
								w="100%"
								onClick={handleIPDPrint}
								bg="var(--theme-secondary-color-6)"
								disabled={isSubmitting}
							>
								<Stack gap={0} align="center" justify="center">
									<Text>{t("Print")}</Text>
									<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
										(alt + p)
									</Text>
								</Stack>
							</Button> */}
							<Button
								id="EntityFormSubmit"
								w="100%"
								bg="var(--theme-save-btn-color)"
								onClick={() => handleSubmit()}
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
				</Box>
			</Stack>

			{/* ===================== prescription templates here ====================== */}
			{children}

			<IPDDetailsDrawer opened={openedDetails} close={closeDetails} prescriptionId={item?.prescription_id} />
			{printData && <AdmissionInvoiceBN data={{ ...item, entities }} ref={ipdRef} />}
		</>
	);
}
