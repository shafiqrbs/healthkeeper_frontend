import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IconCalendarWeek, IconUser, IconArrowNarrowRight, IconPrinter } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon, LoadingOverlay } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useEffect, useRef, useState } from "react";
import { MODULES } from "@/constants";
import { capitalizeWords, formatDate } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useSelector } from "react-redux";
import CustomDivider from "@components/core-component/CustomDivider";
import { getDataWithoutStore } from "@/services/apiService";
import AdmissionInvoiceDetailsBN from "@hospital-components/print-formats/admission/AdmissionInvoiceDetailsBN";
import { useReactToPrint } from "react-to-print";
import RefundFromBedBn from "@hospital-components/print-formats/refund/RefundFormBedBN";

const module = MODULES.FINAL_BILLING;
const PER_PAGE = 500;

export default function _Table() {

	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const [selectedPatientId, setSelectedPatientId] = useState(id);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const [printData, setPrintData] = useState(null);
	const printRef = useRef(null);
	const invoicePrint = useReactToPrint({ content: () => printRef.current });


	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const invoiceRefundPrint = useReactToPrint({ content: () => invoicePrintRef.current });



	const handleAdmissionOverview = (id) => {
		setSelectedPatientId(id);
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.FINAL_BILLING.VIEW}/${id}`);
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

	const { records, fetching } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.FINAL_BILLING.INDEX,
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
		filterParams: {
			created: filterData.created,
			term: filterData.keywordSearch,
		},
	});

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

	const handleView = (id) => {
		console.info(id);
	};

	return (
		<Box>
			<Flex gap="sm" p="les" c="white" bg="var(--theme-primary-color-6)" mt="3xs">
				<Text ta="center" fz="sm" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea bg="var(--mantine-color-white)" h={mainAreaHeight - 164} scrollbars="y" px="3xs">
				<LoadingOverlay visible={fetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
				{records?.map((item) => (
					<Grid
						columns={12}
						key={item.id}
						onClick={() => handleAdmissionOverview(item.uid)}
						my="xs"
						bg={
							selectedPatientId === item?.uid
								? "var(--theme-primary-color-1)"
								: "var(--theme-tertiary-color-0)"
						}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={12}>
							<Flex justify="space-between">
								<Text fz="sm" fw={"600"}>
									{item.name}
								</Text>{" "}
								<Flex align="center" gap="les">
									<Text c={item.process === 'paid' ? 'green':'red' } >{capitalizeWords(item.process)}</Text>
									{item.process === 'paid' && (
									<ActionIcon
										variant="filled"
										color="var(--theme-secondary-color-6)"
										radius="xs"
										aria-label="Settings"
										onClick={(e) => handleAdmissionBillDetails(e, item.uid)}
									>
										<IconPrinter size={14} stroke={1.5} />
									</ActionIcon>
									)}
									{item.process === 'refund' && (
									<ActionIcon
										variant="filled"
										color="red"
										radius="xs"
										aria-label="Settings"
										onClick={(e) => handleRefundPrint(e, item.uid)}
									>
										<IconPrinter size={14} stroke={1.5} />
									</ActionIcon>
									)}
								</Flex>
							</Flex>
						</Grid.Col>
						<CustomDivider />
						<Grid.Col span={6}>
							<Flex align="center" gap="3xs">
								<IconCalendarWeek size={16} stroke={1.5} />
								<Text
									fz="sm"
									onClick={() => handleView(item?.id)}
									className="activate-link text-nowrap"
								>
									{formatDate(item?.created_at)}
								</Text>
							</Flex>
							<Flex align="center" gap="3xs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.mobile}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={6}>
							<Flex justify="space-between" align="center" gap="3xs">
								<Box>
									<Text fz="sm">{item.patient_id}</Text>
									<Text fz="sm">{item.invoice}</Text>
								</Box>
								<Button.Group>
									<ActionIcon
										variant="filled"
										onClick={() => handleAdmissionOverview(item.uid)}
										color="var(--theme-primary-color-6)"
										radius="xs"
										aria-label="Settings"
									>
										<IconArrowNarrowRight style={{ width: "70%", height: "70%" }} stroke={1.5} />
									</ActionIcon>
								</Button.Group>
							</Flex>
						</Grid.Col>
					</Grid>
				))}
			</ScrollArea>

			{printData && <AdmissionInvoiceDetailsBN data={printData} ref={printRef} />}
			<RefundFromBedBn data={invoicePrintData} ref={invoicePrintRef} />
		</Box>
	);
}
