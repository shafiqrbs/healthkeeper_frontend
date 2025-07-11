import { Drawer, Flex, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";

export default function GlobalDrawer({ opened, close, title, size = "35%", position = "right", children }) {
	return (
		<Drawer.Root opened={opened} onClose={close} position={position} closeOnClickOutside={false} offset={10} radius="sm" size={size}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header
					mb="xs"
					styles={{
						header: {
							borderBottom: `1px solid var(--theme-drawer-border-color)`,
							backgroundColor: `var(--theme-primary-color-0)`,
						},
					}}
				>
					<Drawer.Title>
						<Flex align="center" gap={8}>
							<IconArrowLeft size={16} />{" "}
							<Text mt={2} fz={16} fw={500}>
								{title}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>
				<Drawer.Body pb="xs">{children}</Drawer.Body>
			</Drawer.Content>
		</Drawer.Root>
	);
}
