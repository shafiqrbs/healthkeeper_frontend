import {Tooltip, TextInput, Highlight} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "@assets/css/InputField.module.css";
import {RichTextEditor} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {useEffect} from "react";

function RichTextEditorForm({
                       size = "sm",
                       readOnly = false,
                       pt,
                       label = "",
                       placeholder = "",
                       required = false,
                       nextField = "",
                       name = "",
                       form = {},
                       tooltip = "",

                       disabled,
                       content,
                       leftSection,
                       rightSection,
                       styles = {},
                       handleChange,
                       onBlur,
                   }) {
    const { t } = useTranslation();
    const editor = useEditor({
        extensions: [StarterKit, Highlight,TextAlign.configure({ types: ['heading', 'paragraph'] }),],
        content:form.values[name],
        shouldRerenderOnTransaction: true,
    });
    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content);
        }
    }, [content, editor,reportId]);

    return (
        <>
            {form && (
                <RichTextEditor editor={editor} variant="subtle" h={mainAreaHeight-260}>
                    <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
            )}
        </>
    );
}

export default InputForm;

