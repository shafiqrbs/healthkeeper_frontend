import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNetwork, useViewportSize } from "@mantine/hooks";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import useAppLocalStore from "@hooks/useAppLocalStore";
import HomeIndex from "@/modules/home";
import useHospitalUserData from "@hooks/useHospitalUserData";
import { useAuthStore } from "@/store/useAuthStore.js";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { decryptData } from "@utils/crypto.js";
// import { useBrowserHeight } from "@hooks/userBrowserHeight";

const Layout = () => {
	const store = useAppLocalStore();
	useHospitalUserData();
	const { user } = useAppLocalStore();
	const networkStatus = useNetwork();
	const { height } = useViewportSize();
	const location = useLocation();
	const paramPath = location.pathname;

	/*=============================================================================*/
	/*ALL REFERENCE FOR ACCESS DATA*/
	console.log(store)
	const user_jwt = useAuthStore((state) => state.user);
	// const token_jwt = useAuthStore(state => state.token);
	// const config_jwt = useAuthStore(state => state.hospitalConfig);
	// const warehouse_jwt = useAuthStore(state => state.warehouse);
	// console.log(user_jwt,token_jwt,config_jwt,warehouse_jwt)

	// to access user role
	// console.log(user_jwt.access_control_role,user_jwt.android_control_role)

	// update existing data
	// Update Zustand store with new data
	/*useEffect(() => {
        // Top-level field update
        const updateState = useAuthStore.getState().updateState;
        const updateNestedState = useAuthStore.getState().updateNestedState;
        updateState("hospitalConfig", {
            name : 'Rashedul Raju'
        });

        // Nested field update
        updateNestedState("hospitalConfig.account_config", {
            name : 'RB Raju'
        });

    }, []);
    console.log(config_jwt)*/

	// access core product
	// const coreProducts = decryptData(localStorage.getItem("core-products"));
	// console.log(coreProducts)

	// access accounting-transaction-mode
	// const transactionMode = decryptData(localStorage.getItem("accounting-transaction-mode"));
	// console.log(transactionMode)

	// access config-data
	// const configDataJwt = decryptData(localStorage.getItem("config-data"));
	// console.log(configDataJwt)

	// access core-customers
	// const coreCustomers = decryptData(localStorage.getItem("core-customers"));
	// console.log(coreCustomers)

	// access core-users
	// const coreUsers = decryptData(localStorage.getItem("core-users"));
	// console.log(coreUsers)

	/*=============================================================================*/

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
				<Header isOnline={networkStatus.online} mainAreaHeight={mainAreaHeight} />
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
