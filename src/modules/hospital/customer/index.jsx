import { Box, Grid, Progress } from "@mantine/core";
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
import { MODULES } from "@/constants";

const module = MODULES.CUSTOMER;

export default function Index({ mode = "create" }) {
	const { t } = useTranslation();
	const form = useForm(getInitialValues(t));
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const [opened, { open, close }] = useDisclosure(false);
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
				<>
					<CoreHeaderNavbar
						module="core"
						pageTitle={t("ManageCustomer")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							{!matches && (
								<Grid.Col span={2}>
									<Navigation module="base" mainAreaHeight={mainAreaHeight} />
								</Grid.Col>
							)}

							<Grid.Col span={matches ? 36 : 34}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<_Table module={module} open={open} close={close} />
								</Box>
							</Grid.Col>

							<GlobalDrawer
								opened={opened}
								close={close}
								title={mode === "create" ? t("CreateCustomer") : t("UpdateCustomer")}
							>
								<IndexForm module={module} form={form} mode={mode} close={close} />
							</GlobalDrawer>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
