import { Box, Flex, Tabs, TextInput, FloatingIndicator, Button, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import tabClass from "@assets/css/Tab.module.css";
import { IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";

const DEFAULT_ACTIVE_COLOR = "var(--theme-primary-color-6)";

export default function TabsWithSearch({
	expand = true,
	tabPanels,
	tabList,
	hideSearchbar = false,
	searchbarContainerBg = "var(--theme-secondary-color-5)",
	tabWidth = "32%",
	leftSection = null,
	showDatePicker = true,
	rightSection = null,
}) {
	const { t } = useTranslation();
	const [rootRef, setRootRef] = useState(null);
	const [tabValue, setTabValue] = useState(tabList[0]);
	const [controlsRefs, setControlsRefs] = useState({});
	const [date, setDate] = useState(null);

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const handleDateChange = (date) => {
		setDate(date);
	};

	return (
		<Tabs variant="none" value={tabValue} onChange={setTabValue} className="borderRadiusAll">
			<ScrollArea scrollbars="x" type="hover" bg="var(--theme-primary-color-0)">
				{tabList.length > 1 && (
					<Tabs.List px="sm" py="xxxs" className={tabClass.list} ref={setRootRef}>
						<Flex w="100%" justify={expand ? "space-between" : "center"}>
							{leftSection}
							{expand ? (
								<>
									{tabList.map((tab, index) => (
										<Tabs.Tab
											w={tabWidth}
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
									{rightSection}
								</>
							) : (
								<Button variant="filled" bg="var(--theme-primary-color-6)" w="100%" size="xs">
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
			</ScrollArea>

			{tabPanels.map((tab) => (
				<Tabs.Panel key={tab.tab} value={tab.tab}>
					<Box py={hideSearchbar || tabList.length === 1 ? "0" : "xs"} bg="white">
						{!hideSearchbar && (
							<Flex gap="les" p="xs" bg={searchbarContainerBg}>
								{showDatePicker && (
									<DateInput
										clearable
										name="created"
										placeholder="Select Date"
										value={date}
										onChange={handleDateChange}
										w={280}
									/>
								)}
								<TextInput
									w="100%"
									leftSection={<IconSearch size={18} />}
									name="search"
									placeholder={t("search")}
								/>
							</Flex>
						)}
						{tab.component}
					</Box>
				</Tabs.Panel>
			))}
		</Tabs>
	);
}
