export const getFile = (bucket: string,path: string) =>
  `https://skvnrwmwmcvsevknedhm.supabase.co/storage/v1/object/public/${bucket}/${path}`;

