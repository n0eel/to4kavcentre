import { useState } from "react";
import { menuItems, parseCartKey, getItemPrice, getItemVolume } from "@/data/menu";
import { Minus, Plus, Trash2, ShoppingBag, Send, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartDrawerProps {
  cart: Record<string, number>;
  totalItems: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const CartDrawer = ({ cart, totalItems, onAdd, onRemove, onClear }: CartDrawerProps) => {
  const [sending, setSending] = useState(false);

  const cartEntries = Object.entries(cart)
    .map(([key, qty]) => {
      const { itemId, variantIndex } = parseCartKey(key);
      const item = menuItems.find((m) => m.id === itemId);
      if (!item) return null;
      const price = getItemPrice(item, variantIndex);
      const volume = getItemVolume(item, variantIndex);
      return { cartKey: key, name: item.name, volume, price, quantity: qty };
    })
    .filter(Boolean) as { cartKey: string; name: string; volume: string; price: number; quantity: number }[];

  const totalPrice = cartEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);

  const handleSendOrder = async () => {
    if (cartEntries.length === 0) return;
    setSending(true);
    try {
      const orderItems = cartEntries.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, volume: i.volume }));

      // Save order to database for daily reporting
      const { error: dbError } = await supabase
        .from('orders')
        .insert({ items: orderItems, total: totalPrice });
      if (dbError) console.error('Failed to save order to DB:', dbError);

      // Send to Telegram
      const { error } = await supabase.functions.invoke('send-telegram-order', {
        body: { items: orderItems, total: totalPrice },
      });
      if (error) throw error;
      toast.success('Заказ отправлен!');
      onClear();
    } catch (e) {
      console.error(e);
      toast.error('Ошибка отправки заказа');
    } finally {
      setSending(false);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-full flex items-center justify-between bg-card/95 backdrop-blur-md border border-gold/20 rounded-2xl px-5 py-3.5 shadow-xl shadow-black/30 active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-gold" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gold-light/70">Корзина</p>
                  <p className="text-lg font-display font-bold text-cream">
                    {totalPrice.toLocaleString("ru-RU")}{" "}
                    <span className="text-xs font-body font-normal text-gold-light/60">сум</span>
                  </p>
                </div>
              </div>
              <span className="text-xs text-gold-light/50 font-body">Открыть →</span>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="bg-background border-t border-gold/20 rounded-t-3xl max-h-[80vh] px-0">
            <SheetHeader className="px-5 pb-3 border-b border-gold/10">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-display text-lg text-foreground">
                  Корзина ({totalItems})
                </SheetTitle>
                <button
                  onClick={onClear}
                  className="text-xs text-destructive/70 hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Очистить
                </button>
              </div>
            </SheetHeader>

            <div className="overflow-y-auto max-h-[55vh] px-5 py-3 space-y-2">
              {cartEntries.map((entry) => (
                <div
                  key={entry.cartKey}
                  className="flex items-center gap-3 bg-card/60 border border-gold/10 rounded-xl p-3 animate-fade-in"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm text-foreground truncate">
                      {entry.name}
                    </p>
                    {entry.volume && <p className="text-xs text-muted-foreground">{entry.volume}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemove(entry.cartKey)}
                      className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    >
                      {entry.quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="w-6 text-center font-display font-bold text-sm text-foreground">
                      {entry.quantity}
                    </span>
                    <button
                      onClick={() => onAdd(entry.cartKey)}
                      className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-display font-semibold text-gold min-w-[60px] text-right">
                    {(entry.price * entry.quantity).toLocaleString("ru-RU")}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-5 pt-3 pb-5 border-t border-gold/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Итого</span>
                <p className="text-xl font-display font-bold text-cream">
                  {totalPrice.toLocaleString("ru-RU")}{" "}
                  <span className="text-xs font-body font-normal text-gold-light/60">сум</span>
                </p>
              </div>
              <button
                onClick={handleSendOrder}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {sending ? 'Отправка...' : 'Сохранить заказ'}
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CartDrawer;
