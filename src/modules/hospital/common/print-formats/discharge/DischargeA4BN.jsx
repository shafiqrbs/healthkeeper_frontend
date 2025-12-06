import { Box, Text, Grid, Group, Image, Divider } from "@mantine/core";
import { forwardRef } from "react";
import GLogo from "@assets/images/government_seal_of_bangladesh.svg";
import TBLogo from "@assets/images/tb_logo.png";
import "@/index.css";
import DashedDivider from "@components/core-component/DashedDivider";
import { formatDate } from "@/common/utils";
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
				<Divider />

				<Box mt="sm" fz="sm">
					<Text fz="sm" fw={700}>
						তারিখ: {formatDate(new Date())}
					</Text>
					<Text fz="sm" mt={"sm"}>
						বরাবর,
					</Text>
					<Text fz="sm">পরিচালক</Text>
					<Text fz="sm">_____________________________ হাসপাতাল</Text>
					<Text fz="sm">_____________________________ (ঠিকানা)</Text>
					<Text fz="sm" mt={"sm"} fw={700}>
						বিষয়: রোগী ছাড়পত্রের আবেদন।
					</Text>
					<Text fz="sm" mt={"sm"}>
						মহোদয়/মহোদয়া,
					</Text>
					<Text fz="sm" mt={"xs"}>
						আমি, ডা. ______________________________________, এই মর্মে জানাচ্ছি যে রোগী
						জনাব/জনাবা ______________________________________, বয়স ______ বছর, লিঙ্গ
						__________, ঠিকানা ________________________________________, আমাদের
						হাসপাতালে ____ / ____ / ______ তারিখে ভর্তি হন।
					</Text>
					<Text fz="sm" mt={"xs"}>
						রোগীকে ____________________________ (প্রাথমিক রোগ/অভিযোগ) কারণে ভর্তি করা
						হয়। ভর্তি-পরবর্তী সময়ে প্রয়োজনীয় পরীক্ষা-নিরীক্ষা ও চিকিৎসা প্রদান করা
						হয়েছে। রোগীর অবস্থা ধীরে ধীরে উন্নতি লাভ করে এবং বর্তমানে তিনি স্থিতিশীল ও
						সন্তোষজনক অবস্থায় রয়েছেন।
					</Text>
					<Text fz="sm" mt={"xs"}>
						চিকিৎসাকালীন সময়ে রোগীকে ____________________________ (চিকিৎসার সারসংক্ষেপ)
						প্রদান করা হয়েছে। বর্তমান শারীরিক অবস্থা স্থিতিশীল এবং রোগীকে বাসায় ফেরার
						উপযোগী বিবেচিত হয়েছে।
					</Text>
					<Text fz="sm" mt={"xs"}>
						অতএব, রোগীকে আজ ____ / ____ / ______ তারিখে হাসপাতাল থেকে ছাড়পত্র প্রদান করা
						হলো।
					</Text>
					<Text fz="sm" mt={"sm"} fw={600}>
						প্রেসক্রাইবড ওষুধসমূহ:
					</Text>
					<Text fz="sm">• Apzalen 2 BP - 1+1+1 --- Gurgle after water --- 50</Text>
					<Text fz="sm">• Ciprofloxacin 500 mg BD --- After food --- 20</Text>
					<Text fz="sm">• Azithromycin 500 mg BD --- After food --- 10</Text>

					{data?.medicines?.map((medicine) => (
						<Text key={medicine?.medicine_id} fz="sm" mt="sm" fw={600}>
							{medicine?.medicine_name}
						</Text>
					))}
					<Text fz="sm" mt={"sm"} fw={600}>
						অতিরিক্ত পরামর্শ ও নির্দেশনা:
					</Text>
					<Text fz="sm">{data?.advice}</Text>
					<Text fz="sm" mt="xs">
						রোগীকে {formatDate(data?.follow_up_date)} তারিখে (বা প্রয়োজনবোধে তার আগে)
						ফলো‑আপের জন্য উপস্থিত হতে পরামর্শ দেওয়া হলো।
					</Text>
					<Text fz="sm" mt={"xs"}>
						উপরোক্ত তথ্যসমূহ যথাযথভাবে হাসপাতালের নথিতে সংরক্ষণ করার জন্য অনুরোধ করা
						হলো।
					</Text>
					<Text fz="sm" mt={"sm"}>
						বিনীত,
					</Text>
					<Text fz="sm">ডা. ______________________________________</Text>
					<Text fz="sm">পদবি: ___________________________________</Text>
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
