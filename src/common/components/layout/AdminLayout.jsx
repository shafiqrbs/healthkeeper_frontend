import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useNetwork } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { Navigate, Outlet } from "react-router-dom";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useState } from "react";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

export default function AdminLayout() {
	const { mainAreaHeight } = useMainAreaHeight()
	const { user } = useAppLocalStore();
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");

	const networkStatus = useNetwork();

	const [ pageTitle, setPageTitle ] = useState(() => t("ManageCustomer"));

	// check authentication
	if (!user?.id) {
		console.info("Not logged in, redirecting to login page.");
		return <Navigate replace to="/login" />;
	}

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
						pageTitle={pageTitle}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							{!matches && (
								<Grid.Col span={6}>
									<Navigation
										menu="base"
										subMenu={"baseSubmenu"}
									/>
								</Grid.Col>
							)}
							<Grid.Col span={matches ? 30 : 30}>
								<Outlet
									context={{
										isOnline: networkStatus.online,
										setPageTitle,
										mainAreaHeight,
									}}
								/>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
