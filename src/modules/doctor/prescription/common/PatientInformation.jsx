import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { Box, Flex, SegmentedControl, Text } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PatientInformation() {
	const { t } = useTranslation();
	const [rootRef, setRootRef] = useState(null);
	const [tabValue, setTabValue] = useState("new");
	const [controlsRefs, setControlsRefs] = useState({});
	return (
		<Box>
			<Flex justify="space-between" align="center">
				<Text>{t("patientInformation")}</Text>
				<SegmentedControl
					size="xs"
					color="var(--theme-primary-color-6)"
					data={["List", "New"]}
					styles={{
						root: { backgroundColor: "var(--theme-secondary-color-3)" },
						control: { width: "60px" },
					}}
				/>
			</Flex>
			<TabsWithSearch
				tabValue={tabValue}
				setTabValue={setTabValue}
				rootRef={rootRef}
				setRootRef={setRootRef}
				controlsRefs={controlsRefs}
				setControlsRefs={setControlsRefs}
				newChild={<div>New</div>}
				reportChild={<div>Report</div>}
				reVisitChild={<div>Re-Visit</div>}
			/>
		</Box>
	);
}
