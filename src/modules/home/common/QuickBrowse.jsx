import { Card, Flex, Group, Text } from "@mantine/core";

export default function QuickBrowse() {
	return (
		<Card padding="lg" radius="sm">
			<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
				<Flex align="center" h="100%" px="lg">
					<Text pb={0} fz="sm" c="white" fw={500}>
						Quick Browse
					</Text>
				</Flex>
			</Card.Section>

			<Group justify="space-between" mt="md" mb="xs">
				<Text fw={500}>Norway Fjord Adventures</Text>
			</Group>

			<Text size="sm" c="dimmed">
				With Fjord Tours you can explore more of the magical fjord landscapes with tours and
				activities on and around the fjords of Norway
			</Text>
		</Card>
	);
}
