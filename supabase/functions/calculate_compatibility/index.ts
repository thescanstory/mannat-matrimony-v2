// Supabase Edge Function: calculate_compatibility
// Compares user scenario responses to generate a behavioral compatibility score percentage

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RequestPayload {
  user_a_responses: Record<string, number>;
  user_b_responses: Record<string, number>;
}

serve(async (req) => {
  try {
    const { user_a_responses, user_b_responses }: RequestPayload = await req.json();

    if (!user_a_responses || !user_b_responses) {
      return new Response(
        JSON.stringify({ error: "Missing user response payloads" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const scenarioIds = Object.keys(user_a_responses);
    if (scenarioIds.length === 0) {
      return new Response(
        JSON.stringify({ compatibility_score: 50 }), // Default baseline
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    let matchPoints = 0;
    let totalScenarios = 0;

    scenarioIds.forEach((id) => {
      const optionA = user_a_responses[id];
      const optionB = user_b_responses[id];

      if (optionA !== undefined && optionB !== undefined) {
        totalScenarios++;
        if (optionA === optionB) {
          matchPoints += 1.0; // Perfect agreement
        } else if (Math.abs(optionA - optionB) === 1) {
          matchPoints += 0.5; // Partial compatibility
        }
      }
    });

    const rawScore = totalScenarios > 0 ? (matchPoints / totalScenarios) * 100 : 75;
    // Normalize score to realistic high-intent range (e.g. 68% - 98%)
    const finalScore = Math.min(98, Math.max(65, Math.round(rawScore)));

    return new Response(
      JSON.stringify({
        compatibility_score: finalScore,
        matched_scenarios_count: totalScenarios,
        calculated_at: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
