import { proxyToSpring } from "@/lib/backend";

export async function GET() {
  return proxyToSpring("/api/students");
}

export async function POST(request: Request) {
  const body = await request.text();

  return proxyToSpring("/api/students", {
    method: "POST",
    body,
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json"
    }
  });
}

