import { Home, Scan, BookOpen, Layers, LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Shared between BottomNav (mobile/tablet) and SidebarNav (desktop) so both
// surfaces stay in sync with a single list of destinations.
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/scanner", label: "SCAN", icon: Scan },
  { href: "/discoveries", label: "COLLECTION", icon: Layers },
  { href: "/guide", label: "GUIDE", icon: BookOpen },
];
