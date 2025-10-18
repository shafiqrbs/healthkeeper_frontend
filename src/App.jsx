import AppRoute from "./AppRoute";
import useHospitalUserData from "@hooks/useHospitalUserData";
// import { useResponsiveScale } from "@hooks/useResponsiveScale";

function App() {
	// useResponsiveScale();
	useHospitalUserData();

	return <AppRoute />;
}

export default App;
