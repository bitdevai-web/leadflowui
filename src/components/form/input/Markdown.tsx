import "@toast-ui/editor/dist/toastui-editor.css";

import { FC, useEffect, useRef } from "react";

import { Editor } from "@toast-ui/editor";

export interface MarkdownEditorProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  className,
  value = "",
  onChange,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (!editorRef.current && divRef.current) {
      editorRef.current = new Editor({
        el: divRef.current,
        height: "500px",
        initialEditType: "markdown",
        initialValue: value,
        previewStyle: "vertical",
      });

      editorRef.current.on("change", () => {
        const content = editorRef.current?.getMarkdown();
        if (onChange && content !== undefined) {
          onChange(content);
        }
      });
    }
  }, []);

  // Update editor value when `value` changes from parent
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const currentMarkdown = editor.getMarkdown();
      if (value !== currentMarkdown) {
        editor.setMarkdown(value || "");
      }
    }
  }, [value]);

  return <div ref={divRef} className={className}></div>;
};

export default MarkdownEditor;
