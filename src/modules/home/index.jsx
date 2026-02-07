import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HomeSkeleton from "@components/skeletons/HomeSkeleton";
import useAppLocalStore from "@/common/hooks/useAppLocalStore";
import OperatorBoard from "@/modules/home/operator/OperatorBoard";
import AdminBoard from "./operator/AdminBoard";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const ALLOWED_ADMIN_ROLES = [ "admin_hospital", "admin_administrator" ];
const ALLOWED_OPERATOR_ROLES = [ "operator_opd", "operator_manager", "operator_emergency" ];
const ALLOWED_OPD_DOCTOR_ROLES = [ "doctor_opd" ];
const ALLOWED_IPD_DOCTOR_ROLES = [ "doctor_ipd" ];
const ALLOWED_RS_RP_DOCTOR_ROLES = [ "admin_doctor" ];
const ALLOWED_LAB_ROLES = [ "lab_operator", "lab_assistant", "doctor_lab" ];
const ALLOWED_EMERGENCY_ROLES = [ "doctor_emergency", "operator_emergency" ];

export default function Index() {
	const { mainAreaHeight } = useMainAreaHeight();
	const { userRoles } = useAppLocalStore();
	const progress = useGetLoadingProgress();
	const navigate = useNavigate();

	if (userRoles.some((role) => ALLOWED_RS_RP_DOCTOR_ROLES.includes(role))) {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.DASHBOARD.RP_RS);
		return null;
	}
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
	return (
		<>
			{progress !== 100 ? (
				<HomeSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" />
						{/* ================= carousel part ================== */}
						<Box w="100%" h={mainAreaHeight}>
							{userRoles.some((role) => ALLOWED_OPERATOR_ROLES.includes(role)) && (
								<OperatorBoard />
							)}
							{userRoles.some((role) => ALLOWED_ADMIN_ROLES.includes(role)) && (
								<AdminBoard />
							)}
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
