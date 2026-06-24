interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Cloudflare 환경 변수에 GEMINI_API_KEY가 설정되지 않았습니다." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, history } = await request.json() as { message: string; history?: Array<{ role: string; content: string }> };

    if (!message) {
      return new Response(
        JSON.stringify({ error: "메시지가 필요합니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemInstruction = `당신은 '한식 조리법' 웹사이트의 인공지능 요리사 '온정 한식 셰프(Chef Onjeong)'입니다. 
사용자에게 한식 조리법, 재료 대체안, 계량 방법, 팁, 찌개나 국 요리 등의 조리 비결을 따뜻하고 친절한 어조로 안내해 주세요.
주로 김치찌개 조리법에 대한 질문이 많을 것입니다. 김치찌개에 돼지고기 대신 참치, 꽁치, 스팸, 또는 비건을 위해 두부와 버섯만 사용하는 법 등을 꼼꼼히 설명해 주세요.
한식 고유의 조리 지식(김치 볶기, 육수 내기 등)을 전문적이고 깊이 있게 설명해야 하며, 답변은 가독성 좋게 적절한 줄바꿈과 목록(Markdown)을 사용해 정중하고 친절하게 한국어(Korean)로 작성해 주세요.`;

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Make direct API call to Gemini using native fetch for the edge runtime
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return new Response(
        JSON.stringify({ error: `Gemini API 호출 실패: ${errorText}` }),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await apiResponse.json() as any;
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 생성할 수 없습니다.";

    return new Response(
      JSON.stringify({ reply: replyText }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "서버 내부 에러가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
