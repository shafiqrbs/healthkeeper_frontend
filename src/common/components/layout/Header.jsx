import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	CloseButton,
	Divider,
	Flex,
	Grid,
	Group,
	Image,
	Kbd,
	Menu,
	Modal,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	NavLink,
	ThemeIcon,
	Tooltip,
	UnstyledButton,
	rem,
} from "@mantine/core";

import { setInventoryShowDataEmpty } from "@/app/store/core/crudSlice.js";
import SpotLightSearchModal from "@modules/modals/SpotLightSearchModal";
import LanguagePickerStyle from "@assets/css/LanguagePicker.module.css";
import flagBD from "@assets/images/flags/bd.svg";
import flagGB from "@assets/images/flags/gb.svg";
import logo_default from "@assets/images/logo_default.png";
import shortcutDropdownData from "@hooks/shortcut-dropdown/useShortcutDropdownData";
import { useDisclosure, useFullscreen, useHotkeys, useMediaQuery } from "@mantine/hooks";
import "@mantine/spotlight/styles.css";
import {
	IconArrowRight,
	IconBackspace,
	IconChevronDown,
	IconLogout,
	IconSearch,
	IconWifi,
	IconWifiOff,
	IconWindowMaximize,
	IconWindowMinimize,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getLoggedInUser, getUserRole } from "@/common/utils";

const languages = [
	{ label: "EN", value: "en", flag: flagGB },
	{ label: "BN", value: "bn", flag: flagBD },
];

const getActionPath = (action) => {
	if (
		(action.group === "Domain" && action.id === "dashboard") ||
		(action.group === "ডোমেইন" && action.id === "dashboard")
	) {
		return `b2b/${action.id}`;
	}
	if (action.group === "Production" || action.group === "প্রোডাকশন") {
		return `production/${action.id}`;
	}
	if (action.group === "Core" || action.group === "কেন্দ্র") {
		return `core/${action.id}`;
	}
	if (action.group === "Inventory" || action.group === "ইনভেন্টরি") {
		return `inventory/${action.id}`;
	}
	if (action.group === "Domain" || action.group === "ডোমেইন") {
		return `domain/${action.id}`;
	}
	if (action.group === "Accounting" || action.group === "একাউন্টিং") {
		return `accounting/${action.id}`;
	}
	if (action.group === "Procurement") {
		return `procurement/${action.id}`;
	}
	if (action.group === "Sales & Purchase") {
		return `inventory/${action.id}`;
	}
	return `/sitemap`;
};

// Logo Component
const Logo = ({ configData, navigate }) => {
	if (!configData?.path) {
		return (
			<NavLink
				component="button"
				bg="transparent"
				style={{
					color: "white",
					fontWeight: 800,
					whiteSpace: "nowrap",
				}}
				styles={{
					body: {
						overflow: "unset",
					},
				}}
				unselectable="on"
				label={configData?.domain?.company_name || configData?.domain?.name || ""}
				onClick={() => navigate("/")}
			/>
		);
	}

	return (
		<Flex pl={16} align="center" h="100%">
			<Tooltip label={configData?.domain?.company_name || ""} position="right" withArrow>
				<Anchor
					target="_blank"
					underline="never"
					onClick={() => navigate("/")}
					style={{
						backgroundColor: "#C6AF9D",
						color: "white",
						fontWeight: 800,
						transition: "background 1s",
					}}
				>
					<Image
						mah={40}
						radius="md"
						src={`${import.meta.env.VITE_IMAGE_GATEWAY_URL}/uploads/inventory/logo/${
							configData.path
						}`}
					/>
				</Anchor>
			</Tooltip>
		</Flex>
	);
};

// Search Button Component
const SearchButton = ({ t, onClick, matches2 }) => (
	<Button
		ml="auto"
		leftSection={
			<>
				<IconSearch size={16} c={"white"} />
				{!matches2 && (
					<Text fz={`xs`} pl={"xs"} c={"gray.8"}>
						{t("SearchMenu")}
					</Text>
				)}
			</>
		}
		fullWidth={!matches2}
		maw={matches2 ? 40 : "100%"}
		variant="transparent"
		rightSection={
			<>
				{!matches2 && (
					<>
						<Kbd h={"24"} c={"gray.8"} fz={"12"}>
							Alt{" "}
						</Kbd>{" "}
						+{" "}
						<Kbd c={"gray.8"} h={"24"} fz={"12"}>
							{" "}
							K
						</Kbd>
					</>
				)}
			</>
		}
		justify="space-between"
		style={{ border: "1px solid #49362366" }}
		color={"black"}
		bg={"white"}
		onClick={onClick}
		className="no-focus-outline"
	/>
);

// Search Input Component
const SearchInput = ({ value, onChange, onKeyDown, onClear }) => {
	const { t } = useTranslation();
	return (
		<TextInput
			w={"100%"}
			align={"center"}
			pr={"lg"}
			justify="space-between"
			data-autofocus
			leftSection={<IconSearch size={16} c={"red"} />}
			placeholder={t("SearchMenu")}
			value={value}
			rightSectionPointerEvents="all"
			rightSection={
				<div style={{ display: "flex", alignItems: "center" }}>
					{value ? (
						<>
							<CloseButton
								ml={"-50"}
								mr={"xl"}
								icon={<IconBackspace style={{ width: rem(24) }} stroke={1.5} />}
								aria-label="Clear input"
								onClick={onClear}
							/>
							<Kbd ml={"-xl"} h={"24"} c={"gray.8"} fz={"12"}>
								Alt
							</Kbd>{" "}
							+{" "}
							<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
								C
							</Kbd>
						</>
					) : (
						<>
							<Kbd ml={"-lg"} h={"24"} c={"gray.8"} fz={"12"}>
								Alt{" "}
							</Kbd>{" "}
							+{" "}
							<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
								X
							</Kbd>
						</>
					)}
				</div>
			}
			onChange={onChange}
			onKeyDown={onKeyDown}
			className="no-focus-outline"
		/>
	);
};

// Action Item Component
const ActionItem = ({ action, isSelected, onClick }) => (
	<Link
		id={`item-${action.index}`}
		className={"link"}
		to={getActionPath(action)}
		onClick={onClick}
	>
		<Group
			wrap="nowrap"
			align="center"
			justify="left"
			pt={"4"}
			pb={"4"}
			className={isSelected ? "highlightedItem" : ""}
		>
			<ThemeIcon size={18} color={"#242424"} variant="transparent">
				<IconArrowRight />
			</ThemeIcon>
			<Text size="sm" className={`${isSelected ? "highlightedItem" : ""} ${"link"}`}>
				{action.label}
			</Text>
		</Group>
	</Link>
);

// Language Picker Component
const LanguagePicker = ({ languageSelected, onLanguageChange }) => {
	return (
		<Menu radius="md" width="target" withinPortal withArrow arrowPosition="center">
			<Menu.Target>
				<UnstyledButton p={2} bg={"red"} className={LanguagePickerStyle.control}>
					<Group gap="xs">
						<Image src={languageSelected?.flag} width={18} height={18} />
						<span className={LanguagePickerStyle.label}>{languageSelected?.label}</span>
					</Group>
					<IconChevronDown size="1rem" className={LanguagePickerStyle.icon} stroke={1} />
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown p={4} className={LanguagePickerStyle.dropdown}>
				{languages.map((item) => (
					<Menu.Item
						p={4}
						leftSection={<Image src={item.flag} width={18} height={18} />}
						onClick={() => onLanguageChange(item)}
						key={item.label}
					>
						{item.label}
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};

// Header Actions Component
const HeaderActions = ({
	isOnline,
	fullscreen,
	toggle,
	loginUser,
	t,
	onLogout,
	languageSelected,
	handleLanguageChange,
}) => (
	<Flex
		gap="sm"
		justify="flex-end"
		direction="row"
		wrap="wrap"
		mih={42}
		align={"right"}
		px={"xs"}
		pr={"24"}
	>
		<LanguagePicker
			languageSelected={languageSelected}
			onLanguageChange={handleLanguageChange}
		/>
		<Tooltip label={fullscreen ? t("NormalScreen") : t("Fullscreen")} bg={"#635031"} withArrow>
			<ActionIcon mt={"6"} onClick={toggle} variant="subtle" color={"white"}>
				{fullscreen ? <IconWindowMinimize size={24} /> : <IconWindowMaximize size={24} />}
			</ActionIcon>
		</Tooltip>
		<Tooltip
			label={
				<>
					<Stack spacing={0} gap={0}>
						<Text align="center">
							{loginUser?.name} ( {loginUser?.username} )
						</Text>
						<Text align="center">{t("LogoutAltL")}</Text>
					</Stack>
				</>
			}
			bg={"#635031"}
			withArrow
			position={"left"}
			multiline
		>
			<ActionIcon onClick={onLogout} variant="subtle" mt={"6"} color={"white"}>
				<IconLogout size={24} />
			</ActionIcon>
		</Tooltip>
		<Tooltip
			label={isOnline ? t("Online") : t("Offline")}
			bg={isOnline ? "green.5" : "red.5"}
			withArrow
		>
			<ActionIcon
				mt={"6"}
				variant="filled"
				radius="xl"
				color={isOnline ? "green.5" : "red.5"}
			>
				{isOnline ? (
					<IconWifi color={"white"} size={24} />
				) : (
					<IconWifiOff color={"white"} size={24} />
				)}
			</ActionIcon>
		</Tooltip>
	</Flex>
);

export default function Header({ isOnline, configData, mainAreaHeight }) {
	const userRole = getUserRole();
	const [opened, { open, close }] = useDisclosure(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const height = mainAreaHeight - 140;
	const { toggle, fullscreen } = useFullscreen();
	const [languageSelected, setLanguageSelected] = useState(
		languages.find((item) => item.value === i18n.language)
	);
	const loginUser = getLoggedInUser();
	const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
	const [value, setValue] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const matches = useMediaQuery("(max-width: 1070px)");
	const matches2 = useMediaQuery("(max-width: 768px)");

	const getActions = () => {
		const actions = shortcutDropdownData(t, configData);
		let index = 0;
		return actions.map((group) => ({
			...group,
			actions: group.actions.map((action) => ({
				...action,
				index: index++,
				group: group.group,
			})),
		}));
	};

	const hasAccessToGroup = (group) => {
		if (userRole.includes("role_domain")) return true;

		switch (group) {
			case "Production":
			case "প্রোডাকশন":
				return userRole.includes("role_production");
			case "Core":
			case "কেন্দ্র":
				return userRole.includes("role_core");
			case "Inventory":
			case "ইনভেন্টরি":
				return userRole.includes("role_inventory");
			case "Domain":
			case "ডোমেইন":
				return userRole.includes("role_domain");
			case "Accounting":
			case "একাউন্টিং":
				return userRole.includes("role_accounting");
			case "Procurement":
				return userRole.includes("role_procurement");
			case "Sales & Purchase":
				return userRole.includes("role_sales_purchase");
			default:
				return false;
		}
	};

	const filterList = (searchValue) => {
		const updatedList = getActions().reduce((acc, group) => {
			if (hasAccessToGroup(group.group)) {
				const filteredActions = group.actions.filter((action) =>
					action.label.toLowerCase().includes(searchValue.toLowerCase())
				);
				return [...acc, ...filteredActions];
			}
			return acc;
		}, []);

		setFilteredItems(updatedList);
		setSelectedIndex(-1);
	};

	const clearSearch = () => {
		setValue("");
		const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
		setFilteredItems(allActions);
		setSelectedIndex(0);
	};

	const handleKeyDown = (event) => {
		if (filteredItems.length === 0) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((prevIndex) =>
				prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 1
			);
		} else if (event.key === "Enter" && selectedIndex >= 0) {
			handleActionSelect(filteredItems[selectedIndex]);
		}
	};

	const handleActionSelect = (selectedAction) => {
		if (selectedAction) {
			const path = getActionPath(selectedAction);
			navigate(path);
			setValue("");
			setShortcutModalOpen(false);
		}
	};

	const handleSearchChange = (event) => {
		setValue(event.target.value);
		filterList(event.target.value);
	};

	const handleLanguageChange = (item) => {
		setLanguageSelected(item);
		i18n.changeLanguage(item.value);
	};

	const handleLogout = () => {
		dispatch(setInventoryShowDataEmpty());
		localStorage.clear();
		navigate("/login");
	};

	useHotkeys(
		[
			["alt+k", () => setShortcutModalOpen(true)],
			["alt+x", () => setShortcutModalOpen(false)],
			["alt+l", handleLogout],
			["alt+c", clearSearch],
		],
		[]
	);

	useEffect(() => {
		if (selectedIndex >= 0 && filteredItems.length > 0) {
			const selectedElement = document.getElementById(
				`item-${filteredItems[selectedIndex].index}`
			);
			if (selectedElement) {
				selectedElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	}, [selectedIndex, filteredItems]);

	useEffect(() => {
		const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
		setFilteredItems(allActions);
	}, [shortcutModalOpen === true]);

	return (
		<>
			<Modal.Root opened={opened} onClose={close} size="64%">
				<Modal.Overlay />
				<Modal.Content p={"xs"}>
					<Modal.Header ml={"xs"}>
						<Modal.Title>
							{configData?.domain?.company_name || configData?.domain?.name || ""}
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<SpotLightSearchModal onClose={close} configData={configData} />
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
			<Box bg="var(--theme-primary-color-6)" mb="2" pos="relative">
				<Grid columns={24} justify="space-between" gutter={{ base: 2 }}>
					<Grid.Col span={6}>
						<Logo configData={configData} navigate={navigate} />
					</Grid.Col>
					<Grid.Col span={matches2 ? 6 : matches ? 10 : 12}>
						<Group gap={"md"} wrap="nowrap" mih={42}>
							<SearchButton
								matches2={matches2}
								t={t}
								onClick={() => setShortcutModalOpen(true)}
							/>
							<Modal
								opened={shortcutModalOpen}
								onClose={() => setShortcutModalOpen(false)}
								centered
								size="450"
								padding="md"
								radius="md"
								styles={{
									title: {
										width: "100%",
										margin: 0,
										padding: 0,
									},
								}}
								overlayProps={{
									backgroundOpacity: 0.7,
									blur: 3,
								}}
								title={
									<Box>
										<SearchInput
											value={value}
											onChange={handleSearchChange}
											onKeyDown={handleKeyDown}
											onClear={clearSearch}
										/>
									</Box>
								}
								transitionProps={{ transition: "fade", duration: 200 }}
							>
								<Divider my="sm" mt={0} />
								<ScrollArea type={"never"} scrollbars="y" h={height}>
									{filteredItems.length > 0 ? (
										<Stack spacing="xs">
											{filteredItems
												.reduce((groups, item) => {
													const existingGroup = groups.find(
														(g) => g.group === item.group
													);
													if (existingGroup) {
														existingGroup.items.push(item);
													} else {
														groups.push({
															group: item.group,
															items: [item],
														});
													}
													return groups;
												}, [])
												.map((groupData, groupIndex) => (
													<Box key={groupIndex}>
														<Text
															size="sm"
															fw="bold"
															c="#828282"
															pb={"xs"}
														>
															{groupData.group}
														</Text>
														<Stack
															bg="var(--mantine-color-body)"
															justify="flex-start"
															align="stretch"
															gap="2"
														>
															{groupData.items.map(
																(action, itemIndex) => (
																	<ActionItem
																		key={itemIndex}
																		action={action}
																		isSelected={
																			filteredItems.indexOf(
																				action
																			) === selectedIndex
																		}
																		onClick={() => {
																			setShortcutModalOpen(
																				false
																			);
																			setValue("");
																			navigate(
																				getActionPath(
																					action
																				)
																			);
																		}}
																	/>
																)
															)}
														</Stack>
													</Box>
												))}
										</Stack>
									) : (
										<Text align="center" mt="md" c="dimmed">
											{t("NoResultsFound")}
										</Text>
									)}
								</ScrollArea>
								<div className={"titleBackground"}>
									<Group justify="space-between" mt={"xs"}>
										<div>
											<Text fw={500} fz="sm">
												{t("Sitemap")}
											</Text>
											<Text size="xs" c="dimmed">
												{t("SitemapDetails")}
											</Text>
										</div>
										<Button
											className={"btnPrimaryBg"}
											size="xs"
											onClick={() => navigate("/")}
										>
											{t("Sitemap")}
										</Button>
									</Group>
								</div>
							</Modal>
						</Group>
					</Grid.Col>
					<Grid.Col span={matches2 ? 12 : matches ? 8 : 6}>
						<HeaderActions
							isOnline={isOnline}
							fullscreen={fullscreen}
							toggle={toggle}
							loginUser={loginUser}
							t={t}
							onLogout={handleLogout}
							languageSelected={languageSelected}
							handleLanguageChange={handleLanguageChange}
						/>
					</Grid.Col>
				</Grid>
			</Box>
		</>
	);
}
