import { supabase } from './supabaseClient';
import { sendFCMNotification } from './sendFCMNotification';

export async function sendNotification(title: string, message: string) {
  // Save notification to Supabase
  await supabase.from('notifications').insert([{ title, message }]);

  // Fetch device tokens
  const { data: tokens } = await supabase.from('device_tokens').select('token');
  if (tokens) {
    for (const { token } of tokens) {
      await sendFCMNotification(token, title, message);
    }
  }
}
