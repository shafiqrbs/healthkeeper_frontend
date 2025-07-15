import { Box, Flex, Tabs, TextInput, FloatingIndicator } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import tabClass from "@assets/css/Tab.module.css";

export default function TabsWithSearch({
	tabValue,
	setTabValue,
	rootRef,
	setRootRef,
	controlsRefs,
	setControlsRefs,
	newChild,
	reportChild,
	reVisitChild,
}) {
	const { t } = useTranslation();

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	return (
		<Tabs variant="none" value={tabValue} onChange={setTabValue}>
			<Tabs.List p="sm" className={tabClass.list} ref={setRootRef}>
				<Flex w="100%" justify="space-between">
					<Tabs.Tab w="32%" value="new" ref={setControlRef("new")} className={tabClass.tab}>
						{t("new")}
					</Tabs.Tab>
					<Tabs.Tab w="32%" value="report" ref={setControlRef("report")} className={tabClass.tab}>
						{t("report")}
					</Tabs.Tab>
					<Tabs.Tab w="32%" value="re-visit" ref={setControlRef("re-visit")} className={tabClass.tab}>
						{t("reVisit")}
					</Tabs.Tab>
				</Flex>
				<FloatingIndicator
					target={tabValue ? controlsRefs[tabValue] : null}
					parent={rootRef}
					className={tabClass.indicator}
				/>
			</Tabs.List>

			<Tabs.Panel value="new">
				<Box py="sm" bg="white">
					<Box p="xs" bg="var(--theme-success-color-5)">
						<TextInput name="search" placeholder={t("search")} />
					</Box>
					{newChild}
				</Box>
			</Tabs.Panel>
			<Tabs.Panel value="report">{reportChild}</Tabs.Panel>
			<Tabs.Panel value="re-visit">{reVisitChild}</Tabs.Panel>
		</Tabs>
	);
}
