"use client";

import Image from "next/image";
import {
  BarChart3,
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileText,
  Gauge,
  History,
  PackageCheck,
  ReceiptText,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingDown,
  UsersRound,
  UtensilsCrossed,
  Warehouse,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type MainAppId = "analytics" | "inventory" | "consumption" | "kitchen" | "management";

type MainSectionId =
  | "dashboard"
  | "inventory-forecast"
  | "leakage"
  | "reports"
  | "stock"
  | "purchase-orders"
  | "grn"
  | "returns"
  | "sale"
  | "usage"
  | "wastage"
  | "recipes"
  | "menu"
  | "approvals"
  | "audit-trail"
  | "employees";

type NavItem = {
  id: MainSectionId;
  label: string;
  app: MainAppId;
  icon: LucideIcon;
};

type NavGroup = {
  id: MainAppId;
  label: string;
  items: NavItem[];
};

const appLabels: Record<MainAppId, string> = {
  analytics: "Analytics",
  inventory: "Inventory",
  consumption: "Consumption",
  kitchen: "Kitchen",
  management: "Management",
};

const sectionDescriptions: Record<MainSectionId, string> = {
  dashboard: "Data will appear here after the Excel source is connected.",
  "inventory-forecast": "Inventory forecast data will appear here after the Excel source is connected.",
  leakage: "Leakage data will appear here after the Excel source is connected.",
  reports: "Reports will appear here after the Excel source is connected.",
  stock: "Stock data will appear here after the Excel source is connected.",
  "purchase-orders": "Purchase order data will appear here after the Excel source is connected.",
  grn: "GRN data will appear here after the Excel source is connected.",
  returns: "Returns data will appear here after the Excel source is connected.",
  sale: "Sale data will appear here after the Excel source is connected.",
  usage: "Usage data will appear here after the Excel source is connected.",
  wastage: "Wastage data will appear here after the Excel source is connected.",
  recipes: "Recipe data will appear here after the Excel source is connected.",
  menu: "Menu data will appear here after the Excel source is connected.",
  approvals: "Approval data will appear here after the Excel source is connected.",
  "audit-trail": "Audit trail data will appear here after the Excel source is connected.",
  employees: "Employee data will appear here after the Excel source is connected.",
};

const dashboardItem: NavItem = {
  id: "dashboard",
  label: "Dashboard",
  app: "analytics",
  icon: Gauge,
};

const navGroups: NavGroup[] = [
  {
    id: "analytics",
    label: "Analytics",
    items: [
      { id: "inventory-forecast", label: "Inventory Forecast", app: "analytics", icon: BarChart3 },
      { id: "leakage", label: "Leakage", app: "analytics", icon: TrendingDown },
      { id: "reports", label: "Reports", app: "analytics", icon: FileText },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    items: [
      { id: "stock", label: "Stock", app: "inventory", icon: Warehouse },
      { id: "purchase-orders", label: "Purchase Orders", app: "inventory", icon: ClipboardList },
      { id: "grn", label: "GRN", app: "inventory", icon: PackageCheck },
      { id: "returns", label: "Returns", app: "inventory", icon: ReceiptText },
    ],
  },
  {
    id: "consumption",
    label: "Consumption",
    items: [
      { id: "sale", label: "Sale", app: "consumption", icon: ReceiptText },
      { id: "usage", label: "Usage", app: "consumption", icon: ClipboardCheck },
      { id: "wastage", label: "Wastage", app: "consumption", icon: TrendingDown },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    items: [
      { id: "recipes", label: "Recipes", app: "kitchen", icon: BookOpenText },
      { id: "menu", label: "Menu", app: "kitchen", icon: UtensilsCrossed },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      { id: "approvals", label: "Approvals", app: "management", icon: ClipboardCheck },
      { id: "audit-trail", label: "Audit Trail", app: "management", icon: History },
      { id: "employees", label: "Employees", app: "management", icon: UsersRound },
    ],
  },
];

const sectionLookup = [dashboardItem, ...navGroups.flatMap((group) => group.items)].reduce<Record<MainSectionId, NavItem>>(
  (lookup, item) => {
    lookup[item.id] = item;
    return lookup;
  },
  {} as Record<MainSectionId, NavItem>,
);

function getAppForSection(sectionId: MainSectionId): MainAppId {
  return sectionLookup[sectionId].app;
}

export default function MainPage() {
  const [activeSection, setActiveSection] = useState<MainSectionId>("dashboard");
  const [expandedGroup, setExpandedGroup] = useState<MainAppId | null>("analytics");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeItem = sectionLookup[activeSection];
  const activeApp = getAppForSection(activeSection);

  useEffect(() => {
    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => document.removeEventListener("keydown", handleDocumentKeyDown);
  }, []);

  function selectSection(item: NavItem) {
    setActiveSection(item.id);
    setExpandedGroup(item.app);
  }

  function toggleGroup(groupId: MainAppId) {
    setExpandedGroup((current) => (current === groupId ? null : groupId));
  }

  function handleGlobalKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      setIsModalOpen(false);
    }
  }

  return (
    <main className="main-page min-h-screen bg-[oklch(1_0_0)] text-[#20242c]" onKeyDown={handleGlobalKeyDown}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <TopBar />

        <div className="main-workspace grid flex-1 grid-cols-1 gap-5 pt-5 lg:grid-cols-[270px_minmax(0,1fr)]">
          <Sidebar
            activeSection={activeSection}
            expandedGroup={expandedGroup}
            onDashboardSelect={() => selectSection(dashboardItem)}
            onGroupToggle={toggleGroup}
            onItemSelect={selectSection}
          />

          <section className="main-content-surface min-h-0 overflow-hidden rounded-[8px]" aria-label={`${appLabels[activeApp]} workspace`}>
            <div className="flex min-h-full flex-col gap-5 overflow-y-auto px-1 pb-5 lg:px-2">
              <ContentHeader activeApp={activeApp} activeItem={activeItem} onOpenModal={() => setIsModalOpen(true)} />
              <DashboardGrid activeSection={activeSection} />
              <DataWorkspace activeSection={activeSection} />
            </div>
          </section>
        </div>
      </div>

      {isModalOpen ? <ReviewModal activeItem={activeItem} onClose={() => setIsModalOpen(false)} /> : null}
    </main>
  );
}

function TopBar() {
  return (
    <header className="main-topbar rounded-[8px] px-4 py-3 sm:px-5">
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(240px,1fr)_auto] lg:items-center">
        <a className="inline-flex items-center gap-2 text-bocca-blue" href="/login" aria-label="BoccaCafe login">
          <Image
            className="bocca-logo-image"
            src="/assets/Bocca-Logo.png"
            alt=""
            width={48}
            height={48}
            priority
          />
          <span className="bocca-logo">BOCCA</span>
        </a>

        <div className="flex min-w-0 items-center justify-center">
          <div className="main-empty-control h-11 w-full max-w-[420px] rounded-[8px]" aria-hidden="true" />
        </div>

        <div className="main-actions flex items-center justify-start gap-2 lg:justify-end">
          <button type="button" className="main-action-button grid size-10 place-items-center rounded-[8px] bg-[#f7f9fb] text-[#475467] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#236f87]/35" aria-label="Settings">
            <Settings className="size-5" aria-hidden="true" />
          </button>
          <div className="ml-1 flex h-10 items-center gap-2 rounded-[8px] bg-[#f7f9fb] px-2.5 text-sm font-bold text-[#20242c]">
            <CircleUserRound className="size-5 text-[#236f87]" aria-hidden="true" />
            <span>DR</span>
          </div>
        </div>
      </div>
    </header>
  );
}

type SidebarProps = {
  activeSection: MainSectionId;
  expandedGroup: MainAppId | null;
  onDashboardSelect: () => void;
  onGroupToggle: (groupId: MainAppId) => void;
  onItemSelect: (item: NavItem) => void;
};

function Sidebar({ activeSection, expandedGroup, onDashboardSelect, onGroupToggle, onItemSelect }: SidebarProps) {
  return (
    <aside className="main-sidebar min-h-0 rounded-[8px] p-2 lg:p-3" aria-label="Main navigation">
      <button
        type="button"
        className={cn("main-nav-root", activeSection === "dashboard" ? "is-selected" : "")}
        aria-current={activeSection === "dashboard" ? "page" : undefined}
        onClick={onDashboardSelect}
      >
        <dashboardItem.icon className="size-4" aria-hidden="true" />
        <span>{dashboardItem.label}</span>
      </button>

      <div className="mt-2 space-y-1">
        {navGroups.map((group) => {
          const isExpanded = expandedGroup === group.id;
          const groupContainsActive = group.items.some((item) => item.id === activeSection);

          return (
            <section key={group.id} className="main-nav-group">
              <button
                type="button"
                className={cn("main-nav-group-button", groupContainsActive ? "is-selected" : "")}
                aria-expanded={isExpanded}
                aria-controls={`${group.id}-items`}
                onClick={() => onGroupToggle(group.id)}
              >
                <span>{group.label}</span>
                <ChevronDown className={cn("size-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} aria-hidden="true" />
              </button>
              <div id={`${group.id}-items`} className={cn("main-nav-items-grid", isExpanded ? "is-open" : "")} aria-hidden={!isExpanded}>
                <div className="main-nav-items-inner">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={cn("main-nav-item", activeSection === item.id ? "is-selected" : "")}
                        aria-current={activeSection === item.id ? "page" : undefined}
                        tabIndex={isExpanded ? 0 : -1}
                        onClick={() => onItemSelect(item)}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}

type ContentHeaderProps = {
  activeApp: MainAppId;
  activeItem: NavItem;
  onOpenModal: () => void;
};

function ContentHeader({ activeApp, activeItem, onOpenModal }: ContentHeaderProps) {
  const Icon = activeItem.icon;

  return (
    <div className="main-content-header grid gap-4 rounded-[8px] px-1 pt-1 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#667085]">
          <span>{appLabels[activeApp]}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[#eef8fa] text-[#236f87]">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black tracking-0 text-[#20242c] sm:text-3xl">{activeItem.label}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#667085]">{sectionDescriptions[activeItem.id]}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="main-secondary-button" onClick={onOpenModal}>
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Review exceptions
        </button>
        <button type="button" className="main-primary-button">
          <Download className="size-4" aria-hidden="true" />
          Export
        </button>
      </div>
    </div>
  );
}

type DashboardGridProps = {
  activeSection: MainSectionId;
};

function DashboardGrid({ activeSection }: DashboardGridProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
      <section className="main-empty-panel rounded-[8px] p-5 sm:p-6 xl:col-span-2" aria-label={`${sectionLookup[activeSection].label} dashboard`}>
        <div className="main-empty-state">
          <h2>No data loaded</h2>
          <p>Bocca-data.xlsx is ready for the future data import flow.</p>
        </div>
      </section>
    </div>
  );
}

type DataWorkspaceProps = {
  activeSection: MainSectionId;
};

function DataWorkspace({ activeSection }: DataWorkspaceProps) {
  return (
    <section className="main-table-panel rounded-[8px] p-4 sm:p-5" aria-label={`${sectionLookup[activeSection].label} data`}>
      <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <h2 className="text-base font-black text-[#20242c]">{sectionLookup[activeSection].label} ledger</h2>
          <p className="mt-1 text-sm text-[#667085]">No records are available yet.</p>
        </div>
        <label className="main-search relative block w-full lg:w-[280px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a2b3]" aria-hidden="true" />
          <span className="sr-only">Search ledger</span>
          <input className="h-10 w-full rounded-[8px] pl-9 pr-3 text-sm font-semibold" placeholder="Search items" type="search" disabled />
        </label>
      </div>

      <div className="main-empty-table">
        <p>No data to display.</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[#667085]">Page 0 of 0 · 0 rows</p>
        <div className="flex items-center gap-2">
          <button type="button" className="main-pagination-button" disabled>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </button>
          <button type="button" className="main-pagination-button" disabled>
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

type ReviewModalProps = {
  activeItem: NavItem;
  onClose: () => void;
};

function ReviewModal({ activeItem, onClose }: ReviewModalProps) {
  return (
    <div className="main-modal-backdrop" role="presentation">
      <section className="main-modal rounded-[8px] p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="main-modal-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="main-modal-title" className="text-xl font-black text-[#20242c]">
              {activeItem.label} exceptions
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">No exception data is loaded yet.</p>
          </div>
          <button type="button" className="main-icon-button" aria-label="Close modal" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 main-empty-table">
          <p>No data to display.</p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="main-secondary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
