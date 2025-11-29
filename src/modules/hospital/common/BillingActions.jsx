import { ActionIcon, Box, Button, Flex, Text } from "@mantine/core";
// import PaymentMethodsCarousel from "./PaymentMethodsCarousel";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import InputNumberForm from "@/common/components/form-builders/InputNumberForm";
import { IconArrowsSplit2 } from "@tabler/icons-react";
import {getDataWithoutStore} from "@/services/apiService";
import {HOSPITAL_DATA_ROUTES} from "@/constants/routes";
import {useParams} from "react-router-dom";

export default function BillingActions({entity}) {
	const { t } = useTranslation();
	const { id } = useParams();
	const form = useForm({
		initialValues: {
			paymentMethod: PAYMENT_METHODS[0],
		},
	});

	// const selectPaymentMethod = (method) => {
	// 	form.setFieldValue("paymentMethod", method);
	// };

	const  handlePrescriptionPosSubmit = async () => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.VIEW}/${id}/final-bill`,
		});
	};

	const receive = entity?.remaining_day*entity?.room_price

	return (
		<Box p="xs" mt="xs" bg="var(--theme-tertiary-color-0)">
			{/* <PaymentMethodsCarousel
				selectPaymentMethod={selectPaymentMethod}
				paymentMethod={form.values.paymentMethod}
			/> */}
			<Flex justify="space-between" align="center">
				<Flex fz="sm" align="center" gap="xs">
					{/* SMS Alert{" "}
					<Checkbox
						checked={form.values.smsAlert}
						onChange={(event) => form.setFieldValue("smsAlert", event.currentTarget.checked)}
						color="var(--theme-success-color)"
					/> */}
				</Flex>
				<Flex gap="xs" align="center">
					<Box bg="var(--mantine-color-white)" px="xs" py="les" className="borderRadiusAll">
						<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
							{t("Amount")} ৳ {receive}
						</Text>
					</Box>
					{/*
					<ActionIcon color="var(--theme-success-color)">
						<IconArrowsSplit2 size={16} />
					</ActionIcon>
					*/}
				</Flex>
			</Flex>
			<Button.Group mt="xs">
				<Button w="100%" bg="var(--theme-save-btn-color)" type="button" onClick={handlePrescriptionPosSubmit}>
					{t("Save")}
				</Button>
			</Button.Group>
		</Box>
	);
}
