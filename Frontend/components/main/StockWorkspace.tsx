"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Edit3,
  Filter,
  MoreHorizontal,
  PackageOpen,
  PackageSearch,
  ShoppingCart,
  TriangleAlert,
  X,
} from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type StockRow = {
  itemCode: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  costPerUnit: number;
  totalCost: number;
  category: string;
  expiryDate: string;
  stockStatus: string;
};

type ChartPoint = {
  label: string;
  value: number;
  percentage?: number;
  quantitiesByUnit?: Record<string, number>;
};

type WeeklyConsumptionPoint = {
  date: string;
  label: string;
  value: number;
};

type StockApiResponse = {
  rows: StockRow[];
  summary: {
    totalInventoryValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    nearExpiryItems: number;
    nearExpiryDate: string;
  };
  charts: {
    health: ChartPoint[];
    weeklyConsumption: WeeklyConsumptionPoint[];
    categoryBreakdown: ChartPoint[];
  };
  filters: Partial<Record<FilterColumnId, string[]>>;
};

type FilterColumnId = "itemCode" | "ingredientName" | "quantity" | "costPerUnit" | "totalCost" | "expiryDate" | "stockStatus";
type ComparisonOperator = "greaterThan" | "lessThan" | "equal";
type ExpiryPreset = "lessThanWeek" | "lessThanMonth" | "moreThanMonth";

type SelectedFilter =
  | { kind: "text"; value: string }
  | { kind: "status"; value: string }
  | { kind: "quantity"; operator: ComparisonOperator; unit: string; value: number }
  | { kind: "number"; operator: ComparisonOperator; value: number }
  | { kind: "date"; mode: "comparison"; operator: ComparisonOperator; value: string }
  | { kind: "date"; mode: "preset"; preset: ExpiryPreset };

type FilterDraft = {
  dateValue: string;
  operator: ComparisonOperator;
  text: string;
  unit: string;
  value: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type TableColumn = {
  id: FilterColumnId;
  label: string;
  getValue: (row: StockRow) => string;
};

const inventoryAccent = "#3760ccd9";
const inventoryAccentSolid = "#3760cc";
const chartColors = [inventoryAccent, "#6f8be8", "#8fb4ff", "#42a5a4", "#7c8b5f", "#d39c4a", "#b86c9f", "#5d738f"];
const healthChartColors: Record<string, string> = {
  "In Stock": "#249b68",
  "Low Stock": "#f2c94c",
  "No Stock": "#d92d20",
  "Near Expiry": "#f97316",
};
const comparisonLabels: Record<ComparisonOperator, string> = {
  equal: "Equal",
  greaterThan: "Greater than",
  lessThan: "Less than",
};
const expiryPresetLabels: Record<ExpiryPreset, string> = {
  lessThanMonth: "Less than 1 month",
  lessThanWeek: "Less than 1 week",
  moreThanMonth: "More than 1 month",
};
const comparisonOptions: SelectOption[] = Object.entries(comparisonLabels).map(([value, label]) => ({ label, value }));
const rowsPerPage = 10;

const numberFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatQuantity(row: StockRow) {
  return `${formatNumber(row.quantity)} ${row.unit}`.trim();
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatDateControlLabel(value: string) {
  return value ? formatDate(value) : "Select date";
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarDays(monthDate: Date) {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return toDateInputValue(firstDate) === toDateInputValue(secondDate);
}

const tableColumns: TableColumn[] = [
  { id: "itemCode", label: "Item Code", getValue: (row) => row.itemCode },
  { id: "ingredientName", label: "Ingredient Name", getValue: (row) => row.ingredientName },
  { id: "quantity", label: "Quantity", getValue: formatQuantity },
  { id: "costPerUnit", label: "Cost per unit", getValue: (row) => formatNumber(row.costPerUnit) },
  { id: "totalCost", label: "Total Cost", getValue: (row) => formatNumber(row.totalCost) },
  { id: "expiryDate", label: "Expiry Date", getValue: (row) => row.expiryDate },
  { id: "stockStatus", label: "Stock Status", getValue: (row) => row.stockStatus },
];

function defaultFilterDraft(unit = ""): FilterDraft {
  return {
    dateValue: "",
    operator: "greaterThan",
    text: "",
    unit,
    value: "",
  };
}

function draftFromFilter(filter: SelectedFilter | undefined, unit = ""): FilterDraft {
  const draft = defaultFilterDraft(unit);

  if (!filter) {
    return draft;
  }

  if (filter.kind === "text") {
    return { ...draft, text: filter.value };
  }

  if (filter.kind === "quantity") {
    return { ...draft, operator: filter.operator, unit: filter.unit, value: String(filter.value) };
  }

  if (filter.kind === "number") {
    return { ...draft, operator: filter.operator, value: String(filter.value) };
  }

  if (filter.kind === "date" && filter.mode === "comparison") {
    return { ...draft, dateValue: filter.value, operator: filter.operator };
  }

  return draft;
}

function compareNumbers(value: number, operator: ComparisonOperator, target: number) {
  if (operator === "greaterThan") {
    return value > target;
  }

  if (operator === "lessThan") {
    return value < target;
  }

  return Math.abs(value - target) < 0.000001;
}

function parseLocalDate(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function dateMatchesPreset(rowDate: Date, preset: ExpiryPreset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (preset === "lessThanWeek") {
    return rowDate < addDays(today, 7);
  }

  if (preset === "lessThanMonth") {
    return rowDate < addDays(today, 30);
  }

  return rowDate > addDays(today, 30);
}

function rowMatchesFilter(row: StockRow, column: TableColumn, filter: SelectedFilter) {
  if (filter.kind === "text") {
    return column.getValue(row).toLowerCase().includes(filter.value.toLowerCase());
  }

  if (filter.kind === "status") {
    return row.stockStatus === filter.value;
  }

  if (filter.kind === "quantity") {
    return row.unit === filter.unit && compareNumbers(row.quantity, filter.operator, filter.value);
  }

  if (filter.kind === "number") {
    const value = column.id === "costPerUnit" ? row.costPerUnit : row.totalCost;
    return compareNumbers(value, filter.operator, filter.value);
  }

  const rowDate = parseLocalDate(row.expiryDate);
  if (!rowDate) {
    return false;
  }

  if (filter.mode === "preset") {
    return dateMatchesPreset(rowDate, filter.preset);
  }

  const targetDate = parseLocalDate(filter.value);
  if (!targetDate) {
    return true;
  }

  return compareNumbers(rowDate.getTime(), filter.operator, targetDate.getTime());
}

function getFilteredRows(rows: StockRow[], selectedFilters: Partial<Record<FilterColumnId, SelectedFilter>>) {
  return rows.filter((row) =>
    tableColumns.every((column) => {
      const selectedFilter = selectedFilters[column.id];
      return !selectedFilter || rowMatchesFilter(row, column, selectedFilter);
    }),
  );
}

function getChartColor(point: ChartPoint, index: number, variant: PieChartVariant) {
  return variant === "health" ? healthChartColors[point.label] ?? chartColors[index % chartColors.length] : chartColors[index % chartColors.length];
}

function clampPage(page: number, pageCount: number) {
  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.min(Math.max(Math.trunc(page), 1), pageCount);
}

export default function StockWorkspace() {
  const [stockData, setStockData] = useState<StockApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterColumnId | null>(null);
  const [filterDrafts, setFilterDrafts] = useState<Partial<Record<FilterColumnId, FilterDraft>>>({});
  const [selectedFilters, setSelectedFilters] = useState<Partial<Record<FilterColumnId, SelectedFilter>>>({});
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadStockData() {
      try {
        const response = await fetch("/api/inventory/stock", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || "Unable to load stock data.");
        }

        if (isMounted) {
          setStockData(payload);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load stock data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStockData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveFilter(null);
        setActiveActionRow(null);
        setIsCreatePoOpen(false);
      }
    }

  function handleDocumentMouseDown(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (!target.closest(".inventory-filter-header")) {
        setActiveFilter(null);
      }

      if (!target.closest(".inventory-row-actions")) {
        setActiveActionRow(null);
      }
    }

    document.addEventListener("keydown", handleDocumentKeyDown);
    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []);

  const filteredRows = useMemo(() => getFilteredRows(stockData?.rows ?? [], selectedFilters), [selectedFilters, stockData?.rows]);
  const availableUnits = useMemo(
    () => Array.from(new Set((stockData?.rows ?? []).map((row) => row.unit).filter(Boolean))).sort((first, second) => first.localeCompare(second)),
    [stockData?.rows],
  );
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const pageStartRow = filteredRows.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const pageEndRow = Math.min(currentPage * rowsPerPage, filteredRows.length);
  const hasActiveFilters = Object.keys(selectedFilters).length > 0;
  const rowSummary =
    filteredRows.length === stockData?.rows.length
      ? `Showing ${pageStartRow}-${pageEndRow} of ${filteredRows.length} rows`
      : `Showing ${pageStartRow}-${pageEndRow} of ${filteredRows.length} filtered rows (${stockData?.rows.length ?? 0} total)`;
  const maxConsumptionValue = Math.max(...(stockData?.charts.weeklyConsumption.map((point) => point.value) ?? [0]));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  function goToPage(page: number) {
    const nextPage = clampPage(page, pageCount);
    setCurrentPage(nextPage);
  }

  function getDraft(columnId: FilterColumnId) {
    return filterDrafts[columnId] ?? defaultFilterDraft(availableUnits[0] ?? "");
  }

  function updateFilterDraft(columnId: FilterColumnId, patch: Partial<FilterDraft>) {
    setFilterDrafts((current) => ({
      ...current,
      [columnId]: {
        ...defaultFilterDraft(availableUnits[0] ?? ""),
        ...current[columnId],
        ...patch,
      },
    }));
  }

  function toggleFilter(columnId: FilterColumnId) {
    setFilterDrafts((current) => ({
      ...current,
      [columnId]: current[columnId] ?? draftFromFilter(selectedFilters[columnId], availableUnits[0] ?? ""),
    }));
    setActiveActionRow(null);
    setActiveFilter((current) => (current === columnId ? null : columnId));
  }

  function filterIsActive(columnId: FilterColumnId) {
    return Boolean(selectedFilters[columnId]);
  }

  function applyTextFilter(columnId: FilterColumnId) {
    const value = getDraft(columnId).text.trim();

    setSelectedFilters((current) => {
      const nextFilters = { ...current };

      if (value) {
        nextFilters[columnId] = { kind: "text", value };
      } else {
        delete nextFilters[columnId];
      }

      return nextFilters;
    });
    setActiveFilter(null);
  }

  function applyQuantityFilter(columnId: FilterColumnId) {
    const draft = getDraft(columnId);
    const value = Number(draft.value);
    const unit = draft.unit || availableUnits[0] || "";

    if (!unit || !Number.isFinite(value)) {
      clearFilter(columnId);
      return;
    }

    setSelectedFilters((current) => ({
      ...current,
      [columnId]: { kind: "quantity", operator: draft.operator, unit, value },
    }));
    setActiveFilter(null);
  }

  function applyNumberFilter(columnId: FilterColumnId) {
    const draft = getDraft(columnId);
    const value = Number(draft.value);

    if (!Number.isFinite(value)) {
      clearFilter(columnId);
      return;
    }

    setSelectedFilters((current) => ({
      ...current,
      [columnId]: { kind: "number", operator: draft.operator, value },
    }));
    setActiveFilter(null);
  }

  function applyDateFilter(columnId: FilterColumnId) {
    const draft = getDraft(columnId);

    if (!draft.dateValue) {
      clearFilter(columnId);
      return;
    }

    setSelectedFilters((current) => ({
      ...current,
      [columnId]: { kind: "date", mode: "comparison", operator: draft.operator, value: draft.dateValue },
    }));
    setActiveFilter(null);
  }

  function applyExpiryPreset(columnId: FilterColumnId, preset: ExpiryPreset) {
    setSelectedFilters((current) => ({
      ...current,
      [columnId]: { kind: "date", mode: "preset", preset },
    }));
    setActiveFilter(null);
  }

  function selectStatusFilter(columnId: FilterColumnId, value: string) {
    setSelectedFilters((current) => ({ ...current, [columnId]: { kind: "status", value } }));
    setActiveFilter(null);
  }

  function selectTextFilter(columnId: FilterColumnId, value: string) {
    setFilterDrafts((current) => ({ ...current, [columnId]: { ...defaultFilterDraft(availableUnits[0] ?? ""), ...current[columnId], text: value } }));
    setSelectedFilters((current) => ({ ...current, [columnId]: { kind: "text", value } }));
    setActiveFilter(null);
  }

  function clearFilter(columnId: FilterColumnId) {
    setSelectedFilters((current) => {
      const nextFilters = { ...current };
      delete nextFilters[columnId];
      return nextFilters;
    });
    setFilterDrafts((current) => ({ ...current, [columnId]: defaultFilterDraft(availableUnits[0] ?? "") }));
    setActiveFilter(null);
  }

  function clearAllFilters() {
    setSelectedFilters({});
    setFilterDrafts({});
    setActiveFilter(null);
  }

  return (
    <section className="inventory-workspace" aria-label="Inventory workspace">
      <div className={cn("inventory-workspace-content", isCreatePoOpen ? "is-blurred" : "")}>
        <div className="inventory-heading-row">
          <p className="inventory-kicker">INVENTORY</p>
        </div>

        {isLoading ? (
          <div className="inventory-state-panel">Loading inventory...</div>
        ) : errorMessage ? (
          <div className="inventory-state-panel is-error">{errorMessage}</div>
        ) : stockData ? (
          <>
            <div className="inventory-status-grid">
              <StatusCard icon={CircleDollarSign} label="Total Inventory Value" value={formatCurrency(stockData.summary.totalInventoryValue)} />
              <StatusCard icon={TriangleAlert} label="Low Stock Items" value={String(stockData.summary.lowStockItems)} />
              <StatusCard icon={PackageOpen} label="Out of Stock" value={String(stockData.summary.outOfStockItems)} />
              <StatusCard icon={PackageSearch} label="Near Expiry Items" value={String(stockData.summary.nearExpiryItems)} />
            </div>

            <div className="inventory-chart-grid">
              <section className="inventory-chart-panel" aria-label="Inventory Health">
                <div className="inventory-panel-heading">
                  <h2>Inventory Health</h2>
                </div>
                <PieChart points={stockData.charts.health} variant="health" />
              </section>

              <section className="inventory-chart-panel" aria-label="Ingredient Consumption by value last week">
                <div className="inventory-panel-heading">
                  <h2>Ingredient Consumption by value</h2>
                  <span>Last week</span>
                </div>
                <div className="inventory-bar-chart">
                  {stockData.charts.weeklyConsumption.map((point) => (
                    <div key={point.date} className="inventory-bar-column">
                      <div
                        className="inventory-bar-track"
                        style={{ "--bar-height": `${maxConsumptionValue > 0 ? (point.value / maxConsumptionValue) * 100 : 0}%` } as CSSProperties}
                      >
                        <strong>{formatCurrency(point.value)}</strong>
                        <span />
                      </div>
                      <span>{point.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="inventory-chart-panel" aria-label="Category Breakdown by value">
                <div className="inventory-panel-heading">
                  <h2>Category Breakdown by value</h2>
                </div>
                <PieChart points={stockData.charts.categoryBreakdown} showPercentage variant="category" />
              </section>
            </div>

            <section className="inventory-table-panel" aria-label="Inventory items">
              <div className="inventory-table-heading">
                <div>
                  <h2>Inventory Items</h2>
                  <p>{rowSummary}</p>
                </div>
                <InventoryPagination
                  currentPage={currentPage}
                  hasActiveFilters={hasActiveFilters}
                  pageCount={pageCount}
                  onClearFilters={clearAllFilters}
                  onPageChange={goToPage}
                />
              </div>

              <div className="inventory-table-wrap">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      {tableColumns.map((column) => {
                        const draft = getDraft(column.id);

                        return (
                          <th key={column.id}>
                            <div className="inventory-filter-header">
                              <span>{column.label}</span>
                              <button
                                type="button"
                                className={cn("inventory-filter-button", filterIsActive(column.id) ? "is-active" : "")}
                                aria-label={`Filter ${column.label}`}
                                aria-expanded={activeFilter === column.id}
                                onClick={() => toggleFilter(column.id)}
                              >
                                <Filter className="size-3.5" aria-hidden="true" />
                              </button>

                              {activeFilter === column.id ? (
                                <FilterMenu
                                  activeFilter={selectedFilters[column.id]}
                                  availableUnits={availableUnits}
                                  column={column}
                                  draft={draft}
                                  statusOptions={stockData.filters.stockStatus ?? []}
                                  textOptions={stockData.filters[column.id] ?? []}
                                  onApplyDate={() => applyDateFilter(column.id)}
                                  onApplyExpiryPreset={(preset) => applyExpiryPreset(column.id, preset)}
                                  onApplyNumber={() => applyNumberFilter(column.id)}
                                  onApplyQuantity={() => applyQuantityFilter(column.id)}
                                  onApplyText={() => applyTextFilter(column.id)}
                                  onClear={() => clearFilter(column.id)}
                                  onSelectText={(value) => selectTextFilter(column.id, value)}
                                  onSelectStatus={(value) => selectStatusFilter(column.id, value)}
                                  onUpdateDraft={(patch) => updateFilterDraft(column.id, patch)}
                                />
                              ) : null}
                            </div>
                          </th>
                        );
                      })}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row) => (
                        <tr key={row.itemCode || row.ingredientName}>
                          <td>{row.itemCode}</td>
                          <td>{row.ingredientName}</td>
                          <td>{formatQuantity(row)}</td>
                          <td>{formatNumber(row.costPerUnit)}</td>
                          <td>{formatNumber(row.totalCost)}</td>
                          <td>{formatDate(row.expiryDate)}</td>
                          <td>
                            <span
                              className={cn(
                                "inventory-stock-pill",
                                row.stockStatus === "LOW STOCK" ? "is-low" : row.stockStatus === "NO STOCK" || row.quantity === 0 ? "is-out" : "is-ok",
                              )}
                            >
                              {row.stockStatus}
                            </span>
                          </td>
                          <td>
                            <div className="inventory-row-actions">
                              <button
                                type="button"
                                className="inventory-row-action-button"
                                aria-label={`Actions for ${row.ingredientName || row.itemCode}`}
                                aria-expanded={activeActionRow === row.itemCode}
                                onClick={() => {
                                  setActiveFilter(null);
                                  setActiveActionRow((current) => (current === row.itemCode ? null : row.itemCode));
                                }}
                              >
                                <MoreHorizontal className="size-4" aria-hidden="true" />
                              </button>
                              {activeActionRow === row.itemCode ? (
                                <div className="inventory-row-action-menu" role="menu">
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setIsCreatePoOpen(true);
                                      setActiveActionRow(null);
                                    }}
                                  >
                                    <ShoppingCart className="size-4" aria-hidden="true" />
                                    Create PO
                                  </button>
                                  <button type="button" role="menuitem" onClick={() => setActiveActionRow(null)}>
                                    <Edit3 className="size-4" aria-hidden="true" />
                                    Edit
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="inventory-empty-table-cell">
                          No rows match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </section>
          </>
        ) : null}
      </div>

      {isCreatePoOpen ? (
        <div className="inventory-modal-layer" role="presentation" onClick={() => setIsCreatePoOpen(false)}>
          <section
            className="inventory-po-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-po-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="inventory-modal-close" aria-label="Close modal" onClick={() => setIsCreatePoOpen(false)}>
              <X className="size-5" aria-hidden="true" />
            </button>
            <h2 id="inventory-po-modal-title">Create Purchase Order Modal</h2>
          </section>
        </div>
      ) : null}
    </section>
  );
}

type FilterMenuProps = {
  activeFilter?: SelectedFilter;
  availableUnits: string[];
  column: TableColumn;
  draft: FilterDraft;
  statusOptions: string[];
  textOptions: string[];
  onApplyDate: () => void;
  onApplyExpiryPreset: (preset: ExpiryPreset) => void;
  onApplyNumber: () => void;
  onApplyQuantity: () => void;
  onApplyText: () => void;
  onClear: () => void;
  onSelectText: (value: string) => void;
  onSelectStatus: (value: string) => void;
  onUpdateDraft: (patch: Partial<FilterDraft>) => void;
};

function FilterMenu({
  activeFilter,
  availableUnits,
  column,
  draft,
  statusOptions,
  textOptions,
  onApplyDate,
  onApplyExpiryPreset,
  onApplyNumber,
  onApplyQuantity,
  onApplyText,
  onClear,
  onSelectText,
  onSelectStatus,
  onUpdateDraft,
}: FilterMenuProps) {
  const isTextFilter = column.id === "itemCode" || column.id === "ingredientName";
  const isQuantityFilter = column.id === "quantity";
  const isNumberFilter = column.id === "costPerUnit" || column.id === "totalCost";
  const isDateFilter = column.id === "expiryDate";
  const isStatusFilter = column.id === "stockStatus";
  const visibleTextOptions = textOptions.filter((option) => !draft.text.trim() || option.toLowerCase().includes(draft.text.trim().toLowerCase()));

  return (
    <div className={cn("inventory-filter-menu", isStatusFilter ? "is-status-filter" : "", isDateFilter ? "is-date-filter" : "")} role="menu" aria-label={`${column.label} filter`}>
      {activeFilter ? (
        <button type="button" className="inventory-filter-clear" onClick={onClear}>
          Clear filter
        </button>
      ) : null}

      {isTextFilter ? (
        <div className="inventory-filter-form">
          <input
            type="search"
            value={draft.text}
            placeholder="Search text"
            aria-label={`Search ${column.label}`}
            onChange={(event) => onUpdateDraft({ text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onApplyText();
              }
            }}
          />
          <button type="button" className="inventory-filter-apply" onClick={onApplyText}>
            Apply
          </button>
          <div className="inventory-filter-options">
            {visibleTextOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={cn(activeFilter?.kind === "text" && activeFilter.value === option ? "is-selected" : "")}
                role="menuitem"
                onClick={() => onSelectText(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isQuantityFilter ? (
        <div className="inventory-filter-form">
          <InventorySelect
            ariaLabel="Select unit"
            options={availableUnits.map((unit) => ({ label: unit, value: unit }))}
            value={draft.unit || availableUnits[0] || ""}
            onChange={(unit) => onUpdateDraft({ unit })}
          />
          <ComparisonControls draft={draft} label={column.label} onApply={onApplyQuantity} onUpdateDraft={onUpdateDraft} step="0.01" />
        </div>
      ) : null}

      {isNumberFilter ? (
        <div className="inventory-filter-form">
          <ComparisonControls draft={draft} label={column.label} onApply={onApplyNumber} onUpdateDraft={onUpdateDraft} step="0.01" />
        </div>
      ) : null}

      {isDateFilter ? (
        <div className="inventory-filter-form">
          <div className="inventory-filter-row">
            <InventorySelect
              ariaLabel={`Select ${column.label} comparison`}
              options={comparisonOptions}
              value={draft.operator}
              onChange={(operator) => onUpdateDraft({ operator: operator as ComparisonOperator })}
            />
            <InventoryDatePicker value={draft.dateValue} onChange={(dateValue) => onUpdateDraft({ dateValue })} />
          </div>
          <button type="button" className="inventory-filter-apply" onClick={onApplyDate}>
            Apply
          </button>
          <div className="inventory-filter-presets" aria-label="Expiry presets">
            {(Object.keys(expiryPresetLabels) as ExpiryPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(activeFilter?.kind === "date" && activeFilter.mode === "preset" && activeFilter.preset === preset ? "is-selected" : "")}
                onClick={() => onApplyExpiryPreset(preset)}
              >
                {expiryPresetLabels[preset]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isStatusFilter ? (
        <div className="inventory-filter-options">
          {statusOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(activeFilter?.kind === "status" && activeFilter.value === option ? "is-selected" : "")}
              role="menuitem"
              onClick={() => onSelectStatus(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type ComparisonControlsProps = {
  draft: FilterDraft;
  label: string;
  onApply: () => void;
  onUpdateDraft: (patch: Partial<FilterDraft>) => void;
  step: string;
};

function ComparisonControls({ draft, label, onApply, onUpdateDraft, step }: ComparisonControlsProps) {
  return (
    <>
      <div className="inventory-filter-row">
        <InventorySelect
          ariaLabel={`Select ${label} comparison`}
          options={comparisonOptions}
          value={draft.operator}
          onChange={(operator) => onUpdateDraft({ operator: operator as ComparisonOperator })}
        />
        <input
          type="number"
          step={step}
          value={draft.value}
          placeholder="Value"
          aria-label={`${label} value`}
          onChange={(event) => onUpdateDraft({ value: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onApply();
            }
          }}
        />
      </div>
      <button type="button" className="inventory-filter-apply" onClick={onApply}>
        Apply
      </button>
    </>
  );
}

type InventorySelectProps = {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

function InventorySelect({ ariaLabel, onChange, options, value }: InventorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      const target = event.target;

      if (target instanceof Node && !selectRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, []);

  return (
    <div className="inventory-select" ref={selectRef}>
      <button type="button" className={cn("inventory-select-trigger", isOpen ? "is-open" : "")} aria-label={ariaLabel} aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>
        <span>{selectedOption?.label ?? "Select"}</span>
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="inventory-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(option.value === value ? "is-selected" : "")}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type InventoryDatePickerProps = {
  onChange: (dateValue: string) => void;
  value: string;
};

function InventoryDatePicker({ onChange, value }: InventoryDatePickerProps) {
  const selectedDate = parseLocalDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? new Date());
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectedDateTime = selectedDate?.getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const nextSelectedDate = parseLocalDate(value);

    if (nextSelectedDate) {
      setVisibleMonth(nextSelectedDate);
    }
  }, [selectedDateTime, value]);

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      const target = event.target;

      if (target instanceof Node && !pickerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, []);

  function moveMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <div className="inventory-date-picker" ref={pickerRef}>
      <button type="button" className={cn("inventory-date-trigger", isOpen ? "is-open" : "")} aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>
        <CalendarDays className="size-4" aria-hidden="true" />
        <span>{formatDateControlLabel(value)}</span>
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="inventory-calendar-popover" role="dialog" aria-label="Choose expiry date">
          <div className="inventory-calendar-header">
            <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <strong>{getMonthLabel(visibleMonth)}</strong>
            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="inventory-calendar-weekdays" aria-hidden="true">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="inventory-calendar-grid">
            {getCalendarDays(visibleMonth).map((date) => {
              const dateValue = toDateInputValue(date);
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

              return (
                <button
                  key={dateValue}
                  type="button"
                  className={cn(!isCurrentMonth ? "is-muted" : "", isSelected ? "is-selected" : "", isSameDay(date, today) ? "is-today" : "")}
                  onClick={() => {
                    onChange(dateValue);
                    setIsOpen(false);
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type InventoryPaginationProps = {
  currentPage: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  pageCount: number;
  onPageChange: (page: number) => void;
};

function InventoryPagination({ currentPage, hasActiveFilters, onClearFilters, pageCount, onPageChange }: InventoryPaginationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      const target = event.target;

      if (target instanceof Node && !paginationRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, []);

  return (
    <div className="inventory-pagination" aria-label="Inventory pagination" ref={paginationRef}>
      <button type="button" className="inventory-clear-filters-button" disabled={!hasActiveFilters} onClick={onClearFilters}>
        Clear filters
      </button>
      <button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      <div className="inventory-page-select">
        <button type="button" className={cn("inventory-page-select-trigger", isOpen ? "is-open" : "")} aria-label="Select page" aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>
          <span>Page {currentPage}</span>
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </button>
        {isOpen ? (
          <div className="inventory-page-menu" role="listbox" aria-label="Inventory pages">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={cn(page === currentPage ? "is-selected" : "")}
                role="option"
                aria-selected={page === currentPage}
                onClick={() => {
                  onPageChange(page);
                  setIsOpen(false);
                }}
              >
                Page {page}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <button type="button" aria-label="Next page" disabled={currentPage >= pageCount} onClick={() => onPageChange(currentPage + 1)}>
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

type StatusCardProps = {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
};

function StatusCard({ icon: Icon, label, value }: StatusCardProps) {
  return (
    <section className="inventory-status-card">
      <span className="inventory-status-icon">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </section>
  );
}

type PieChartVariant = "category" | "health";

type PieChartProps = {
  points: ChartPoint[];
  showPercentage?: boolean;
  variant: PieChartVariant;
};

function PieChart({ points, showPercentage = false, variant }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = points.reduce((sum, point) => sum + point.value, 0);
  const visiblePoints = points.filter((point) => point.value > 0);
  const chartPoints = visiblePoints.length > 0 ? visiblePoints : points;
  const circumference = 2 * Math.PI * 42;
  let strokeOffset = 0;
  const hoveredPoint = variant === "category" && hoveredIndex !== null ? chartPoints[hoveredIndex] : null;

  return (
    <div className="inventory-pie-layout">
      <div className={cn("inventory-pie", variant === "category" ? "is-category" : "")} onMouseLeave={() => setHoveredIndex(null)}>
        {total > 0 ? (
          <svg viewBox="0 0 100 100" role="img" aria-label={`${variant === "health" ? "Inventory health" : "Category breakdown"} chart`}>
            {chartPoints.map((point, index) => {
              const segmentLength = (point.value / total) * circumference;
              const dashOffset = -strokeOffset;
              const strokeWidth = variant === "category" && hoveredIndex !== null ? (hoveredIndex === index ? 26.4 : 19.8) : 22;

              strokeOffset += segmentLength;

              return (
                <circle
                  key={point.label}
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={getChartColor(point, index, variant)}
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={dashOffset}
                  strokeWidth={strokeWidth}
                  transform="rotate(-90 50 50)"
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              );
            })}
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" role="img" aria-label="No chart data">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="22" />
          </svg>
        )}
        {variant === "health" ? <span>{formatNumber(total)}</span> : null}
        {hoveredPoint ? (
          <div className="inventory-pie-tooltip" role="tooltip">
            <strong>{hoveredPoint.label}</strong>
            <p>{hoveredPoint.percentage !== undefined ? `${hoveredPoint.percentage.toFixed(1)}%` : "0.0%"}</p>
            <p>Total cost: {formatCurrency(hoveredPoint.value)}</p>
          </div>
        ) : null}
      </div>
      <div className="inventory-legend">
        {chartPoints.map((point, index) => (
          <div key={point.label} className="inventory-legend-row">
            <span style={{ background: getChartColor(point, index, variant) }} />
            <p>{point.label}</p>
            <strong>{showPercentage && point.percentage !== undefined ? `${point.percentage.toFixed(1)}%` : formatNumber(point.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
