import {
	Paper,
	TextInput,
	PasswordInput,
	Checkbox,
	Button,
	Title,
	Anchor,
	Alert,
	Tooltip,
	Group,
	Center,
	rem,
	Box,
	Loader,
} from "@mantine/core";
import LoginPage from "@assets/css/LoginPage.module.css";
import classes from "@assets/css/AuthenticationImage.module.css";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { IconInfoCircle, IconLogin, IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import commonDataStoreIntoLocalStorage from "@hooks/local-storage/useCommonDataStoreIntoLocalStorage.js";
import orderProcessDropdownLocalDataStore from "@hooks/local-storage/useOrderProcessDropdownLocalDataStore.js";
import { API_BASE_URL, API_KEY } from "@/constants";
import { getLoggedInUser } from "@/common/utils";

export default function Login() {
	const user = getLoggedInUser();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [spinner, setSpinner] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		initialValues: { username: "", password: "" },

		// functions will be used to validate values at corresponding key
		validate: {
			username: isNotEmpty(),
			password: isNotEmpty(),
		},
	});

	if (user?.id) {
		console.info("already logged in, redirecting from login page.");
		return <Navigate replace to="/" />;
	}

	function login(data) {
		setSpinner(true);
		axios({
			method: "POST",
			url: `${API_BASE_URL}/user-login`,
			headers: {
				Accept: `application/json`,
				"Content-Type": `application/json`,
				"Access-Control-Allow-Origin": "*",
				"X-Api-Key": API_KEY,
			},
			data: data,
		})
			.then((res) => {
				if (res.data.status === 200) {
					localStorage.setItem("user", JSON.stringify(res.data.data));
					orderProcessDropdownLocalDataStore(res.data.data.id);
					commonDataStoreIntoLocalStorage(res.data.data.id).then(() => {
						setErrorMessage("");
						setSpinner(false);
						return navigate("/");
					});
				} else {
					setErrorMessage(res.data.message);
					setSpinner(false);
				}
			})
			.catch(function (error) {
				setSpinner(false);
				console.error(error);
			});
	}

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("Username").focus();
				},
			],
		],
		[]
	);

	return (
		<div className={classes.wrapper}>
			<Box component="form" onSubmit={form.onSubmit((values) => login(values))}>
				<Paper className={classes.form} radius={0} p={30}>
					<Title order={2} className={classes.title} ta="center" mt="md" mb={80}>
						{t("WelcomeBackToPOSH")}
					</Title>
					{errorMessage && (
						<Alert
							variant="light"
							color="red"
							radius="md"
							title={errorMessage}
							icon={<IconInfoCircle />}
						></Alert>
					)}
					<Tooltip
						label={t("UserNameRequired")}
						px={20}
						py={3}
						opened={!!form.errors.username}
						position="top-end"
						color="red"
						withArrow
						offset={2}
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<TextInput
							withAsterisk
							label={t("UserName")}
							placeholder={t("UserName")}
							size="md"
							id={"Username"}
							{...form.getInputProps("username")}
							onKeyDown={getHotkeyHandler([
								[
									"Enter",
									(e) => {
										document.getElementById("Password").focus();
									},
								],
							])}
						/>
					</Tooltip>

					<Tooltip
						label={t("RequiredPassword")}
						px={20}
						py={3}
						opened={!!form.errors.password}
						position="top-end"
						color="red"
						withArrow
						offset={2}
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<PasswordInput
							withAsterisk
							label={t("Password")}
							placeholder={t("Password")}
							mt="md"
							size="md"
							{...form.getInputProps("password")}
							id="Password"
							onKeyDown={getHotkeyHandler([
								[
									"Enter",
									(e) => {
										document.getElementById("LoginSubmit").click();
									},
								],
							])}
						/>
					</Tooltip>
					<Checkbox label="Keep me logged in" mt="xl" size="md" />
					<Group justify="space-between" mt="lg" className={LoginPage.controls}>
						<Anchor c="dimmed" size="sm" className={LoginPage.control}>
							<Center inline>
								<IconArrowLeft
									style={{ width: rem(12), height: rem(12) }}
									stroke={1.5}
								/>
								<Box ml={5}>Back to the sign-up page</Box>
							</Center>
						</Anchor>
						<Button
							fullWidth={true}
							mt="xl"
							bg={"red.5"}
							size="md"
							type="submit"
							id={"LoginSubmit"}
							className={LoginPage.control}
							rightSection={<IconLogin />}
						>
							{spinner ? <Loader color="red" type="dots" size={30} /> : "Login"}
						</Button>
					</Group>
				</Paper>
			</Box>
			<Box className={classes.wrapperImage} />
		</div>
	);
}
