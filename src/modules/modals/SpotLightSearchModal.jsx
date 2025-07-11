import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	CloseButton,
	Grid,
	GridCol,
	Kbd,
	LoadingOverlay,
	rem,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { IconRestore, IconSearch, IconXboxX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useHotkeys } from "@mantine/hooks";
import getSpotlightDropdownData from "@hooks/spotlight-dropdown/useSpotlightDropdownData.js";
import useConfigData from "@hooks/config-data/useConfigData.js";

function SpotLightSearchModal({ onClose }) {
	const { configData } = useConfigData();
	const [filteredItems, setFilteredItems] = useState([]);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [value, setValue] = useState("");
	const ref = useRef(null);
	const scrollRef = useRef(null);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	// Initialize the loading state as true
	const [visible, setVisible] = useState(true);

	localStorage.setItem("config-data", JSON.stringify(configData));

	const [configDataSpot, setConfigData] = useState(configData);

	// Fetch the configData from local storage and set loading
	useEffect(() => {
		const checkConfigData = () => {
			const storedConfigData = localStorage.getItem("config-data");
			if (storedConfigData) {
				setConfigData(JSON.parse(storedConfigData));
			} else {
				navigate("/login");
			}
		};

		const timeoutId = setTimeout(checkConfigData, 500);

		return () => clearTimeout(timeoutId);
	}, [navigate]);

	useHotkeys([
		[
			"alt+c",
			() => {
				setValue("");
				filterList("");
				ref.current.focus();
			},
		],
	]);

	// Get actions filtered from Spotlight based on configData
	const getActions = () => {
		const actions = getSpotlightDropdownData(t, configDataSpot);
		let index = 0;

		// Assign an index to each action
		return actions.map((group) => ({
			...group,
			actions: group.actions.map((action) => ({
				...action,
				index: index++,
				group: group.group,
			})),
		}));
	};

	// Add user role state
	const [userRole, setUserRole] = useState(() => {
		const userRoleData = localStorage.getItem("user");
		if (!userRoleData) return [];

		try {
			const parsedUser = JSON.parse(userRoleData);

			if (!parsedUser.access_control_role) return [];

			if (Array.isArray(parsedUser.access_control_role)) {
				return parsedUser.access_control_role;
			}

			if (typeof parsedUser.access_control_role === "string") {
				try {
					if (parsedUser.access_control_role.trim() === "") return [];
					return JSON.parse(parsedUser.access_control_role);
				} catch (parseError) {
					console.error("Error parsing access_control_role:", parseError);
					return [];
				}
			}

			return [];
		} catch (error) {
			console.error("Error parsing user data from localStorage:", error);
			return [];
		}
	});

	// Helper function to check if user has access to a group
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

	// Filter the actions based on searchValue and user roles
	const filterList = (searchValue) => {
		const updatedList = getActions().reduce((acc, group) => {
			// Only include actions from groups the user has access to
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

	// Initialize the filtered list when component mounts
	useEffect(() => {
		if (configDataSpot) {
			const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
			setFilteredItems(allActions);
			setTimeout(() => {
				if (allActions) {
					setVisible(false);
				}
			}, 1000);
		}
	}, [configDataSpot]);

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
			const selectedAction = filteredItems[selectedIndex];
			if (selectedAction) {
				const path =
					(selectedAction.group === "Domain" && selectedAction.id === "dashboard") ||
					(selectedAction.group === "ডোমেইন" && selectedAction.id === "dashboard")
						? `b2b/${selectedAction.id}`
						: selectedAction.group === "Production" ||
						  selectedAction.group === "প্রোডাকশন"
						? `production/${selectedAction.id}`
						: selectedAction.group === "Core" || selectedAction.group === "কেন্দ্র"
						? `core/${selectedAction.id}`
						: selectedAction.group === "Inventory" ||
						  selectedAction.group === "ইনভেন্টরি"
						? `inventory/${selectedAction.id}`
						: selectedAction.group === "Domain" || selectedAction.group === "ডোমেইন"
						? `domain/${selectedAction.id}`
						: selectedAction.group === "Accounting" ||
						  selectedAction.group === "একাউন্টিং"
						? `accounting/${selectedAction.id}`
						: selectedAction.group === "Procurement"
						? `procurement/${selectedAction.id}`
						: selectedAction.group === "Sales & Purchase"
						? `inventory/${selectedAction.id}`
						: `/sitemap`;

				navigate(path);
				onClose();
			}
		}
	};
	const [hoveredIndex, setHoveredIndex] = useState(null);

	return (
		<>
			{filteredItems && (
				<>
					<TextInput
						w={`100%`}
						align={"center"}
						justify="space-between"
						ref={ref}
						data-autofocus
						mb={4}
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
											icon={
												<IconRestore
													style={{ width: rem(20) }}
													stroke={2.0}
												/>
											}
											aria-label="Clear input"
											onClick={() => {
												setValue("");
												filterList("");
												ref.current.focus();
											}}
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
										<CloseButton
											ml={"-50"}
											mr={"lg"}
											icon={
												<IconXboxX
													style={{ width: rem(20) }}
													stroke={2.0}
												/>
											}
											aria-label="Close"
											onClick={onClose}
										/>
										<Kbd ml={"-lg"} h={"24"} c={"gray.8"} fz={"12"}>
											Alt{" "}
										</Kbd>{" "}
										+{" "}
										<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"xl"}>
											X
										</Kbd>
									</>
								)}
							</div>
						}
						onChange={(event) => {
							setValue(event.target.value);
							filterList(event.target.value);
						}}
						onKeyDown={handleKeyDown}
						className="no-focus-outline"
					/>

					<ScrollArea
						h={"400"}
						className={"boxBackground borderRadiusAll"}
						type="never"
						ref={scrollRef}
					>
						<LoadingOverlay
							visible={visible}
							zIndex={1000}
							overlayProps={{ radius: "sm", blur: 2 }}
							loaderProps={{ color: "red" }}
						/>
						<Box p={"xs"}>
							{filteredItems.length > 0 ? (
								filteredItems
									.reduce((groups, item) => {
										if (
											!groups.length ||
											item.group !== groups[groups.length - 1].group
										) {
											groups.push({ group: item.group, items: [item] });
										} else {
											groups[groups.length - 1].items.push(item);
										}
										return groups;
									}, [])
									.map((groupData, groupIndex) => {
										// Check if there are any visible items in this group
										const visibleItems = groupData.items.filter(
											(action) =>
												action.isShow && hasAccessToGroup(action.group)
										);

										// Only render the group if it has visible items
										return visibleItems.length > 0 ? (
											<React.Fragment key={groupIndex}>
												<Text
													size="md"
													fw="bold"
													c="#828282"
													mt={groupIndex ? "md" : undefined}
												>
													{groupData.group}
												</Text>
												<Grid columns={12} grow gutter={"xs"}>
													{groupData.items.map(
														(action, itemIndex) =>
															// Only render if user has access and item is marked to show
															action.isShow &&
															hasAccessToGroup(action.group) && (
																<GridCol key={itemIndex} span={6}>
																	<Link
																		to={
																			action.id === "inhouse"
																				? "#"
																				: (action.group ===
																						"Domain" &&
																						action.id ===
																							"dashboard") ||
																				  (action.group ===
																						"ডোমেইন" &&
																						action.id ===
																							"dashboard")
																				? `b2b/${action.id}`
																				: action.group ===
																						"Production" ||
																				  action.group ===
																						"প্রোডাকশন"
																				? `production/${action.id}`
																				: action.group ===
																						"Core" ||
																				  action.group ===
																						"কেন্দ্র"
																				? `core/${action.id}`
																				: action.group ===
																						"Inventory" ||
																				  action.group ===
																						"ইনভেন্টরি"
																				? `inventory/${action.id}`
																				: action.group ===
																						"Domain" ||
																				  action.group ===
																						"ডোমেইন"
																				? `domain/${action.id}`
																				: action.group ===
																						"Accounting" ||
																				  action.group ===
																						"একাউন্টিং"
																				? `accounting/${action.id}`
																				: action.group ===
																				  "Procurement"
																				? `procurement/${action.id}`
																				: action.group ===
																				  "Sales & Purchase"
																				? `inventory/${action.id}`
																				: `/sitemap`
																		}
																		onClick={(e) => {
																			navigate(
																				((action.group ===
																					"Domain" &&
																					action.id ===
																						"dashboard") ||
																				(action.group ===
																					"ডোমেইন" &&
																					action.id ===
																						"dashboard")
																					? `b2b/${action.id}`
																					: action.group ===
																							"Domain" &&
																					  action.id ===
																							"dashboard") ||
																					(action.group ===
																						"ডোমেইন" &&
																						action.id ===
																							"dashboard")
																					? `b2b/${action.id}`
																					: action.group ===
																							"Production" ||
																					  action.group ===
																							"প্রোডাকশন"
																					? `production/${action.id}`
																					: action.group ===
																							"Core" ||
																					  action.group ===
																							"কেন্দ্র"
																					? `core/${action.id}`
																					: action.group ===
																							"Inventory" ||
																					  action.group ===
																							"ইনভেন্টরি"
																					? `inventory/${action.id}`
																					: action.group ===
																							"Domain" ||
																					  action.group ===
																							"ডোমেইন"
																					? `domain/${action.id}`
																					: action.group ===
																							"Accounting" ||
																					  action.group ===
																							"একাউন্টিং"
																					? `accounting/${action.id}`
																					: action.group ===
																					  "Sales & Purchase"
																					? `inventory/${action.id}`
																					: `/sitemap`
																			);
																			onClose();
																		}}
																		style={{
																			textDecoration: "none",
																			color: "inherit",
																		}}
																		onMouseEnter={() => {
																			setHoveredIndex(
																				action.index
																			);
																			setSelectedIndex(-1);
																		}}
																		onMouseLeave={() =>
																			setHoveredIndex(null)
																		}
																	>
																		<Stack
																			bg={"grey.2"}
																			ml={"sm"}
																			id={`item-${action.index}`}
																			className={`
                                                          ${
																filteredItems.indexOf(action) ===
																selectedIndex
																	? "highlightedItem"
																	: ""
															}
                                                          ${
																hoveredIndex === action.index
																	? "hoveredItem"
																	: ""
															}
                                                      `}
																			style={{
																				cursor: "pointer",
																				padding: "8px",
																			}}
																			gap={"0"}
																		>
																			<Stack
																				direction="column"
																				mt={"xs"}
																				gap={"0"}
																				pl={"xs"}
																			>
																				<Title
																					order={6}
																					mt={"2px"}
																					className="title"
																				>
																					{action.label}
																				</Title>
																				<Text
																					size="sm"
																					c={"#828282"}
																					className="description"
																				>
																					{
																						action.description
																					}
																				</Text>
																			</Stack>
																		</Stack>
																	</Link>
																</GridCol>
															)
													)}
												</Grid>
											</React.Fragment>
										) : null;
									})
							) : (
								<Text align="center" size="md" c="#828282" mt="md">
									{t("NoResultsFoundTryDifferentSearchTerm")}
								</Text>
							)}
						</Box>
					</ScrollArea>
				</>
			)}
		</>
	);
}

export default SpotLightSearchModal;
