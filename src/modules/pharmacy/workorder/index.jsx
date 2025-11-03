import { Box, Flex, Progress } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import Navigation from "@components/layout/Navigation";
import { useOutletContext } from "react-router-dom";
import { MODULES_PHARMACY } from "@/constants";

import Table from "./_Table";
import CoreHeaderNavbar from "@hospital-components/CoreHeaderNavbar";
import {useTranslation} from "react-i18next";

const module = MODULES_PHARMACY.WORKORDER;

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const { mainAreaHeight } = useOutletContext();

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
							<Navigation menu="base" subMenu={"basePharmacySubmenu"} mainAreaHeight={mainAreaHeight} />
						)}
						<Box bg="white" p="xs" className="borderRadiusAll" w="100%">
							<CoreHeaderNavbar
								module="pharmacy"
								pageTitle={t("ManageWorkorder")}
								roles={t("Roles")}
								allowZeroPercentage=""
								currencySymbol=""
							/>
							<Table module={module} />
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
