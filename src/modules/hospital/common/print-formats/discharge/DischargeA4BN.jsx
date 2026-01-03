import { Box, Text, Grid, Group, Image, Flex, Table } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import DashedDivider from "@components/core-component/DashedDivider";
import { formatDate, formatDateTimeAmPm } from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const DischargeA4BN = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	const prescription_data = JSON.parse(data?.json_content || "{}");

	return (
		<Box display={preview ? "block" : "none"}>
			<style>
				{`@media print {
					table { border-collapse: collapse !important; }
					table, table th, table td { border: 1px solid #807e7e !important; }
				}`}
			</style>
			<Box
				ref={ref}
				p="60"
				pt={"xl"}
				w={PAPER_WIDTH}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz="md"
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box mb="xs">
					<Flex gap="md" justify="center">
						<Box>
							<Group ml="md" align="center" h="100%">
								<Image src={GLogo} alt="logo" width={60} height={60} />
							</Group>
						</Box>
						<Box>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{hospitalConfigData?.organization_name || ""}
							</Text>
							<Text ta="center" size="sm" c="gray" mt="2">
								{hospitalConfigData?.address || ""}
							</Text>
							<Text ta="center" size="sm" c="gray" mb="2">
								{t("হটলাইন")} {hospitalConfigData?.hotline || ""}
							</Text>
						</Box>
						<Box>
							<Group mr="md" justify="flex-end" align="center" h="100%">
								<Image src={TBLogo} alt="logo" width={60} height={60} />
							</Group>
						</Box>
					</Flex>
					<hr />
					<Text ta={"center"} fz={"xl"} fw={"600"}>
						রোগীর ছাড়পত্র
					</Text>
				</Box>
				<hr />
				<Box mt="sm" fz="md">
					<Text fz="md" mt={"xl"}>
						প্রত্যায়ন করা যাইতেছে যে জনাব/জনাবা <strong>{data?.name}</strong>{" "}
						{data?.patient_id && `(${data?.patient_id})`}। পিতা/স্বামী{" "}
						<strong>{data?.guardian_name || data?.father_name || ""}</strong>। বয়স{" "}
						<strong>
							{data?.year ? `${data.year} ${t("বছর")} ` : ""}
							{data?.month ? `${data.month} ${t("মাস")} ` : ""}
							{data?.day ? `${data.day} ${t("দিন")}` : ""}
						</strong>
						।
					</Text>
					<Text fz="md" mt={"xs"}>
						ঠিকানা <strong>{data?.address}</strong>। NID / Birth Reg. Num. <strong>{data?.nid || ""}</strong>
					</Text>
					<Text fz="md" mt={"xs"}>
						অত্র হাসপাতালের <strong>{data?.admit_department_name || ""}</strong> বিভাগে,{" "}
						<strong>{data?.admit_unit_name || ""}</strong> ইউনিটে, <strong>{data?.room_name || ""}</strong>{" "}
						শয্যা/কেবিনে <strong>{formatDateTimeAmPm(data?.admission_date)}</strong> হইতে{" "}
						<strong>{formatDateTimeAmPm(data?.release_date)}</strong> তারিখ পর্যন্ত চিকিৎসাধীন ছিলেন।
					</Text>
					<Text fz="md" mt={"xs"} style={{ height: "120px" }}>
						তিনি <strong>{`${prescription_data?.disease || ""}, ${prescription_data?.disease_details || ""}`}</strong>{" "}
						রোগে ভুগিতেছিলেন।
					</Text>
					{/* =============== first section: results of examination and observation ================ */}
					<hr style={{ marginTop: "60px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					<Text fz="md" mt={"sm"} fw={600}>
						পরীক্ষা ও পর্যবেক্ষণের ফলাফল:
					</Text>
					<hr style={{ border: "none", borderTop: "1px solid #ccc" }} />
					<Text style={{ height: "240px" }}>{getValue(prescription_data?.examination_investigation, "")}</Text>
					{/* =============== second section: description of medical and surgical treatment ================ */}
					<hr style={{ marginTop: "12px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					<Text fz="md" mt={"sm"} fw={600}>
						প্রদত্ত চিকিৎসা ও শল্য চিকিৎসার বিবরণ:
					</Text>
					<hr style={{ border: "none", borderTop: "1px solid #ccc" }} />
					<Text style={{ height: "260px" }}>{getValue(prescription_data?.treatment_medication, "")}</Text>
					<Text fz="md" mt={"sm"} fw={600}>
						হাসপাতাল ত্যাগকালে উপদেশ ও ব্যবস্থাপত্র
					</Text>
					<hr style={{ marginTop: "8px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					{prescription_data?.medicines?.map((medicine, index) => (
						<Box key={index}>
							<Flex
								gap="4"
								justify="flex-start"
								align="center"
								direction="row"
								wrap="wrap"
								fw={"600"}
								style={{
									fontSize: "12px",
								}}
							>
								<Text size="sm" fw={600}>
									*
								</Text>
								<Text size="" fw={600}>
									{getValue(medicine.medicine_id ? medicine.medicine_name : medicine.generic)}
								</Text>
								<Text pl={'md'}>  {getValue(medicine.dose_details_bn, medicine.dose_details)} {" ---- "}
									{getValue(medicine.by_meal_bn, medicine.by_meal)} {"----"}
									{medicine?.quantity > 0 && getValue(medicine.quantity)}{" "}
									{medicine?.duration && getValue(medicine.duration_mode_bn, medicine.duration)}</Text>
							</Flex>
							{/*{medicine.dosages && medicine.dosages.length > 0 ? (
								(medicine.dosages || []).map((dose, dIdx) => (
									<Text
										size="sm"
										key={dIdx}
										style={{
											color: "var(--theme-tertiary-color-8)",
											marginLeft: "32px",
										}}
									>
										{getValue(dose.dose_details_bn, dose.dose_details)} {" ---- "}
										{getValue(dose.by_meal_bn, dose.by_meal)} {" ---- "}
										{dose?.quantity > 0 && getValue(dose.quantity)}{" "}
										{dose.duration && getValue(dose.duration_mode_bn, dose.duration)}
									</Text>
								))
							) : (
								<Text
									size="sm"
									style={{
										color: "var(--theme-tertiary-color-8)",
										marginLeft: "32px",
									}}
								>
									{getValue(medicine.dose_details_bn, medicine.dose_details)} {" ---- "}
									{getValue(medicine.by_meal_bn, medicine.by_meal)} {"----"}
									{medicine?.quantity > 0 && getValue(medicine.quantity)}{" "}
									{medicine?.duration && getValue(medicine.duration_mode_bn, medicine.duration)}
								</Text>
							)}*/}
						</Box>
					))}
					{prescription_data?.advise && (
						<>
							<Text fz="md" mt={"sm"} fw={600}>
								উপদেশ ও নির্দেশনা:
							</Text>
							<Text fz="md">{prescription_data?.advise}</Text>
						</>
					)}
					<br />
					{prescription_data?.follow_up_date && (
						<Text fz="md" mt="xs">
							{prescription_data?.follow_up_date}
						</Text>
					)}
					{prescription_data?.doctor_comment && (
						<Text fz="md" mt="xs">
							<strong>বিঃ দ্রঃ {prescription_data?.doctor_comment}</strong>
						</Text>
					)}
					<Text fz="md"><strong>{data?.doctor_name}</strong>
					</Text>
					<Text fz="md">
						পদবি: <strong>{data?.designation_name}</strong><br/>
					</Text>
					<Text fz="md">বিভাগ: __________________________________</Text>
					<Text fz="md">সিল ও স্বাক্ষর: ____________________________</Text>
				</Box>
			</Box>
		</Box>
	);
});

DischargeA4BN.displayName = "DischargeA4BN";

export default DischargeA4BN;
