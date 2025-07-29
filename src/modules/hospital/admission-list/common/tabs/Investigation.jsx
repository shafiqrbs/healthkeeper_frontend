import TabSubHeading from "@modules/hospital/common/TabSubHeading";
import { ActionIcon, Badge, Box, Button, Divider, Flex, Grid, Group, Text, TextInput } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { IconEye, IconSearch, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

const investigationDetails = [
	{
		id: 1,
		text: "Complete Blood Count (CBC)",
	},
	{
		id: 2,
		text: "Hemoglobin (Hb)",
	},
	{
		id: 3,
		text: "Blood Sugar - Fasting (FBS)",
	},
	{
		id: 4,
		text: "Thyroid Profile (T3, T4, TSH)",
	},
];

const complainDetails = [
	{
		id: 1,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
	{
		id: 2,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
	{
		id: 3,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
	{
		id: 4,
		items: ["Complete Blood Count (CBC)", "Hemoglobin (Hb)"],
		date: "25-06-25",
	},
];

export default function Investigation() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={9}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation" />
						<Box p="xxxs">
							<Box mx="-xxxs" p="xs" bg="var(--theme-secondary-color-5)">
								<TextInput
									leftSection={<IconSearch size={18} />}
									name="search"
									placeholder={t("search")}
								/>
							</Box>
							<Box mt="sm">
								{investigationDetails.map((item) => (
									<Fragment key={item.id}>
										<Flex gap="xs" mb="xxxs" justify="space-between" align="center">
											<Text fz="xs">
												{item.id}. {item.text}
											</Text>
											<Button
												size="compact-xs"
												fz="xxs"
												px="xs"
												bg="var(--theme-primary-color-6)"
											>
												Add
											</Button>
										</Flex>
										<Divider mb="xs" />
									</Fragment>
								))}
							</Box>
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={15}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Investigation Details" />
						<Box p="xs">
							{complainDetails.map((item) => (
								<Flex key={item.id} gap="xs" mb="xxxs">
									<Text>{item.id}.</Text>
									<Box w="100%">
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
										<Box mt="es" fz="sm">
											{item.items.map((item, index) => (
												<Flex key={index} justify="space-between" align="center" mb="les">
													{index + 1}. {item}
													<Group gap="xxxs">
														<Button
															variant="light"
															color="var(--theme-primary-color-5)"
															size="compact-xs"
														>
															Status
														</Button>
														<ActionIcon
															variant="light"
															color="var(--theme-secondary-color-5)"
															size="sm"
														>
															<IconEye size={16} stroke={1.5} />
														</ActionIcon>
														<ActionIcon
															variant="light"
															color="var(--theme-error-color)"
															size="sm"
														>
															<IconX size={16} stroke={1.5} />
														</ActionIcon>
													</Group>
												</Flex>
											))}
										</Box>
									</Box>
								</Flex>
							))}
						</Box>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
