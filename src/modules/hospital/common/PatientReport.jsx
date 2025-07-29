import { Box, Flex, Stack, Text, Group, Checkbox, ActionIcon, Select, ScrollArea } from "@mantine/core";
import { useState } from "react";
import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import { IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PatientReportAction from "./PatientReportAction";

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

export default function PatientReport({ patientData }) {
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
		"Face X-Ray",
		"Head X-Ray",
		"Teeth X-Ray",
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
			<Stack gap="xxxs" bg="var(--theme-primary-color-1)" p="xs" className="borderRadiusAll">
				<Flex justify="space-between">
					<Text fw={600}>{patientData.name}</Text>
					<Text fz="sm">{patientData.date}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text fz="xs">
						Patient ID: <b>{patientData.patientId || "N/A"}</b>
					</Text>
					<Text fz="xs">
						{t("age")}: <b>{patientData.age}</b> - {t("gender")}: <b>{patientData.gender || "Male"}</b>
					</Text>
				</Flex>
			</Stack>

			<ScrollArea scrollbars="y" h={mainAreaHeight - 136}>
				<Flex gap="les" mt="xxxs" mb="xxxs" wrap="wrap">
					<Group gap="les" grow w="100%" px="les">
						<InputForm
							value={vitals.bp}
							label={t("bp")}
							name="bp"
							tooltip="Blood Pressure"
							form={form}
							placeholder="120/80"
							mt={0}
							styles={{ input: { padding: "es", fontSize: "sm" } }}
						/>
						{/* <InputForm
							value={vitals.sugar}
							label={t("sugar")}
							name="sugar"
							tooltip="Sugar"
							form={form}
							placeholder="5.6"
							mt={0}
							styles={{ input: { padding: "es", fontSize: "sm" } }}
						/> */}
					</Group>
					<Group gap="les" grow w="100%" px="les">
						<InputForm
							value={vitals.weight}
							label={t("weight")}
							name="weight"
							tooltip="Weight"
							form={form}
							placeholder="50"
							mt={0}
							styles={{ input: { padding: "es", fontSize: "sm" } }}
						/>
						<SelectForm
							value={vitals.bloodGroup}
							label={t("bloodGroup")}
							name="bloodGroup"
							form={form}
							dropdownValue={BLOOD_GROUPS}
							searchable={false}
							clearable={false}
							mt={0}
							size="sm"
							pt={0}
						/>
					</Group>
				</Flex>

				{/* <Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" mb="xxxs" className="borderRadiusAll">
					<Text fw={600} fz="sm" mb="xxxs">
						{t("ole")}
					</Text>
					<Stack gap="xxxs" bg="white" p="sm" className="borderRadiusSmall">
						{OLE_OPTIONS.map((label, idx) => (
							<Checkbox
								key={idx}
								label={label}
								size="sm"
								checked={ole[idx]}
								color="var(--theme-primary-color-6)"
								onChange={() => handleOleChange(idx)}
								styles={{ label: { fontSize: "sm" } }}
							/>
						))}
					</Stack>
				</Box> */}

				<Box bg="var(--theme-primary-color-0)" p="xs" mt="xxxs" mb="xxxs" className="borderRadiusAll">
					<Text fw={600} fz="sm" mb="xxxs">
						Chief Complaints
					</Text>
					<Stack gap="xxxs" bg="white" p="sm" className="borderRadiusSmall">
						{CHIEF_COMPLAINTS.map((label, idx) => (
							<Checkbox
								key={idx}
								label={label}
								size="sm"
								checked={complaints[idx]}
								color="var(--theme-primary-color-6)"
								onChange={() => handleComplaintChange(idx)}
								styles={{ label: { fontSize: "sm" } }}
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
					<Stack gap={0} bg="white" px="sm" className="borderRadiusAll">
						{investigationList.map((item, idx) => (
							<Flex
								key={idx}
								align="center"
								justify="space-between"
								px="es"
								py="xs"
								style={{
									borderBottom:
										idx !== investigationList.length - 1
											? "1px solid var(--theme-tertiary-color-4)"
											: "none",
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
			<PatientReportAction form={form} />
		</Box>
	);
}
