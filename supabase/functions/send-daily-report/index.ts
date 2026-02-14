import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN not set');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase env not set');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Tashkent is UTC+5
    const nowUTC = new Date();
    const tashkentOffset = 5 * 60 * 60 * 1000;
    const nowTashkent = new Date(nowUTC.getTime() + tashkentOffset);

    const startOfDayTashkent = new Date(nowTashkent);
    startOfDayTashkent.setUTCHours(0, 0, 0, 0);
    const startUTC = new Date(startOfDayTashkent.getTime() - tashkentOffset);
    const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startUTC.toISOString())
      .lt('created_at', endUTC.toISOString());

    if (error) throw error;

    const totalOrders = orders?.length ?? 0;
    const totalSum = orders?.reduce((sum: number, o: any) => sum + o.total, 0) ?? 0;

    // Payment stats
    const cashOrders = orders?.filter((o: any) => o.payment_method === 'cash') ?? [];
    const cardOrders = orders?.filter((o: any) => o.payment_method === 'card') ?? [];
    const cashSum = cashOrders.reduce((s: number, o: any) => s + o.total, 0);
    const cardSum = cardOrders.reduce((s: number, o: any) => s + o.total, 0);

    // Product stats
    const productMap: Record<string, { qty: number; sum: number }> = {};
    for (const order of (orders ?? [])) {
      const items = order.items as any[];
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        const key = item.name || 'Неизвестно';
        if (!productMap[key]) productMap[key] = { qty: 0, sum: 0 };
        productMap[key].qty += item.quantity || 0;
        productMap[key].sum += (item.price || 0) * (item.quantity || 0);
      }
    }

    const dateStr = `${String(nowTashkent.getUTCDate()).padStart(2, '0')}.${String(nowTashkent.getUTCMonth() + 1).padStart(2, '0')}.${nowTashkent.getUTCFullYear()}`;

    let message = `📊 <b>Итоги дня — ${dateStr}</b>\n\n`;
    message += `📦 Заказов было: <b>${totalOrders}</b>\n\n`;

    message += `💵 Оплата наличными:\n`;
    message += `${cashOrders.length} заказов — ${cashSum.toLocaleString('ru-RU')} сум\n\n`;

    message += `💳 Оплата картой:\n`;
    message += `${cardOrders.length} заказов — ${cardSum.toLocaleString('ru-RU')} сум\n\n`;

    message += `———\n\n`;

    const productEntries = Object.entries(productMap).sort((a, b) => b[1].sum - a[1].sum);
    for (const [name, stats] of productEntries) {
      message += `${name} × ${stats.qty} — ${stats.sum.toLocaleString('ru-RU')} сум\n`;
    }

    message += `\n———\n\n`;
    message += `💰 <b>Итого за день: ${totalSum.toLocaleString('ru-RU')} сум</b>`;

    const CHAT_ID = '-1003742140185';
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Telegram API error:', data);
      throw new Error(`Telegram error: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true, totalOrders, totalSum }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
