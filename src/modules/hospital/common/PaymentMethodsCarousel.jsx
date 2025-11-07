import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import { Carousel } from "@mantine/carousel";
import { Image, Stack, Text } from "@mantine/core";

export default function PaymentMethodsCarousel({ selectPaymentMethod, paymentMethod }) {
	return (
		<Carousel height={50} align="start" slideSize="20%" bg="var(--theme-tertiary-color-0)" py="les" loop>
			{PAYMENT_METHODS.map((method) => (
				<Carousel.Slide key={method.id} onClick={() => selectPaymentMethod(method)}>
					<Stack
						bd={
							paymentMethod.id === method.id
								? "2px solid var(--theme-secondary-color-8)"
								: "2px solid transparent"
						}
						h="100%"
						justify="space-between"
						align="center"
						gap="0"
						className="cursor-pointer"
					>
						<Image src={method.icon} alt={method.label} w={30} />
						<Text fz="2xs">{method.label}</Text>
					</Stack>
				</Carousel.Slide>
			))}
		</Carousel>
	);
}
