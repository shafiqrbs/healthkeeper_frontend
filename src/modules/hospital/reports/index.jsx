import Navigation from "@components/layout/Navigation";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex, Grid, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import classes from "@assets/css/Navigation.module.css";
import DetailsRenderer from "./DetailsRenderer";

const REPORT_TABS = [
	{
		label: "Dashboard Daily Summary",
		value: "dashboard-daily-summary",
		allowedGroups: ["role_domain", "admin_administrator", "operator_manager", "operator_emergency", "operator_opd"],
	},
	{
		label: "Patient Ticket",
		value: "patient-ticket",
		allowedGroups: ["role_domain", "admin_administrator", "operator_manager", "operator_emergency", "operator_opd"],
	},
	{
		label: "Stock item history",
		value: "stock-item-history",
		allowedGroups: ["pharmacy_manager","pharmacy_pharmacist"],
	},

];

export default function ReportsIndex() {
	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab");
	const navigate = useNavigate();
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();

	const handleNavigation = (value) => {
		navigate(`/hospital/reports?tab=${value}`);
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24}>
							<Grid.Col mt={9} span={4} bg="white">
								{REPORT_TABS.map((item, index) => (
									<Box
										key={index}
										className={`cursor-pointer ${classes["pressable-card"]}  ${
											tab === item.value ? classes["active-link"] : ""
										}`}
										variant="default"
										onClick={() => handleNavigation(item.value)}
										bg={tab === item.value ? "gray.1" : "#ffffff"}
									>
										<Text
											size="xs"
											py="3xs"
											pl="3xs"
											fw={500}
											c={tab === item.value ? "var(--theme-primary-color-8)" : "black"}
										>
											{t(item.label)}
										</Text>
									</Box>
								))}
							</Grid.Col>
							<Grid.Col span={20}>
								<DetailsRenderer />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
