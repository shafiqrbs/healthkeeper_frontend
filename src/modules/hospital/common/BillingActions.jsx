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
import {useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import RefundFormInvestigationBN from "@hospital-components/print-formats/refund/RefundFormInvestigationBN";
import RefundFromBedBn from "@hospital-components/print-formats/refund/RefundFormBedBN";
import IPDInvoicePosBn from "@hospital-components/print-formats/ipd/IPDInvoicePosBN";

export default function BillingActions({entity}) {
	const { t } = useTranslation();
	const { id } = useParams();
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const [investigationRecords, setInvestigationRecords] = useState([]);
	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });
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
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.VIEW}/${id}/final-bill-process`,
		});
		setInvoicePrintData(res);
	};

	useEffect(() => {
		if(invoicePrintData){
			invoicePrint();
		}
	}, [invoicePrintData]);

	const receive = entity?.remaining_day * entity?.room_price

	return (
		<Box p="xs" mt="xs" bg="var(--theme-tertiary-color-0)">
			<Flex justify="space-between" align="center">
				<Flex fz="sm" align="center" gap="xs">
				</Flex>
				<Flex gap="xs" align="center">
					<Box bg="var(--mantine-color-white)" px="xs" py="les" className="borderRadiusAll">
						<Text fz="sm" fw={600} style={{ textWrap: "nowrap" }}>
							{t("Amount")} ৳ {receive}
						</Text>
					</Box>
				</Flex>
			</Flex>
			<Button.Group mt="xs">
				{entity?.process === 'admitted' && receive === 0 && (
					<Button  w="100%" bg="var(--theme-primary-color-6)" type="button" onClick={handlePrescriptionPosSubmit}>PAID</Button>
				)}
				{entity?.process === 'admitted' && receive > 0 && (
					<Button  w="100%" bg="var(--theme-secondary-color-6)" type="button" onClick={handlePrescriptionPosSubmit}>RECEIVE</Button>
				)}
				{entity?.process === 'admitted' && receive < 0 && (
					<Button  w="100%" bg="var(--theme-warn-color-6)" type="button" onClick={handlePrescriptionPosSubmit}>REFUND</Button>
				)}
			</Button.Group>
			{ receive >= 0 ? <IPDInvoicePosBn data={invoicePrintData?.data} ref={invoicePrintRef} /> : <RefundFromBedBn data={invoicePrintData?.data} ref={invoicePrintRef} /> }
		</Box>
	);
}
