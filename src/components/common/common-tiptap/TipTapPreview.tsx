import "./tiptap.scss";

export const TipTapPreview = ({ content,className }: { content: string, className?: string }) => {
  return (
    <div
      className={className + " tiptapPreview"}
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};
