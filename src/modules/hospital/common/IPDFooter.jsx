import ActionButtons from "./_ActionButtons";

export default function IPDFooter({ form, isSubmitting, handleSubmit, type = "prescription" }) {
	return <ActionButtons form={form} isSubmitting={isSubmitting} handleSubmit={handleSubmit} type={type} />;
}
