import {Box, Button, Divider, Flex, Text} from "@mantine/core";
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

export default function BillingActions({ entity,refetchAll,setRefetchBillingKey }) {
	const { t } = useTranslation();
	const { id } = useParams();

	const [printData, setPrintData] = useState(null);
	const printRef = useRef(null);
	const invoicePrint = useReactToPrint({ content: () => printRef.current });


	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoiceRefundPrint = useReactToPrint({ content: () => invoicePrintRef.current });

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
		refetchAll()
		setRefetchBillingKey(true)
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
	};

	const handleAdmissionBillDetails = async (e, uid) => {
		e.stopPropagation();
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.VIEW}/${uid}/final-bill`,
		});
		setPrintData(res?.data);
	};

	useEffect(() => {
		if (printData) {
			invoicePrint();
		}
	}, [printData]);


	const handleRefundPrint = async (e,id) => {
		e.stopPropagation();
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.IPD_PRINT}/${id}`,
		});
		setInvoicePrintData(res?.data);
	};
	useEffect(() => {
		if(invoicePrintData){
			invoiceRefundPrint();
		}
	}, [invoicePrintData]);



	const total = Number(invoiceEntity?.total ?? 0);
	const amount = Number(invoiceEntity?.amount ?? 0);
	const refund = Number(invoiceEntity?.refund_amount ?? 0);
	const due = total - (amount - refund);

	return (
		<Box p="xs" mt="xs" bg="var(--theme-tertiary-color-0)">
			<Text bg={'green'} c={'white'} fz={'md'} p={'xs'}>Room/Bed Summary</Text>
			<Box bg="var(--mantine-color-white)" p="xs">
				<Flex justify="space-between" align={'center'}>
					<Text>Admission</Text>
					<Text>{entity.admission_day} Days</Text>
					<Text>৳ {entity.admission_day * entity?.room_price}</Text>
				</Flex>
				{entity?.is_free_bed !== 1 && (
					<Flex justify="space-between" align={'center'}>
						<Text>Payment</Text>
						<Text>{entity.consume_day} Days </Text>
						<Text>৳ {entity.consume_day  * entity?.room_price}</Text>
					</Flex>
				)}
				{entity.remaining_day > 0 && (
					<>
						<Divider my="xs" />
						<Flex justify="space-between" align={'center'}>
							<Text>Payable</Text>
							<Text>{entity.remaining_day} Days </Text>
							<Text>৳ {entity.remaining_day  * entity?.room_price}</Text>
						</Flex>
					</>
				)}
				{entity.remaining_day < 0 && due < 0   && (
					<>
						<Divider my="xs" />
						<Flex justify="space-between"  align={'center'}>
							<Text>Refund</Text>
							<Text>{entity.remaining_day} Days </Text>
							<Text>৳ {entity.remaining_day  * entity?.room_price}</Text>
						</Flex>
					</>
				)}
				<Divider my="xs" />
				{due > 0 && (
					<Flex  c="white" justify="space-between" bg="var(--theme-secondary-color-8)" py="les" px="3xs">
						<Text>Receive</Text>
						<Text>৳ {due}</Text>
					</Flex>
				)}
				{due < 0 && (
					<Flex  c="white" justify="space-between" bg="red" py="les" px="3xs">
						<Text>Refund</Text>
						<Text>৳ {due}</Text>
					</Flex>
				)}

			</Box>
			<Flex justify="space-between" align="center">
				<Flex gap="xs" align="center" />
				<Flex fz="sm" align="center" gap="xs">
					<Button.Group>
						{invoiceEntity?.process === "admitted" && due === 0 && (
							<Button
								w="100%"
								bg="var(--theme-primary-color-6)"
								type="button"
								onClick={handlePrescriptionPosSubmit}
							>
								SETTLED
							</Button>
						)}
						{invoiceEntity?.process === "admitted" && due > 0 && (
							<Button
								w="100%"
								bg="var(--theme-secondary-color-6)"
								type="button"
								onClick={handlePrescriptionPosSubmit}
							>
								RECEIVE
							</Button>
						)}
						{(invoiceEntity?.process === "admitted" ||
							invoiceEntity?.process === "paid") &&
							due < 0 && (
								<Button
									w="100%"
									bg="var(--theme-warn-color-6)"
									type="button"
									onClick={handlePrescriptionPosSubmit}
								>
									REFUND
								</Button>
							)}
						<Button.Group>
							{invoiceEntity?.process === "paid" && (
								<Button
									w="100%"
									bg="var(--theme-primary-color-6)"
									type="button"
									onClick={(e) => handleAdmissionBillDetails(e, invoiceEntity.uid)}
								>
									Print Bill
								</Button>
							)}
							{invoiceEntity?.process === "refund" && (
								<Button
									w="100%"
									bg="var(--theme-warn-color-6)"
									type="button"
									onClick={(e) => handleRefundPrint(e, invoiceEntity.uid)}
								>
									Print Refund
								</Button>
							)}
						</Button.Group>
					</Button.Group>
				</Flex>
			</Flex>

			{invoiceEntity?.process === "paid" && (
				 <AdmissionInvoiceDetailsBN data={printData} ref={printRef} />
			)}
			{invoiceEntity?.process === "refund" && (
				<RefundFromBedBn data={invoicePrintData} ref={invoicePrintRef} />
			)}
		</Box>
	);
}
