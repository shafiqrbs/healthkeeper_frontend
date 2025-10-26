import OPDPos from "../../../modules/hospital/common/print-formats/opd/OPDPosBN";

const DATA = {
	id: 31,
	created: "30-08-25",
	appointment: "30-08-25",
	invoice: "OPD-082500025",
	total: "0",
	comment: null,
	name: "Demo user",
	mobile: "+883 2323 232332",
	guardian_name: "Demo user",
	guardian_mobile: "+883 2323 232332",
	patient_id: "PID-082500026",
	health_id: null,
	gender: "male",
	year: 23,
	month: 10,
	day: 24,
	dob: "10-06-01",
	identity_mode: "BRID",
	nid: null,
	address: "Dhaka, Narayanganj, Sonargaon, Baridhi, Pailopara, Cengakandini,",
	created_by_user_name: "hospital",
	created_by_name: "hospital",
	created_by_id: 15,
	room_name: "101",
	mode_name: "OPD",
	payment_mode_name: "Govt. Service",
	process: "New",
	invoice_particular: [
		{
			id: 25,
			hms_invoice_id: 31,
			item_name: null,
			quantity: 1,
			price: 0,
		},
	],
};
export default function TestRoute() {
	return <OPDPos data={DATA} />;
}
