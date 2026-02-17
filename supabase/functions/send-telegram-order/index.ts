import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { items, total, order_number, payment_method, order_id } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'No items provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const CHAT_ID = '-1003742140185';

    // Get today's boundaries in Tashkent timezone
    const now = new Date();
    const tashkentOffset = 5 * 60; // UTC+5 in minutes
    const localDate = new Date(now.getTime() + tashkentOffset * 60000);
    const dateStr = localDate.toISOString().slice(0, 10);
    const todayStart = new Date(`${dateStr}T00:00:00+05:00`).toISOString();
    const todayEnd = new Date(`${dateStr}T23:59:59+05:00`).toISOString();

    // Fetch all today's orders with the same order_number
    const { data: existingOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', order_number)
      .gte('created_at', todayStart)
      .lte('created_at', todayEnd)
      .order('created_at', { ascending: true });

    // Combine all items from all orders with this number
    const allItems: { name: string; quantity: number; price: number; volume: string }[] = [];
    let combinedTotal = 0;
    let latestPaymentMethod = payment_method;
    let existingMessageId: number | null = null;

    if (existingOrders && existingOrders.length > 0) {
      for (const order of existingOrders) {
        const orderItems = order.items as any[];
        if (orderItems) {
          for (const item of orderItems) {
            allItems.push({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              volume: item.volume || '',
            });
          }
        }
        combinedTotal += order.total;
        latestPaymentMethod = order.payment_method;
        if (order.telegram_message_id) {
          existingMessageId = order.telegram_message_id;
        }
      }
    }

    // Build message
    const paymentLabel = latestPaymentMethod === 'card' ? 'Карта' : latestPaymentMethod === 'payme' ? 'Payme/Click' : 'Наличные';
    let message = `🧾 <b>Заказ №${order_number}</b>\n\n`;
    for (const item of allItems) {
      const subtotal = item.price * item.quantity;
      const volPart = item.volume ? ` (${item.volume})` : '';
      message += `${item.name}${volPart} × ${item.quantity} — ${subtotal.toLocaleString('ru-RU')} сум\n`;
    }
    message += `\n💳 <b>Способ оплаты: ${paymentLabel}</b>`;
    message += `\n💰 <b>Итого: ${combinedTotal.toLocaleString('ru-RU')} сум</b>`;

    let sentMessageId: number;

    if (existingMessageId) {
      // Edit existing Telegram message
      const editUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;
      const editRes = await fetch(editUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          message_id: existingMessageId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
      const editData = await editRes.json();
      if (!editRes.ok) {
        console.error('Telegram edit error, sending new:', editData);
        // Fallback: send new message
        const sendRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' }),
        });
        const sendData = await sendRes.json();
        sentMessageId = sendData.result?.message_id;
      } else {
        sentMessageId = existingMessageId;
      }
    } else {
      // Send new message
      const sendRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' }),
      });
      const sendData = await sendRes.json();
      if (!sendRes.ok) {
        console.error('Telegram API error:', sendData);
        throw new Error(`Telegram API error [${sendRes.status}]: ${JSON.stringify(sendData)}`);
      }
      sentMessageId = sendData.result?.message_id;
    }

    // Store telegram_message_id on all orders with this number today
    if (sentMessageId) {
      await supabase
        .from('orders')
        .update({ telegram_message_id: sentMessageId })
        .eq('order_number', order_number)
        .gte('created_at', todayStart)
        .lte('created_at', todayEnd);
    }

    return new Response(JSON.stringify({ success: true }), {
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
