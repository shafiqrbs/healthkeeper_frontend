import { Box, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import PatientReportAction from "./PatientReportAction";
import BasicInfoCard from "./tab-items/BasicInfoCard";
import Vitals from "./tab-items/Vitals";
import ChiefComplaints from "./tab-items/ChiefComplaints";
import Investigation from "./tab-items/Investigation";
import OLE from "./tab-items/OLE";

export default function PatientReport({ patientData, tabValue }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 118;
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

	const generateTabItems = () => {
		console.log(tabValue);
		if (tabValue === "All") {
			return (
				<ScrollArea h={height}>
					<BasicInfoCard patientData={patientData} />
					<Vitals vitals={vitals} form={form} />
					<ChiefComplaints complaints={complaints} handleComplaintChange={handleComplaintChange} />
					<Investigation
						investigation={investigation}
						setInvestigation={setInvestigation}
						investigationList={investigationList}
					/>
				</ScrollArea>
			);
		} else if (tabValue === "Vitals") {
			return (
				<ScrollArea h={height}>
					<Vitals vitals={vitals} form={form} />
				</ScrollArea>
			);
		} else if (tabValue === "Chief Complaints") {
			return (
				<ScrollArea h={height}>
					<ChiefComplaints complaints={complaints} handleComplaintChange={handleComplaintChange} />
				</ScrollArea>
			);
		} else if (tabValue === "Investigation") {
			return (
				<ScrollArea h={height}>
					<Investigation
						investigation={investigation}
						setInvestigation={setInvestigation}
						investigationList={investigationList}
					/>
				</ScrollArea>
			);
		} else if (tabValue === "OLE") {
			return (
				<ScrollArea h={height}>
					<OLE ole={ole} handleOleChange={handleOleChange} />
				</ScrollArea>
			);
		}
	};

	return (
		<Box bg="white" p="les">
			{generateTabItems()}
			<PatientReportAction form={form} />
		</Box>
	);
}
