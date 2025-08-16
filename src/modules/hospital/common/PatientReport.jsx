import { Box, ScrollArea } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useOutletContext } from "react-router-dom";
import PatientReportAction from "./PatientReportAction";
import BasicInfoCard from "./tab-items/BasicInfoCard";
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

	const [ole, setOle] = useState([false, true, false, false]);
	const [complaints, setComplaints] = useState([false, true, false]);
	const [investigation, setInvestigation] = useState("");
	const [investigationList, setInvestigationList] = useState([
		"Chest X-Ray P/A",
		"Face X-Ray",
		"Head X-Ray",
		"Teeth X-Ray",
	]);

	const handleOleChange = (idx) => {
		setOle((prev) => prev.map((v, i) => (i === idx ? !v : v)));
	};
	const handleComplaintChange = (idx) => {
		setComplaints((prev) => prev.map((v, i) => (i === idx ? !v : v)));
	};

	const generateTabItems = () => {
		switch (tabValue) {
			case "All":
				return (
					<ScrollArea h={height}>
						<BasicInfoCard patientData={patientData} />
						<ChiefComplaints complaints={complaints} handleComplaintChange={handleComplaintChange} />
						<Investigation
							investigation={investigation}
							setInvestigation={setInvestigation}
							investigationList={investigationList}
						/>
					</ScrollArea>
				);
			case "Chief Complaints":
				return (
					<ScrollArea h={height}>
						<BasicInfoCard patientData={patientData} />
						<ChiefComplaints complaints={complaints} handleComplaintChange={handleComplaintChange} />
					</ScrollArea>
				);
			case "Investigation":
				return (
					<ScrollArea h={height}>
						<BasicInfoCard patientData={patientData} />
						<Investigation
							investigation={investigation}
							setInvestigation={setInvestigation}
							investigationList={investigationList}
						/>
					</ScrollArea>
				);
			case "OLE":
				return (
					<ScrollArea h={height}>
						<BasicInfoCard patientData={patientData} />
						<OLE ole={ole} handleOleChange={handleOleChange} />
					</ScrollArea>
				);
			default:
				return null;
		}
	};

	return (
		<Box bg="white" p="les">
			{generateTabItems()}
			<PatientReportAction form={form} />
		</Box>
	);
}
