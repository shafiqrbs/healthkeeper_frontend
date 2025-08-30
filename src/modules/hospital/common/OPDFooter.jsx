import { useRef } from "react";
import ActionButtons from "./_ActionButtons";
import { useReactToPrint } from "react-to-print";
import OPDDocument from "@/common/components/print-formats/opd/OPDA4";
import OPDPos from "@/common/components/print-formats/opd/OPDPos";
import Prescription2 from "@/common/components/print-formats/opd/Prescription2";

export default function OPDFooter({ form, isSubmitting, handleSubmit, type }) {
	const opdDocumentA4Ref = useRef(null);
	const opdDocumentPosRef = useRef(null);
	const prescriptionRef = useRef(null);

	const handleA4 = useReactToPrint({
		content: () => opdDocumentA4Ref.current,
	});

	const handlePos = useReactToPrint({
		content: () => opdDocumentPosRef.current,
	});

	const handlePrescription = useReactToPrint({
		content: () => prescriptionRef.current,
	});

	const handleA4PrintWithData = () => {
		handleA4();
		handleSubmit();
	};

	const handlePosPrintWithData = async () => {
		const res = await handleSubmit();

		if (res.status === 200) {
			handlePos();
		}
	};

	const handlePrescriptionPrint = () => {
		handlePrescription();
		handleSubmit();
	};

	return (
		<ActionButtons
			form={form}
			isSubmitting={isSubmitting}
			handleSubmit={handleSubmit}
			handlePrescriptionPrint={handlePrescriptionPrint}
			handleA4Print={handleA4PrintWithData}
			handlePosPrint={handlePosPrintWithData}
			type={type}
		>
			<Prescription2 data={form.values} ref={prescriptionRef} />
			<OPDDocument data={form.values} ref={opdDocumentA4Ref} />
			<OPDPos data={form.values} ref={opdDocumentPosRef} />
		</ActionButtons>
	);
}
