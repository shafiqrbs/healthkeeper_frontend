import { Drawer, Flex, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";

export default function GlobalDrawer({ opened, close, title, children }) {
	return (
		<Drawer.Root opened={opened} onClose={close} position="right" closeOnClickOutside={false}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header
					styles={{
						header: {
							borderBottom: `1px solid var(--theme-drawer-border-color)`,
							marginBottom: "10px",
						},
					}}
				>
					<Drawer.Title>
						<Flex align="center" gap={4}>
							<IconArrowLeft size={16} />{" "}
							<Text mt={2} fz={16} fw={500}>
								{title}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Drawer.Body>{children}</Drawer.Body>
			</Drawer.Content>
		</Drawer.Root>
	);
}
