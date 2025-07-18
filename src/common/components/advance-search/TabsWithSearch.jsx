import { Box, Flex, Tabs, TextInput, FloatingIndicator, Button } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import tabClass from "@assets/css/Tab.module.css";

export default function TabsWithSearch({ expand = true, tabPanels, tabList }) {
	const { t } = useTranslation();
	const [rootRef, setRootRef] = useState(null);
	const [tabValue, setTabValue] = useState(tabList[0]);
	const [controlsRefs, setControlsRefs] = useState({});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	return (
		<Tabs variant="none" value={tabValue} onChange={setTabValue}>
			<Tabs.List p="sm" className={tabClass.list} ref={setRootRef}>
				<Flex w="100%" justify={expand ? "space-between" : "center"}>
					{expand ? (
						<>
							{tabList.map((tab) => (
								<Tabs.Tab
									w="32%"
									key={tab}
									value={tab}
									ref={setControlRef(tab)}
									className={tabClass.tab}
								>
									{t(tab)}
								</Tabs.Tab>
							))}
						</>
					) : (
						<Button variant="filled" size="xs">
							{t(tabList[0])}
						</Button>
					)}
				</Flex>
				<FloatingIndicator
					target={tabValue ? controlsRefs[tabValue] : null}
					parent={rootRef}
					className={tabClass.indicator}
				/>
			</Tabs.List>

			{tabPanels.map((tab) => (
				<Tabs.Panel key={tab.tab} value={tab.tab}>
					<Box py="sm" bg="white">
						<Box p="xs" bg="var(--theme-secondary-color-5)">
							<TextInput name="search" placeholder={t("search")} />
						</Box>
						{tab.component}
					</Box>
				</Tabs.Panel>
			))}
		</Tabs>
	);
}
