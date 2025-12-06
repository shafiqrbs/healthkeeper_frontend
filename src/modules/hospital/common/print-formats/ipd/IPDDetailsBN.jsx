import { Box, Text, Grid, Group, Stack, Image } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import DashedDivider from "@components/core-component/DashedDivider";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { t } from "i18next";
import useHospitalConfigData from "@hooks/config-data/useHospitalConfigData";

const PAPER_HEIGHT = 1122;
const PAPER_WIDTH = 793;

const IPDDetailsBN = forwardRef(({ data, preview = false }, ref) => {
	const { user } = useAppLocalStore();

	const patientInfo = data || {};
	const jsonContent = data?.json_content || {};
	const medicines = jsonContent?.medicines || [];
	const { hospitalConfigData } = useHospitalConfigData();

	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

	return (
		<Box display={preview ? "block" : "none"}>
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

				{/* =============== patient information section ================ */}
				<Box mb="xs">
					<Grid columns={12} gutter="xs" px={4}>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("প্রকার")} {getValue(patientInfo?.mode_name, "")}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="md" fw={600}>
									{t("বহির্বিভাগ কক্ষ")}
								</Text>
								<Text size="md">{getValue(patientInfo?.room_name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(patientInfo?.invoice, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">{getValue(patientInfo?.patient_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("HID")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.health_id, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs" />
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={6} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("নাম")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.name, "")}</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("মোবাইল")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.mobile, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("লিঙ্গ")}
								</Text>
								<Text size="xs">
									{patientInfo?.gender &&
										patientInfo.gender[0].toUpperCase() +
											patientInfo.gender.slice(1)}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs">
									{t("তারিখ")}: {getValue(patientInfo?.created)}
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("বয়স")}
								</Text>
								<Text size="xs">
									{getValue(patientInfo?.year, 0)} Y,{" "}
									{getValue(patientInfo?.month, 0)} M,{" "}
									{getValue(patientInfo?.day, 0)} D
								</Text>
							</Group>
						</Grid.Col>
						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("জন্ম তারিখ")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.dob, "")}</Text>
							</Group>
						</Grid.Col>

						<Grid.Col bd="1px solid #555" span={3} px="xs">
							<Group gap="xs">
								<Text size="xs" fw={600}>
									{t("ফি পরিমাণ")}
								</Text>
								<Text size="xs">{getValue(patientInfo?.total, 0)}</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>

				{/* =============== medical notes and prescription area with rx symbol ================ */}
				<Box style={{ position: "relative", minHeight: "350px" }} mb="lg">
					<Grid columns={12} gutter="md">
						<Grid.Col span={4}></Grid.Col>
						<Grid.Col
							span={8}
							style={{ borderLeft: "2px solid #555", paddingLeft: "20px" }}
						>
							<Stack gap="xs" h={PAPER_HEIGHT - 330} justify="space-between">
								<Box>
									<Text fz="xl" fw="bold" pl="sm">
										Rx.
									</Text>
									{medicines.map((medicine, index) => (
										<Box key={index}>
											<Text size="xs" fw={600} mb="xs">
												{index + 1}. {getValue(medicine.medicineName)}
											</Text>
											<Text
												size="xs"
												c="var(--theme-tertiary-color-8)"
												ml="md"
											>
												{getValue(medicine.dosage)}{" "}
												{getValue(medicine.by_meal)}{" "}
												{getValue(medicine.duration)}{" "}
												{getValue(medicine.count)}
											</Text>
										</Box>
									))}
								</Box>
								<Box p="les">
									<DashedDivider mb="0" mt="0" />
									{/* =============== top section with printed by and signature ================ */}
									<Grid columns={12} gutter="md">
										<Grid.Col span={6}>
											<Text mt="md" size="sm" fw={600}>
												{t("ডাক্তারের নাম")}:
												.................................
											</Text>
										</Grid.Col>
										<Grid.Col span={6}>
											<Text mt="md" size="sm" fw={600}>
												{t("পদবি")}: ..........................
											</Text>
										</Grid.Col>
									</Grid>
								</Box>
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>
				<DashedDivider mt={0} mb={0} />
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

IPDDetailsBN.displayName = "IPDDetailsBN";

export default IPDDetailsBN;
