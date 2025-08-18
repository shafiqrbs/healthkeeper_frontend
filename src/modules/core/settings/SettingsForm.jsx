import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Group, Text, Title, Stack, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconX,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import _ShortcutMasterData from "../../shortcut/_ShortcutMasterData.jsx";


import {
    editEntityData,
    setEntityNewData,
    setFormLoading,
    setInsertType,
    setSearchKeyword,
    setFetching,
    setDropdownLoad, storeEntityData
} from "@/app/store/core/crudSlice";

import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import SwitchForm from "@components/form-builders/SwitchForm";



function SettingsForm(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [categoryGroupData, setCategoryGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(true);
    const [settingTypeData, setSettingTypeData] = useState(null);

    const { saveId, settingTypeDropdown, setGroupDrawer } = props

    useEffect(() => {
        saveId !== 'EntityFormSubmit' && effectRan.current && (
            setTimeout(() => {
                document.getElementById('setting_type').click()
            }, 100),
            effectRan.current = false
        )
    })

    const settingsForm = useForm({
        initialValues: {
            setting_type_id: '', name: '', status: true
        },
        validate: {
            setting_type_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
        }
    });

    const closeModel = () => {
        setGroupDrawer(false)
    }

    saveId === 'EntityFormSubmit' && useHotkeys([['alt+n', () => {
        document.getElementById('setting_type').click()
    }]], []);

    saveId === 'EntityFormSubmit' && useHotkeys([['alt+r', () => {
        settingsForm.reset()
    }]], []);

    saveId === 'EntityFormSubmit' && useHotkeys([['alt+s', () => {
        document.getElementById(saveId).click()
    }]], []);


    return (
        <>
            <Box>
                <form onSubmit={settingsForm.onSubmit((values) => {
                    modals.openConfirmModal({
                        title: (
                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            setSaveCreateLoading(true)
                            const value = {
                                url: 'core/setting',
                                data: settingsForm.values
                            }
                            dispatch(storeEntityData(value))

                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 700,
                                style: { backgroundColor: 'lightgray' },
                            });

                            setTimeout(() => {
                                settingsForm.reset()
                                setSettingTypeData(null)
                                setSaveCreateLoading(false)
                                saveId === 'EntityDrawerSubmit' && setGroupDrawer(false)
                                saveId === 'EntityFormSubmit' && dispatch(setFetching(true))
                                saveId === 'EntityDrawerSubmit' && dispatch(setDropdownLoad(true))
                            }, 700)
                        },
                    });
                })}>
                    <Box mb={0}>

                        <Grid columns={9} gutter={{ base: 6 }} >
                            <Grid.Col span={saveId === 'EntityFormSubmit' ? 8 : 9} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box bg={"white"} >
                                        <Box pl={`xs`} pr={8} pt={saveId === 'EntityFormSubmit' ? 6 : 4} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                            <Grid>
                                                <Grid.Col span={8} >
                                                    <Title order={6} pt={'6'}>{t('CreateSetting')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    {saveId === 'EntityFormSubmit' &&
                                                        <Stack right align="flex-end">
                                                            <>
                                                                {
                                                                    !saveCreateLoading && isOnline &&
                                                                    <Button
                                                                        size="xs"
                                                                        className={'btnPrimaryBg'}
                                                                        type="submit"
                                                                        id={saveId}
                                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                                    >

                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={14} fw={400}>
                                                                                {t("CreateAndSave")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                }
                                                            </>
                                                        </Stack>
                                                    }
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                            <ScrollArea h={saveId === 'EntityFormSubmit' ? height : height + 18} scrollbars="y" type="never">
                                                <Box mt={'8'}>
                                                    <SelectForm
                                                        tooltip={t('SettingType')}
                                                        label={t('SettingType')}
                                                        placeholder={t('ChooseSettingType')}
                                                        required={true}
                                                        nextField={'setting_name'}
                                                        name={'setting_type_id'}
                                                        form={settingsForm}
                                                        dropdownValue={settingTypeDropdown}
                                                        id={'setting_type'}
                                                        searchable={false}
                                                        value={settingTypeData}
                                                        changeValue={setSettingTypeData}
                                                    />
                                                </Box>

                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('SettingName')}
                                                        label={t('SettingName')}
                                                        placeholder={t('SettingName')}
                                                        required={true}
                                                        nextField={'status'}
                                                        form={settingsForm}
                                                        name={'name'}
                                                        id={'setting_name'}
                                                    />
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('Status')}
                                                                label=''
                                                                nextField={saveId}
                                                                name={'status'}
                                                                form={settingsForm}
                                                                color="red"
                                                                id={'status'}
                                                                position={'left'}
                                                                defaultChecked={1}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Status')}</Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </ScrollArea>
                                        </Box>
                                        {saveId === 'EntityDrawerSubmit' &&
                                            <>
                                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
                                                    <Group justify="space-between">
                                                        <Flex
                                                            gap="md"
                                                            justify="center"
                                                            align="center"
                                                            direction="row"
                                                            wrap="wrap"
                                                        >
                                                            <ActionIcon
                                                                variant="transparent"
                                                                size="sm"
                                                                color="red.6"
                                                                onClick={closeModel}
                                                                ml={'4'}
                                                            >
                                                                <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Flex>

                                                        <Group gap={8}>
                                                            <Stack align="flex-start">
                                                                <>
                                                                    {
                                                                        !saveCreateLoading && isOnline &&
                                                                        <Button
                                                                            size="xs"
                                                                            className={'btnPrimaryBg'}
                                                                            type="submit"
                                                                            id={saveId}
                                                                            leftSection={<IconDeviceFloppy size={16} />}
                                                                        >

                                                                            <Flex direction={`column`} gap={0}>
                                                                                <Text fz={14} fw={400}>
                                                                                    {t("CreateAndSave")}
                                                                                </Text>
                                                                            </Flex>
                                                                        </Button>
                                                                    }
                                                                </>
                                                            </Stack>
                                                        </Group>
                                                    </Group>
                                                </Box>
                                            </>
                                        }
                                    </Box>
                                </Box>
                            </Grid.Col>
                            {saveId === 'EntityFormSubmit' &&
                                <Grid.Col span={1} >
                                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                        <_ShortcutMasterData
                                            form={settingsForm}
                                            FormSubmit={saveId}
                                            Name={'setting_type'}
                                            inputType="select"
                                        />
                                    </Box>
                                </Grid.Col>
                            }
                        </Grid>
                    </Box>
                </form>
            </Box>
        </>

    );
}

export default SettingsForm;
