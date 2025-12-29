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
	Image,
} from "@mantine/core";
import LoginPage from "@assets/css/LoginPage.module.css";
import classes from "@assets/css/AuthenticationImage.module.css";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { IconInfoCircle, IconLogin, IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import commonDataStoreIntoLocalStorage from "@hooks/local-storage/useCommonDataStoreIntoLocalStorage.js";
import { API_BASE_URL, API_KEY } from "@/constants";
import useAppLocalStore from "@/common/hooks/useAppLocalStore";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/useAuthStore.js";
import TBLogo from "@assets/images/tb_logo.png";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";

export default function LoginJwt() {
	const { user } = useAppLocalStore();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [spinner, setSpinner] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		initialValues: { username: "", password: "" },

		validate: {
			username: isNotEmpty(),
			password: isNotEmpty(),
		},
	});

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

	axios.defaults.withCredentials = true;

	function login(data) {
		setSpinner(true);
		axios({
			method: "POST",
			url: `${API_BASE_URL}/login-tb`,
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
					const token = res.data.data.token;
					const decoded = jwtDecode(token);

					useAuthStore.getState().setUserData({
						token: token,
						decoded: decoded,
						user_warehouse: res.data.data.user_warehouse,
						hospital_config: res.data.data.hospital_config,
					});

					localStorage.setItem("user", JSON.stringify(decoded)); // remove when full implement

					commonDataStoreIntoLocalStorage(decoded?.id).then(() => {
						setErrorMessage("");
						setSpinner(false);

						const userRoles = JSON.parse(decoded.access_control_role || []);
						const ALLOWED_OPD_DOCTOR_ROLES = ["doctor_opd"];
						const ALLOWED_IPD_DOCTOR_ROLES = ["doctor_ipd"];
						const ALLOWED_LAB_ROLES = ["lab_operator", "lab_assistant", "doctor_lab"];
						const ALLOWED_EMERGENCY_ROLES = ["doctor_emergency", "operator_emergency"];
						if (userRoles.some((role) => ALLOWED_OPD_DOCTOR_ROLES.includes(role))) {
							navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX);
							return null;
						}
						if (userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role))) {
							navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.INDEX);
							return null;
						}
						if (userRoles.some((role) => ALLOWED_EMERGENCY_ROLES.includes(role))) {
							navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX);
							return null;
						}
						if (userRoles.some((role) => ALLOWED_IPD_DOCTOR_ROLES.includes(role))) {
							navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX);
							return null;
						}
						// return navigate("/");
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

	if (!user?.id) {
		return (
			<div className={classes.wrapper}>
				<Box component="form" onSubmit={form.onSubmit((values) => login(values))}>
					<Paper className={classes.form} radius={0} p={30}>
						<Box>
							<Group mr="md" justify="center" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={120} height={120} />
							</Group>
						</Box>
						<Title order={2} className={classes.title} ta="center" mt="md" mb={80}>
							{t("WelcomeToLogin")}
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
							<Button
								fullWidth={true}
								mt="xl"
								bg={"var(--theme-primary-color-6)"}
								size="md"
								type="submit"
								id={"LoginSubmit"}
								className={LoginPage.control}
								rightSection={<IconLogin />}
							>
								{spinner ? <Loader color="white" type="dots" size={30} /> : "Login"}
							</Button>
						</Group>
					</Paper>
				</Box>
				<Box className={classes.wrapperImage} />
			</div>
		);
	} else {
		return null;
	}
}
