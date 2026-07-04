import {
  LayoutDashboard,
  Package,
  Users,
  UserCog,
  Truck,
  Boxes,
  Wallet,
  Coins,
  BarChart3,
  Settings,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export type AdminTabKey =
  | 'summary'
  | 'orders' | 'validated' | 'delivered' | 'refused' | 'sav'
  | 'lost' | 'by-closeuse' | 'drafts'
  | 'closeuses' | 'ranking' | 'perf' | 'salaires'
  | 'livreurs'
  | 'stock'
  | 'compta' | 'bilan'
  | 'commissions'
  | 'stats' | 'exports' | 'audit';

type Item = { key: AdminTabKey; label: string };
type Group = { id: string; label: string; icon: typeof Package; items: Item[] };

const SINGLES: { key: AdminTabKey; label: string; icon: typeof Package }[] = [
  { key: 'summary', label: 'Tableau de bord', icon: LayoutDashboard },
];

const GROUPS: Group[] = [
  {
    id: 'orders',
    label: 'Commandes',
    icon: Package,
    items: [
      { key: 'orders', label: 'Toutes les commandes' },
      { key: 'validated', label: 'Validées' },
      { key: 'delivered', label: 'Livrées' },
      { key: 'refused', label: 'Refusées' },
      { key: 'sav', label: 'SAV / Suivi' },
    ],
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: Users,
    items: [
      { key: 'by-closeuse', label: 'Par closeuse' },
      { key: 'drafts', label: 'Brouillons' },
      { key: 'lost', label: 'Perdus' },
    ],
  },
  {
    id: 'closeuses',
    label: 'Closeuses',
    icon: UserCog,
    items: [
      { key: 'closeuses', label: 'Liste & objectifs' },
      { key: 'ranking', label: 'Classement' },
      { key: 'perf', label: 'Performance' },
      { key: 'salaires', label: 'Salaires' },
    ],
  },
  {
    id: 'livraison',
    label: 'Livraison',
    icon: Truck,
    items: [{ key: 'livreurs', label: 'Livreurs & assignations' }],
  },
  {
    id: 'stock',
    label: 'Stock',
    icon: Boxes,
    items: [{ key: 'stock', label: 'Produits & mouvements' }],
  },
  {
    id: 'compta',
    label: 'Comptabilité',
    icon: Wallet,
    items: [
      { key: 'compta', label: 'Recettes & dépenses' },
      { key: 'bilan', label: 'Bilan' },
    ],
  },
  {
    id: 'commissions',
    label: 'Commissions',
    icon: Coins,
    items: [{ key: 'commissions', label: 'Montants & paiements' }],
  },
  {
    id: 'rapports',
    label: 'Rapports',
    icon: BarChart3,
    items: [
      { key: 'stats', label: 'Statistiques' },
      { key: 'exports', label: 'Exports' },
      { key: 'audit', label: 'Journal' },
    ],
  },
];

const SETTINGS_GROUP: Group = {
  id: 'settings',
  label: 'Paramètres',
  icon: Settings,
  items: [{ key: 'closeuses', label: 'Closeuses & accès' }],
};

export function AdminSidebar({
  tab,
  onChange,
}: {
  tab: AdminTabKey;
  onChange: (t: AdminTabKey) => void;
}) {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === 'collapsed';

  const handlePick = (k: AdminTabKey) => {
    onChange(k);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3 border-b">
        <div className="flex items-center gap-2 font-extrabold text-vert">
          <span className="text-xl">🌿</span>
          {!collapsed && <span>ShopAfrik Admin</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SINGLES.map((s) => (
                <SidebarMenuItem key={s.key}>
                  <SidebarMenuButton
                    isActive={tab === s.key}
                    onClick={() => handlePick(s.key)}
                    tooltip={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                    <span>{s.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {GROUPS.map((g) => {
          const active = g.items.some((i) => i.key === tab);
          return (
            <Collapsible key={g.id} defaultOpen={active} className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center gap-2">
                    <g.icon className="h-4 w-4" />
                    <span>{g.label}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {/* When collapsed: show group icon button that triggers first item */}
                      {collapsed ? (
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            isActive={active}
                            onClick={() => handlePick(g.items[0].key)}
                            tooltip={g.label}
                          >
                            <g.icon className="h-4 w-4" />
                            <span>{g.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ) : (
                        <SidebarMenuSub>
                          {g.items.map((i) => (
                            <SidebarMenuSubItem key={i.key}>
                              <SidebarMenuSubButton
                                isActive={tab === i.key}
                                onClick={() => handlePick(i.key)}
                                className="cursor-pointer"
                              >
                                <span>{i.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <SETTINGS_GROUP.icon className="h-4 w-4" />
            <span>{SETTINGS_GROUP.label}</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_GROUP.items.map((i) => (
                <SidebarMenuItem key={i.key}>
                  <SidebarMenuButton
                    isActive={tab === i.key}
                    onClick={() => handlePick(i.key)}
                    tooltip={i.label}
                  >
                    <Settings className="h-4 w-4" />
                    <span>{i.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function getTabBreadcrumb(tab: AdminTabKey): { group: string; item: string } {
  for (const s of SINGLES) if (s.key === tab) return { group: 'Admin', item: s.label };
  for (const g of GROUPS) {
    const found = g.items.find((i) => i.key === tab);
    if (found) return { group: g.label, item: found.label };
  }
  const f = SETTINGS_GROUP.items.find((i) => i.key === tab);
  if (f) return { group: SETTINGS_GROUP.label, item: f.label };
  return { group: 'Admin', item: tab };
}
