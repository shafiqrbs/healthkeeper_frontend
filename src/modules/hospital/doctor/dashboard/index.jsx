import { Box, Grid, Group, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { getInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
import IndexForm from "./form/__IndexForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { useOutletContext } from "react-router-dom";
import _Table from "./_Table";
import { MODULES_PHARMACY } from "@/constants";
import { useEffect } from "react";

const module = MODULES_PHARMACY.STOCK;

export default function Index({ mode = "create" }) {
	const { t } = useTranslation();
	const form = useForm(getInitialValues(t));
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const [opened, { open, close }] = useDisclosure(false);
	const { mainAreaHeight } = useOutletContext();
	const { setPageTitle } = useOutletContext();
	useEffect(() => {
		setPageTitle(t("DoctorDashboard"));
	}, [t, setPageTitle]);
	return (
		<>
			<Box bg="var(--mantine-color-white)" p="xs" className="borderRadiusAll">
				Doctor Dashboard
			</Box>
		</>
	);
}
