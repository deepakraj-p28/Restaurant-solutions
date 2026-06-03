import path from "node:path";
import { readFileSync } from "node:fs";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RawInventoryRow = Record<string, unknown>;

type InventoryRow = {
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

const lockedStoreName = "Central Store";

function textValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function numericValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalized = textValue(value).replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateWithOffset(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

function excelDateValue(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatLocalDate(value);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      return `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
    }
  }

  const rawValue = textValue(value);
  if (!rawValue) {
    return "";
  }

  const parsedDate = new Date(rawValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return formatLocalDate(parsedDate);
  }

  return rawValue;
}

function normalizeRow(row: RawInventoryRow): InventoryRow {
  const quantity = numericValue(row.Quantity);
  const stockStatus = quantity === 0 ? "NO STOCK" : textValue(row["Stock Status"]).toUpperCase() || "UNKNOWN";

  return {
    itemCode: textValue(row["Item Code"]),
    ingredientName: textValue(row["Ingredient Name"]),
    unit: textValue(row.Unit),
    quantity,
    costPerUnit: numericValue(row["Cost per Unit"]),
    totalCost: numericValue(row["Total Cost"]),
    category: textValue(row.Category) || "Uncategorized",
    expiryDate: excelDateValue(row["Expiry Date"]),
    stockStatus,
  };
}

function rowMatchesLockedStore(row: RawInventoryRow) {
  const storeName = textValue(row["Store Name"]);
  return !storeName || storeName === lockedStoreName;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((first, second) => first.localeCompare(second));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

function buildWeeklyConsumption(totalInventoryValue: number) {
  const multipliers = [0.82, 0.96, 1.08, 0.91, 1.15, 1.28, 1.02];
  const baseValue = Math.max(totalInventoryValue * 0.012, 1);

  return multipliers.map((multiplier, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    return {
      date: formatLocalDate(date),
      label: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(date),
      value: Math.round(baseValue * multiplier),
    };
  });
}

export async function GET() {
  try {
    const workbookPath = path.resolve(process.cwd(), "..", "Bocca-data.xlsx");
    const workbookBuffer = readFileSync(workbookPath);
    const workbook = XLSX.read(workbookBuffer, { cellDates: true, type: "buffer" });
    const inventorySheet = workbook.Sheets.Inventory;

    if (!inventorySheet) {
      return NextResponse.json({ message: "Inventory worksheet was not found in Bocca-data.xlsx." }, { status: 404 });
    }

    const rawRows = XLSX.utils.sheet_to_json<RawInventoryRow>(inventorySheet, { defval: "" });
    const rows = rawRows.filter(rowMatchesLockedStore).map(normalizeRow).filter((row) => row.itemCode || row.ingredientName);
    const totalInventoryValue = rows.reduce((total, row) => total + row.totalCost, 0);
    const nearExpiryDate = dateWithOffset(3);
    const nearExpiryItems = rows.filter((row) => row.expiryDate === nearExpiryDate).length;
    const lowStockItems = rows.filter((row) => row.stockStatus === "LOW STOCK").length;
    const outOfStockItems = rows.filter((row) => row.quantity === 0).length;

    const categoryTotals = rows.reduce<Record<string, { quantitiesByUnit: Record<string, number>; totalCost: number }>>((totals, row) => {
      const category = totals[row.category] ?? { quantitiesByUnit: {}, totalCost: 0 };
      const unit = row.unit || "unit";

      category.totalCost += row.totalCost;
      category.quantitiesByUnit[unit] = (category.quantitiesByUnit[unit] ?? 0) + row.quantity;
      totals[row.category] = category;

      return totals;
    }, {});

    const inStockCount = rows.filter((row) => row.stockStatus === "OK" && row.expiryDate !== nearExpiryDate).length;
    const health = [
      { label: "In Stock", value: inStockCount },
      { label: "Low Stock", value: lowStockItems },
      { label: "No Stock", value: outOfStockItems },
      { label: "Near Expiry", value: nearExpiryItems },
    ];

    return NextResponse.json({
      rows,
      summary: {
        totalInventoryValue,
        lowStockItems,
        outOfStockItems,
        nearExpiryItems,
        nearExpiryDate,
      },
      charts: {
        health,
        weeklyConsumption: buildWeeklyConsumption(totalInventoryValue),
        categoryBreakdown: Object.entries(categoryTotals)
          .map(([label, category]) => ({
            label,
            value: category.totalCost,
            percentage: totalInventoryValue > 0 ? (category.totalCost / totalInventoryValue) * 100 : 0,
            quantitiesByUnit: category.quantitiesByUnit,
          }))
          .sort((first, second) => second.value - first.value),
      },
      filters: {
        itemCode: uniqueValues(rows.map((row) => row.itemCode)),
        ingredientName: uniqueValues(rows.map((row) => row.ingredientName)),
        quantity: uniqueValues(rows.map((row) => `${formatNumber(row.quantity)} ${row.unit}`.trim())),
        costPerUnit: uniqueValues(rows.map((row) => formatNumber(row.costPerUnit))),
        totalCost: uniqueValues(rows.map((row) => formatNumber(row.totalCost))),
        expiryDate: uniqueValues(rows.map((row) => row.expiryDate)),
        stockStatus: uniqueValues(rows.map((row) => row.stockStatus)),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read inventory data.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
