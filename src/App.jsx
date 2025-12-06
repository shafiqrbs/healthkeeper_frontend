import AppRoute from "./AppRoute";
import useAutoLogout from "@/hooks/useAutoLogout.js";
// import { useResponsiveScale } from "@hooks/useResponsiveScale";

function App() {
	// useResponsiveScale();
    useAutoLogout()
	return <AppRoute />;
}

export default App;
