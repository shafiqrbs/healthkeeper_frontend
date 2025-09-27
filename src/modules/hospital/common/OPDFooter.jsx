import { useRef, useState, useEffect } from "react";
import ActionButtons from "./_ActionButtons";
import { useReactToPrint } from "react-to-print";
import OPDDocument from "@components/print-formats/opd/OPDA4";
import OPDPos from "@components/print-formats/opd/OPDPos";

export default function OPDFooter({ form, isSubmitting, handleSubmit, type }) {
	const [printData, setPrintData] = useState(null);
	const [pendingPrint, setPendingPrint] = useState(null); // "a4" | "pos" | null

	const opdDocumentA4Ref = useRef(null);
	const opdDocumentPosRef = useRef(null);

	const printA4 = useReactToPrint({ content: () => opdDocumentA4Ref.current });
	const printPos = useReactToPrint({ content: () => opdDocumentPosRef.current });

	// Run print only after data is updated
	useEffect(() => {
		if (!printData || !pendingPrint) return;

		if (pendingPrint === "a4") printA4();
		if (pendingPrint === "pos") printPos();

		setPendingPrint(null);
	}, [printData, pendingPrint]);

	const handlePrint = async (type) => {
		const res = await handleSubmit();
		if (res?.status === 200) {
			console.log(res);
			setPrintData(res.data);
			setPendingPrint(type); // triggers effect after data updates
		}
	};

	return (
		<ActionButtons
			form={form}
			isSubmitting={isSubmitting}
			handleSubmit={handleSubmit}
			handleA4Print={() => handlePrint("a4")}
			handlePosPrint={() => handlePrint("pos")}
			type={type}
		>
			<OPDDocument data={printData} ref={opdDocumentA4Ref} />
			<OPDPos data={printData} ref={opdDocumentPosRef} />
		</ActionButtons>
	);
}
