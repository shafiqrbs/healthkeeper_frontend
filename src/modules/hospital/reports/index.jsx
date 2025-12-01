import Navigation from "@components/layout/Navigation";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex, Grid, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
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
];

export default function ReportsIndex() {
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
							<Grid.Col span={4} h="100%" bg="white">
								{REPORT_TABS.map((item, index) => (
									<Box
										key={index}
										className={`cursor-pointer ${classes["pressable-card"]}  ${
											location.pathname === item.path ? classes["active-link"] : ""
										}`}
										variant="default"
										onClick={() => handleNavigation(item.value)}
										bg={location.pathname === item.path ? "gray.1" : "#ffffff"}
									>
										<Text
											size="xs"
											py="3xs"
											pl="3xs"
											fw={500}
											c={
												location.pathname === item.path
													? "var(--theme-primary-color-8)"
													: "black"
											}
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
