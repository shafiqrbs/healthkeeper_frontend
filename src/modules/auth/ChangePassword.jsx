import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Box, ScrollArea, Group, Text, ActionIcon, Stack, Drawer, Flex, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDeviceFloppy, IconRefreshDot, IconX } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import PasswordInputForm from "@components/form-builders/PasswordInputForm";
import { isNotEmpty, useForm } from "@mantine/form";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { storeEntityData } from "@/app/store/core/crudThunk";

function ChangePassword({ height, resetPasswordOpened, closeResetPassword }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [saveCreateLoading, setSaveCreateLoading] = useState(false);

	const form = useForm({
		initialValues: {
			current_password: "",
			new_password: "",
			confirm_password: "",
		},
		validate: {
			current_password: isNotEmpty("Current Password is required"),
			new_password: (value) => {
				if (!value) return t("NewPassword");
				if (value.length < 8) return t("PasswordValidateMessage");
				return null;
			},
			confirm_password: (value, values) => {
				if (!value) return t("ConfirmPassword");
				if (value !== values.new_password) return t("PasswordNotMatch");
				return null;
			},
		},
	});

	const handleResetPassword = async (values) => {
		const data = {
			url: "core/change-password",
			data: values,
			module: "auth",
		};
		const resultAction = await dispatch(storeEntityData(data));
		if (storeEntityData.rejected.match(resultAction)) {
			const fieldErrors = resultAction.payload.errors;
			// Check if there are field validation errors and dynamically set them
			if (fieldErrors) {
				const errorObject = {};
				Object.keys(fieldErrors).forEach((key) => {
					errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
				});
				// Display the errors using your form's `setErrors` function dynamically
				form.setErrors(errorObject);
			}
		} else if (storeEntityData.fulfilled.match(resultAction)) {
			showNotificationComponent(t("PasswordChangeSuccessfully"), "teal");
			setTimeout(() => {
				logout();
			}, 1000);
		}
	};

	const closeModel = () => {
		closeResetPassword(false);
	};

	function logout() {
		localStorage.clear();
		navigate("/login");
	}

	return (
		<Drawer.Root opened={resetPasswordOpened} position="right" onClose={closeModel} size={"30%"}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Box component="form" p={2} mx={2} mb={0} onSubmit={form.onSubmit(handleResetPassword)}>
					<Grid columns={9} gutter={{ base: 6 }}>
						<Grid.Col span={9}>
							<Box bg={"var(--mantine-color-white)"} p={"xs"} className={"borderRadiusAll"}>
								<Box bg={"var(--mantine-color-white)"}>
									<Box pl={`xs`} pr={8} pt={"4"} pb={"6"} mb={"4"} className={"boxBackground borderRadiusAll"}>
										<Flex direction="row" justify="space-between" align="center">
											<Title order={6} py={"6"}>
												{t("ChangePassword")}
											</Title>
											<ActionIcon radius="xl" color="grey.6" size="md" variant="outline" onClick={closeModel}>
												<IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
											</ActionIcon>
										</Flex>
									</Box>
									<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
										<ScrollArea h={height + 90} mt={"md"} scrollbarSize={1} scrollbars="y" type="never">
											<PasswordInputForm
												tooltip={form.errors.current_password ? form.errors.current_password : t("RequiredPassword")}
												form={form}
												name="current_password"
												label={t("CurrentPassword")}
												placeholder={t("EnterCurrentPassword")}
												required
												nextField="new_password"
												{...form.getInputProps("current_password")}
											/>
											<Box mt={"md"}>
												<PasswordInputForm
													tooltip={form.errors.new_password ? form.errors.new_password : t("RequiredPassword")}
													form={form}
													name="new_password"
													label={t("NewPassword")}
													placeholder={t("EnterNewPassword")}
													required
													nextField="confirm_password"
													{...form.getInputProps("new_password")}
												/>
											</Box>
											<Box mt={"md"}>
												<PasswordInputForm
													tooltip={form.errors.confirm_password}
													form={form}
													name="confirm_password"
													label={t("ConfirmPassword")}
													placeholder={t("EnterConfirmNewPassword")}
													required
													{...form.getInputProps("confirm_password")}
												/>
											</Box>
										</ScrollArea>
									</Box>
									<Box pl={`xs`} pr={8} py={"6"} mb={"2"} mt={4} className={"boxBackground borderRadiusAll"}>
										<Group justify="space-between">
											<ActionIcon variant="transparent" size="sm" color="red.6" onClick={closeModel} ml={"4"}>
												<IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
											</ActionIcon>

											<Group gap={8}>
												<Flex justify="flex-end" align="center" h="100%">
													<Button
														variant="transparent"
														size="xs"
														color="red.4"
														type="reset"
														id=""
														comboboxProps={{ withinPortal: false }}
														p={0}
														rightSection={<IconRefreshDot style={{ width: "100%", height: "60%" }} stroke={1.5} />}
														onClick={() => {
															form.reset();
														}}
													></Button>
												</Flex>
												<Stack align="flex-start">
													<>
														{!saveCreateLoading && (
															<Button
																size="xs"
																className={"btnPrimaryBg"}
																type="submit"
																id={"EntityProductFormSubmit"}
																leftSection={<IconDeviceFloppy size={16} />}
															>
																<Flex direction={`column`} gap={0}>
																	<Text fz={14} fw={400}>
																		{t("ResetPassword")}
																	</Text>
																</Flex>
															</Button>
														)}
													</>
												</Stack>
											</Group>
										</Group>
									</Box>
								</Box>
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</Drawer.Content>
		</Drawer.Root>
	);
}

export default ChangePassword;
