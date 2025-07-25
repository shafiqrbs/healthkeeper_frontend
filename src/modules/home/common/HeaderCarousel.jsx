import { Carousel } from "@mantine/carousel";
import { Flex, NumberFormatter, Progress, Text } from "@mantine/core";
import classes from "@assets/css/Carousel.module.css";
import { IconBed, IconCash, IconCreditCardPay, IconStethoscope, IconTestPipe } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const slides = [
	{
		icon: IconCash,
		title: "balance",
		color: "var(--theme-carousel-item-color)",
		amount: 10971033,
		progress: 70,
	},
	{
		icon: IconCreditCardPay,
		title: "Ticket",
		color: "var(--theme-primary-color-7)",
		amount: 30000,
		progress: 50,
	},
	{
		icon: IconTestPipe,
		color: "var(--theme-carousel-item-color)",
		title: "diagnostic",
		amount: 10000,
		progress: 30,
	},
	{
		icon: IconBed,
		title: "admission",
		color: "var(--theme-primary-color-7)",
		amount: 5000,
		progress: 20,
	},
	{
		icon: IconStethoscope,
		title: "patient",
		color: "var(--theme-carousel-item-color)",
		amount: 1000,
		progress: 10,
	},
];

function Slide({ slide }) {
	const { t } = useTranslation();

	return (
		<Flex
			bg="white"
			direction="column"
			align="center"
			justify="center"
			gap="xs"
			p="md"
			style={{ borderRadius: "4px" }}
			h="100%"
			bd="1px solid var(--theme-tertiary-color-2)"
		>
			<Flex align="center" w="100%" justify="space-between" gap="sm">
				<Text fz="sm" tt="uppercase" fw={500} c="var(--theme-tertiary-color-6)">
					{t(slide.title)}
				</Text>
				<slide.icon size={24} color={slide.color} />
			</Flex>
			<Flex align="center" w="100%" justify="space-between" gap="sm">
				<Text size="sm" c={slide.color} fw={700} fz={24}>
					<NumberFormatter thousandSeparator value={slide.amount} decimalScale={0} fixedDecimalScale />
				</Text>
				<Text size="sm" c={slide.color} fz="md">
					{t("bdt")}
				</Text>
			</Flex>
			<Progress
				styles={{ section: { borderRadius: "50px" } }}
				w="100%"
				value={slide.progress}
				radius="xl"
				color={slide.color}
				h={10}
			/>
		</Flex>
	);
}

export default function HeaderCarousel() {
	return (
		<Carousel
			height="100%"
			slideSize={{ base: "100%", sm: "100%", md: "25%" }}
			slideGap={{ base: 0, sm: "md" }}
			align="start"
			loop
			className="header-carousel"
			classNames={classes}
		>
			{slides.map((slide) => (
				<Carousel.Slide key={slide.id}>
					<Slide slide={slide} />
				</Carousel.Slide>
			))}
		</Carousel>
	);
}
