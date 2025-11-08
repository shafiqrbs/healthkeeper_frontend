import { Box, Flex, Grid, ScrollArea, Stack, Text } from "@mantine/core";
import TabSubHeading from "@hospital-components/TabSubHeading";
import BillingTable from "@hospital-components/BillingTable";
import { useOutletContext, useParams } from "react-router-dom";
import BillingSummary from "@hospital-components/BillingSummary";
import BillingActions from "@hospital-components/BillingActions";
import { useState } from "react";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { MODULES } from "@/constants";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useTranslation } from "react-i18next";
import Table from "./_Table";

const billing = {
	cabinCharge: 1000,
	otherCharge: 2000,
	testCharge: 3000,
	medicineCharge: 4000,
	totalCharge: 10000,
};

const billingSummary = {
	totalAmount: 10000,
	discount: 10000,
	grandTotal: 0,
	receivedAmount: 0,
	receivable: 3220,
};

const finalBillDetails = [
	{ particular: "Cabin - 1", unitPrice: 1000, qty: 5, subtotal: "৳ 10000" },
	{ particular: "ICU - 202", unitPrice: 5000, qty: 5, subtotal: "৳ 10000" },
	{ particular: "CBC", unitPrice: 400, qty: 5, subtotal: "৳ 1200" },
];

const module = MODULES.FINAL_BILLING;

export default function Index() {
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const { t } = useTranslation();

	const rows = finalBillDetails.map((item, index) => (
		<Table.Tr key={index}>
			<Table.Td>{item.particular}</Table.Td>
			<Table.Td>৳ {item.unitPrice}</Table.Td>
			<Table.Td>{item.qty}</Table.Td>
			<Table.Td>{item.subtotal}</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box h={mainAreaHeight} p="xs">
					<Flex w="100%" gap="xs">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid columns={24} gutter="xs" w="100%" h="100%" styles={{ inner: { height: "100%" } }}>
							<Grid.Col span={6}>
								<Box bg="var(--mantine-color-white)" p="xs" h="100%">
									<Text fw={600} mb="sm" fz="sm">
										{t("PatientInformation")}
									</Text>
									<TabsWithSearch
										tabList={["list"]}
										module={module}
										tabPanels={[
											{
												tab: "list",
												component: (
													<Table
														selectedId={id}
														isOpenPatientInfo={isOpenPatientInfo}
														setIsOpenPatientInfo={setIsOpenPatientInfo}
													/>
												),
											},
										]}
									/>
								</Box>
							</Grid.Col>
							<Grid.Col span={8}>
								<Box bg="var(--mantine-color-white)" className="borderRadiusAll" h="100%">
									<TabSubHeading title="Final Bill" />
									<BillingTable data={billing} />
								</Box>
							</Grid.Col>
							<Grid.Col span={10}>
								<Stack
									bg="var(--mantine-color-white)"
									justify="space-between"
									className="borderRadiusAll"
									h="100%"
									w="100%"
								>
									<Box>
										<TabSubHeading title="Final Bill Details" />
										<BillingSummary data={billingSummary} />
									</Box>
									<Box p="xs" bg="var(--mantine-color-white)">
										<Box>
											<BillingActions />
										</Box>
									</Box>
								</Stack>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
