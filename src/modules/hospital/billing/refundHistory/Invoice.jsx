import {
	Box,
	Text,
	ScrollArea,
	Stack,
	Button,
	Flex,
	Grid,
	ActionIcon,
	LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { formatDate } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import {
	IconArrowNarrowRight,
	IconCalendarWeek,
	IconUser,
	IconBuildingHospital,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";
import {modals} from "@mantine/modals";
import {getDataWithoutStore} from "@/services/apiService";
import RefundPosBN from "@hospital-components/print-formats/refund/RefundPosBN";
import RefundFormInvestigationBN from "@hospital-components/print-formats/refund/RefundFormInvestigationBN";

const ALLOWED_BILLING_ROLES = [
	"billing_manager",
	"billing_cash",
	"admin_hospital",
	"admin_administrator",
	"operator_opd",
	"operator_manager",
];

export default function Invoice({ setRefetchBillingKey,entity }) {
	const { userRoles } = useAppLocalStore();
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const { id, transactionId: selectedTransactionId } = useParams();
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const ipdAllPrintRef = useRef(null);

	const item = entity;
	const transactions = entity?.invoice_transaction_refund || [];
	const printIPDAll = useReactToPrint({ content: () => ipdAllPrintRef.current });

	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });

	const handleTest = (transactionId) => {
		navigate(
			`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.REFUND.VIEW}/${id}/payment/${transactionId}`
		);
	};

	const handleApprove = async (id) => {

		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleApproveConfirm(id),
		});
	}

	const handleApproveConfirm = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.APPROVE}/${id}`,
		});
		setRefetchBillingKey(((prev) => prev +1));
	};

	const handlePrint = async (id) => {

		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.PRINT}/${id}`,
		});
		setInvoicePrintData(res.data);
		requestAnimationFrame(invoicePrint);
	};



	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Flex bg="var(--theme-primary-color-0)" p="sm" justify="space-between">
				<Text fw={600} fz="sm" py="es" px="xs">
					{t("RefundHistory")}
				</Text>
			</Flex>
			{id && transactions.length ? (
				<>
					<Grid
						columns={12}
						key={item.id}
						my="xs"
						bg={"var(--theme-secondary-color-2)"}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={6}>
							<Flex align="center" gap="3xs">
								<IconCalendarWeek size={16} stroke={1.5} />
								<Text fz="sm" className="activate-link text-nowrap">
									{formatDate(item?.created_at)}
								</Text>
							</Flex>
							<Flex align="center" gap="3xs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.patient_id}</Text>
							</Flex>
							<Flex align="center" gap="3xs">
								<IconBuildingHospital size={16} stroke={1.5} />
								<Text fz="sm">{item.mode_name}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={6}>
							<Flex justify="space-between" align="center" gap="3xs">
								<Box>
									<Text fz="sm">{item.name}</Text>
									<Text fz="sm">{item.mobile}</Text>
									<Text fz="sm">{item.payment_mode_name}</Text>
								</Box>
								<Button.Group>
									<ActionIcon
										variant="filled"
										color="var(--theme-primary-color-6)"
										radius="xs"
										aria-label="Settings"
									>
										<IconArrowNarrowRight
											style={{ width: "70%", height: "70%" }}
											stroke={1.5}
										/>
									</ActionIcon>
								</Button.Group>
							</Flex>
						</Grid.Col>
					</Grid>
					<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 138}>
						<LoadingOverlay
							visible={isSubmitting}
							zIndex={1000}
							overlayProps={{ radius: "sm", blur: 2 }}
						/>
						<Stack className="form-stack-vertical" p="xs" pos="relative">
							{transactions?.map((item, index) => (
								<Box
									key={index}
									className="borderRadiusAll"
									bg={
										selectedTransactionId == item.hms_invoice_transaction_id
											? "var(--theme-primary-color-1)"
											: "white"
									}
									p="sm"
								>
									<Grid columns={16} gap={0} gutter="xs">
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Created:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{item?.created}</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Mode:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{item?.mode}</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Amount:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{Number(item?.total, 2)}</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Status:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{item?.process}</Text>
										</Grid.Col>
									</Grid>
									<Flex align="center" gap="sm" mt={"md"} justify="flex-end">
										{userRoles.some((role) =>
											ALLOWED_BILLING_ROLES.includes(role)
										) && (
											<>
											{item?.process === "In-progress" &&(
													<Button
														onClick={() =>
															handleApprove(
																item.id
															)
														}
														size="xs"
														bg="var(--theme-primary-color-6)"
														color="white"
													>
														{t("Confirm")}
													</Button>
												)}
												<Button
													onClick={() =>
														handlePrint(
															item.id
														)
													}
													size="xs"
													bg="var(--theme-delete-color)"
													color="white"
												>
													{t("Print")}
												</Button>

												<Button
													onClick={() =>
														handleTest(
															item.hms_invoice_transaction_id
														)
													}
													size="xs"
													bg="var(--theme-secondary-color-6)"
													color="white"
												>
													{t("View")}
												</Button>
											</>
										)}
									</Flex>
								</Box>
							))}
						</Stack>
					</ScrollArea>
				</>
			) : (
				<Stack
					h={mainAreaHeight - 52}
					bg="var(--mantine-color-body)"
					align="center"
					justify="center"
					gap="md"
				>
					<Box>{t("NoPatientSelected")}</Box>
				</Stack>
			)}
			<RefundFormInvestigationBN data={invoicePrintData} ref={invoicePrintRef} />
			{/*<IPDAllPrint data={test} ref={ipdAllPrintRef} />*/}
		</Box>
	);
}
