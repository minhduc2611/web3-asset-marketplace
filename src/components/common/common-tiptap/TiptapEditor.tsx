import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useImperativeHandle } from "react";
import "./style.scss";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];
type Props = {
  onChange: (e: string) => void;
};
export type TipTapEditorHandle = {
  setContent: (text: string) => void;
  getContent: () => string;
};
// eslint-disable-next-line react/display-name
const TipTapEditor = React.forwardRef<TipTapEditorHandle | null, Props>(
  ({ onChange }, ref) => {
    const editor = useEditor({
      extensions: [StarterKit],
      onUpdate({ editor }) {
        onChange(editor.getHTML())
      },
    });
    useImperativeHandle(ref, () => ({
      setContent: (html: string) => {
        editor?.commands.setContent(html);
      },
      getContent: (): string => {
        return editor?.getHTML() || "";
      },
    }));

    return (
      <>
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <MenuBar editor={editor} />
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </>
    );
  }
);

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap bg-slate-200 w-[500px]">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          editor.isActive("bold") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
      >
        bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          editor.isActive("italic") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
      >
        italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          editor.isActive("strike") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
      >
        strike
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(
          editor.isActive("code") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
      >
        code
      </button>
      {/* <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        clear marks
      </button>
      <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().clearNodes().run()}
      >
        clear nodes
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={cn(
          editor.isActive("paragraph") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
      >
        paragraph
      </button> */}
      <button
        type="button"
        className={cn(
          editor.isActive("heading", { level: 1 }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        h1
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("heading", { level: 2 }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        h2
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("heading", { level: 3 }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        h3
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("heading", { level: 4 }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        h4
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("heading", { level: 5 }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        h5
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("heading", { level: 6 }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        h6
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("bulletList") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        bullet list
      </button>
      {/* <button
        type="button"
        className={cn(
          editor.isActive("orderedList") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        ordered list
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("codeBlock") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        code block
      </button> */}
      <button
        type="button"
        className={cn(
          editor.isActive("blockquote") ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        blockquote
      </button>
      {/* <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        horizontal rule
      </button>
      <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        hard break
      </button> */}
      <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button>
      <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
      <button
        type="button"
        className={cn(
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : "",
          "border border-r-2 ml-2 p-2 border-stone-400"
        )}
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
      >
        purple
      </button>
    </div>
  );
};

export default TipTapEditor;
