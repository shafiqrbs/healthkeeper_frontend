import { Box, Flex, Tabs, TextInput, FloatingIndicator, Button } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import tabClass from "@assets/css/Tab.module.css";
import { IconSearch } from "@tabler/icons-react";

const DEFAULT_ACTIVE_COLOR = "var(--theme-primary-color-6)";

export default function TabsWithSearch({
	expand = true,
	tabPanels,
	tabList,
	hideSearchbar = false,
	searchbarContainerBg = "var(--theme-secondary-color-5)",
}) {
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
			{tabList.length > 1 && (
				<Tabs.List px="sm" py="xxxs" className={tabClass.list} ref={setRootRef}>
					<Flex w="100%" justify={expand ? "space-between" : "center"}>
						{expand ? (
							<>
								{tabList.map((tab, index) => (
									<Tabs.Tab
										w="32%"
										key={tab}
										value={tab}
										ref={setControlRef(tab)}
										className={tabClass.tab}
										styles={{
											tab: {
												backgroundColor:
													tabValue === tab
														? tabPanels[index].activeColor || DEFAULT_ACTIVE_COLOR
														: "transparent",
											},
										}}
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
			)}

			{tabPanels.map((tab) => (
				<Tabs.Panel key={tab.tab} value={tab.tab}>
					<Box py={hideSearchbar || tabList.length === 1 ? "0" : "xs"} bg="white">
						{!hideSearchbar && (
							<Box p="xs" bg={searchbarContainerBg}>
								<TextInput
									leftSection={<IconSearch size={18} />}
									name="search"
									placeholder={t("search")}
								/>
							</Box>
						)}
						{tab.component}
					</Box>
				</Tabs.Panel>
			))}
		</Tabs>
	);
}
