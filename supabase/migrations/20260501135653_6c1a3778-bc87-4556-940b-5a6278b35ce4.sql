-- 1) S'assurer que l'extension http est dispo dans le schéma extensions
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- 2) (Re)créer le trigger AFTER INSERT sur orders pour notifier l'admin
DROP TRIGGER IF EXISTS trg_notify_admin_new_order ON public.orders;

CREATE TRIGGER trg_notify_admin_new_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_order();

-- 3) Brancher aussi le trigger de gestion de stock manquant
DROP TRIGGER IF EXISTS trg_handle_order_stock_change ON public.orders;

CREATE TRIGGER trg_handle_order_stock_change
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_stock_change();