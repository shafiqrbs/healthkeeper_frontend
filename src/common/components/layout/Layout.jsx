import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNetwork } from "@mantine/hooks";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import useConfigData from "@hooks/config-data/useConfigData";
import { getLoggedInUser } from "@/common/utils";
import HomeIndex from "@/modules/home";
import { useMantineScale } from "@/hooks/useMantineScale";
import { useEffect, useState } from "react";
function useBrowserHeight() {
	const [height, setHeight] = useState(window.innerHeight);
	const scale = useMantineScale();

	useEffect(() => {
		const handleResize = () => setHeight(window.innerHeight);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const scaleAdjustments = {
		0.75: 200,
		0.9: 80,
		1.0: 0,
	};
	return height + (scaleAdjustments[scale] ?? 0);
}

const Layout = () => {
	const user = getLoggedInUser();
	const networkStatus = useNetwork();
	//	const { height } = useViewportSize();
	//const { height }  = useState(window.innerHeight);
	const height = useBrowserHeight();
	const scale = useMantineScale();
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
					// <MainDashboard height={mainAreaHeight} />
					<HomeIndex height={mainAreaHeight} />
				)}
			</AppShell.Main>
			<AppShell.Footer height={footerHeight}>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
};

export default Layout;
