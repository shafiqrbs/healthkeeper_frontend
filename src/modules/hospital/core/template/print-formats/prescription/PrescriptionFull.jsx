import {Box, Text, Grid, Group, Stack, Image, Table, Flex} from "@mantine/core";
import {forwardRef, useState} from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import DashedDivider from "@components/core-component/DashedDivider";
import CustomDivider from "@components/core-component/CustomDivider";
import { formatDate } from "@/common/utils";
import "@/index.css";
import useDoaminHospitalConfigData from "@hooks/config-data/useHospitalConfigData";
import { t } from "i18next";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {HOSPITAL_DATA_ROUTES} from "@/constants/routes";

const PrescriptionFull = forwardRef(({ data }, ref) => {
	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/59`,
	});
	const patientInfo = prescriptionData?. data || {};
	const jsonContent = JSON.parse(patientInfo?.json_content || "{}");
	const invoiceDetails = prescriptionData?. data?.invoice_details || {};
	const patientReport = jsonContent?.patient_report || {};
	const basicInfo = patientReport?.basic_info || {};
	const patientExamination = patientReport?.patient_examination || {};
	const medicines = jsonContent?.medicines || [];
	const exEmergencies = jsonContent?.exEmergency || [];
	const { hospitalConfigData } = useDoaminHospitalConfigData();
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	console.log(jsonContent)
	const [digitalSignature, setDigitalSignature] = useState([]);
	const renderImagePreview = (imageArray, fallbackSrc = null) => {
		if (imageArray.length > 0) {
			const imageUrl = URL.createObjectURL(imageArray[0]);
			return (
				<Flex h={80} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={80} w={80} fit="cover" src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
				</Flex>
			);
		} else if (fallbackSrc) {
			return (
				<Flex h={80} justify={"center"} align={"center"} mt={"xs"}>
					<Image h={80} w={80} fit="cover" src={fallbackSrc} />
				</Flex>
			);
		}
		return null;
	};

	return (
		<Box>
			<Box
				ref={ref}
				p="md"
				w="210mm"
				mih="1122px"
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				bd="1px solid black"
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box mb="sm">
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%">
								<Image src={GLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{hospitalConfigData?.organization_name || "Hospital"}
							</Text>
							<Text ta="center" size="sm" c="gray" mt="2">
								{hospitalConfigData?.address || "Uttara"}
							</Text>
							<Text ta="center" size="sm" c="gray" mb="2">
								{t("হটলাইন")} {hospitalConfigData?.hotline || "0987634523"}
							</Text>

							<Text ta="center" fw="bold" size="lg" c="#1e40af">
								{t("Prescription")}
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== patient information section ================ */}
				<Box mb="sm">
					<Grid columns={12} gutter="xs" px={4}>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(patientInfo?.invoice || "PT-987654321")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(patientInfo?.patient_id || "PT-987654321")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("নাম")}:
								</Text>
								<Text size="sm">{getValue(patientInfo?.name, "John Doe")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("মোবাইল")}:
								</Text>
								<Text size="xs">{getValue(patientInfo?.mobile || "01717171717")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("বয়স")}:
								</Text>
								<Text size="xs">
									{" "}
									{patientInfo?.day || 1} D {patientInfo?.month || 1} M{" "}
									{patientInfo?.year || ""} Y
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("লিঙ্গ")}:
								</Text>
								<Text size="xs">{patientInfo?.gender && patientInfo.gender[0].toUpperCase() + patientInfo.gender.slice(1)}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={2} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("জন্ম")}
								</Text>
								<Text size="xs">{patientInfo?.dob || ""}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={4} px="xs">
							<Group gap="xs">
								<strong>তারিখ:</strong> {patientInfo?.created || ""}
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box style={{ position: "relative", minHeight: "350px" }} mb="sm">
					<Grid columns={12} gutter="md">
						<Grid.Col span={4}>
							<Stack gap="0px">
								{patientExamination?.chief_complaints && (
									<Box>
										<Text size="sm" fw={600}>
											C/C:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.chief_complaints || [])
												.map(
													(item) => `${item.name}: ${item.value} ${item.duration || "Day"}/s`
												)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.ho_past_illness && (
									<Box>
										<Text size="sm" fw={600}>
											H/O Past Illness:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.ho_past_illness || [])
												.map((item) => `${item.name}`)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.diagnosis && (
									<Box>
										<Text size="sm" fw={600}>
											Diagnosis:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.diagnosis || [])
												.map((item) => item.value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}

								{patientExamination?.icd_11_listed_diseases && (
									<Box>
										<Text size="sm" fw={600}>
											ICD-11 listed diseases:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.icd_11_listed_diseases || []).join(", ") ||
												"Headache, Fever"}
										</Text>
									</Box>
								)}

								{patientExamination?.comorbidity && (
									<Box>
										<Text size="sm" fw={600}>
											Comorbidity:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.comorbidity || [])
												.filter((item) => item.value)
												.map((item) => item.name)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.["treatment-history"] && (
									<Box>
										<Text size="sm" fw={600}>
											Treatment History:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.["treatment-history"] || [])
												.map((item) => item.value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
								{patientExamination?.on_examination && (
									<Box>
										<Text size="sm" fw={600}>
											On/Examination:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="sm" c="gray" mt="-xs" mb="xs">
											Headache, Fever
										</Text>
									</Box>
								)}
								{patientExamination?.investigation && (
									<Box>
										<Text size="sm" fw={600}>
											Investigation:
										</Text>
										<CustomDivider mb="es" borderStyle="dashed" w="90%" />
										<Text size="xs" c="black.5" mt="0">
											{(patientExamination?.investigation || [])
												.map((item) => item.value)
												.join(", ") || "Headache, Fever"}
										</Text>
									</Box>
								)}
							</Stack>
						</Grid.Col>
						<Grid.Col span={8} style={{ borderLeft: "2px solid #555", paddingLeft: "20px" }}>
							<Stack gap="2" mih={200}>
								{exEmergencies.map((emeregncy, index) => (
									<Box key={index}>
										<Text size="xs" fw={600}>
											{index + 1}. {getValue(emeregncy.value)}
										</Text>
									</Box>
								))}
								{medicines.map((medicine, index) => (
									<Box key={index}>
										<Text size="xs" fw={600}>
											{index + 1}. {getValue(medicine.medicine_name)}
										</Text>
										{(medicine.dosages || []).map((dose, dIdx) => (
											<Text
												key={dose.id ?? dIdx}
												size="xs"
												c="var(--theme-tertiary-color-8)"
												ml="md"
											>
												{getValue(dose.dose_details)} {" ------- "}
												{getValue(dose.by_meal)} {" ------- "}
												{getValue(dose.quantity)} {getValue(medicine.duration)}
											</Text>
										))}{
										<Text size="xs" c="var(--theme-tertiary-color-8)" ml="md">
											{getValue(medicine.dose_details)} {" -------"} {getValue(medicine.by_meal)}{" -------"}
											{getValue(medicine.quantity)} {getValue(medicine.duration)}
										</Text>
									   }
									</Box>
								))}
							</Stack>
							<Box mt="4" mb={'4'} style={{ borderBottom: `1px solid #444` }} />
							<Text size="sm" fw={600}>
								অন্যান্য নির্দেশাবলী:
							</Text>
							<Text size="sm">{getValue(jsonContent.advise, "রিপোর্ট সংগ্রহ করে দেখা করবেন")}</Text>
							<Box mt="4" mb={'4'} style={{ borderBottom: `1px solid #444` }} />
							<Text size="sm" fw={600}>
								বিশেষ নির্দেশাবলী:
							</Text>
							<Text size="sm">{getValue(jsonContent.instruction)}</Text>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== new prescription layout matching the image ================ */}
				<Box bd="1px solid #555" style={{ borderRadius: "4px" }}>
					{/* =============== top section with printed by and signature ================ */}
					<Grid columns={12} gutter="0">
						<Grid.Col span={6} pl={'xl'} pt={'md'}>
							<Text fz={'xl'}>{patientInfo?.doctor_name}</Text>
							<Text fz={'xs'}>{patientInfo?.designation_name}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text size="sm" fw={600}>
								{renderImagePreview(digitalSignature, patientInfo?.signature_path)}
							</Text>
						</Grid.Col>
					</Grid>
				</Box>
				<DashedDivider  />
				{/* =============== bottom section with patient info and medication table ================ */}
				<Grid columns={12} gutter="md" mb="lg">
					<Grid.Col span={4}>
						<Stack gap="6px">
							<Text size="sm" fw={500}>
								Name: {getValue(patientInfo?.name, )}
							</Text>
							<Text size="sm" fw={500}>
								Mobile: {getValue(patientInfo?.mobile, )}
							</Text>
							<Text size="xs" fw={500}>
								Room: {getValue(patientInfo?.room_name, )}
							</Text>
							<Text size="xs">
								Age: {getValue(patientInfo?.year, "25")} Y. Sex:{patientInfo?.gender}
							</Text>
							<Text size="sm" fw={600}>
								Doctor Comments:
							</Text>
							<Text size="xs" c="gray">
								{getValue(jsonContent?.pharmacy_instruction )}
							</Text>
						</Stack>
					</Grid.Col>
					<Grid.Col span={8}>
						{/* =============== medication table ================ */}
						<Box style={{ border: "1px solid #333", borderRadius: "4px", overflow: "hidden" }}>
							<Grid columns={24} p={8} bg="#f8f9fa"
								  style={{
									  borderBottom: "1px solid #333",
								  }}>
								<Grid.Col span={20} m={0} p={0}>
									<Text size="xs" pl={4}>
										Generic Name
									</Text>
								</Grid.Col>
								<Grid.Col span={4} m={0} p={0}><Text size="sm" ta="center" fw={500}>
									Quantity
								</Text></Grid.Col>
							</Grid>
								{medicines?.map((medicine, index) => (
									<>
									<Grid columns={24} m={4} p={4}>
										<Grid.Col span={20} m={0} p={0}>
											<Text size="xs" pl={4}>
													{index + 1}. {getValue(medicine.generic)}
											</Text>
										</Grid.Col>
										<Grid.Col span={4} m={0} p={0}><Text size="sm" ta="center" fw={500}>
											{getValue(medicine.quantity, "1")}
										</Text></Grid.Col>
									</Grid>
									</>
									))}


						</Box>
					</Grid.Col>
				</Grid>

				{/* =============== footer with prescribed by ================ */}
				<Box ta="center" mt="xs">
					<Text size="sm" fw={600} c="#1e40af">
						Prescribed By: Doctor ID {getValue(patientInfo?.employee_id, "DOC-987654321")}
					</Text>
					<Text size="sm" c="gray" mt="xs">
						Prescription Date: {formatDate(new Date())}
					</Text>
					{patientInfo?.follow_up_date && (
						<Text size="sm" c="gray" mt="xs">
							Follow Up Date: {formatDate(new Date())}
						</Text>
					)}
				</Box>
			</Box>
		</Box>
	);
});

PrescriptionFull.displayName = "Prescription2";

export default PrescriptionFull;
