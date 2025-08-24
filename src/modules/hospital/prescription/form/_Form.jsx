import PatientForm from "../../common/__PatientForm";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mantine/core";
import { IconDoorEnter, IconDoorExit } from "@tabler/icons-react";
import PatientInformation from "../../common/PatientInformation";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setInsertType } from "@/app/store/core/crudSlice";
import GlobalDrawer from "@/common/components/drawers/GlobalDrawer";
import { useDisclosure } from "@mantine/hooks";

export default function Form({ form, isOpenPatientInfo, setIsOpenPatientInfo, setPatientData }) {
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const insertType = useSelector((state) => state.crud.prescription.insertType);
	const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

	useEffect(() => {
		dispatch(
			setInsertType({
				insertType: params.id ? "edit" : "create",
				module: "prescription",
			})
		);
		if (params.id) openDrawer();
	}, [params, dispatch]);

	const handleSubmit = (values) => {
		console.log(values);
	};

	const handleCloseDrawer = () => {
		closeDrawer();
		navigate("/hospital/prescription");
	};

	return (
		<>
			{insertType === "edit" && (
				<GlobalDrawer
					offset={18}
					position="left"
					opened={openedDrawer}
					close={handleCloseDrawer}
					title="Patient Information"
					size="60%"
				>
					<PatientForm form={form} handleSubmit={handleSubmit} />
				</GlobalDrawer>
			)}
			<Box className="right-arrow-button" onClick={() => setIsOpenPatientInfo(!isOpenPatientInfo)}>
				{isOpenPatientInfo ? <IconDoorEnter size={20} /> : <IconDoorExit size={20} />}
			</Box>
			<PatientInformation
				isOpenPatientInfo={isOpenPatientInfo}
				setIsOpenPatientInfo={setIsOpenPatientInfo}
				setPatientData={setPatientData}
			/>
		</>
	);
}
