import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNetwork } from "@mantine/hooks";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import useAppLocalStore from "@hooks/useAppLocalStore";
import HomeIndex from "@/modules/home";
import useHospitalUserData from "@hooks/useHospitalUserData";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const Layout = () => {
	useHospitalUserData();
	const { user } = useAppLocalStore();
	const networkStatus = useNetwork();
	const location = useLocation();
	const paramPath = location.pathname;

	const { headerHeight, footerHeight } = useMainAreaHeight();

	// check authentication
	if (!user?.id) {
		console.info("Not logged in, redirecting to login page.");
		return <Navigate replace to="/login" />;
	}

	return (
		<AppShell padding="0">
			<AppShell.Header height={headerHeight} bg="gray.0">
				<Header isOnline={networkStatus.online} />
			</AppShell.Header>
			<AppShell.Main>
				{paramPath !== "/" ? (
					<Outlet context={{ isOnline: networkStatus.online }} />
				) : (
					<HomeIndex />
				)}
			</AppShell.Main>
			<AppShell.Footer height={footerHeight}>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
};

export default Layout;
