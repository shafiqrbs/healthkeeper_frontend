import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex, Grid, ScrollArea } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HeaderCarousel from "./common/HeaderCarousel";
import Overview from "./common/Overview";
import QuickBrowse from "./common/QuickBrowse";
import GrandTotalOverview from "./common/GrandTotalOverview";
import SparkLineOverview from "./common/SparkLineOverview";
import HomeSkeleton from "@components/skeletons/HomeSkeleton";
import {useEffect} from "react";
import {getLoggedInHospitalUser, getLoggedInUser, getUserRole} from "@utils/index";
import useHospitalUserData from "@hooks/useHospitalUserData";
import Operator from "@modules/home/operator/Operator";

const ALLOWED_ADMIN_ROLES = [ "admin_hospital", "admin_administrator"];
const ALLOWED_OPERATOR_ROLES = [ "operator_opd", "operator_manager", "operator_emergency"];

export default function Index_oldx({ height }) {
	const progress = useGetLoadingProgress();
	const {userInfo} = useHospitalUserData();
	const userRoles = getUserRole();
	const userId = userInfo?.employee_id;
	return (
		<>
			{progress !== 100 ? (
				<HomeSkeleton height={height} />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={height} />
						{/* ================= carousel part ================== */}
						<Box w="100%">

							{userRoles.some((role) => ALLOWED_OPERATOR_ROLES.includes(role)) && (
								<Operator />
							)}
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
