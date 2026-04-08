import { proxyToSpring } from "@/lib/backend";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyToSpring(`/api/students/${id}`);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyToSpring(`/api/students/${id}`, {
    method: "DELETE"
  });
}

