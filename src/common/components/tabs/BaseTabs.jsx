import { Flex, Tabs, FloatingIndicator, Button, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import tabClass from "@assets/css/Tab.module.css";

const DEFAULT_ACTIVE_COLOR = "var(--theme-primary-color-6)";

export default function BaseTabs({ width, expand = true, tabList, tabValue, setTabValue }) {
	const { t } = useTranslation();
	const [rootRef, setRootRef] = useState(null);

	const [controlsRefs, setControlsRefs] = useState({});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	return (
		<Tabs
			style={{ overflow: "hidden" }}
			variant="none"
			value={tabValue}
			onChange={setTabValue}
			className="borderRadiusAll"
		>
			<ScrollArea
				w={width}
				style={{ overflowX: "hidden" }}
				scrollbars="x"
				type="hover"
				bg="var(--theme-primary-color-0)"
			>
				{tabList.length > 1 && (
					<Tabs.List px="sm" py="xxxs" className={tabClass.list} ref={setRootRef}>
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
											styles={{
												tab: {
													backgroundColor:
														tabValue === tab ? DEFAULT_ACTIVE_COLOR : "transparent",
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
			</ScrollArea>
		</Tabs>
	);
}
