import { cn } from "@/lib/utils";
import { Color } from "@tiptap/extension-color";
import HighLight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  useEditor
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import debounce from "lodash.debounce";
import React, { useEffect, useImperativeHandle } from "react";
import "./style.scss";

type Props = {
  value: string;
  onChange: (value: string) => void;
};
export type TipTapEditorHandle = {
  setContent: (text: string) => void;
  getContent: () => string;
};
// eslint-disable-next-line react/display-name
const TipTapEditor = React.forwardRef<TipTapEditorHandle | null, Props>(
  ({ value, onChange }, ref) => {
    const debounceChange = debounce((val) => onChange(val), 300);
    const editor = useEditor({
      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure(),
        HighLight.configure({ multicolor: true }),
        StarterKit,
      ],
      content: value,
    });
    useImperativeHandle(ref, () => ({
      setContent: (html: string) => {
        editor?.commands.setContent(html);
      },
      getContent: (): string => {
        return editor?.getHTML() || "";
      },
    }));

    useEffect(() => {
      if (editor?.getHTML() !== value) {
        editor?.commands.setContent(value);
      }
    }, [value]);

    useEffect(() => {
      onChange(editor?.getHTML() || "");
    }, [editor?.getHTML()]);

    editor?.getHTML();
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
      {/* <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button> */}
      <button
        type="button"
        className={cn("border border-r-2 ml-2 p-2 border-stone-400")}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
      <div className="group inline-block border border-r-2 ml-2 p-2 border-stone-400">
        <button type="button">Color</button>
        <div className="z-10 hidden group-hover:block absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDelayButton"
          >
            {[
              { color: "Black", colorCode: "black" },
              { color: "Purple", colorCode: "#958DF1" },
              { color: "Green", colorCode: "#588157" },
              { color: "Red", colorCode: "#ae2012" },
              { color: "Yellow", colorCode: "#ffd500" },
            ].map((item) => {
              return (
                <li key={item.colorCode}>
                  <a
                    style={{ color: item.colorCode }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                    onClick={() =>
                      editor.chain().focus().setColor(item.colorCode).run()
                    }
                  >
                    {item.color}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="group inline-block border border-r-2 ml-2 p-2 border-stone-400">
        <button type="button">Highlight</button>
        <div className="z-10 hidden group-hover:block absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDelayButton"
          >
            {[
              { color: "White", colorCode: "white" },
              { color: "Pink", colorCode: "#ffb3c1" },
              { color: "Green", colorCode: "#b5e48c" },
              { color: "Red", colorCode: "#f07167" },
              { color: "Yellow", colorCode: "#ffd60a" },
            ].map((item) => {
              return (
                <li key={item.colorCode}>
                  <a
                    style={{
                      backgroundColor: item.colorCode,
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setHighlight({ color: item.colorCode })
                        .run()
                    }
                  >
                    {item.color}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;
