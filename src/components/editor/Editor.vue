<script setup>
import { watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";

import {
    mdiUndo,
    mdiRedo,
    mdiFormatBold,
    mdiFormatItalic,
    mdiFormatStrikethrough,
    mdiFormatUnderline,
    mdiCodeTags,
    mdiFormatParagraph,
    mdiFormatHeader1,
    mdiFormatHeader2,
    mdiFormatHeader3,
    mdiFormatListBulleted,
    mdiFormatListNumbered,
    mdiFormatQuoteClose,
    mdiTable,
    mdiTableRemove,
    mdiTableColumnPlusBefore,
    mdiTableColumnPlusAfter,
    mdiTableColumnRemove,
    mdiTableRowPlusBefore,
    mdiTableRowPlusAfter,
    mdiTableRowRemove,
    mdiTableMergeCells,
} from "@mdi/js";

// provided interfaces
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
});
const emit = defineEmits(["update:modelValue", "close:cancel", "close:save"]);

// injects

// internal
const editor = useEditor({
    content: props.modelValue,
    editorProps: {
        attributes: {
            class: "w-full prose my-6 mx-auto focus:outline-none",
        },
    },
    extensions: [
        StarterKit,
        Underline,
        Image,
        Table,
        TableHeader,
        TableRow,
        TableCell,
    ],
    onUpdate: () => {
        emit("update:modelValue", editor.value?.getHTML());
    },
});

watch(
    () => props.modelValue,
    (value) => {
        const isSame = editor.value.getHTML() === value;

        if (isSame) {
            return;
        }

        editor.value.commands.setContent(value, false);
    }
);

// event handlers
const onCancel = () => {
    emit("close:cancel", editor.value?.getHTML());
};

const onSave = () => {
    emit("close:save", editor.value?.getHTML());
};

// hooks
</script>

<template>
  <v-toolbar v-if="editor">
    <v-btn
      icon
      dense
      :class="{ 'is-active': editor.isActive('undo') }"
      :disabled="!editor.can().chain().focus().undo().run()"
      @click="editor.chain().focus().undo().run()"
    >
      <v-icon :icon="mdiUndo" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('redo') }"
      :disabled="!editor.can().chain().focus().redo().run()"
      @click="editor.chain().focus().redo().run()"
    >
      <v-icon :icon="mdiRedo" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('bold') }"
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <v-icon :icon="mdiFormatBold" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('italic') }"
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      dense
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <v-icon :icon="mdiFormatItalic" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('strike') }"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      <v-icon :icon="mdiFormatStrikethrough" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('underline') }"
      @click="editor.chain().focus().toggleUnderline().run()"
    >
      <v-icon :icon="mdiFormatUnderline" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('code') }"
      :disabled="!editor.can().chain().focus().toggleCode().run()"
      @click="editor.can().chain().focus().toggleCode().run()"
    >
      <v-icon :icon="mdiCodeTags" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('paragraph') }"
      :disabled="!editor.can().chain().focus().setParagraph().run()"
      @click="editor.chain().focus().setParagraph().run()"
    >
      <v-icon :icon="mdiFormatParagraph" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      :disabled="
        !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
      "
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      <v-icon :icon="mdiFormatHeader1" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      :disabled="
        !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
      "
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      <v-icon :icon="mdiFormatHeader2" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      :disabled="
        !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
      "
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
    >
      <v-icon :icon="mdiFormatHeader3" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('bulletList') }"
      :disabled="!editor.can().chain().focus().toggleBulletList().run()"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <v-icon :icon="mdiFormatListBulleted" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('orderedList') }"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <v-icon :icon="mdiFormatListNumbered" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('blockquote') }"
      :disabled="!editor.can().chain().focus().toggleBlockquote().run()"
      @click="editor.chain().focus().toggleBlockquote().run()"
    >
      <v-icon :icon="mdiFormatQuoteClose" />
    </v-btn>
    <v-btn
      icon
      :class="{ 'is-active': editor.isActive('table') }"
      @click="
        editor
          .chain()
          .focus()
          .insertTable({
            rowsCount: 3,
            colsCount: 3,
            withHeaderRow: false,
          })
          .run()
      "
    >
      <v-icon :icon="mdiTable" />
    </v-btn>
    <span v-if="editor.isActive('table')">
      <v-btn
        icon
        @click="editor.chain().focus().deleteTable().run()"
      >
        <v-icon :icon="mdiTableRemove" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().addColumnBefore().run()"
      >
        <v-icon :icon="mdiTableColumnPlusBefore" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().addColumnAfter().run()"
      >
        <v-icon :icon="mdiTableColumnPlusAfter" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().deleteColumn().run()"
      >
        <v-icon :icon="mdiTableColumnRemove" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().addRowBefore().run()"
      >
        <v-icon :icon="mdiTableRowPlusBefore" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().addRowAfter().run()"
      >
        <v-icon :icon="mdiTableRowPlusAfter" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().deleteRow().run()"
      >
        <v-icon :icon="mdiTableRowRemove" />
      </v-btn>
      <v-btn
        icon
        @click="editor.chain().focus().toggleCellMerge().run()"
      >
        <v-icon :icon="mdiTableMergeCells" />
      </v-btn>
    </span>
  </v-toolbar>

  <editor-content :editor="editor" />

  <v-card-actions>
    <v-spacer />
    <v-btn
      color="blue-darken-1"
      variant="text"
      @click="onCancel"
    >
      {{ $t("cancel") }}
    </v-btn>
    <v-btn
      color="blue-darken-1"
      variant="text"
      @click="onSave"
    >
      {{ $t("save") }}
    </v-btn>
  </v-card-actions>
</template>

<style lang="scss">
.tiptap {
    table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin: 0;
        overflow: hidden;

        td,
        th {
            min-width: 1em;
            border: 2px solid #ced4da;
            padding: 3px 5px;
            vertical-align: top;
            box-sizing: border-box;
            position: relative;

            > * {
                margin-bottom: 0;
            }
        }

        th {
            font-weight: bold;
            text-align: left;
            background-color: #f1f3f5;
        }

        .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(200, 200, 255, 0.4);
            pointer-events: none;
        }

        .column-resize-handle {
            position: absolute;
            right: -2px;
            top: 0;
            bottom: -2px;
            width: 4px;
            background-color: #adf;
            pointer-events: none;
        }

        p {
            margin: 0;
        }
    }
}

.tableWrapper {
    padding: 1rem 0;
    overflow-x: auto;
}

.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
}
</style>
