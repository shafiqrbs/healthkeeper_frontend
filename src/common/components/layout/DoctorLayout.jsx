import { Box, Flex, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useNetwork, useViewportSize } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import Navigation from "@components/layout/Navigation";
import { Navigate, Outlet } from "react-router-dom";
import { getLoggedInUser } from "@/common/utils";
import { useState } from "react";

export default function DoctorLayout() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");

	const user = getLoggedInUser();
	const networkStatus = useNetwork();
	const { height } = useViewportSize();

	const [pageTitle, setPageTitle] = useState(() => t("ManageCustomer"));

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
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-reset-btn-color)"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
				<Box p="8">
					<Flex gap="8">
						{!matches && (
							<Box>
								<Navigation menu="base" mainAreaHeight={mainAreaHeight} />
							</Box>
						)}
						<Box w="100%">
							<Outlet context={{ isOnline: networkStatus.online, mainAreaHeight, setPageTitle }} />
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
