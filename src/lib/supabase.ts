import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false },
      })
    : null;

export interface ConversationRecord {
  video_id: string | null;
  question: string;
  answer: string;
  sources: unknown;
  ip: string;
}

export async function saveConversation(record: ConversationRecord): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("conversations").insert(record);
  if (error) {
    console.error(JSON.stringify({ type: "supabase_insert_error", error: error.message }));
  }
}
