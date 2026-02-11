import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  // ────────────────────────────────────────────────
  // 1. Обработчик создания заказа (оставляем без изменений)
  // ────────────────────────────────────────────────
  if (path === "/" || path === "") {
    try {
      const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
      if (!TELEGRAM_BOT_TOKEN) {
        throw new Error("TELEGRAM_BOT_TOKEN не задан");
      }

      const { items, total } = await req.json();

      if (!items || !Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: "Нет товаров" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const CHAT_ID = "-1003742140185";

      let message = "🧾 <b>Новый заказ — To4kavcentre</b>\n\n";
      items.forEach((item: { name: string; quantity: number; price: number; volume?: string }, i: number) => {
        const subtotal = item.price * item.quantity;
        const volPart = item.volume ? ` (${item.volume})` : "";
        message += `${i + 1}. ${item.name}${volPart} × ${item.quantity} — ${subtotal.toLocaleString("ru-RU")} сум\n`;
      });
      message += `\n💰 <b>Итого: ${total.toLocaleString("ru-RU")} сум</b>`;

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const res = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Telegram ошибка: ${JSON.stringify(data)}`);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      return new Response(
        JSON.stringify({ error: err.message || "Ошибка сервера" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ────────────────────────────────────────────────
  // 2. Ежедневный отчёт — /daily-report
  // Запускать в 21:10 Ташкент = 16:10 UTC
  // ────────────────────────────────────────────────
  if (path === "/daily-report") {
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase переменные не заданы");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Текущее время в Ташкенте
      const nowTashkent = new Date(Date.now() + 5 * 60 * 60 * 1000);
      nowTashkent.setHours(0, 0, 0, 0); // начало сегодняшнего дня 00:00 Ташкент

      // Конвертируем в UTC (база хранит в UTC)
      const startOfDayUTC = new Date(nowTashkent.getTime() - 5 * 60 * 60 * 1000).toISOString();

      // Конец дня = начало следующего дня
      const endOfDayUTC = new Date(nowTashkent.getTime() + 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString();

      // Запрос суммы и количества заказов за день
      const { data, error } = await supabase
        .from("orders")                     // ← замените на имя вашей таблицы, если отличается
        .select("total")
        .gte("created_at", startOfDayUTC)
        .lt("created_at", endOfDayUTC);

      if (error) throw error;

      const orders = data || [];
      const count = orders.length;
      const totalSum = orders.reduce((sum, row) => sum + (Number(row.total) || 0), 0);

      // Форматируем дату красиво
      const todayStr = nowTashkent.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      let message = `📊 <b>Отчёт за ${todayStr}</b>\n\n`;
      message += `Количество заказов: <b>${count}</b>\n`;
      message += `Общая сумма: <b>${totalSum.toLocaleString("ru-RU")} сум</b>\n`;

      if (count === 0) {
        message += `\nСегодня заказов не было.`;
      }

      const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
      if (!TELEGRAM_BOT_TOKEN) {
        throw new Error("TELEGRAM_BOT_TOKEN не задан");
      }

      const CHAT_ID = "-1003742140185";

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const res = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const tgData = await res.json();
      if (!res.ok) {
        throw new Error(`Telegram ошибка: ${JSON.stringify(tgData)}`);
      }

      return new Response(
        JSON.stringify({ success: true, count, total: totalSum }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error(err);
      return new Response(
        JSON.stringify({ error: err.message || "Ошибка отчёта" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  return new Response("Not found", { status: 404 });
});
