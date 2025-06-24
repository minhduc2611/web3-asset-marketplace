import GraphExplorer from "@/components/pages/graph-explorer";

const GraphExplorerPage = async ({
  params,
}: {
  params: { canvasId: string };
}) => {
  const paramsObject = await params;
  const canvasId = paramsObject.canvasId;
  return <GraphExplorer canvasId={canvasId} />;
};

export default GraphExplorerPage;
