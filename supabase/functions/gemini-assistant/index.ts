import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, language = "en" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      const fallbackReply = language === "hi"
        ? "अनूप फैब्रिकेशन (31/1 नांगली सकरावती, नजफगढ़, नई दिल्ली) में आपका स्वागत है। विस्तृत कोटेशन एवं साइट माप के लिए कृपया 7217853257 पर कॉल करें।"
        : "Welcome to Anup Fabrication (31/1 Nangli Sakrawati, Najafgarh, New Delhi). For physical site measurement and quotations, call 7217853257.";
      return new Response(JSON.stringify({ reply: fallbackReply }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const systemInstruction = `You are the technical assistant for Anup Fabrication in Najafgarh, New Delhi (Phones: 7217853257, 7838640423). Answer concisely in ${language === 'hi' ? 'Hindi' : 'English'}. Never invent prices or delivery guarantees. Direct users to the quotation form or direct workshop call.`;

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }] }]
        })
      }
    );

    const data = await apiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thank you for contacting Anup Fabrication.";

    return new Response(
      JSON.stringify({ reply: text }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
