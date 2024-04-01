import { BrainLogModel } from "@/models/brain-log/brainLogModel";
import { useBrainLog } from "@/stores/brainLog";
import { FC, PropsWithChildren, useRef, useState } from "react";
import { Icons } from "@/components/common/icons";
import BrainLogForm, { BrainLogFormHandle } from "./BrainLogForm";
import BrainLogService from "@/services/brainLog";
import { TipTapPreview } from "@/components/common/common-tiptap/TipTapPreview";
type BrainLogItemProps = PropsWithChildren<{
  log: BrainLogModel;
}>;
export const BrainLogItem: FC<BrainLogItemProps> = ({
  log,
  children,
}: BrainLogItemProps) => {
  const formRef = useRef<BrainLogFormHandle>(null);
  // open state
  const [open, setOpen] = useState(false);
  const onOpenEdit = (isOpen: boolean) => {
    setOpen(isOpen)
    isOpen && formRef.current?.setForm(log.content);
  };
  return (
    <div className=" w-full bg-slate-200 dark:bg-slate-700 rounded-lg min-h-[200px] whitespace-pre-wrap break-words mt-2">
      <div className="header bg-slate-300 dark:bg-slate-800 rounded-t-lg flex justify-end fill text-slate-500 dark:text-slate-200 p-2">
        <Icons.pencil
          className="cursor-pointer h-4"
          onClick={() => onOpenEdit(!open)}
        />
      </div>

      <TipTapPreview
        className={open ? "hidden" : "content p-2"}
        content={log.content}
      ></TipTapPreview>

      <BrainLogForm
        editable
        className={open ? "" : "hidden"}
        ref={formRef}
        onSubmit={(content) => {
          BrainLogService.update(log.id, {
            content,
          });
        }}
      />
    </div>
  );
};
