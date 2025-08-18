import { Modal, Grid, Box, useMantineTheme } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function UserViewModal({ userViewModel, setUserViewModel }) {
	const { t } = useTranslation();
	const entityEditData = useSelector((state) => state.crud.user.editData);
	const theme = useMantineTheme();
	const closeModel = () => {
		setUserViewModel(false);
	};

	return (
		<Modal
			opened={userViewModel}
			onClose={closeModel}
			title={t("UserInformation")}
			size="75%"
			overlayProps={{
				color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.dark[8],
				opacity: 0.9,
				blur: 3,
			}}
		>
			<Box m={"md"}>
				<Grid columns={24}>
					<Grid.Col span={"6"} align={"left"} fw={"600"} fz={"14"}>
						{t("Name")}
					</Grid.Col>
					<Grid.Col span={"1"}>:</Grid.Col>
					<Grid.Col span={"auto"}>{entityEditData && entityEditData.name && entityEditData.name}</Grid.Col>
				</Grid>
				<Grid columns={24}>
					<Grid.Col span={"6"} align={"left"} fw={"600"} fz={"14"}>
						{t("UserName")}
					</Grid.Col>
					<Grid.Col span={"1"}>:</Grid.Col>
					<Grid.Col span={"auto"}>
						{entityEditData && entityEditData.username && entityEditData.username}
					</Grid.Col>
				</Grid>
				<Grid columns={24}>
					<Grid.Col span={"6"} align={"left"} fw={"600"} fz={"14"}>
						{t("Mobile")}
					</Grid.Col>
					<Grid.Col span={"1"}>:</Grid.Col>
					<Grid.Col span={"auto"}>
						{entityEditData && entityEditData.mobile && entityEditData.mobile}
					</Grid.Col>
				</Grid>
				<Grid columns={24}>
					<Grid.Col span={"6"} align={"left"} fw={"600"} fz={"14"}>
						{t("Email")}
					</Grid.Col>
					<Grid.Col span={"1"}>:</Grid.Col>
					<Grid.Col span={"auto"}>{entityEditData && entityEditData.email && entityEditData.email}</Grid.Col>
				</Grid>
			</Box>
		</Modal>
	);
}
