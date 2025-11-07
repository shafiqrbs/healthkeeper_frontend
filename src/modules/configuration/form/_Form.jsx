import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack, Card, Group, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconRefreshDot } from "@tabler/icons-react";
import Shortcut from "../../shortcut/Shortcut";
import classes from "@assets/css/FeaturesCards.module.css";
import __FormGeneric from "./__FormGeneric";

import _DomainDetailsSection from "../common/_DomainDetailsSection";
import AccountingForm from "./__AccountingForm.jsx";
import useDomainConfig from "@hooks/config-data/useDomainConfig";
import __HospitalForm from "@modules/configuration/form/__HospitalForm";
import { modals } from "@mantine/modals";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import HealthShareForm from "./__HealthShareForm.jsx";

const NAV_ITEMS = ["Domain", "Accounting", "Hospital", "Inventory", "Product", "HealthShare"];

export default function _Form({ module }) {
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 104; //TabList height 104
	const [activeTab, setActiveTab] = useState("Hospital");
	const { domainConfig } = useDomainConfig();

	const id = domainConfig?.id;

	const renderForm = () => {
		switch (activeTab) {
			case "Hospital":
				return <__HospitalForm height={height} id={id} />;
			case "Accounting":
				return <AccountingForm height={height} module={module} />;
			case "HealthShare":
				return <HealthShareForm height={height} id={id} />;
			default:
				return <__FormGeneric height={height} module={module} id={id} />;
		}
	};

	const submitButtonId = () => {
		switch (activeTab) {
			case "Hospital":
				return "HospitalFormSubmit";
			case "Accounting":
				return "AccountingFormSubmit";
			case "HealthShare":
				return "HealthShareFormSubmit";
			default:
				return "DomainFormSubmit";
		}
	};

	const handleSubmit = () => {
		document.getElementById(submitButtonId()).click();
	};

	function AccountingDataProcess(url) {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: async () => {
				const response = await axios.get(`${import.meta.env.VITE_API_GATEWAY_URL}${url}`, {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Api-Key": import.meta.env.VITE_API_KEY,
						"X-Api-User": JSON.parse(localStorage.getItem("user")).id,
					},
				});
				if (response.data.message === "success") {
					notifications.show({
						color: "teal",
						title: t("CreateSuccessfully"),
						icon: <IconCheck style={{ width: "18px", height: "18px" }} />,
						loading: false,
						autoClose: 700,
						style: { backgroundColor: "lightgray" },
					});
				}
			},
		});
	}

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
								<Box mt="3xs" pt="3xs">
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
												<Text size="sm" pt="3xs" pl="3xs" fw={500} c="black">
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
				<Box bg="white" p="xs" className="borderRadiusAll" mb="3xs">
					<Box bg="white">
						<Box pl="xs" pr="3xs" py="3xs" mb="3xs" className="boxBackground borderRadiusAll">
							<Grid>
								<Grid.Col span={6}>
									<Title order={6} pt="es">
										{t(activeTab)}
									</Title>
								</Grid.Col>
								<Grid.Col span={6}>
									<Stack right align="flex-end">
										<>
											{isOnline && (
												<>
													<Group justify="center">
														<Button
															size="xs"
															className={"btnPrimaryBg"}
															leftSection={<IconDeviceFloppy size={16} />}
															onClick={handleSubmit}
														>
															<Flex direction={`column`} gap={0}>
																<Text fz={14} fw={400}>
																	{t("UpdateAndSave")}
																</Text>
															</Flex>
														</Button>
														<ActionIcon
															onClick={() => {
																AccountingDataProcess(
																	`/domain/config/hospital-reset/${id}`
																);
															}}
															variant="filled"
															color="var(--theme-primary-color-3)"
															aria-label="Settings"
														>
															<IconRefreshDot
																style={{ width: "70%", height: "70%" }}
																stroke={1.5}
															/>
														</ActionIcon>
													</Group>
												</>
											)}
										</>
									</Stack>
								</Grid.Col>
							</Grid>
						</Box>
						<Box className="borderRadiusAll">{renderForm()}</Box>
					</Box>
				</Box>
			</Grid.Col>
			<Grid.Col span={8}>
				<_DomainDetailsSection height={height} domainConfig={domainConfig} />
			</Grid.Col>
			<Grid.Col span={1}>
				<Box bg="white" className="borderRadiusAll" pt="md">
					<Shortcut FormSubmit={submitButtonId()} Name="name" inputType="select" />
				</Box>
			</Grid.Col>
		</Grid>
	);
}
