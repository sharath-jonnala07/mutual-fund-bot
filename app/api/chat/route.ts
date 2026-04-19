export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TRANSIENT_UPSTREAM_STATUSES = new Set([429, 502, 503, 504]);

function normalizeApiBaseUrl(value: string | undefined): string {
  const fallback = "http://127.0.0.1:8000";
  const trimmed = value?.trim() || fallback;
  return trimmed.replace(/\/+$/, "").replace(/\/v1$/i, "");
}

async function fetchUpstream(url: string, payload: ChatRequest) {
  let response: Response | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });

    if (!TRANSIENT_UPSTREAM_STATUSES.has(response.status) || attempt === 1) {
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  return response;
}

type ChatRequest = {
  question: string;
  conversation_id?: string;
};

export async function POST(request: Request) {
  let payload: ChatRequest;

  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return Response.json(
      {
        status: "error",
        answer: "The request body was invalid.",
        last_updated_from_sources: "Unavailable",
      },
      { status: 400 },
    );
  }

  const apiBaseUrl = normalizeApiBaseUrl(process.env.MF_RAG_API_URL);

  try {
    const upstream = await fetchUpstream(`${apiBaseUrl}/v1/qa`, payload);

    if (!upstream) {
      throw new Error("No upstream response received");
    }

    const raw = await upstream.text();
    let data: Record<string, unknown> | null = null;

    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      data = null;
    }

    if (!upstream.ok) {
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
            ? "The backend rejected the request payload."
            : null;

      return Response.json(
        {
          status: "error",
          answer:
            (detail === "Not Found"
              ? "The backend path was not found. Check MF_RAG_API_URL and make sure it is only the service base URL, not a /v1 path."
              : detail) ??
            `The backend returned ${upstream.status}. Check MF_RAG_API_URL and ensure it is the service base URL without /v1.`,
          last_updated_from_sources: "Unavailable",
        },
        { status: 200 },
      );
    }

    // FastAPI validation errors (422) return {detail: [...]}, not our schema
    if (!data || !data.status || !data.answer) {
      return Response.json(
        {
          status: "error",
          answer:
            "The backend response was invalid. Check MF_RAG_API_URL and verify the Fly deployment is serving /v1/qa.",
          last_updated_from_sources: "Unavailable",
        },
        { status: 200 },
      );
    }

    return Response.json(data, { status: 200 });
  } catch {
    return Response.json(
      {
        status: "error",
        answer:
          "The mutual fund assistant is unavailable right now. Start the FastAPI service or check MF_RAG_API_URL.",
        last_updated_from_sources: "Unavailable",
      },
      { status: 503 },
    );
  }
}
