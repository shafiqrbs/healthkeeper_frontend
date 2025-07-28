import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack, Card } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDeviceFloppy } from "@tabler/icons-react";
import Shortcut from "../../shortcut/Shortcut";
import classes from "@assets/css/FeaturesCards.module.css";
import FormGeneric from "./FormGeneric";

import _DomainDetailsSection from "./_DomainDetailsSection.jsx";
import AccountingForm from "./AccountingForm.jsx";
import useDomainConfig from "@hooks/config-data/useDomainConfig";

const NAV_ITEMS = ["Domain", "Accounting", "Inventory", "Product", "Discount"];

export default function InventoryConfigurationForm({ module }) {
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 104; //TabList height 104

	const [activeTab, setActiveTab] = useState("Accounting");

	const { domainConfig } = useDomainConfig();

	const inventoryConfig = domainConfig?.inventory_config;
	const configSales = inventoryConfig?.config_sales;
	const id = domainConfig?.id;

	const renderForm = () => {
		switch (activeTab) {
			case "Accounting":
				return <AccountingForm height={height} module={module} />;
			default:
				return <FormGeneric height={height} module={module} config_sales={configSales} id={id} />;
		}
	};

	return (
		<Grid columns={24} gutter={{ base: 8 }}>
			<Grid.Col span={4}>
				<Card shadow="md" radius="4" className={classes.card} padding="xs">
					<Grid gutter={{ base: 2 }}>
						<Grid.Col span={11}>
							<Text fz="md" fw={500} className={classes.cardTitle}>
								{t("ConfigNavigation")}
							</Text>
						</Grid.Col>
					</Grid>
					<Grid columns={9} gutter={{ base: 1 }}>
						<Grid.Col span={9}>
							<Box bg={"white"}>
								<Box mt="xxxs" pt="xxxs">
									<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
										{NAV_ITEMS.map((item) => (
											<Box
												key={item}
												style={{
													borderRadius: 4,
													cursor: "pointer",
												}}
												className={`${classes["pressable-card"]} border-radius`}
												mih={40}
												mt="es"
												variant="default"
												onClick={() => setActiveTab(item)}
												bg={activeTab === item ? "#f8eedf" : "gray.1"}
											>
												<Text size="sm" pt="xxxs" pl="xxxs" fw={500} c="black">
													{t(item)}
												</Text>
											</Box>
										))}
									</ScrollArea>
								</Box>
							</Box>
						</Grid.Col>
					</Grid>
				</Card>
			</Grid.Col>
			<Grid.Col span={11}>
				<Box bg="white" p="xs" className="borderRadiusAll" mb="xxxs">
					<Box bg="white">
						<Box pl="xs" pr="xxxs" py="xxxs" mb="xxxs" className="boxBackground borderRadiusAll">
							<Grid>
								<Grid.Col span={6}>
									<Title order={6} pt="es">
										{t(activeTab)}
									</Title>
								</Grid.Col>
								<Grid.Col span={6}>
									<Stack right align="flex-end">
										<>
											{isOnline && activeTab === "Accounting" && (
												<Button
													size="xs"
													className={"btnPrimaryBg"}
													leftSection={<IconDeviceFloppy size={16} />}
													onClick={() => {
														if (activeTab === "Accounting") {
															document.getElementById("AccountingFormSubmit").click();
														}
													}}
												>
													<Flex direction={`column`} gap={0}>
														<Text fz={14} fw={400}>
															{t("UpdateAndSave")}
														</Text>
													</Flex>
												</Button>
											)}
										</>
									</Stack>
								</Grid.Col>
							</Grid>
						</Box>
						<Box px="xs" className="borderRadiusAll">
							{renderForm()}
						</Box>
					</Box>
				</Box>
			</Grid.Col>
			<Grid.Col span={8}>
				<_DomainDetailsSection height={height} domainConfig={domainConfig} />
			</Grid.Col>
			<Grid.Col span={1}>
				<Box bg="white" className="borderRadiusAll" pt="md">
					<Shortcut
						FormSubmit={activeTab === "Accounting" ? "AccountingFormSubmit" : "DomainFormSubmit"}
						Name="name"
						inputType="select"
					/>
				</Box>
			</Grid.Col>
		</Grid>
	);
}
