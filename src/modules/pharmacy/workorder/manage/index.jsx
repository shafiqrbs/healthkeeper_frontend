import { Box, Flex, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@hospital-components/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { useOutletContext, useParams } from "react-router-dom";
import Update from "../form/Update";
import Create from "../form/Create";
import { getInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";

export default function Index({ mode }) {
	const { t } = useTranslation();
	const form = useForm(getInitialValues(t));

	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const { mainAreaHeight } = useOutletContext();
	const [data, setData] = useState({});

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			fetchSingleWorkorderData();
		}
	}, [id]);

	async function fetchSingleWorkorderData() {
		const response = await getDataWithoutStore({
			url: `${PHARMACY_DATA_ROUTES.API_ROUTES.PURCHASE.VIEW}/${id}`,
		});
		setData(response?.data);
	}

	const isEditMode = mode === "edit";

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
				<>
					<Flex p="16px" w="100%" gap="14px">
						{!matches && (
							<Navigation menu="base" subMenu={"basePharmacySubmenu"} mainAreaHeight={mainAreaHeight} />
						)}
						<Box bg="white" w="100%" p="xs" className="borderRadiusAll">
							<CoreHeaderNavbar
								module="pharmacy"
								pageTitle={t("ManageWorkorder")}
								roles={t("Roles")}
								allowZeroPercentage=""
								currencySymbol=""
							/>
							{isEditMode ? <Update form={form} data={data} /> : <Create form={form} />}
						</Box>
					</Flex>
				</>
			)}
		</>
	);
}
