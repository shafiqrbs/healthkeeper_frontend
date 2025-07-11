import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { ActionIcon, Box, Button, Checkbox, Flex, Grid, Image, Stack, Text } from "@mantine/core";
import {
	IconArrowsSplit2,
	IconCirclePlusFilled,
	IconHistory,
	IconRefresh,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { Carousel } from "@mantine/carousel";
import InputNumberForm from "@components/form-builders/InputNumberForm";

export default function VisitActionButton({ form }) {
	const { t } = useTranslation();

	return (
		<Stack gap="xxxs" justify="space-between">
			<Grid columns={24}>
				<Grid.Col span={8}>
					<TextAreaForm
						form={form}
						placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its"
						label={t("remark")}
						name="remark"
					/>
				</Grid.Col>
				<Grid.Col span={8}>
					<Stack>
						<InputForm
							form={form}
							label={t("referredName")}
							placeholder={t("name")}
							name="referredName"
							rightSection={
								<IconCirclePlusFilled
									color="var(--theme-primary-color-6)"
									size="24px"
								/>
							}
						/>
						<InputForm
							form={form}
							label={t("marketingEx")}
							placeholder="101"
							name="marketingEx"
							rightSection={
								<IconCirclePlusFilled
									color="var(--theme-primary-color-6)"
									size="24px"
								/>
							}
						/>
					</Stack>
				</Grid.Col>
				<Grid.Col span={8}>
					<Carousel slideGap="xs" align="start" slideSize="20%">
						{PAYMENT_METHODS.map((method) => (
							<Carousel.Slide key={method.value}>
								<Image src={method.icon} alt={method.label} mih={40} />
								<Text>{method.label}</Text>
							</Carousel.Slide>
						))}
					</Carousel>
					<Flex justify="space-between">
						<Flex align="center" gap="xs">
							Is Confirm{" "}
							<Checkbox
								checked={form.values.isConfirm}
								onChange={(event) =>
									form.setFieldValue("isConfirm", event.currentTarget.checked)
								}
								color="var(--theme-success-color)"
							/>
						</Flex>
						<Flex align="center" gap="xs">
							SMS Alert{" "}
							<Checkbox
								checked={form.values.smsAlert}
								onChange={(event) =>
									form.setFieldValue("smsAlert", event.currentTarget.checked)
								}
								color="var(--theme-success-color)"
							/>
						</Flex>
					</Flex>
					<Flex gap="xs" align="center">
						<Text>{t("Due")} ৳ 200000</Text>
						<InputNumberForm form={form} placeholder={t("amount")} name="amount" />
						<ActionIcon color="var(--theme-success-color)">
							<IconArrowsSplit2 size={16} />
						</ActionIcon>
					</Flex>
				</Grid.Col>
			</Grid>
			<Button.Group>
				<Button
					w="100%"
					bg="var(--theme-reset-btn-color)"
					leftSection={<IconHistory size={16} />}
				>
					{t("reset")}
				</Button>
				<Button w="100%" bg="var(--theme-hold-btn-color)">
					{t("Hold")}
				</Button>
				<Button w="100%" bg="var(--theme-prescription-btn-color)">
					{t("prescription")}
				</Button>
				<Button w="100%" bg="var(--theme-print-btn-color)">
					{t("a4Print")}
				</Button>
				<Button w="100%" bg="var(--theme-pos-btn-color)">
					{t("Pos")}
				</Button>
				<Button w="100%" bg="var(--theme-save-btn-color)">
					{t("Save")}
				</Button>
			</Button.Group>
		</Stack>
	);
}
