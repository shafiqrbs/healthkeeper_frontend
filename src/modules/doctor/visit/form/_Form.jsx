import PatientForm from "./__PatientForm";

export default function Form({ form }) {
	const handleSubmit = (values) => {
		console.log(values);
	};

	return <PatientForm form={form} handleSubmit={handleSubmit} />;
}
