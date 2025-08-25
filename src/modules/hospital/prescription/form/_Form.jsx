import PatientForm from "../../common/__PatientForm";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mantine/core";
import { IconDoorEnter, IconDoorExit } from "@tabler/icons-react";
import PatientInformation from "../../common/PatientInformation";
import {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {setInsertType, setRefetchData} from "@/app/store/core/crudSlice";
import GlobalDrawer from "@/common/components/drawers/GlobalDrawer";
import { useDisclosure } from "@mantine/hooks";
import {showEntityData, storeEntityData, updateEntityData} from "@/app/store/core/crudThunk";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import {successNotification} from "@components/notification/successNotification";
import {ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import {errorNotification} from "@components/notification/errorNotification";

export default function Form({ form, isOpenPatientInfo, setIsOpenPatientInfo, setPatientData }) {

	const navigate = useNavigate();
	const params = useParams();
	const [prescription, setPrescription] = useState({});
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

	const handleSubmit = async (values) => {
		try {
			setIsLoading(true);
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${id}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("InsertSuccessfully"),SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message,ERROR_NOTIFICATION_COLOR);
		} finally {

		}
	};

	useEffect(() => {
		handlePrescription(params.prescriptionId);
	}, [params]);

	const handlePrescription = async (id) => {
		const resultAction = await dispatch(
			showEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.EDIT}/${id}`,
				module: "prescription",
				id,
			})
		).unwrap();
		setPrescription(resultAction?.data?.data);
	};
	console.log(prescription);
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
