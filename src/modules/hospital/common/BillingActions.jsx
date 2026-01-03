import { Box, Button, Flex, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import RefundFormInvestigationBN from "@hospital-components/print-formats/refund/RefundFormInvestigationBN";
import RefundFromBedBn from "@hospital-components/print-formats/refund/RefundFormBedBN";
import IPDInvoicePosBn from "@hospital-components/print-formats/ipd/IPDInvoicePosBN";

export default function BillingActions({ entity }) {
	const { t } = useTranslation();
	const { id } = useParams();
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });
	const [invoiceEntity, setInvoiceEntity] = useState({});

	// const selectPaymentMethod = (method) => {
	// 	form.setFieldValue("paymentMethod", method);
	// };

	const handlePrescriptionPosSubmit = async () => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.VIEW}/${id}/final-bill-process`,
		});
		setInvoiceEntity(res?.data);
		setInvoicePrintData(res);
	};

	const handlePrescriptionPrint = async () => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.VIEW}/${id}/final-bill-process`,
		});
		setInvoicePrintData(res);
	};

	useEffect(() => {
		if (invoicePrintData) {
			invoicePrint();
		}
	}, [invoicePrintData]);

	useEffect(() => {
		if (entity) {
			setInvoiceEntity(entity);
		}
	}, [entity]);

	const receive = invoiceEntity?.remaining_day * invoiceEntity?.room_price;

	return (
		<Box p="xs" mt="xs" bg="var(--theme-tertiary-color-0)">
			<Flex justify="space-between" align="center">
				<Flex gap="xs" align="center">
					<Box bg="var(--mantine-color-white)" px="xs" py="les" className="borderRadiusAll">
						<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
							{t("Amount")} ৳ {receive || 0}
						</Text>
					</Box>
				</Flex>
				<Flex fz="sm" align="center" gap="xs">
					<Button.Group>
						{invoiceEntity?.process === "paid" && (
							<Button
								w="100%"
								bg="var(--theme-primary-color-6)"
								type="button"
								onClick={handlePrescriptionPrint}
							>
								Print
							</Button>
						)}
						{invoiceEntity?.process === "refund" && (
							<Button
								w="100%"
								bg="var(--theme-warn-color-6)"
								type="button"
								onClick={handlePrescriptionPrint}
							>
								Print
							</Button>
						)}
					</Button.Group>
					<Button.Group>
						{invoiceEntity?.process === "admitted" && receive === 0 && (
							<Button
								w="100%"
								bg="var(--theme-primary-color-6)"
								type="button"
								onClick={handlePrescriptionPosSubmit}
							>
								SETTLED
							</Button>
						)}
						{invoiceEntity?.process === "admitted" && receive > 0 && (
							<Button
								w="100%"
								bg="var(--theme-secondary-color-6)"
								type="button"
								onClick={handlePrescriptionPosSubmit}
							>
								RECEIVE
							</Button>
						)}
						{(invoiceEntity?.process === "admitted" || invoiceEntity?.process === "refund") &&
							receive < 0 && (
								<Button
									w="100%"
									bg="var(--theme-warn-color-6)"
									type="button"
									onClick={handlePrescriptionPosSubmit}
								>
									REFUND
								</Button>
							)}
					</Button.Group>
				</Flex>
			</Flex>

			{invoiceEntity?.process === "paid" && receive === 0 && (
				<IPDInvoicePosBn data={invoicePrintData?.data} ref={invoicePrintRef} />
			)}
			{invoiceEntity?.process === "refund" && receive < 0 && (
				<RefundFromBedBn data={invoicePrintData?.data} ref={invoicePrintRef} />
			)}
		</Box>
	);
}
