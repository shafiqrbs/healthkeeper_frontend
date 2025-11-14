import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import Invoice from "./Invoice";
import InvoiceDetails from "./InvoiceDetails";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";

const module = MODULES.BILLING;

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [diagnosticReport, setDiagnosticReport] = useState([]);
	const [refetchBillingKey, setRefetchBillingKey] = useState(0);

	useEffect(() => {
		if (id) {
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.INDEX}/${id}`,
				});
				setDiagnosticReport(res?.data);
			})();
		}
	}, [id, refetchBillingKey]);

	const entity = diagnosticReport || {};
	const  investigations = entity?.invoice_particular||[];
	const  transactions = entity?.invoice_transaction||[];


	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="2">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" gutter="2" columns={24}>
							<Grid.Col span={6} pos="relative" className="animate-ease-out">
								<Box px="sm" py="md" bg="var(--mantine-color-white)">
									<Text fw={600} fz="sm">
										{t("PatientInformation")}
									</Text>
								</Box>
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
							</Grid.Col>
							<Grid.Col span={18} className="animate-ease-out">
								<Grid columns={18} gutter="2">
									<Grid.Col span={6} className="animate-ease-out">
										<Invoice transactions={transactions}  setRefetchBillingKey={setRefetchBillingKey} />
									</Grid.Col>
									<Grid.Col span={12}>
										<InvoiceDetails entity={entity} />
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
