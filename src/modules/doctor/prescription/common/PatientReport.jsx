import {
	Box,
	Flex,
	Stack,
	Text,
	Group,
	Checkbox,
	ActionIcon,
	Select,
	TextInput,
	Divider,
	ScrollArea,
} from "@mantine/core";
import React, { useState } from "react";
import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import { IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OLE_OPTIONS = ["Investigation", "Investigation", "Investigation", "Investigation"];
const CHIEF_COMPLAINTS = ["Fever (For 2 days)", "Runny Nose", "Headache"];
const INVESTIGATION_OPTIONS = [
	{ label: "Chest X-Ray P/A", value: "Chest X-Ray P/A" },
	{ label: "CBC", value: "CBC" },
	{ label: "ECG", value: "ECG" },
];
const BLOOD_GROUPS = [
	{ label: "A+", value: "A+" },
	{ label: "A-", value: "A-" },
	{ label: "B+", value: "B+" },
	{ label: "B-", value: "B-" },
	{ label: "O+", value: "O+" },
	{ label: "O-", value: "O-" },
	{ label: "AB+", value: "AB+" },
	{ label: "AB-", value: "AB-" },
];

export default function PatientReport() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const form = useForm({
		initialValues: {
			bp: "120/80",
			sugar: "",
			weight: "",
			bloodGroup: "O+",
		},
	});
	// Form state
	const [vitals, setVitals] = useState({
		bp: "120/80",
		sugar: "",
		weight: "",
		bloodGroup: "O+",
	});
	const [ole, setOle] = useState([false, true, false, false]);
	const [complaints, setComplaints] = useState([false, true, false]);
	const [investigation, setInvestigation] = useState("");
	const [investigationList, setInvestigationList] = useState([
		"Chest X-Ray P/A",
		"Chest X-Ray P/A",
		"Chest X-Ray P/A",
		"Chest X-Ray P/A",
	]);

	// Handlers
	const handleVitalsChange = (field, value) => {
		setVitals((prev) => ({ ...prev, [field]: value }));
	};
	const handleOleChange = (idx) => {
		setOle((prev) => prev.map((v, i) => (i === idx ? !v : v)));
	};
	const handleComplaintChange = (idx) => {
		setComplaints((prev) => prev.map((v, i) => (i === idx ? !v : v)));
	};
	const handleInvestigationAdd = (val) => {
		if (val && !investigationList.includes(val)) {
			setInvestigationList((prev) => [...prev, val]);
		}
		setInvestigation("");
	};
	const handleInvestigationRemove = (idx) => {
		setInvestigationList((prev) => prev.filter((_, i) => i !== idx));
	};

	return (
		<Box bg="white" p="les">
			{/* Header */}
			<Stack gap="xxxs" bg="var(--theme-primary-color-1)" p="xs" className="borderRadiusAll">
				<Flex justify="space-between">
					<Text fw={600}>Md. Shafiqul Islam</Text>
					<Text fz="sm">30-06-25</Text>
				</Flex>
				<Flex justify="space-between">
					<Text fz="xs">
						Patient ID: <b>20</b>
					</Text>
					<Text fz="xs">
						Age: <b>25</b> - Gender: <b>Male</b>
					</Text>
				</Flex>
			</Stack>

			<ScrollArea scrollbars="y" h={mainAreaHeight - 96}>
				{/* Vitals */}
				<Flex gap="les" mt="xxxs" mb="xxxs" wrap="wrap">
					<Group gap="les" grow>
						<Box w={90}>
							<Text fz="xs" mb={2}>
								B/P
							</Text>
							<InputForm
								value={vitals.bp}
								name="bp"
								form={form}
								placeholder=""
								mt={0}
								styles={{ input: { padding: 4, fontSize: 13 } }}
							/>
						</Box>
						<Box w={90}>
							<Text fz="xs" mb={2}>
								Sugar
							</Text>
							<InputForm
								value={vitals.sugar}
								name="sugar"
								form={form}
								placeholder=""
								mt={0}
								styles={{ input: { padding: 4, fontSize: 13 } }}
							/>
						</Box>
					</Group>
					<Group gap="les" grow>
						<Box w={90}>
							<Text fz="xs" mb={2}>
								Weight
							</Text>
							<InputForm
								value={vitals.weight}
								name="weight"
								form={form}
								placeholder=""
								mt={0}
								styles={{ input: { padding: 4, fontSize: 13 } }}
							/>
						</Box>
						<Box w={90}>
							<Text fz="xs" mb={2}>
								Blood Group
							</Text>
							<SelectForm
								value={vitals.bloodGroup}
								name="bloodGroup"
								form={form}
								dropdownValue={BLOOD_GROUPS}
								searchable={false}
								clearable={false}
								mt={0}
								size="xs"
								pt={0}
							/>
						</Box>
					</Group>
				</Flex>

				{/* OLE */}
				<Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" mb="xxxs" className="borderRadiusAll">
					<Text fw={600} fz="sm" mb="xxxs">
						OLE
					</Text>
					<Stack gap="xxxs">
						{OLE_OPTIONS.map((label, idx) => (
							<Checkbox
								key={idx}
								label={label}
								size="sm"
								checked={ole[idx]}
								onChange={() => handleOleChange(idx)}
								styles={{ label: { fontSize: 14 } }}
							/>
						))}
					</Stack>
				</Box>

				{/* Chief Complaints */}
				<Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" mb="xxxs" className="borderRadiusAll">
					<Text fw={600} fz="sm" mb="xxxs">
						Chief Complaints
					</Text>
					<Stack gap="xxxs">
						{CHIEF_COMPLAINTS.map((label, idx) => (
							<Checkbox
								key={idx}
								label={label}
								size="sm"
								checked={complaints[idx]}
								onChange={() => handleComplaintChange(idx)}
								styles={{ label: { fontSize: 14 } }}
							/>
						))}
					</Stack>
				</Box>

				{/* Investigation */}
				<Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" className="borderRadiusAll">
					<Text fw={600} fz="sm" mb="xxxs">
						Investigation
					</Text>
					<Select
						placeholder="Search"
						data={INVESTIGATION_OPTIONS}
						value={investigation}
						onChange={setInvestigation}
						searchable
						nothingFoundMessage="No test found"
						size="xs"
						mb="xxxs"
						onKeyDown={(e) => {
							if (e.key === "Enter" && investigation) handleInvestigationAdd(investigation);
						}}
						onBlur={() => handleInvestigationAdd(investigation)}
					/>
					<Stack gap={0}>
						{investigationList.map((item, idx) => (
							<Flex
								key={idx}
								align="center"
								justify="space-between"
								py={2}
								px={2}
								style={{
									borderBottom: idx !== investigationList.length - 1 ? "1px solid #f0f0f0" : "none",
								}}
							>
								<Text fz="sm">
									{idx + 1}. {item}
								</Text>
								<ActionIcon
									color="red"
									size="xs"
									variant="subtle"
									onClick={() => handleInvestigationRemove(idx)}
								>
									<IconX size={16} />
								</ActionIcon>
							</Flex>
						))}
					</Stack>
				</Box>
			</ScrollArea>
		</Box>
	);
}
