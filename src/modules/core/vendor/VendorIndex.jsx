import React, { useState } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";

import VendorTable from "./_VendorTable";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { getVendorFormInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
import Shortcut from "@/modules/shortcut/Shortcut";
import Form from "./_Form";

function VendorIndex({ mode }) {
	const { t } = useTranslation();
	const [isRotated, setIsRotated] = useState(false);
	const form = useForm(getVendorFormInitialValues(t));

	const progress = useGetLoadingProgress();

	const gridComponents = [
		{
			span: 20,
			component: (
				<Box bg="white" p="xs" className="borderRadiusAll">
					<VendorTable />
				</Box>
			),
		},
		{
			span: 12,
			component: <Form form={form} mode={mode} />,
		},
	];

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="red"
					size={"sm"}
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
							<Grid.Col span={2}>
								<Navigation module="base" />
							</Grid.Col>
							{(isRotated ? [...gridComponents].reverse() : gridComponents).map(
								({ span, component }, index) => (
									<Grid.Col key={index} span={span}>
										{component}
									</Grid.Col>
								)
							)}
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
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default VendorIndex;
