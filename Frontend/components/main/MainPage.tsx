"use client";

import Image from "next/image";
import StockWorkspace from "@/components/main/StockWorkspace";
import {
  BarChart3,
  Bell,
  BookOpenText,
  CalendarDays,
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
  Moon,
  PackageCheck,
  ReceiptText,
  Search,
  Settings,
  SlidersHorizontal,
  Sun,
  TrendingDown,
  UsersRound,
  UtensilsCrossed,
  Warehouse,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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

type DateRangeId = "1d" | "1w" | "1m" | "custom";

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

const lockedStoreLabel = "Central Store";

const storeOptions = [
  "Central Store",
  "Semi Kitchen",
  "Bocca Bakery",
  "Bocca Cafe",
  "Bocca Lite",
  "Bocca Book Store",
  "Terra Rosso",
  "Master Canteen",
  "Bocca Patia",
  "Bocca Kalabhoomi",
] as const;

const dateRanges: { id: DateRangeId; label: string }[] = [
  { id: "1d", label: "1 Day" },
  { id: "1w", label: "1 Week" },
  { id: "1m", label: "1 Month" },
  { id: "custom", label: "Custom" },
];

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const activeItem = sectionLookup[activeSection];
  const activeApp = getAppForSection(activeSection);

  useEffect(() => {
    setIsMounted(true);

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
    <main 
      className={cn(
        "main-page min-h-screen bg-[oklch(1_0_0)] text-[#20242c] transition-all duration-700 ease-out", 
        isDarkMode ? "is-dark" : "",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )} 
      onKeyDown={handleGlobalKeyDown}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <TopBar isDarkMode={isDarkMode} onDarkModeToggle={() => setIsDarkMode((current) => !current)} />

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
              {activeSection === "stock" ? (
                <StockWorkspace />
              ) : (
                <>
                  <ContentHeader activeApp={activeApp} activeItem={activeItem} onOpenModal={() => setIsModalOpen(true)} />
                  <DashboardGrid activeSection={activeSection} />
                  <DataWorkspace activeSection={activeSection} />
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {isModalOpen ? <ReviewModal activeItem={activeItem} onClose={() => setIsModalOpen(false)} /> : null}
    </main>
  );
}

type TopBarProps = {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
};

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(date);
}

function getDateDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function parseDateInput(value: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00`);
}

function formatDateRangeLabel(fromDate: Date, toDate: Date) {
  return `${formatShortDate(fromDate)} - ${formatShortDate(toDate)}`;
}

function getDateRangeLabel(rangeId: DateRangeId, customFromDate: string, customToDate: string) {
  if (rangeId === "1d") {
    return "1 Day";
  }

  if (rangeId === "1w") {
    return formatDateRangeLabel(getDateDaysAgo(6), getDateDaysAgo(0));
  }

  if (rangeId === "1m") {
    return formatDateRangeLabel(getDateDaysAgo(29), getDateDaysAgo(0));
  }

  const fromDate = parseDateInput(customFromDate);
  const toDate = parseDateInput(customToDate);

  if (fromDate && toDate) {
    return formatDateRangeLabel(fromDate, toDate);
  }

  return "Custom Range";
}

function TopBar({ isDarkMode, onDarkModeToggle }: TopBarProps) {
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [activeDateRange, setActiveDateRange] = useState<DateRangeId>("1w");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const storeMenuRef = useRef<HTMLDivElement>(null);
  const dateMenuRef = useRef<HTMLDivElement>(null);

  const activeDateRangeLabel = getDateRangeLabel(activeDateRange, customFromDate, customToDate);
  const DarkModeIcon = isDarkMode ? Sun : Moon;

  useEffect(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (storeMenuRef.current && !storeMenuRef.current.contains(target)) {
        setIsStoreMenuOpen(false);
      }

      if (dateMenuRef.current && !dateMenuRef.current.contains(target)) {
        setIsDateMenuOpen(false);
        setIsCustomDateOpen(false);
      }
    }

    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsStoreMenuOpen(false);
        setIsDateMenuOpen(false);
        setIsCustomDateOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, []);

  function handleStoreOptionClick() {
    setIsStoreMenuOpen(false);
  }

  function handleDateRangeClick(rangeId: DateRangeId) {
    setActiveDateRange(rangeId);
    setIsDateMenuOpen(false);
    setIsCustomDateOpen(rangeId === "custom");
  }

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

        <div className="relative flex min-w-0 items-center justify-center" ref={storeMenuRef}>
          <button
            type="button"
            className={cn("main-store-picker", isStoreMenuOpen ? "is-open" : "")}
            aria-haspopup="menu"
            aria-expanded={isStoreMenuOpen}
            aria-controls="main-store-menu"
            onClick={() => setIsStoreMenuOpen((current) => !current)}
          >
            <span>{lockedStoreLabel}</span>
            <ChevronDown className={cn("size-4 transition-transform duration-200", isStoreMenuOpen ? "rotate-180" : "")} aria-hidden="true" />
          </button>

          {isStoreMenuOpen ? (
            <div id="main-store-menu" className="main-menu main-store-menu" role="menu" aria-label="Store picker">
              {storeOptions.map((store) => (
                <button
                  key={store}
                  type="button"
                  className={cn("main-menu-item", store === lockedStoreLabel ? "is-selected" : "")}
                  role="menuitem"
                  aria-current={store === lockedStoreLabel ? "true" : undefined}
                  onClick={handleStoreOptionClick}
                >
                  {store}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="main-actions flex items-center justify-start gap-2 lg:justify-end">
          <div className="relative" ref={dateMenuRef}>
            <button
              type="button"
              className={cn("main-date-picker", isDateMenuOpen || isCustomDateOpen ? "is-open" : "")}
              aria-haspopup="menu"
              aria-expanded={isDateMenuOpen || isCustomDateOpen}
              aria-controls="main-date-menu"
              onClick={() => {
                setIsDateMenuOpen((current) => !current);
                setIsCustomDateOpen(false);
              }}
            >
              <CalendarDays className="size-4 text-[#236f87]" aria-hidden="true" />
              <span>{activeDateRangeLabel}</span>
              <ChevronDown className={cn("size-4 transition-transform duration-200", isDateMenuOpen ? "rotate-180" : "")} aria-hidden="true" />
            </button>

            {isDateMenuOpen ? (
              <div id="main-date-menu" className="main-menu main-date-menu" role="menu" aria-label="Date range picker">
                {dateRanges.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    className={cn("main-menu-item", activeDateRange === range.id ? "is-selected" : "")}
                    role="menuitem"
                    aria-current={activeDateRange === range.id ? "true" : undefined}
                    onClick={() => handleDateRangeClick(range.id)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            ) : null}

            {isCustomDateOpen ? (
              <div className="main-menu main-custom-date-popover" role="dialog" aria-label="Custom date range">
                <label>
                  <span>From</span>
                  <input type="date" value={customFromDate} onChange={(event) => setCustomFromDate(event.target.value)} />
                </label>
                <label>
                  <span>To</span>
                  <input type="date" value={customToDate} onChange={(event) => setCustomToDate(event.target.value)} />
                </label>
              </div>
            ) : null}
          </div>

          <button type="button" className="main-action-button grid size-10 place-items-center rounded-[8px] bg-[#f7f9fb] text-[#475467] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#236f87]/35" aria-label="Notifications">
            <Bell className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn("main-dark-toggle", isDarkMode ? "is-on" : "")}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDarkMode}
            onClick={onDarkModeToggle}
          >
            <DarkModeIcon className="size-4" aria-hidden="true" />
            <span className="main-dark-toggle-track" aria-hidden="true">
              <span />
            </span>
          </button>
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
    <aside className="main-sidebar flex min-h-0 flex-col rounded-[8px] p-2 lg:p-3" aria-label="Main navigation">
      <div className="main-nav-scroll min-h-0 flex-1">
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
        <p className="text-sm font-semibold text-[#667085]">Page 0 of 0 - 0 rows</p>
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
