import { Sparkline } from "@mantine/charts";
import { Box, Card, Flex, Text, Tabs, Grid, NumberFormatter, ScrollArea } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const tabs = [
	{
		label: "opd",
		value: "opd",
	},
	{
		label: "IPD",
		value: "visit",
	},
	{
		label: "Emergency",
		value: "emergency",
	},
];

const opdData = [
	{
		label: "NonPrescription",
		value: 10,
		route: "/opd/created",
	},
	{
		label: "Prescription",
		value: 7,
		route: "/opd/closed",
	},
	{
		label: "Done",
		value: 10789,
		route: "/opd/done",
	},
];

export default function _OperatorOverview({ height }) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<Card padding="lg" radius="sm" h="100%">
			<Card.Section h={32} withBorder component="div" bg="var(--theme-secondary-color-8)">
				<Flex align="center" h="100%" px="lg">
					<Text pb={0} fz="sm" c="white" fw={500}>
						{t("overview")}
					</Text>
				</Flex>
			</Card.Section>

			<Box h={height} pt="md">
				<Tabs id="overview-tabs" orientation="vertical" defaultValue="opd">
					<ScrollArea miw={140} h={height} scrollbarSize={8} scrollbars="y" type="never">
						<Tabs.List mr="sm" p="2xs" bg="var(--theme-tertiary-color-0)" style={{ borderRadius: "es" }}>
							{tabs.map((tab) => (
								<Tabs.Tab py="3xs" key={tab.value} value={tab.value}>
									<Text mt="es" fz="sm" c="var(--theme-tertiary-color-6)">
										{t(tab.label)}
									</Text>
								</Tabs.Tab>
							))}
						</Tabs.List>
					</ScrollArea>

					{tabs.map((tab) => (
						<Tabs.Panel
							key={tab.value}
							value={tab.value}
							pl="xs"
							style={{ borderLeft: "1px solid var(--theme-tertiary-color-2)" }}
						>
							<ScrollArea h={height} scrollbarSize={8} scrollbars="y" type="hover">
								<Grid
									mt="sm"
									pt="sm"
									columns={9}
									gutter="xs"
									style={{
										borderTop: "1px solid var(--theme-tertiary-color-2)",
									}}
								>
									{opdData.map((item) => (
										<Grid.Col span={3} key={item.label}>
											<Box
												onClick={() => navigate(item.route)}
												className="opd-card"
												px="sm"
												py="3xs"
												h="100%"
											>
												<Flex justify="space-between" align="center">
													<Text fz="sm" c="var(--theme-tertiary-color-6)">
														{t(item.label)}
													</Text>
													<IconArrowRight size={16} color="var(--theme-secondary-color-8)" />
												</Flex>
												<Text fz="lg" fw={600}>
													<NumberFormatter
														thousandSeparator
														value={item.value}
														decimalScale={0}
														fixedDecimalScale
													/>
												</Text>
											</Box>
										</Grid.Col>
									))}
								</Grid>
							</ScrollArea>
						</Tabs.Panel>
					))}
				</Tabs>
			</Box>
		</Card>
	);
}
