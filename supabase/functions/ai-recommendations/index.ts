import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "gift-recommendations") {
      systemPrompt = `You are Santa's AI assistant helping with gift recommendations. You analyze children's wishlists and provide smart gift suggestions. Keep responses concise and festive! Always respond in JSON format with an array of 3-4 recommendations.`;
      userPrompt = `Based on the following children data, provide gift recommendations:
${JSON.stringify(context.children || [], null, 2)}

Current inventory categories: ${context.categories?.join(", ") || "Toys, Electronics, Books, Games, Art Supplies"}

Respond with a JSON array of recommendations, each with: title, description, priority (high/medium/low), category, and reason.`;
    } else if (type === "delivery-optimization") {
      systemPrompt = `You are Santa's logistics AI. You analyze delivery routes and provide optimization suggestions. Keep responses concise and actionable. Always respond in JSON format.`;
      userPrompt = `Analyze these delivery regions and provide optimization suggestions:
${JSON.stringify(context.deliveries || [], null, 2)}

Respond with a JSON array of suggestions, each with: title, description, priority (urgent/high/medium/low), and expectedImpact.`;
    } else if (type === "workforce-analysis") {
      systemPrompt = `You are Santa's workshop manager AI. You analyze elf productivity and provide workforce recommendations. Keep responses concise. Always respond in JSON format.`;
      userPrompt = `Analyze this elf workforce data and provide recommendations:
${JSON.stringify(context.elves || [], null, 2)}

Respond with a JSON array of recommendations, each with: title, description, priority (high/medium/low), and action.`;
    } else {
      throw new Error("Invalid recommendation type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from the response
    let recommendations;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(content);
      }
    } catch {
      console.error("Failed to parse AI response:", content);
      recommendations = [{ title: "AI Response", description: content, priority: "medium" }];
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-recommendations:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
