import __PatientForm from "../../common/__PatientForm";

export default function _Form({ form, selectedRoom, module, setSelectedRoom }) {
	return <__PatientForm module={module} selectedRoom={selectedRoom} form={form} setSelectedRoom={setSelectedRoom} />;
}
