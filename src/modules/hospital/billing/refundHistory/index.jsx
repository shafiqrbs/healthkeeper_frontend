import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, SegmentedControl, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import Invoice from "./Invoice";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES_CORE } from "@/constants";

const module = MODULES_CORE.REFUND;

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [diagnosticReport, setDiagnosticReport] = useState([]);
	const [refetchBillingKey, setRefetchBillingKey] = useState(0);
	const [type, setType] = useState("opd");

	useEffect(() => {
		if (id) {
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.REFUND_HISTORY.INDEX}/${id}`,
				});
				setDiagnosticReport(res?.data);
			})();
		}
	}, [id, refetchBillingKey]);
	const entity = diagnosticReport || {};
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
								<TabsWithSearch
									tabList={["list"]}
									module={module}
									tabPanels={[
										{
											tab: "list",
											component: (
												<Table
													patient_mode={type}
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
									<Grid.Col span={18} className="animate-ease-out">
										<Invoice setRefetchBillingKey={setRefetchBillingKey} entity={entity} />
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
