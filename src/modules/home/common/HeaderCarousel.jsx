import React from "react";
import { Carousel } from "@mantine/carousel";
import { Flex, Text } from "@mantine/core";
import {
	IconBed,
	IconCash,
	IconCreditCardPay,
	IconStethoscope,
	IconTestPipe,
} from "@tabler/icons-react";

const slides = [
	{
		icon: IconCash,
		title: "Balance",
		color: "var(--theme-primary-color-7)",
		amount: 10971033,
		progress: 80,
	},
	{
		icon: IconCreditCardPay,
		title: "Expense",
		color: "var(--theme-carousel-item-color)",
		amount: 30000,
		progress: 50,
	},
	{
		icon: IconTestPipe,
		title: "Diagnostic",
		color: "var(--theme-primary-color-7)",
		amount: 10000,
		progress: 30,
	},
	{
		icon: IconBed,
		title: "Admission",
		color: "var(--theme-carousel-item-color)",
		amount: 5000,
		progress: 20,
	},
	{
		icon: IconStethoscope,
		title: "Patient",
		color: "var(--theme-primary-color-7)",
		amount: 1000,
		progress: 10,
	},
];

function Slide({ slide }) {
	return (
		<Flex
			bg="white"
			direction="column"
			align="center"
			justify="center"
			gap={10}
			p="md"
			style={{ borderRadius: "2px" }}
		>
			<slide.icon size={40} color={slide.color} />
			<Text size="lg" fw={500} c={slide.color}>
				{slide.title}
			</Text>
			<Text size="sm" c={slide.color}>
				{slide.progress}%
			</Text>
		</Flex>
	);
}

export default function HeaderCarousel() {
	return (
		<Carousel
			withIndicators
			height={130}
			slideSize={{ base: "100%", sm: "100%", md: "25%" }}
			slideGap={{ base: 0, sm: "md" }}
			emblaOptions={{ loop: true, align: "start" }}
		>
			{slides.map((slide) => (
				<Carousel.Slide key={slide.id}>
					<Slide slide={slide} />
				</Carousel.Slide>
			))}
		</Carousel>
	);
}
