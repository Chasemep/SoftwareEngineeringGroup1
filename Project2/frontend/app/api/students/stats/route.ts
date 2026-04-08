import { proxyToSpring } from "@/lib/backend";

export async function GET() {
  return proxyToSpring("/api/students/stats");
}

