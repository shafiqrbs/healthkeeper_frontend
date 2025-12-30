import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HomeSkeleton from "@components/skeletons/HomeSkeleton";
import useAppLocalStore from "@/common/hooks/useAppLocalStore";
import OperatorBoard from "@/modules/home/operator/OperatorBoard";
import AdminBoard from "./operator/AdminBoard";
import { MODULES } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

const ALLOWED_ADMIN_ROLES = ["admin_hospital", "admin_administrator"];
const ALLOWED_OPERATOR_ROLES = ["operator_opd", "operator_manager", "operator_emergency"];
const ALLOWED_OPD_DOCTOR_ROLES = ["doctor_opd"];
const ALLOWED_IPD_DOCTOR_ROLES = ["doctor_ipd"];
const ALLOWED_LAB_ROLES = ["lab_operator", "lab_assistant", "doctor_lab"];
const ALLOWED_EMERGENCY_ROLES = ["doctor_emergency", "operator_emergency"];
const module = MODULES.VISIT;
export default function Index({ height }) {
	const { userRoles } = useAppLocalStore();
	const progress = useGetLoadingProgress();
	const navigate = useNavigate();

	if (userRoles.some((role) => ALLOWED_OPD_DOCTOR_ROLES.includes(role))) {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX);
		return null;
	}
	if (userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role))) {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.INDEX);
		return null;
	}
	if (userRoles.some((role) => ALLOWED_EMERGENCY_ROLES.includes(role))) {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX);
		return null;
	}
	if (userRoles.some((role) => ALLOWED_IPD_DOCTOR_ROLES.includes(role))) {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX);
		return null;
	}
	console.log(userRoles)

	return (
		<>
			{progress !== 100 ? (
				<HomeSkeleton height={height} />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={height} />
						{/* ================= carousel part ================== */}
						<Box w="100%" mainAreaHeight={height}>
							{userRoles.some((role) => ALLOWED_OPERATOR_ROLES.includes(role)) && (
								<OperatorBoard height={height} />
							)}
							{userRoles.some((role) => ALLOWED_ADMIN_ROLES.includes(role)) && (
								<AdminBoard height={height} />
							)}
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
