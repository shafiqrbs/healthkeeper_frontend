import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNetwork, useViewportSize } from "@mantine/hooks";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import MainDashboard from "@modules/dashboard/MainDashboard";
import useConfigData from "@hooks/config-data/useConfigData";
import { getLoggedInUser } from "@/common/utils";

const Layout = () => {
	const user = getLoggedInUser();
	const networkStatus = useNetwork();
	const { height } = useViewportSize();
	const location = useLocation();
	const paramPath = location.pathname;
	const { configData } = useConfigData();

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
		<AppShell padding="0">
			<AppShell.Header height={headerHeight} bg="gray.0">
				<Header isOnline={networkStatus.online} configData={configData} />
			</AppShell.Header>
			<AppShell.Main>
				{paramPath !== "/" ? (
					<Outlet context={{ isOnline: networkStatus.online, mainAreaHeight }} />
				) : (
					<MainDashboard height={mainAreaHeight} />
				)}
			</AppShell.Main>
			<AppShell.Footer height={footerHeight}>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
};

export default Layout;
