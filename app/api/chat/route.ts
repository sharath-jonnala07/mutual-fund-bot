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

    const data = await upstream.json();
    return Response.json(data, { status: upstream.status });
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
