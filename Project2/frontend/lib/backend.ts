const springApiBaseUrl =
  process.env.SPRING_API_BASE_URL ?? "http://localhost:8080";

function buildSpringUrl(path: string) {
  return new URL(path, springApiBaseUrl).toString();
}

function buildProxyResponseHeaders(source: Response) {
  const headers = new Headers();
  const contentType = source.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  return headers;
}

export async function proxyToSpring(path: string, init?: RequestInit) {
  try {
    const upstreamResponse = await fetch(buildSpringUrl(path), {
      ...init,
      cache: "no-store"
    });

    if (upstreamResponse.status === 204) {
      return new Response(null, {
        status: upstreamResponse.status
      });
    }

    const body = await upstreamResponse.text();

    return new Response(body, {
      status: upstreamResponse.status,
      headers: buildProxyResponseHeaders(upstreamResponse)
    });
  } catch {
    return Response.json(
      {
        error:
          "The frontend could not reach the Spring backend. Start the backend and try again."
      },
      {
        status: 502
      }
    );
  }
}

