import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { ActionIcon, Box, Button, Flex, Grid, ScrollArea, SegmentedControl, Text } from "@mantine/core";
import { IconCalendar, IconUser, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

const patientList = [
	{
		id: 1,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 2,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 3,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 4,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 5,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 6,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 7,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 8,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 9,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 10,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 11,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 12,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 13,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 14,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 15,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
	{
		id: 16,
		date: "30-06-25",
		name: "MD. Shafiqul",
		patientId: "0000234",
		mobile: "+88012345678",
	},
];

function PatientList() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();

	return (
		<Box pos="relative">
			<Flex gap="sm" p="les" mt="xxxs" c="white" bg="var(--theme-primary-color-6)">
				<Text fz="sm" fw={500}>
					S/N
				</Text>
				<Text fz="sm" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea scrollbars="y" h={mainAreaHeight - 240}>
				{patientList.map((patient) => (
					<Grid columns={14} my="xs" bg="var(--theme-secondary-color-0)" px="les">
						<Grid.Col span={1}>
							<Text fz="sm" fw={500}>
								{patient.id}.
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Flex align="center" gap="es">
								<IconCalendar size={16} stroke={1.5} />
								<Text fz="sm">{patient.date}</Text>
							</Flex>
							<Flex align="center" gap="es">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{patient.patientId}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={5}>
							<Text fz="sm">{patient.name}</Text>
							<Text fz="sm">{patient.mobile}</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Flex align="center" h="100%" justify="flex-end" gap="es">
								<Button variant="filled" size="xs" color="var(--theme-primary-color-6)">
									{t("confirm")}
								</Button>
								<ActionIcon variant="transparent" aria-label="close">
									<IconX size={16} stroke={1.5} color="var(--theme-error-color)" />
								</ActionIcon>
							</Flex>
						</Grid.Col>
					</Grid>
				))}
			</ScrollArea>
		</Box>
	);
}

export default function PatientInformation() {
	const { t } = useTranslation();
	const [rootRef, setRootRef] = useState(null);
	const [tabValue, setTabValue] = useState("new");
	const [controlsRefs, setControlsRefs] = useState({});
	return (
		<Box>
			<Flex justify="space-between" align="center" bg="white" py="xxxs" px="xs">
				<Text>{t("patientInformation")}</Text>
				<SegmentedControl
					size="xs"
					color="var(--theme-primary-color-6)"
					data={["List", "New"]}
					styles={{
						root: { backgroundColor: "var(--theme-secondary-color-1)" },
						control: { width: "60px" },
					}}
				/>
			</Flex>
			<TabsWithSearch
				tabValue={tabValue}
				setTabValue={setTabValue}
				rootRef={rootRef}
				setRootRef={setRootRef}
				controlsRefs={controlsRefs}
				setControlsRefs={setControlsRefs}
				newChild={<PatientList />}
				reportChild={<PatientList />}
				reVisitChild={<PatientList />}
			/>
		</Box>
	);
}
