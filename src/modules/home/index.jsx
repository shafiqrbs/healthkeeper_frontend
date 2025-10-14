import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HomeSkeleton from "@components/skeletons/HomeSkeleton";
import { getUserRole } from "@utils/index";
import OperatorBoard from "@/modules/home/operator/OperatorBoard";
import AdminBoard from "./operator/AdminBoard";

const ALLOWED_ADMIN_ROLES = ["admin_hospital", "admin_administrator"];
const ALLOWED_OPERATOR_ROLES = ["operator_opd", "operator_manager", "operator_emergency"];

export default function Index({ height }) {
	const progress = useGetLoadingProgress();
	const userRoles = getUserRole();

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
							{userRoles.some((role) => ALLOWED_OPERATOR_ROLES.includes(role)) && <OperatorBoard height={height} />}
							{userRoles.some((role) => ALLOWED_ADMIN_ROLES.includes(role)) && <AdminBoard height={height} />}
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
