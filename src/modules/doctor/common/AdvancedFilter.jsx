import React, { useState } from "react";
import { ActionIcon, Box, Button, Flex, Grid, Popover, Text, Tooltip, ScrollArea } from "@mantine/core";
import {
	IconDeviceMobile,
	IconFileInvoice,
	IconFilter,
	IconRefreshDot,
	IconSearch,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";
import InputForm from "@components/form-builders/InputForm";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import SelectForm from "@components/form-builders/SelectForm";

export default function AdvancedFilter({ setRefreshCustomerDropdown, focusField, fieldPrefix }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight;

	const { t } = useTranslation();

	/*START CUSTOMER ADDED FORM INITIAL*/
	const [advanceSearchFormOpened, setAdvanceSearchFormOpened] = useState(false);
	const [nameDropdown, setNameDropdown] = useState(null);
	const [mobileDropdown, setMobileDropdown] = useState(null);
	const [invoiceDropdown, setInvoiceDropdown] = useState(null);
	const advanceSearchForm = useForm({
		initialValues: {
			name: "",
			mobile: "",
			invoice: "",
			name_dropdown: "",
			mobile_dropdown: "",
			invoice_dropdown: "",
		},
		validate: {
			name: (value, values) => {
				// First check if any main field is filled
				if (!value && !values.mobile && !values.invoice) {
					return "At least one main field is required";
				}
				return null;
			},
			name_dropdown: (value, values) => {
				// Validate dropdown when name has value
				if (values.name && !value) {
					return true;
				}
				return null;
			},
			mobile: (value, values) => {
				if (!value && !values.name && !values.invoice) {
					return true;
				}
				return null;
			},
			mobile_dropdown: (value, values) => {
				if (values.mobile && !value) {
					return true;
				}
				return null;
			},
			invoice: (value, values) => {
				if (!value && !values.name && !values.mobile) {
					return "At least one main field is required";
				}
				return null;
			},
			invoice_dropdown: (value, values) => {
				if (values.invoice && !value) {
					return "Please select an option for Invoice";
				}
				return null;
			},
		},
	});
	const mobile_drop_data = [
		{ id: 1, value: "chiller" },
		{ id: 2, value: "party" },
	];
	const invoice_drop_data = [
		{ id: 1, value: "chiller" },
		{ id: 2, value: "party" },
	];
	const name_drop_data = [
		{ id: 1, value: "chiller" },
		{ id: 2, value: "party" },
	];

	return (
		<Box>
			<Popover width="500" trapFocus position="bottom" withArrow shadow="xl" opened={advanceSearchFormOpened}>
				<Popover.Target>
					<Tooltip
						multiline
						bg="var(--theme-error-color)"
						offset={{ crossAxis: "-52", mainAxis: "5" }}
						position="top"
						ta="center"
						withArrow
						transitionProps={{ duration: 200 }}
						label={t("AdvanceSearch")}
					>
						<ActionIcon
							c="var(--theme-success-color)"
							bg="white"
							onClick={() =>
								advanceSearchFormOpened
									? setAdvanceSearchFormOpened(false)
									: setAdvanceSearchFormOpened(true)
							}
						>
							<IconFilter size={16} stroke={1.5} />
						</ActionIcon>
					</Tooltip>
				</Popover.Target>
				<Popover.Dropdown>
					<Box>
						<form
							onSubmit={advanceSearchForm.onSubmit((values) => {
								console.log(advanceSearchForm.values);
							})}
						>
							<Box mt="es">
								<Box className="boxBackground borderRadiusAll" pt="les" mb="es" pb="les">
									<Text ta="center" fw={600} fz="sm">
										{t("AdvanceSearch")}
									</Text>
								</Box>
								<Box className="borderRadiusAll" bg="white">
									<ScrollArea h={height / 3} scrollbarSize={2} scrollbars="y" type="never">
										<Box p="xs">
											<Grid columns={15} gutter={{ base: "xxxs" }}>
												<Grid.Col span={3}>
													<Text ta="left" fw={600} fz="sm" mt="xxxs">
														{t("Name")}
													</Text>
												</Grid.Col>

												<Grid.Col span={5}>
													<SelectForm
														tooltip={t("SelectSearchLikeValue")}
														form={advanceSearchForm}
														searchable
														name="name_dropdown"
														id="name_dropdown"
														label=""
														nextField="name"
														placeholder="Search Like"
														dropdownValue={name_drop_data}
														changeValue={setNameDropdown}
														data={["React", "Angular", "Vue", "Svelte"]}
													/>
												</Grid.Col>
												<Grid.Col span={7}>
													<Box>
														<InputForm
															tooltip={t("NameValidateMessage")}
															label=""
															placeholder={t("Name")}
															nextField={"mobile_dropdown"}
															form={advanceSearchForm}
															name={"name"}
															id={"name"}
															leftSection={<IconUserCircle size={16} opacity={0.5} />}
															rightIcon={""}
														/>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
										<Box p="xs">
											<Grid columns={15} gutter={{ base: "xxxs" }}>
												<Grid.Col span={3}>
													<Text ta="left" fw={600} fz="sm" mt="xxxs">
														{t("Mobile")}
													</Text>
												</Grid.Col>

												<Grid.Col span={5}>
													<SelectForm
														tooltip={t("SelectSearchLikeValue")}
														form={advanceSearchForm}
														searchable
														name="mobile_dropdown"
														id="mobile_dropdown"
														nextField="mobile"
														label=""
														placeholder="Search Like"
														dropdownValue={mobile_drop_data}
														value={mobileDropdown}
														changeValue={setMobileDropdown}
													/>
												</Grid.Col>
												<Grid.Col span={7}>
													<Box>
														<InputForm
															tooltip={t("MobileValidateMessage")}
															label=""
															placeholder={t("Mobile")}
															nextField={"invoice_dropdown"}
															form={advanceSearchForm}
															name={"mobile"}
															id={"mobile"}
															leftSection={<IconDeviceMobile size={16} opacity={0.5} />}
															rightIcon={""}
														/>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
										<Box p="xs">
											<Grid columns={15} gutter={{ base: "xxxs" }}>
												<Grid.Col span={3}>
													<Text ta="left" fw={600} fz="sm" mt="xxxs">
														{t("Invoice")}
													</Text>
												</Grid.Col>

												<Grid.Col span={5}>
													<SelectForm
														tooltip={t("SelectSearchLikeValue")}
														form={advanceSearchForm}
														searchable
														name="invoice_dropdown"
														id="invoice_dropdown"
														nextField="invoice"
														label=""
														placeholder="Search Like"
														dropdownValue={invoice_drop_data}
														value={invoiceDropdown}
														changeValue={setInvoiceDropdown}
													/>
												</Grid.Col>
												<Grid.Col span={7}>
													<Box>
														<InputForm
															tooltip={t("InvoiceValidateMessage")}
															label=""
															placeholder={t("Invoice")}
															nextField={"EntityFormSubmit"}
															form={advanceSearchForm}
															name={"invoice"}
															id={"invoice"}
															leftSection={<IconFileInvoice size={16} opacity={0.5} />}
															rightIcon={""}
														/>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
									</ScrollArea>
								</Box>
							</Box>
							<Box className="borderRadiusAll boxBackground" p="les">
								<Flex gap="es" align="center" justify="space-between">
									<Button
										variant="outline"
										c="var(--theme-primary-color-6)"
										size="xs"
										onClick={() => setAdvanceSearchFormOpened(false)}
										style={{ border: "1px solid var(--theme-primary-color-6)" }}
										leftSection={<IconX size={16} stroke={1.5} />}
									>
										<Text fz="sm" fw={400}>
											{t("Close")}
										</Text>
									</Button>
									<Flex gap="es" align="center">
										<Button
											variant="transparent"
											size="sm"
											color="var(--theme-error-color)"
											onClick={() => {
												advanceSearchForm.reset();
											}}
										>
											<IconRefreshDot size={16} stroke={1.5} />
										</Button>

										<Button
											size="xs"
											color="var(--theme-error-color)"
											type="submit"
											id={"EntityFormSubmit"}
											leftSection={<IconSearch size={16} />}
										>
											<Text fz="sm" fw={400}>
												{t("Search")}
											</Text>
										</Button>
									</Flex>
								</Flex>
							</Box>
						</form>
					</Box>
				</Popover.Dropdown>
			</Popover>
		</Box>
	);
}
