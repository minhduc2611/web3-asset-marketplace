import { useBrainLog } from "@/stores/brainLog";
import { BrainLogItem } from "./BrainLogItem";
import { Icons } from "../common/icons";
import BrainLogForm from "./BrainLogForm";
import BrainLogService from "@/services/brainLog";

export const BrainLogList = () => {
  const { brainLogTypes, subscribedData } = useBrainLog();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-4 w-full">
      {brainLogTypes.map((type) => (
        <div key={type.id} className="">
          <h1 className="text-center text-2xl">{type.name}</h1>
          <div className="">
            <BrainLogForm
              className="hover:"
              onSubmit={(content) => {
                BrainLogService.insert({
                  content,
                  brain_log_type_id: type.id,
                });
              }}
            />
            {subscribedData[type.id].map((log) => {
              return <BrainLogItem key={log.id} log={log}></BrainLogItem>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
