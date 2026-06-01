"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import StatusPopup from "@/components/home/StatusPopup";
import type { HomeNode, NodeId } from "@/scripts/homepage";
import { formatPercent, motionSettings } from "@/scripts/homepage";

type CustomProperties = Record<`--${string}`, string | number>;
type NodeStyle = CSSProperties & CustomProperties;

type MapButtonProps = {
  node: HomeNode;
  activeNodeId: NodeId | null;
  isConnected: boolean;
  isDimmed: boolean;
  onActivate: (nodeId: NodeId) => void;
  onDeactivate: () => void;
};

export default function MapButton({
  node,
  activeNodeId,
  isConnected,
  isDimmed,
  onActivate,
  onDeactivate,
}: MapButtonProps) {
  const popupId = `${node.id}-status`;
  const isActive = activeNodeId === node.id;
  const showPopup = isActive;

  const nodeStyle: NodeStyle = {
    "--node-x-desktop": formatPercent(node.coordinates.desktop.x),
    "--node-y-desktop": formatPercent(node.coordinates.desktop.y),
    "--node-x-tablet": formatPercent(node.coordinates.tablet.x),
    "--node-y-tablet": formatPercent(node.coordinates.tablet.y),
    "--node-x-mobile": formatPercent(node.coordinates.mobile.x),
    "--node-y-mobile": formatPercent(node.coordinates.mobile.y),
    "--home-hover-scale": motionSettings.hoverScale,
    "--home-inactive-scale": motionSettings.inactiveScale,
  };

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate(node.id);
    }

    if (event.key === "Escape") {
      onDeactivate();
    }
  }

  const hasImage = !["central-kitchen", "semi-kitchen", "bocca-bakery"].includes(node.id);
  const imagePath = `/assets/${node.label}.png`;

  return (
    <div
      className={[
        "home-node-wrap",
        `home-node-wrap--${node.size}`,
        `home-node-wrap--depth-${node.depth}`,
        isActive ? "is-active" : "",
        isConnected ? "is-connected" : "",
        isDimmed ? "is-dimmed" : "",
      ].join(" ")}
      style={nodeStyle}
    >
      <button
        type="button"
        className={[
          "home-node-button",
          `home-node-button--${node.ringTone}`,
          `home-node-button--depth-${node.depth}`,
        ].join(" ")}
        aria-label={`${node.label} status`}
        aria-describedby={showPopup ? popupId : undefined}
        aria-expanded={showPopup}
        onMouseEnter={() => onActivate(node.id)}
        onMouseLeave={onDeactivate}
        onFocus={() => onActivate(node.id)}
        onBlur={onDeactivate}
        onKeyDown={handleKeyDown}
      >
        <span className="home-node-button__halo" aria-hidden="true" />
        <span className="home-node-button__image-placeholder" aria-hidden="true">
          {hasImage && (
            <img 
              src={imagePath} 
              alt={node.label} 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
            />
          )}
        </span>
      </button>
      <span className="home-node-label">{node.label}</span>
      {showPopup ? <StatusPopup id={popupId} title={node.label} text={node.popupText} side={node.popupSide} /> : null}
    </div>
  );
}
