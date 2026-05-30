export type ViewportKey = "desktop" | "tablet" | "mobile";

export type NodeId =
  | "central-kitchen"
  | "semi-kitchen"
  | "bocca-book-store"
  | "terra-rosso"
  | "bocca-cafe"
  | "bocca-lite"
  | "master-canteen";

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
  hoverScale: 1.2,
  inactiveScale: 0.8,
} as const;

export const homeNodes: HomeNode[] = [
  {
    id: "central-kitchen",
    label: "Central Kitchen",
    size: "xl",
    ringTone: "green",
    depth: "high",
    popupSide: "right",
    popupText: "Placeholder status for central kitchen stock flow and preparation readiness.",
    coordinates: {
      desktop: { x: 50, y: 64 },
      tablet: { x: 50, y: 58 },
      mobile: { x: 50, y: 53 },
    },
  },
  {
    id: "semi-kitchen",
    label: "Semi Kitchen",
    size: "lg",
    ringTone: "green",
    depth: "mid",
    popupSide: "left",
    popupText: "Placeholder status for semi kitchen inventory movement.",
    coordinates: {
      desktop: { x: 25, y: 43 },
      tablet: { x: 27, y: 43 },
      mobile: { x: 23, y: 56 },
    },
  },
  {
    id: "bocca-book-store",
    label: "Bocca Book Store",
    size: "sm",
    ringTone: "green",
    depth: "low",
    popupSide: "bottom",
    popupText: "Placeholder status for book store stock and cafe items.",
    coordinates: {
      desktop: { x: 21, y: 15 },
      tablet: { x: 22, y: 19 },
      mobile: { x: 22, y: 27 },
    },
  },
  {
    id: "terra-rosso",
    label: "Terra Rosso",
    size: "sm",
    ringTone: "amber",
    depth: "mid",
    popupSide: "top",
    popupText: "Placeholder amber status for Terra Rosso transfer checks.",
    coordinates: {
      desktop: { x: 36, y: 25 },
      tablet: { x: 43, y: 28 },
      mobile: { x: 78, y: 31 },
    },
  },
  {
    id: "bocca-cafe",
    label: "Bocca Cafe",
    size: "md",
    ringTone: "green",
    depth: "high",
    popupSide: "bottom",
    popupText: "Placeholder status for cafe demand and replenishment.",
    coordinates: {
      desktop: { x: 50, y: 10 },
      tablet: { x: 62, y: 18 },
      mobile: { x: 50, y: 13 },
    },
  },
  {
    id: "bocca-lite",
    label: "Bocca Lite",
    size: "sm",
    ringTone: "green",
    depth: "mid",
    popupSide: "right",
    popupText: "Placeholder status for lite outlet supplies.",
    coordinates: {
      desktop: { x: 68, y: 28 },
      tablet: { x: 72, y: 42 },
      mobile: { x: 76, y: 58 },
    },
  },
  {
    id: "master-canteen",
    label: "Master Canteen",
    size: "md",
    ringTone: "green",
    depth: "low",
    popupSide: "left",
    popupText: "Placeholder status for master canteen service stock.",
    coordinates: {
      desktop: { x: 76, y: 47 },
      tablet: { x: 70, y: 70 },
      mobile: { x: 50, y: 83 },
    },
  },
] as const;

export const homeConnections: HomeConnection[] = [
  { id: "central-semi", from: "central-kitchen", to: "semi-kitchen", depth: "high" },
  { id: "central-book", from: "central-kitchen", to: "bocca-book-store", depth: "mid" },
  { id: "central-terra", from: "central-kitchen", to: "terra-rosso", depth: "mid" },
  { id: "central-cafe", from: "central-kitchen", to: "bocca-cafe", depth: "high" },
  { id: "central-lite", from: "central-kitchen", to: "bocca-lite", depth: "mid" },
  { id: "central-master", from: "central-kitchen", to: "master-canteen", depth: "high" },
  { id: "semi-terra", from: "semi-kitchen", to: "terra-rosso", depth: "low" },
  { id: "semi-cafe", from: "semi-kitchen", to: "bocca-cafe", depth: "low" },
  { id: "book-master", from: "bocca-book-store", to: "master-canteen", depth: "low" },
  { id: "terra-master", from: "terra-rosso", to: "master-canteen", depth: "mid" },
  { id: "cafe-master", from: "bocca-cafe", to: "master-canteen", depth: "mid" },
  { id: "lite-master", from: "bocca-lite", to: "master-canteen", depth: "low" },
] as const;

export function getNodeById(nodeId: NodeId): HomeNode {
  const node = homeNodes.find((item) => item.id === nodeId);

  if (!node) {
    throw new Error(`Unknown home node: ${nodeId}`);
  }

  return node;
}

export function getConnectedNodeIds(nodeId: NodeId): NodeId[] {
  const connected = homeConnections.flatMap((connection) => {
    if (connection.from === nodeId) {
      return [connection.to];
    }

    if (connection.to === nodeId) {
      return [connection.from];
    }

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
    midpoint: {
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2,
    },
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
