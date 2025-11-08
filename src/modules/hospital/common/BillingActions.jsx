import { ActionIcon, Box, Button, Checkbox, Flex, Text } from "@mantine/core";
import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@/common/components/form-builders/InputNumberForm";
import { IconArrowsSplit2 } from "@tabler/icons-react";

export default function BillingActions() {
	const { t } = useTranslation();

	const form = useForm({
		initialValues: {
			paymentMethod: PAYMENT_METHODS[0],
		},
	});

	const selectPaymentMethod = (method) => {
		form.setFieldValue("paymentMethod", method);
	};

	const handlePrescriptionPosPrint = () => {
		console.log("handlePrescriptionPosPrint");
	};

	return (
		<Box p="xs" mt="xs" bg="var(--theme-tertiary-color-0)">
			<PaymentMethodsCarousel
				selectPaymentMethod={selectPaymentMethod}
				paymentMethod={form.values.paymentMethod}
			/>
			<Flex justify="space-between" align="center">
				<Flex fz="sm" align="center" gap="xs">
					SMS Alert{" "}
					<Checkbox
						checked={form.values.smsAlert}
						onChange={(event) => form.setFieldValue("smsAlert", event.currentTarget.checked)}
						color="var(--theme-success-color)"
					/>
				</Flex>
				<Flex gap="xs" align="center">
					<Box bg="var(--mantine-color-white)" px="xs" py="les" className="borderRadiusAll">
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
			</Flex>
			<Button.Group mt="xs">
				<Button w="100%" bg="var(--theme-reset-btn-color)" type="button">
					{t("Preview")}
				</Button>
				<Button onClick={handlePrescriptionPosPrint} w="100%" bg="var(--theme-pos-btn-color)" type="button">
					{t("Print")}
				</Button>
				<Button w="100%" bg="var(--theme-save-btn-color)" type="button">
					{t("Save")}
				</Button>
			</Button.Group>
		</Box>
	);
}
