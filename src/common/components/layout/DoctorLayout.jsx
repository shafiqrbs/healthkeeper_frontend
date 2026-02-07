import { Box, Flex, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useNetwork } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import Navigation from "@components/layout/Navigation";
import { Navigate, Outlet } from "react-router-dom";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useState } from "react";

export default function DoctorLayout() {
	const { user } = useAppLocalStore();
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");

	const networkStatus = useNetwork();

	const [ pageTitle, setPageTitle ] = useState(() => t("ManageCustomer"));

	// check authentication
	if (!user?.id) {
		console.info("Not logged in, redirecting to login page.");
		return <Navigate replace to="/login" />;
	}

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
				<Box p="16px">
					<Flex gap="8px">
						{!matches && (
							<Box>
								<Navigation menu="base" />
							</Box>
						)}
						<Box w="100%">
							<Outlet
								context={{
									isOnline: networkStatus.online,
									setPageTitle,
								}}
							/>
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
