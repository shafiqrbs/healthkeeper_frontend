import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import React, { useState } from "react";

export default function PatientInformation() {
	const [rootRef, setRootRef] = useState(null);
	const [tabValue, setTabValue] = useState("new");
	const [controlsRefs, setControlsRefs] = useState({});
	return (
		<TabsWithSearch
			tabValue={tabValue}
			setTabValue={setTabValue}
			rootRef={rootRef}
			setRootRef={setRootRef}
			controlsRefs={controlsRefs}
			setControlsRefs={setControlsRefs}
			newChild={<div>New</div>}
			reportChild={<div>Report</div>}
			reVisitChild={<div>Re-Visit</div>}
		/>
	);
}
