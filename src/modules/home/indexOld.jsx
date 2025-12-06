import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex, Grid, ScrollArea } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HeaderCarousel from "./common/HeaderCarousel";
import Overview from "./common/Overview";
import QuickBrowse from "./common/QuickBrowse";
import GrandTotalOverview from "./common/GrandTotalOverview";
import SparkLineOverview from "./common/SparkLineOverview";
import HomeSkeleton from "@components/skeletons/HomeSkeleton";
import { useEffect } from "react";
import { getLoggedInHospitalUser } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import useHospitalUserData from "@hooks/useHospitalUserData";
import OperatorBoard from "./operator/OperatorBoard";
import AdminBoard from "./operator/AdminBoard";

const ALLOWED_ADMIN_ROLES = ["admin_hospital", "admin_administrator"];
const ALLOWED_OPERATOR_ROLES = ["operator_opd", "operator_manager", "operator_emergency"];

export default function IndexOld({ height }) {
	const { userRoles } = useAppLocalStore();
	const progress = useGetLoadingProgress();
	const { userInfo } = useHospitalUserData();
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
						<Box>
							<HeaderCarousel />
							<ScrollArea mt="md" scrollbars="y" type="never" h={height - 146}>
								{/* ================= overviews part ================== */}
								<Grid columns={40} gutter={{ base: "md" }}>
									<Grid.Col span={20}>
										<QuickBrowse />
										{/*{userRoles.some((role) => ALLOWED_OPERATOR_ROLES.includes(role)) && (
											<QuickBrowse />
										)}*/}
									</Grid.Col>
									<Grid.Col span={20}>
										<Overview />
									</Grid.Col>
									<Grid.Col span={20}>
										<GrandTotalOverview />
									</Grid.Col>
									<Grid.Col span={20}>
										<SparkLineOverview />
									</Grid.Col>
								</Grid>
							</ScrollArea>
							<Box w="100%">
								{userRoles.some((role) =>
									ALLOWED_OPERATOR_ROLES.includes(role)
								) && <OperatorBoard />}
								{userRoles.some((role) => ALLOWED_ADMIN_ROLES.includes(role)) && (
									<AdminBoard />
								)}
							</Box>
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
