export type ViewportKey = "desktop" | "tablet" | "mobile";

export type NodeId =
  | "central-kitchen"
  | "semi-kitchen"
  | "bocca-bakery"
  | "bocca-book-store"
  | "terra-rosso"
  | "bocca-cafe"
  | "bocca-lite"
  | "master-canteen"
  | "bocca-kalabhoomi"
  | "bocca-patia";

export type RingTone = "green" | "amber";
export type DepthTier = "low" | "mid" | "high";
export type NodeSize = "sm" | "md" | "lg" | "xl";
export type PopupSide = "top" | "right" | "bottom" | "left";

export type Coordinate = {
  x: number;
  y: number;
};

export type HomeNode = {
  id: NodeId;
  label: string;
  size: NodeSize;
  ringTone: RingTone;
  depth: DepthTier;
  popupSide: PopupSide;
  coordinates: Record<ViewportKey, Coordinate>;
  popupText: string;
};

export type HomeConnection = {
  id: string;
  from: NodeId;
  to: NodeId;
  depth: DepthTier;
};

export type PipeGeometry = {
  midpoint: Coordinate;
  length: number;
  angle: number;
};

const VIEWPORT_ASPECT_RATIO: Record<ViewportKey, number> = {
  desktop: 16 / 9,
  tablet: 3 / 4,
  mobile: 9 / 16,
};

export const motionSettings = {
  durationMs: 360,
  easing: "cubic-bezier(0.2, 0.82, 0.2, 1)",
  hoverScale: 1.15,
  inactiveScale: 0.85,
} as const;

export const homeNodes: HomeNode[] = [
  {
    id: "central-kitchen",
    label: "Central Kitchen",
    size: "xl",
    ringTone: "green",
    depth: "high",
    popupSide: "bottom",
    popupText: "Central hub for stock flow.",
    coordinates: {
      desktop: { x: 50, y: 15 },
      tablet: { x: 50, y: 15 },
      mobile: { x: 50, y: 10 },
    },
  },
  {
    id: "master-canteen",
    label: "Master Canteen",
    size: "md",
    ringTone: "green",
    depth: "low",
    popupSide: "right",
    popupText: "Master canteen stock.",
    coordinates: {
      desktop: { x: 25, y: 15 },
      tablet: { x: 25, y: 20 },
      mobile: { x: 20, y: 20 },
    },
  },
  {
    id: "bocca-patia",
    label: "Bocca Patia",
    size: "md",
    ringTone: "amber",
    depth: "low",
    popupSide: "left",
    popupText: "Patia outlet checks.",
    coordinates: {
      desktop: { x: 72, y: 12 },
      tablet: { x: 75, y: 20 },
      mobile: { x: 80, y: 20 },
    },
  },
  {
    id: "bocca-kalabhoomi",
    label: "Bocca Kalabhoomi",
    size: "md",
    ringTone: "green",
    depth: "mid",
    popupSide: "right",
    popupText: "Kalabhoomi stock.",
    coordinates: {
      desktop: { x: 15, y: 38 },
      tablet: { x: 15, y: 40 },
      mobile: { x: 15, y: 35 },
    },
  },
  {
    id: "terra-rosso",
    label: "Terra Rosso",
    size: "sm",
    ringTone: "green",
    depth: "mid",
    popupSide: "left",
    popupText: "Terra Rosso transfers.",
    coordinates: {
      desktop: { x: 85, y: 30 },
      tablet: { x: 85, y: 40 },
      mobile: { x: 85, y: 35 },
    },
  },
  {
    id: "bocca-lite",
    label: "Bocca Lite",
    size: "sm",
    ringTone: "amber",
    depth: "low",
    popupSide: "right",
    popupText: "Lite outlet supplies.",
    coordinates: {
      desktop: { x: 12, y: 62 },
      tablet: { x: 15, y: 65 },
      mobile: { x: 15, y: 60 },
    },
  },
  {
    id: "semi-kitchen",
    label: "Semi Kitchen",
    size: "lg",
    ringTone: "green",
    depth: "mid",
    popupSide: "right",
    popupText: "Semi kitchen movement.",
    coordinates: {
      desktop: { x: 30, y: 75 },
      tablet: { x: 30, y: 75 },
      mobile: { x: 30, y: 75 },
    },
  },
  {
    id: "bocca-bakery",
    label: "Bocca Bakery",
    size: "lg",
    ringTone: "green",
    depth: "high",
    popupSide: "left",
    popupText: "Bakery stock & supply.",
    coordinates: {
      desktop: { x: 62, y: 62 },
      tablet: { x: 70, y: 65 },
      mobile: { x: 70, y: 65 },
    },
  },
  {
    id: "bocca-book-store",
    label: "Bocca Book Store",
    size: "md",
    ringTone: "green",
    depth: "low",
    popupSide: "left",
    popupText: "Book store inventory.",
    coordinates: {
      desktop: { x: 82, y: 72 },
      tablet: { x: 85, y: 80 },
      mobile: { x: 85, y: 80 },
    },
  },
  {
    id: "bocca-cafe",
    label: "Bocca Cafe",
    size: "md",
    ringTone: "green",
    depth: "high",
    popupSide: "top",
    popupText: "Main cafe demand.",
    coordinates: {
      desktop: { x: 50, y: 88 },
      tablet: { x: 50, y: 90 },
      mobile: { x: 50, y: 90 },
    },
  },
] as const;

export const homeConnections: HomeConnection[] = [
  // Central Kitchen to all
  { id: "ck-mc", from: "central-kitchen", to: "master-canteen", depth: "high" },
  { id: "ck-bp", from: "central-kitchen", to: "bocca-patia", depth: "high" },
  { id: "ck-bk", from: "central-kitchen", to: "bocca-kalabhoomi", depth: "mid" },
  { id: "ck-tr", from: "central-kitchen", to: "terra-rosso", depth: "mid" },
  { id: "ck-bl", from: "central-kitchen", to: "bocca-lite", depth: "low" },
  { id: "ck-sk", from: "central-kitchen", to: "semi-kitchen", depth: "high" },
  { id: "ck-bb", from: "central-kitchen", to: "bocca-bakery", depth: "high" },
  { id: "ck-bbs", from: "central-kitchen", to: "bocca-book-store", depth: "low" },
  { id: "ck-bc", from: "central-kitchen", to: "bocca-cafe", depth: "high" },

  // Semi Kitchen to others
  { id: "sk-mc", from: "semi-kitchen", to: "master-canteen", depth: "mid" },
  { id: "sk-bk", from: "semi-kitchen", to: "bocca-kalabhoomi", depth: "mid" },
  { id: "sk-bl", from: "semi-kitchen", to: "bocca-lite", depth: "mid" },
  { id: "sk-bb", from: "semi-kitchen", to: "bocca-bakery", depth: "mid" },
  { id: "sk-bc", from: "semi-kitchen", to: "bocca-cafe", depth: "mid" },
  { id: "sk-bbs", from: "semi-kitchen", to: "bocca-book-store", depth: "low" },
  { id: "sk-tr", from: "semi-kitchen", to: "terra-rosso", depth: "low" },
  { id: "sk-bp", from: "semi-kitchen", to: "bocca-patia", depth: "mid" },

  // Bocca Bakery to others
  { id: "bb-bp", from: "bocca-bakery", to: "bocca-patia", depth: "mid" },
  { id: "bb-tr", from: "bocca-bakery", to: "terra-rosso", depth: "mid" },
  { id: "bb-bbs", from: "bocca-bakery", to: "bocca-book-store", depth: "mid" },
  { id: "bb-bc", from: "bocca-bakery", to: "bocca-cafe", depth: "mid" },
  { id: "bb-mc", from: "bocca-bakery", to: "master-canteen", depth: "mid" },
  { id: "bb-bk", from: "bocca-bakery", to: "bocca-kalabhoomi", depth: "mid" },
  { id: "bb-bl", from: "bocca-bakery", to: "bocca-lite", depth: "mid" },
  
  // Outer ring connections
  { id: "mc-bk", from: "master-canteen", to: "bocca-kalabhoomi", depth: "low" },
  { id: "bk-bl", from: "bocca-kalabhoomi", to: "bocca-lite", depth: "low" },
  { id: "bl-sk", from: "bocca-lite", to: "semi-kitchen", depth: "low" },
  { id: "bc-bbs", from: "bocca-cafe", to: "bocca-book-store", depth: "low" },
  { id: "bbs-tr", from: "bocca-book-store", to: "terra-rosso", depth: "low" },
  { id: "tr-bp", from: "terra-rosso", to: "bocca-patia", depth: "low" },
] as const;

export function getNodeById(nodeId: NodeId): HomeNode {
  const node = homeNodes.find((item) => item.id === nodeId);
  if (!node) { throw new Error(`Unknown home node: ${nodeId}`); }
  return node;
}

export function getConnectedNodeIds(nodeId: NodeId): NodeId[] {
  const connected = homeConnections.flatMap((connection) => {
    if (connection.from === nodeId) return [connection.to];
    if (connection.to === nodeId) return [connection.from];
    return [];
  });
  return Array.from(new Set(connected));
}

export function isConnectionLinkedToNode(connection: HomeConnection, nodeId: NodeId): boolean {
  return connection.from === nodeId || connection.to === nodeId;
}

export function getPipeGeometry(connection: HomeConnection, viewport: ViewportKey): PipeGeometry {
  const from = getNodeById(connection.from).coordinates[viewport];
  const to = getNodeById(connection.to).coordinates[viewport];
  const dx = to.x - from.x;
  const dy = (to.y - from.y) / VIEWPORT_ASPECT_RATIO[viewport];

  return {
    midpoint: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
    length: Math.sqrt(dx * dx + dy * dy),
    angle: Math.atan2(dy, dx) * (180 / Math.PI),
  };
}

export function formatPercent(value: number): string {
  return `${Number(value.toFixed(3))}%`;
}

export function formatDegrees(value: number): string {
  return `${Number(value.toFixed(3))}deg`;
}
