import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_HISTORY = 20;

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return Response.json({ error: "El parámetro 'videoId' es obligatorio." }, { status: 400 });
  }

  if (!supabase) {
    return Response.json({ conversations: [] });
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("question, answer, sources, created_at")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false })
    .limit(MAX_HISTORY);

  if (error) {
    console.error(JSON.stringify({ type: "supabase_history_error", error: error.message }));
    return Response.json({ error: "No se pudo cargar el historial." }, { status: 500 });
  }

  return Response.json({ conversations: (data ?? []).reverse() });
}

export async function DELETE(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return Response.json({ error: "El parámetro 'videoId' es obligatorio." }, { status: 400 });
  }

  if (!supabase) {
    return Response.json({ ok: true });
  }

  const { error } = await supabase.from("conversations").delete().eq("video_id", videoId);

  if (error) {
    console.error(JSON.stringify({ type: "supabase_delete_error", error: error.message }));
    return Response.json({ error: "No se pudo borrar la conversación." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
