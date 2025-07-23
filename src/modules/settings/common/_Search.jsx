import { useState } from "react";
import { rem, Grid, Tooltip, TextInput, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconRestore, IconSearch, IconX, IconPdf, IconFileTypeXls } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalFetching, setSearchKeyword } from "@/app/store/core/crudSlice.js";

export default function Search(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const userFilterData = useSelector((state) => state.crud.userFilterData);

	useHotkeys(
		[
			[
				"alt+F",
				() => {
					document.getElementById("SearchKeyword").focus();
				},
			],
		],
		[]
	);

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && searchKeyword.length > 0) {
			dispatch(setGlobalFetching(true)), setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true),
				setTimeout(() => {
					setSearchKeywordTooltip(false);
				}, 1500);
		}
	};

	return (
		<>
			<Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
				<Grid.Col span="8">
					<Tooltip
						label={t("EnterSearchAnyKeyword")}
						opened={searchKeywordTooltip}
						px="md"
						py="es"
						position="top-end"
						color="var(--theme-error-color)"
						withArrow
						offset={2}
						zIndex={100}
						transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
					>
						<TextInput
							leftSection={<IconSearch size={16} opacity={0.5} />}
							size="sm"
							placeholder={t("EnterSearchAnyKeyword")}
							onKeyDown={handleKeyDown}
							onChange={(e) => {
								dispatch(setSearchKeyword(e.currentTarget.value));
								e.target.value !== ""
									? setSearchKeywordTooltip(false)
									: (setSearchKeywordTooltip(true),
									  setTimeout(() => {
											setSearchKeywordTooltip(false);
									  }, 1000));
							}}
							value={searchKeyword}
							id={"SearchKeyword"}
							rightSection={
								searchKeyword ? (
									<Tooltip label={t("Close")} withArrow bg="var(--theme-error-color)">
										<IconX
											color="var(--theme-error-color)"
											size={16}
											opacity={0.5}
											onClick={() => {
												dispatch(setSearchKeyword(""));
											}}
										/>
									</Tooltip>
								) : (
									<Tooltip
										label={t("FieldIsRequired")}
										withArrow
										position={"bottom"}
										color="var(--theme-error-color)"
										bg="var(--theme-error-color-hover)"
									>
										<IconInfoCircle size={16} opacity={0.5} />
									</Tooltip>
								)
							}
						/>
					</Tooltip>
				</Grid.Col>
				<Grid.Col span="auto">
					<ActionIcon.Group mt="es" justify="center">
						<ActionIcon
							variant="default"
							color="var(--theme-error-color)"
							size="lg"
							aria-label="Filter"
							onClick={() => {
								searchKeyword.length > 0
									? (dispatch(setGlobalFetching(true)), setSearchKeywordTooltip(false))
									: (setSearchKeywordTooltip(true),
									  setTimeout(() => {
											setSearchKeywordTooltip(false);
									  }, 1500));
							}}
						>
							<Tooltip
								label={t("SearchButton")}
								px="md"
								py="es"
								withArrow
								position={"bottom"}
								color="var(--theme-error-color)"
								bg="var(--theme-error-color-hover)"
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconSearch style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
						<ActionIcon
							variant="default"
							color="var(--theme-tertiary-color-6)"
							size="lg"
							aria-label="Settings"
						>
							<Tooltip
								label={t("ResetButton")}
								px="md"
								py="es"
								withArrow
								position={"bottom"}
								color="var(--theme-error-color)"
								bg="var(--theme-error-color-hover)"
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconRestore
									style={{ width: rem(18) }}
									stroke={1.5}
									onClick={() => {
										dispatch(setSearchKeyword(""));
										dispatch(setGlobalFetching(true));
										if (props.module === "product") {
											dispatch(
												setProductFilterData({
													...productFilterData,
													name: "",
													alternative_name: "",
													sales_price: "",
													sku: "",
												})
											);
										} else if (props.module === "category") {
											dispatch(
												setCategoryFilterData({
													...categoryFilterData,
													name: "",
													parent_name: "",
												})
											);
										} else if (props.module === "user") {
											dispatch(
												setUserFilterData({
													...userFilterData,
													keyword: "",
												})
											);
										}
									}}
								/>
							</Tooltip>
						</ActionIcon>
						<ActionIcon
							variant="default"
							color="var(--theme-secondary-color-8)"
							size="lg"
							aria-label="Filter"
							onClick={() => {
								searchKeyword.length > 0
									? (dispatch(setGlobalFetching(true)), setSearchKeywordTooltip(false))
									: (setSearchKeywordTooltip(true),
									  setTimeout(() => {
											setSearchKeywordTooltip(false);
									  }, 1500));
							}}
						>
							<Tooltip
								label={t("DownloadPdfFile")}
								px="md"
								py="es"
								withArrow
								position={"bottom"}
								color="var(--theme-error-color)"
								bg="var(--theme-error-color-hover)"
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconPdf style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>

						<ActionIcon
							variant="default"
							color="var(--theme-secondary-color-8)"
							size="lg"
							aria-label="Filter"
							onClick={() => {
								if (props.module === "stock") {
									props.setDownloadStockXls(true);
								}
							}}
						>
							<Tooltip
								label={t("DownloadExcelFile")}
								px="md"
								py="es"
								withArrow
								position={"bottom"}
								color="var(--theme-error-color)"
								bg="var(--theme-error-color-hover)"
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
					</ActionIcon.Group>
				</Grid.Col>
			</Grid>
		</>
	);
}
