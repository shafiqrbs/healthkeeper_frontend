import AppRoute from "./AppRoute";
import useHospitalUserData from "@hooks/useHospitalUserData";

function App() {
	useHospitalUserData();

	return <AppRoute />;
}

export default App;
