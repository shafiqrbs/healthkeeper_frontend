import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useNetwork, useViewportSize } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { Navigate, Outlet } from "react-router-dom";
import { getLoggedInUser } from "@/common/utils";

export default function AdminLayout() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");

	const user = getLoggedInUser();
	const networkStatus = useNetwork();
	const { height } = useViewportSize();

	// check authentication
	if (!user?.id) {
		console.info("Not logged in, redirecting to login page.");
		return <Navigate replace to="/login" />;
	}

	const headerHeight = 42;
	const footerHeight = 58;
	const padding = 0;
	const mainAreaHeight = height - headerHeight - footerHeight - padding;

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-reset-btn-color)"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
				<>
					<CoreHeaderNavbar
						module="core"
						pageTitle={t("ManageCustomer")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							{!matches && (
								<Grid.Col span={6}>
									<Navigation menu="base" subMenu={"baseSubmenu"} mainAreaHeight={mainAreaHeight} />
								</Grid.Col>
							)}
							<Grid.Col span={matches ? 30 : 30}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<Outlet context={{ isOnline: networkStatus.online, mainAreaHeight }} />
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
