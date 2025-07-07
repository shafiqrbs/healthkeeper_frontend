import { Box, Card, Flex, Text, Tabs } from "@mantine/core";

export default function Overview() {
	return (
		<Card padding="lg" radius="sm">
			<Card.Section h={32} withBorder component="div" bg="var(--mantine-color-green-8)">
				<Flex align="center" h="100%" px="lg">
					<Text pb={0} fz="sm" c="white" fw={500}>
						Overview
					</Text>
				</Flex>
			</Card.Section>

			<Box pt="md">
				<Tabs
					bg="var(--theme-primary-color-0)"
					orientation="vertical"
					defaultValue="gallery"
				>
					<Tabs.List>
						<Tabs.Tab value="gallery">Gallery</Tabs.Tab>
						<Tabs.Tab value="messages">Messages</Tabs.Tab>
						<Tabs.Tab value="settings">Settings</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

					<Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

					<Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
				</Tabs>
			</Box>
		</Card>
	);
}
