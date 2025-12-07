import { Box, Text, ScrollArea, Stack, Button, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";
import { getDataWithoutStore } from "@/services/apiService";

const ALLOWED_BILLING_ROLES = [
	"billing_manager",
	"billing_cash",
	"admin_hospital",
	"operator_emergency",
	"admin_administrator",
];
const PER_PAGE = 500;

export default function Invoice({ transactions }) {
	const { userRoles } = useAppLocalStore();
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const { id, transactionId: selectedTransactionId } = useParams();
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const ipdAllPrintRef = useRef(null);

	const printIPDAll = useReactToPrint({ content: () => ipdAllPrintRef.current });

	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });

	const fetchData = useCallback(
		(roomType = "cabin") => {
			if (roomType === "cabin") {
				dispatch(
					getIndexEntityData({
						url: MASTER_DATA_ROUTES.API_ROUTES.CABIN.INDEX,
						module: "cabin",
						params: { particular_type: "cabin", term: "", page: 1, offset: PER_PAGE },
					})
				);
			} else if (roomType === "bed") {
				dispatch(
					getIndexEntityData({
						url: MASTER_DATA_ROUTES.API_ROUTES.BED.INDEX,
						module: "bed",
						params: { particular_type: "bed", term: "", page: 1, offset: PER_PAGE },
					})
				);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleTest = (transactionId) => {
		navigate(
			`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.VIEW}/${id}/payment/${transactionId}`
		);
	};

	const handlePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${id}`,
		});
		setInvoicePrintData(res.data);
		requestAnimationFrame(invoicePrint);
	};

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Flex bg="var(--theme-primary-color-0)" p="sm" justify="space-between">
				<Text fw={600} fz="sm" py="es" px="xs">
					{t("InvoiceHistory")}
				</Text>
				<Button
					onClick={printIPDAll}
					bg="var(--theme-secondary-color-6)"
					color="white"
					size="compact-xs"
				>
					{t("AllPrint")}
				</Button>
			</Flex>
			{id && transactions.length ? (
				<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 52}>
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
											{item?.process === "Done" && (
												<>
													<Button
														onClick={() =>
															handleTest(
																item.hms_invoice_transaction_id
															)
														}
														size="compact-xs"
														bg="var(--theme-primary-color-6)"
														color="white"
													>
														{t("Show")}
													</Button>
													<Button
														onClick={() => handlePrint(item.hms_invoice_transaction_id)}
														size="compact-xs"
														bg="var(--theme-secondary-color-6)"
														color="white"
													>
														{t("Print")}
													</Button>
												</>
											)}
										</>
									)}
								</Flex>
							</Box>
						))}
					</Stack>
				</ScrollArea>
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
			<InvoicePosBN data={invoicePrintData} ref={invoicePrintRef} />
			{/*<IPDAllPrint data={test} ref={ipdAllPrintRef} />*/}
		</Box>
	);
}
