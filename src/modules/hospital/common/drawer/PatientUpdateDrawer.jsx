import InputForm from "@components/form-builders/InputForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

export default function PatientUpdateDrawer({ opened, close, type, data }) {
	const form = useForm({
		initialValues: {
			name: "",
			mobile: "",
			nid: "",
			age: "",
			opd_room: "",
		},
	});

	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	useEffect(() => {
		form.setFieldValue("name", data?.name || "");
		form.setFieldValue("mobile", data?.mobile || "");
	}, [data]);

	const handleSubmit = async (values) => {
		try {
			// if(type === "opd") {
			// } else {
			// }
			console.log(values);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<GlobalDrawer opened={opened} close={close} title="Patient Update" size="35%">
			<Box component="form" onSubmit={form.onSubmit(handleSubmit)} pt="lg">
				<Stack mih={mainAreaHeight - 100} justify="space-between">
					<Grid align="center" columns={20}>
						<Grid.Col span={6}>
							<Text fz="sm">{t("Name")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<InputForm
								form={form}
								label=""
								tooltip={t("EnterPatientName")}
								placeholder="Md. Abdul"
								name="name"
								id="name"
								nextField="mobile"
								value={form.values.name}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text fz="sm">{t("Mobile")}</Text>
						</Grid.Col>
						<Grid.Col span={14}>
							<InputForm
								form={form}
								label=""
								tooltip={t("EnterPatientMobile")}
								placeholder="+880 1700000000"
								name="mobile"
								id="mobile"
								nextField="nid"
								value={form.values.mobile}
							/>
						</Grid.Col>
					</Grid>

					<Flex gap="xs" justify="flex-end">
						<Button type="submit" bg="var(--theme-primary-color-6)" color="white">
							{t("Save")}
						</Button>
						<Button type="button" bg="var(--theme-tertiary-color-6)" color="white" onClick={close}>
							{t("Cancel")}
						</Button>
					</Flex>
				</Stack>
			</Box>
		</GlobalDrawer>
	);
}
