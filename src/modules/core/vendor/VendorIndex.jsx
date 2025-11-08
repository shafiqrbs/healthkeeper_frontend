import React from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import VendorTable from "./_VendorTable";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { getVendorFormInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
import Shortcut from "@/modules/shortcut/Shortcut";
import Form from "./form/__Form";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { useOutletContext } from "react-router-dom";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";

function VendorIndex({ mode = "create" }) {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const [opened, { open, close }] = useDisclosure(false);
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
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
								<Box bg="var(--mantine-color-white)" p="xs" className="borderRadiusAll">
									<VendorTable open={open} close={close} />
								</Box>
							</Grid.Col>

							<GlobalDrawer
								opened={opened}
								close={close}
								title={mode === "create" ? t("CreateVendor") : t("UpdateVendor")}
							>
								<Form form={form} mode={mode} close={close} />
							</GlobalDrawer>

							{/* {!matches && (
								<Grid.Col span={2}>
									<Box bg="var(--mantine-color-white)" className="borderRadiusAll" pt="sm">
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

export default VendorIndex;
