import ActionButtons from "./_ActionButtons";
import IpdActionButtons from "@hospital-components/_IpdActionButtons";

export default function IPDFooter({ form, isSubmitting, handleSubmit, entities, type = "prescription" }) {
	return (
		<IpdActionButtons
			form={form}
			isSubmitting={isSubmitting}
			entities={entities}
			handleSubmit={handleSubmit}
			type={type}
		/>
	);
}
