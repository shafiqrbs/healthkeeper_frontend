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
import AdmissionInvoiceDetailsBN from "@hospital-components/print-formats/admission/AdmissionInvoiceDetailsBN";

export default function BillingActions({ entity }) {
	const { t } = useTranslation();
	const { id } = useParams();
	const invoicePrintRef = useRef(null);
	const printRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });
	const [invoiceEntity, setInvoiceEntity] = useState({});
	const [printData, setPrintData] = useState(null);
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

	useEffect(() => {
		if (entity) {
			setInvoiceEntity(entity);
		}
	}, [entity]);


	const handlePrescriptionPrint = async () => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.VIEW}/${id}/final-bill-process`,
		});
		setInvoicePrintData(res);
	};

	useEffect(() => {
		if (printData) {
			invoicePrint();
		}
	}, [printData]);




	const receive = invoiceEntity?.remaining_day * invoiceEntity?.room_price
	const total = Number(invoiceEntity.total ?? 0);
	const amount = Number(invoiceEntity.amount ?? 0);
	const refund = Number(invoiceEntity.refund_amount ?? 0);
	const due = total - (amount - refund);

	return (
		<Box p="xs" mt="xs" bg="var(--theme-tertiary-color-0)">
			<Flex justify="space-between" align="center">

				<Flex gap="xs" align="center"/>
				<Flex fz="sm" align="center" gap="xs">

					<Button.Group>
						{invoiceEntity?.process === 'admitted' && due === 0 && (
							<Button  w="100%" bg="var(--theme-primary-color-6)" type="button" onClick={handlePrescriptionPosSubmit}>SETTLED</Button>
						)}
						{invoiceEntity?.process === 'admitted' && due > 0 && (
							<Button  w="100%" bg="var(--theme-secondary-color-6)" type="button" onClick={handlePrescriptionPosSubmit}>RECEIVE</Button>
						)}
						{(invoiceEntity?.process === 'admitted' || invoiceEntity?.process === 'refund' || invoiceEntity?.process === 'paid') && due < 0 && (
							<Button  w="100%" bg="var(--theme-warn-color-6)" type="button" onClick={handlePrescriptionPosSubmit}>REFUND</Button>
						)}
						<Button.Group>
							{invoiceEntity?.process === "paid" && (
								<Button
									w="100%"
									bg="var(--theme-primary-color-6)"
									type="button"
									onClick={handlePrescriptionPrint}
								>
									Print Bill
								</Button>
							)}
							{invoiceEntity?.process === "refund" && (
								<Button
									w="100%"
									bg="var(--theme-warn-color-6)"
									type="button"
									onClick={handlePrescriptionPrint}
								>
									Print Refund
								</Button>
							)}
						</Button.Group>

					</Button.Group>
				</Flex>
			</Flex>

			{invoiceEntity?.process === 'paid' && due === 0 && (
				/*<IPDInvoicePosBn data={invoicePrintData?.data} ref={invoicePrintRef} />*/
				<AdmissionInvoiceDetailsBN data={invoicePrintData?.data} ref={invoicePrintRef} />
			)}
			{(invoiceEntity?.process === 'refund') && due < 0 && (
				<RefundFromBedBn data={invoicePrintData?.data} ref={invoicePrintRef} />
			)}
		</Box>
	);
}
