import React from "react";
import { Button, Center, Container, Group, Paper, Stack, Text, Title, rem } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
	const navigate = useNavigate();
	return (
		<Center mih="100vh" p={0}>
			<Container size={440}>
				<Paper
					shadow="xl"
					p="xl"
					radius="xl"
					withBorder
					style={{ background: "rgba(255,255,255,0.95)" }}
				>
					<Stack align="center" gap={0}>
						<Title
							order={1}
							c="indigo.7"
							ta="center"
							mt={rem(8)}
							style={{ fontWeight: 900, fontSize: rem(48), letterSpacing: rem(2) }}
						>
							404
						</Title>
						<Text size="xl" fw={700} ta="center" mt={rem(4)}>
							Page not found
						</Text>
						<Text c="dimmed" ta="center" mb="md" mt={rem(2)}>
							Sorry, the page you are looking for does not exist or has been moved.
							<br />
							Try checking the URL or return to the homepage.
						</Text>
						<Group justify="center" mt={rem(16)}>
							<Button
								leftSection={<IconHome size={20} />}
								variant="gradient"
								gradient={{ from: "indigo", to: "cyan", deg: 90 }}
								size="md"
								radius="xl"
								style={{ transition: "transform 0.2s", fontWeight: 600 }}
								onMouseOver={(e) =>
									(e.currentTarget.style.transform = "scale(1.05)")
								}
								onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
								onClick={() => navigate("/")}
							>
								Go to Home
							</Button>
						</Group>
					</Stack>
				</Paper>
			</Container>
		</Center>
	);
}
