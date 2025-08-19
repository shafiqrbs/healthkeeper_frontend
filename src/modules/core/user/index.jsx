import { Box, Grid } from "@mantine/core";
import _Table from "./_Table.jsx";
import { useTranslation } from "react-i18next";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar.jsx";
import Navigation from "../shared/Navigation.jsx";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton.jsx";
import { MODULES } from "@/constants";
import Form from "./form/Form.jsx";
import { useSelector } from "react-redux";

const module = MODULES.USER;

export default function Index({ mode = "create" }) {
	const { t } = useTranslation();
	const insertType = useSelector((state) => state.crud[module].insertType);

	const progress = useGetLoadingProgress();

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box>
					<CoreHeaderNavbar
						pageTitle={t("ManageUser")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
						module="core"
					/>
					<Box p={"8"}>
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<Navigation module={module} />
							</Grid.Col>
							{insertType === "create" && (
								<Grid.Col span={14}>
									<Box bg="white" p="xs" className="borderRadiusAll">
										<_Table module={module} />
									</Box>
								</Grid.Col>
							)}
							<Grid.Col span={insertType === "create" ? 9 : 23}>
								<Form module={module} mode={mode} />
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}
