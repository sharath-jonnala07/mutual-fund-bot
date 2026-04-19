export const dynamic = "force-dynamic";

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

  const apiBaseUrl = process.env.MF_RAG_API_URL ?? "http://127.0.0.1:8000";

  try {
    const upstream = await fetch(`${apiBaseUrl}/v1/qa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

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
            detail ??
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
