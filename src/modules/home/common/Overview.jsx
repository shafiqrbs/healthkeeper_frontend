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
		label: "visit",
		value: "visit",
	},
	{
		label: "pathology",
		value: "pathology",
	},
	{
		label: "radiology",
		value: "radiology",
	},
	{
		label: "pharmacy",
		value: "pharmacy",
	},
	{
		label: "emergency",
		value: "emergency",
	},
	{
		label: "testReport",
		value: "test-report",
	},
	{
		label: "bill",
		value: "bill",
	},
];

const opdData = [
	{
		label: "closed",
		value: 7,
		route: "/opd/closed",
	},
	{
		label: "created",
		value: 10,
		route: "/opd/created",
	},
	{
		label: "done",
		value: 10789,
		route: "/opd/done",
	},
	{
		label: "inProgress",
		value: 23323,
		route: "/opd/in-progress",
	},
	{
		label: "admitted",
		value: 10,
		route: "/opd/admitted",
	},
	{
		label: "due",
		value: 10,
		route: "/opd/due",
	},
	{
		label: "released",
		value: 10,
		route: "/opd/released",
	},
	{
		label: "returned",
		value: 5158,
		route: "/opd/returned",
	},
	{
		label: "progress",
		value: 2,
		route: "/opd/progress",
	},
];

export default function _Overview({ height }) {
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
						<Tabs.List mr="sm" p="xxs" bg="var(--theme-tertiary-color-0)" style={{ borderRadius: "es" }}>
							{tabs.map((tab) => (
								<Tabs.Tab py="xxxs" key={tab.value} value={tab.value}>
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
								<Sparkline
									w="100%"
									h={80}
									data={[10, 20, 40, 20, 40, 10, 50]}
									curveType="linear"
									color="var(--theme-secondary-color-8)"
									fillOpacity={0.6}
									strokeWidth={0.5}
								/>

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
												py="xxxs"
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
