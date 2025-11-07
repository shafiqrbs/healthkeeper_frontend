import TabSubHeading from "@hospital-components/TabSubHeading";
import { ActionIcon, Badge, Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import SelectForm from "@components/form-builders/SelectForm";
import DatePickerForm from "@/common/components/form-builders/DatePicker";
import { IconX } from "@tabler/icons-react";

const chargeDetails = [
	{
		id: 1,
		date: "25-06-25",
		cabinNo: "101",
		startDate: "25-06-25",
		endDate: "26-06-25",
		charge: 1000,
	},
	{
		id: 2,
		date: "25-06-25",
		cabinNo: "101",
		startDate: "25-06-25",
		endDate: "26-06-25",
		charge: 3000,
	},
	{
		id: 3,
		date: "25-06-25",
		cabinNo: "101",
		startDate: "25-06-25",
		endDate: "26-06-25",
		charge: 6300,
	},
];

const cabinOptions = [
	{ value: "cabin1", label: "Cabin 1" },
	{ value: "cabin2", label: "Cabin 2" },
	{ value: "cabin3", label: "Cabin 3" },
];

export default function Charge() {
	const { mainAreaHeight } = useOutletContext();

	const form = useForm({
		initialValues: {
			cabin: "",
			cabinNo: "",
			startDate: "",
			endDate: "",
			charge: "",
		},
	});

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8} h="100%">
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Charge" />
						<Stack justify="space-between" p="3xs" h={mainAreaHeight - 63 - 70}>
							<Box>
								<SelectForm
									label="Cabin/Ward"
									form={form}
									name="cabin"
									value={form.values.cabin}
									dropdownValue={cabinOptions}
									onChange={(value) => {
										form.setFieldValue("cabin", value);
									}}
								/>

								<DatePickerForm
									mt="xs"
									label="Start Date"
									form={form}
									name="startDate"
									value={form.values.startDate}
									onChange={(value) => {
										form.setFieldValue("startDate", value);
									}}
								/>

								<DatePickerForm
									mt="xs"
									label="End Date"
									form={form}
									name="endDate"
									value={form.values.endDate}
									onChange={(value) => {
										form.setFieldValue("endDate", value);
									}}
								/>
							</Box>

							<TabsActionButtons handleReset={() => {}} handleSave={handleSubmit} />
						</Stack>
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Charge Details" />
						<Box p="xs">
							{chargeDetails.map((item) => (
								<Flex key={item.id} gap="xs" mb="3xs">
									<Text>{item.id}.</Text>
									<Box w="100%">
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.date}
										</Badge>
										<Flex align="center" justify="space-between">
											<Text mt="es" fz="sm">
												Cabin No: {item.cabinNo}
											</Text>
											<Button variant="light" size="xs" color="var(--theme-primary-color-7)">
												৳ {item.charge}
											</Button>
										</Flex>
										<Flex align="center" justify="space-between">
											<Box>
												<Text mt="es" fz="sm">
													Start/End Date:
												</Text>
												<Text mt="es" fz="sm">
													{item.startDate} to {item.endDate} (3 days)
												</Text>
											</Box>
											<ActionIcon variant="light" size="sm" color="var(--theme-error-color)">
												<IconX size={16} stroke={1.5} />
											</ActionIcon>
										</Flex>
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
