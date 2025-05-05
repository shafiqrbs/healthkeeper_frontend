import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, Text, NavLink
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../../../assets/css/HeaderSearch.module.css';
import {
    IconInfoCircle, IconTrash, IconSearch, IconSettings,
    IconBrandProducthunt,
    IconBrandCodesandbox,
    IconStack2,
    IconBuildingStore
} from "@tabler/icons-react";
import {useLocation, useNavigate} from "react-router-dom";


function InventoryHeaderNavbar(props) {
    const { pageTitle, roles, currancySymbol, allowZeroPercentage } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { link: '/inventory/product', label: t('Products') },
        { link: '/inventory/category', label: t('Category') },
        { link: '/inventory/category-group', label: t('CategoryGroup') },
        { link: '/inventory/stock', label: t('Stock') },
    ];
    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={location.pathname==link.link ? classes.active :classes.link}
            onClick={(event) => {
                event.preventDefault();
                navigate(link.link)
            }}
        >
            {link.label}
        </a>
    ));
    return (
        <>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <Group ml={10}><Text>{pageTitle}</Text></Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={'2'}>
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400} mr={'8'}>
                            <Menu.Target>
                                <ActionIcon mt={'4'} variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle height={'12'} width={'12'} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    component="button" onClick={(e) => { navigate('/inventory/opening-stock') }} leftSection={<IconBrandCodesandbox style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('OpeningStockN')}
                                </Menu.Item>
                                <Menu.Item
                                    component="button" onClick={(e) => { navigate('/inventory/particular') }} leftSection={<IconBrandProducthunt style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ProductSetting')}
                                </Menu.Item>
                                <Menu.Item
                                    component="button" onClick={(e) => { navigate('/inventory/config') }} leftSection={<IconBrandCodesandbox style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('InventoryConfiguration')}
                                </Menu.Item>

                                {/* <Menu.Item
                                    component="button" onClick={(e) => { navigate('/inventory/stock') }} leftSection={<IconStack2 style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('Stock')}
                                </Menu.Item> */}
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </header>
        </>
    );
}

export default InventoryHeaderNavbar;
