import { BrainLogModel } from "@/models/brain-log/brainLogModel";
import superbaseInstance from "@/services/superbaseInstance";
import { PostgrestSingleResponse, QueryData } from "@supabase/supabase-js";

const TABLE_NAME = "brain_log_types";
const selectBrainLogTypesWithItem = superbaseInstance
  .getInstance()
  // .from(TABLE_NAME).select(`id, name, brain_logs(*)`);
  .from(TABLE_NAME)
  //brain_logs but ordered by created_at
  .select(`id, name, brain_logs(*)`)
  .order('created_at', {ascending: false, referencedTable: 'brain_logs'})
export type BrainLogTypesWithItems = QueryData<typeof selectBrainLogTypesWithItem>;


// superbaseInstance.getInstance().channel('custom-all-channel')
// .on(
//   'postgres_changes',
//   { event: '*', schema: 'public', table: TABLE_NAME },
//   (payload) => {
//     console.log('Change received!', payload)
//   }
// )


const getAll = async (): Promise<PostgrestSingleResponse<BrainLogTypesWithItems>> => {
  let response = await selectBrainLogTypesWithItem;
  return response;
};

type serviceParam = {
  insert: (data: any) => void;
  update: (data: any) => void;
  delete: (data: any) => void;
}

const subscribe = async (id: string, service: serviceParam) => {
  const channel = superbaseInstance.getInstance().channel(`brain-log-type-${id}`);
  channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'brain_logs', filter: 'brain_log_type_id=eq.' + id },
      (payload) => {
        console.log('Change received!', payload)

        if (payload.eventType  == "INSERT") {
          service.insert(payload.new);
        }
        if (payload.eventType  == "UPDATE") {
          service.update(payload.new);
        }
        if (payload.eventType  == "DELETE") {
          service.delete(payload.old);
        }
      }
    )
  channel.subscribe();
  return channel;

}

const update = async (id: string, data: Pick<BrainLogModel, 'content'>) => {
  let response = await superbaseInstance.getInstance().from('brain_logs').update(data).match({id: id});
  return response;
}

const insert = async (data: Pick<BrainLogModel, 'content' | 'brain_log_type_id'>) => {
  let response = await superbaseInstance.getInstance().from('brain_logs').insert([data]);
  return response;
}
const deleteLog = async (id: string) => {
  let response = await superbaseInstance.getInstance().from('brain_logs').delete().match({id: id});
  return response;
}

const BrainLogService = {
  getAll,
  subscribe,
  insert,
  update,
  delete: deleteLog,
};
export default BrainLogService;
