import { Box, Text, Grid, Group, Image, Flex } from "@mantine/core";
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
				p="md"
				w={PAPER_WIDTH}
				h={PAPER_HEIGHT}
				style={{ overflow: "hidden" }}
				className="watermark"
				ff="Arial, sans-serif"
				lh={1.5}
				fz={12}
				bd="1px solid black"
			>
				{/* =============== header section with doctor information in bengali and english ================ */}
				<Box mb="xs">
					<Grid gutter="md">
						<Grid.Col span={4}>
							<Group ml="md" align="center" h="100%" py="xs">
								<Image src={GLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Text ta="center" fw="bold" size="lg" c="#1e40af" mt="2">
								{getValue(hospitalConfigData?.organization_name, "")}
							</Text>
							<Text ta="center" size="xs" c="gray" mt="2">
								{getValue(hospitalConfigData?.address, "")}
							</Text>
							<Text ta="center" size="xs" c="gray" mb="2">
								{t("হটলাইন")} {getValue(hospitalConfigData?.hotline, "")}
							</Text>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group mr="md" justify="flex-end" align="center" h="100%" py="xs">
								<Image src={TBLogo} alt="logo" width={80} height={80} />
							</Group>
						</Grid.Col>
					</Grid>
				</Box>
				<hr />

				<Box mt="sm" fz="sm">
					<Text fz="sm" mt={"xs"}>
						এটি প্রত্যয়িত যে জনাব/জনাবা <strong>{data?.name}</strong> {data?.patient_id && `(${data?.patient_id})`}।
						পিতা/স্বামী <strong>{data?.father_name || data?.guardian_name || ""}</strong>। বয়স{" "}
						<strong>
							{data?.year ?? 0} বছর, {data?.month ?? 0} মাস, {data?.day ?? 0} দিন
						</strong>
						।
					</Text>
					<Text fz="sm" mt={"xs"}>
						ঠিকানা <strong>{data?.address}</strong>। NID / Birth Reg. Num. <strong>{data?.nid || ""}</strong>
					</Text>
					<Text fz="sm" mt={"xs"}>
						অত্র হাসপাতালের <strong>{data?.admit_department_name || ""}</strong> বিভাগে,{" "}
						<strong>{data?.admit_unit_name || ""}</strong> ইউনিটে, <strong>{data?.room_name || ""}</strong>:{" "}
						<strong>
							{data?.cabin_name || data?.bed_name || ""} {data?.cabin_number || data?.bed_number || ""}
						</strong>{" "}
						শয্যা/কেবিনে
					</Text>
					<Text fz="sm" mt={"xs"}>
						<strong>{formatDateTimeAmPm(data?.admission_date)}</strong> হইতে{" "}
						<strong>
							{data?.discharge_date ? data?.discharge_date : formatDateTimeAmPm(new Date())} {data?.discharge_time}
						</strong>{" "}
						তারিখ পর্যন্ত চিকিৎসাধীন ছিলেন।
					</Text>
					<Text fz="sm" mt={"xs"}>
						তিনি <strong>{`${prescription_data?.disease}, ${prescription_data?.disease_details}`}</strong> রোগে
						ভুগিতেছিলেন।
					</Text>
					{/* =============== first section: results of examination and observation ================ */}
					<hr style={{ marginTop: "12px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					<Text fz="sm" mt={"sm"} fw={600}>
						পরীক্ষা ও পর্যবেক্ষণের ফলাফল
					</Text>
					<Text fz="xs" c="gray">
						Supplied to Patient
					</Text>
					<hr style={{ marginTop: "8px", marginBottom: "12px", border: "none", borderTop: "1px solid #ccc" }} />
					<Flex>
						<Text fz="xs" c="gray">
							{getValue(prescription_data?.examination_investigation, "")}
						</Text>
						<Box
							style={{
								border: "1px solid black",
								width: "200px",
								height: "120px",
								marginLeft: "auto",
								marginRight: "0",
								marginTop: "8px",
								marginBottom: "12px",
							}}
						></Box>
					</Flex>
					{/* =============== second section: description of medical and surgical treatment ================ */}
					<hr style={{ marginTop: "12px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					<Text fz="sm" mt={"sm"} fw={600}>
						প্রদত্ত চিকিৎসা ও শল্য চিকিৎসার বিবরণ
					</Text>
					<Text fz="xs" c="gray">
						Conservative
					</Text>
					<hr style={{ marginTop: "8px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					<Text fz="xs" c="gray">
						{getValue(prescription_data?.treatment_medication, "")}
					</Text>
					<Text fz="sm" mt={"sm"} fw={600}>
						প্রেসক্রাইবড ওষুধসমূহ:
					</Text>
					<hr style={{ marginTop: "8px", marginBottom: "8px", border: "none", borderTop: "1px solid #ccc" }} />
					{prescription_data?.medicines?.map((medicine, index) => (
						<Box key={index}>
							<Flex
								gap="2"
								justify="flex-start"
								align="center"
								direction="row"
								wrap="wrap"
								fw={"600"}
								style={{
									fontSize: "12px",
								}}
							>
								<Text size="xs" fw={600}>
									{index + 1}.
								</Text>
								<Text size="xs" fw={600}>
									{getValue(medicine.medicine_id ? medicine.medicine_name : medicine.generic)}
								</Text>
							</Flex>
							{medicine.dosages && medicine.dosages.length > 0 ? (
								(medicine.dosages || []).map((dose, dIdx) => (
									<Text
										key={dIdx}
										style={{
											fontSize: "11px",
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
									style={{
										fontSize: "11px",
										color: "var(--theme-tertiary-color-8)",
										marginLeft: "32px",
									}}
								>
									{getValue(medicine.dose_details_bn, medicine.dose_details)} {" ---- "}
									{getValue(medicine.by_meal_bn, medicine.by_meal)} {"----"}
									{medicine?.quantity > 0 && getValue(medicine.quantity)}{" "}
									{medicine?.duration && getValue(medicine.duration_mode_bn, medicine.duration)}
								</Text>
							)}
						</Box>
					))}
					<Text fz="sm" mt={"sm"} fw={600}>
						অতিরিক্ত পরামর্শ ও নির্দেশনা:
					</Text>
					<Text fz="sm">{prescription_data?.advise}</Text>
					<br />
					{data?.follow_up_date && (
						<Text fz="sm" mt="xs">
							রোগীকে <strong>{formatDate(data?.follow_up_date)}</strong> তারিখে (বা প্রয়োজনবোধে তার আগে) ফলো‑আপের
							জন্য উপস্থিত হতে পরামর্শ দেওয়া হলো।
						</Text>
					)}
					<Text fz="sm" mt={"xs"}>
						উপরোক্ত তথ্যসমূহ যথাযথভাবে হাসপাতালের নথিতে সংরক্ষণ করার জন্য অনুরোধ করা হলো।
					</Text>
					<Text fz="sm" mt={"sm"}>
						বিনীত,
					</Text>
					<Text fz="sm">
						ডা. <strong>{data?.doctor_name}</strong>
					</Text>
					<Text fz="sm">
						পদবি: <strong>{data?.designation_name}</strong>
					</Text>
					<Text fz="sm">বিভাগ: __________________________________</Text>
					<Text fz="sm">সিল ও স্বাক্ষর: ____________________________</Text>
				</Box>

				<DashedDivider mt={30} mb={0} />
				<Box ta="center">
					<Text size="xs" c="gray" mt="xs">
						<strong>{t("প্রিন্ট")}: </strong>
						{user?.name}
					</Text>
					<Text fz={8}>
						{t("প্রিন্টের সময়")}: {new Date().toLocaleString()}
					</Text>
				</Box>
			</Box>
		</Box>
	);
});

DischargeA4BN.displayName = "DischargeA4BN";

export default DischargeA4BN;
