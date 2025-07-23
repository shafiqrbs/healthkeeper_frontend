import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import VendorTable from "./_Table";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { getInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
// import Shortcut from "@/modules/shortcut/Shortcut";
import IndexForm from "./form/__IndexForm";
import GlobalDrawer from "@/common/components/drawers/GlobalDrawer";
import { useOutletContext } from "react-router-dom";

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
						pageTitle={t("ManageVendor")}
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
									<VendorTable open={open} close={close} />
								</Box>
							</Grid.Col>

							<GlobalDrawer
								opened={opened}
								close={close}
								title={mode === "create" ? t("CreateVendor") : t("UpdateVendor")}
							>
								<IndexForm form={form} mode={mode} close={close} />
							</GlobalDrawer>

							{/* {!matches && (
								<Grid.Col span={2}>
									<Box bg="white" className="borderRadiusAll" pt="sm">
										<Shortcut
											form={form} // have to reset the form in shortcut
											FormSubmit="EntityFormSubmit"
											Name="name"
											inputType="select"
										/>
									</Box>
								</Grid.Col>
							)} */}
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
