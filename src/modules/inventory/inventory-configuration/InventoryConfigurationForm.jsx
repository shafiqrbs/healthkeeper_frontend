import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Flex, Grid, Box, ScrollArea, Text, Title, Stack, Card } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import classes from "@assets/css/FeaturesCards.module.css";
import SalesForm from "./SalesForm";
import PurchaseForm from "./PurchaseForm";
import RequisitionForm from "./RequisitionForm";
import FormGeneric from "./FormGeneric";

import useConfigData from "@hooks/config-data/useConfigData.js";
import _DomainDetailsSection from "./_DomainDetailsSection.jsx";
import AccountingForm from "./AccountingForm.jsx";
import ProductionForm from "./ProductionForm.jsx";
import ProductForm from "./ProductForm.jsx";
import DiscountForm from "./DiscountForm.jsx";
import InventoryForm from "./InventoryForm.jsx";
import PosForm from "./PosForm.jsx";
import VatForm from "./VatForm.jsx";
import DomainConfigForm from "./DomainConfigForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";

export default function InventoryConfigurationForm() {
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 104; //TabList height 104

	const [activeTab, setActiveTab] = useState("Accounting");

	const groupDropdownData = useGlobalDropdownData("customer-group");
	const groupVendorDropdownData = useGlobalDropdownData("vendor-group");

	const { domainConfig, fetchDomainConfig } = useConfigData();

	let inventory_config = domainConfig?.inventory_config;
	let config_sales = inventory_config?.config_sales;
	let config_requisition = inventory_config?.config_requisition;
	let production_config = domainConfig?.production_config;
	let config_discount = inventory_config?.config_discount;
	let config_product = inventory_config?.config_product;
	let id = domainConfig?.id;

	const navItems = [
		"Domain",
		"Inventory",
		"Product",
		"Sales",
		"Purchase",
		"Discount",
		"Pos",
		"Vat",
		"Requisition",
		"Accounting",
		"Production",
	];

	useHotkeys(
		[
			[
				"alt+s",
				() => {
					document.getElementById("SalesFormSubmit").click();
				},
			],
			[
				"alt+p",
				() => {
					document.getElementById("PurchaseFormSubmit").click();
				},
			],
			[
				"alt+r",
				() => {
					document.getElementById("RequisitionFormSubmit").click();
				},
			],
		],
		[]
	);

	const renderForm = () => {
		switch (activeTab) {
			case "Domain":
				return <DomainConfigForm height={height} />;
			case "Inventory":
				return <InventoryForm height={height} />;
			case "Product":
				return (
					<ProductForm
						height={height}
						config_product={config_product}
						id={id}
						fetchDomainConfig={fetchDomainConfig}
					/>
				);
			case "Sales":
				return (
					<SalesForm
						customerGroupDropdownData={groupDropdownData}
						height={height}
						config_sales={config_sales}
						id={id}
						domainConfig={domainConfig}
					/>
				);
			case "Purchase":
				return (
					<PurchaseForm
						vendorGroupDropdownData={groupVendorDropdownData}
						height={height}
						domainConfig={domainConfig}
					/>
				);
			case "Requisition":
				return <RequisitionForm height={height} config_requisition={config_requisition} id={id} />;
			case "Accounting":
				return <AccountingForm height={height} />;
			case "Production":
				return <ProductionForm height={height} production_config={production_config} id={id} />;
			case "Discount":
				return <DiscountForm height={height} config_discount={config_discount} id={id} />;

			case "Pos":
				return <PosForm height={height} id={id} />;
			case "Vat":
				return <VatForm height={height} />;
			default:
				return <FormGeneric height={height} config_sales={config_sales} id={id} />;
		}
	};

	return (
		<Box>
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
									<Box mt={8} pt={"8"}>
										<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
											{navItems.map((item) => (
												<Box
													key={item}
													style={{
														borderRadius: 4,
														cursor: "pointer",
													}}
													className={`${classes["pressable-card"]} border-radius`}
													mih={40}
													mt={"4"}
													variant="default"
													onClick={() => setActiveTab(item)}
													bg={activeTab === item ? "#f8eedf" : "gray.1"}
												>
													<Text size={"sm"} pt={8} pl={8} fw={500} c={"black"}>
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
					<Box bg={"white"} p={"xs"} className={"borderRadiusAll"} mb={"8"}>
						<Box bg={"white"}>
							<Box
								pl={`xs`}
								pr={8}
								pt={"8"}
								pb={"10"}
								mb={"4"}
								className={"boxBackground borderRadiusAll"}
							>
								<Grid>
									<Grid.Col span={6}>
										<Title order={6} pt={"4"}>
											{t(activeTab)}
										</Title>
									</Grid.Col>
									<Grid.Col span={6}>
										<Stack right align="flex-end">
											<>
												{isOnline &&
													(activeTab === "Sales" ||
														activeTab === "Domain" ||
														activeTab === "Purchase" ||
														activeTab === "Requisition" ||
														activeTab === "Accounting" ||
														activeTab === "Production" ||
														activeTab === "Discount" ||
														activeTab === "Product" ||
														activeTab === "Inventory" ||
														activeTab === "Pos" ||
														activeTab === "Vat") && (
														<Button
															size="xs"
															className={"btnPrimaryBg"}
															leftSection={<IconDeviceFloppy size={16} />}
															onClick={() => {
																if (activeTab === "Sales") {
																	document.getElementById("SalesFormSubmit").click();
																} else if (activeTab === "Domain") {
																	document.getElementById("DomainFormSubmit").click();
																} else if (activeTab === "Purchase") {
																	document
																		.getElementById("PurchaseFormSubmit")
																		.click();
																} else if (activeTab === "Requisition") {
																	document
																		.getElementById("RequisitionFormSubmit")
																		.click();
																} else if (activeTab === "Accounting") {
																	document
																		.getElementById("AccountingFormSubmit")
																		.click();
																} else if (activeTab === "Production") {
																	document
																		.getElementById("ProductionFormSubmit")
																		.click();
																} else if (activeTab === "Discount") {
																	document
																		.getElementById("DiscountFormSubmit")
																		.click();
																} else if (activeTab === "Product") {
																	document
																		.getElementById("ProductFormSubmit")
																		.click();
																} else if (activeTab === "Inventory") {
																	document
																		.getElementById("InventoryFormSubmit")
																		.click();
																} else if (activeTab === "Vat") {
																	document.getElementById("VatFormSubmit").click();
																} else if (activeTab === "Pos") {
																	document.getElementById("PosFormSubmit").click();
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
							<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
								{renderForm()}
							</Box>
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={8}>
					<_DomainDetailsSection height={height} domainConfig={domainConfig} />
				</Grid.Col>
				<Grid.Col span={1}>
					<Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
						<Shortcut
							FormSubmit={
								activeTab === "Sales"
									? "SalesFormSubmit"
									: activeTab === "Purchase"
									? "PurchaseFormSubmit"
									: activeTab === "Requisition"
									? "RequisitionFormSubmit"
									: activeTab === "Accounting"
									? "AccountingFormSubmit"
									: activeTab === "Production"
									? "ProductionFormSubmit"
									: activeTab === "Discount"
									? "DiscountFormSubmit"
									: activeTab === "Product"
									? "ProductFormSubmit"
									: activeTab === "Inventory"
									? "InventoryFormSubmit"
									: activeTab === "Pos"
									? "PosFormSubmit"
									: "VatFormSubmit"
							}
							Name={"name"}
							inputType="select"
						/>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
