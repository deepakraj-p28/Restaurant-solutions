"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import MapButton from "@/components/home/MapButton";
import {
  formatDegrees,
  formatPercent,
  getConnectedNodeIds,
  getPipeGeometry,
  homeConnections,
  homeNodes,
  isConnectionLinkedToNode,
  motionSettings,
  type HomeConnection,
  type NodeId,
  type ViewportKey,
} from "@/scripts/homepage";

type CustomProperties = Record<`--${string}`, string | number>;
type PipeStyle = CSSProperties & CustomProperties;

const viewportKeys: ViewportKey[] = ["desktop", "tablet", "mobile"];

function buildPipeStyle(connection: HomeConnection): PipeStyle {
  return viewportKeys.reduce<PipeStyle>((style, viewport) => {
    const geometry = getPipeGeometry(connection, viewport);

    return {
      ...style,
      [`--pipe-x-${viewport}`]: formatPercent(geometry.midpoint.x),
      [`--pipe-y-${viewport}`]: formatPercent(geometry.midpoint.y),
      [`--pipe-length-${viewport}`]: formatPercent(geometry.length),
      [`--pipe-angle-${viewport}`]: formatDegrees(geometry.angle),
      "--home-motion-duration": `${motionSettings.durationMs}ms`,
      "--home-motion-easing": motionSettings.easing,
    };
  }, {});
}

export default function HomePage() {
  const [activeNodeId, setActiveNodeId] = useState<NodeId | null>(null);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);

  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) {
      return new Set<NodeId>();
    }

    return new Set(getConnectedNodeIds(activeNodeId));
  }, [activeNodeId]);

  const hoveredConnection = useMemo(() => {
    return activeConnectionId ? homeConnections.find(c => c.id === activeConnectionId) : null;
  }, [activeConnectionId]);

  function clearActiveState() {
    setActiveNodeId(null);
    setActiveConnectionId(null);
  }

  function handlePipeKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
    }
  }

  return (
    <main className="home-page">
      <div className="home-page__background" aria-hidden="true" />
      <div className="home-page__frost" aria-hidden="true" />
      <div className="home-page__vignette" aria-hidden="true" />

      <a
        className="bocca-logo absolute left-7 top-7 z-20 text-bocca-blue"
        href="/login"
        aria-label="BoccaCafe login"
      >
        BOCCA
      </a>

      <h1 className="sr-only">BoccaCafe Inventory Home</h1>

      <section className="home-graph-shell" aria-label="BoccaCafe inventory node graph">
        <div className="home-graph-stage" onMouseLeave={clearActiveState}>
          <div className="home-pipe-layer" aria-label="Inventory connectors">
            {homeConnections.map((connection) => {
              let isLinked = false;
              let isDimmed = false;

              if (activeNodeId) {
                isLinked = isConnectionLinkedToNode(connection, activeNodeId);
                isDimmed = !isLinked;
              } else if (activeConnectionId) {
                isLinked = connection.id === activeConnectionId;
                isDimmed = !isLinked;
              }

              return (
                <button
                  key={connection.id}
                  type="button"
                  className={[
                    "home-pipe-button",
                    `home-pipe-button--depth-${connection.depth}`,
                    isLinked ? "is-connected" : "",
                    isDimmed ? "is-dimmed" : "",
                  ].join(" ")}
                  style={buildPipeStyle(connection)}
                  aria-label={`${connection.from.replaceAll("-", " ")} connector to ${connection.to.replaceAll("-", " ")}`}
                  onMouseEnter={() => setActiveConnectionId(connection.id)}
                  onMouseLeave={() => setActiveConnectionId(null)}
                  onFocus={() => setActiveConnectionId(connection.id)}
                  onBlur={() => setActiveConnectionId(null)}
                  onKeyDown={handlePipeKeyDown}
                >
                  <span className="home-pipe-button__shadow" aria-hidden="true" />
                  <span className="home-pipe-button__body" aria-hidden="true" />
                  <span className="home-pipe-button__shine" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {homeNodes.map((node) => {
            let isActive = false;
            let isConnected = false;
            let isDimmed = false;

            if (activeNodeId) {
              isActive = activeNodeId === node.id;
              isConnected = connectedNodeIds.has(node.id);
              isDimmed = !isActive && !isConnected;
            } else if (hoveredConnection) {
              isConnected = hoveredConnection.from === node.id || hoveredConnection.to === node.id;
              isDimmed = !isConnected;
            }

            return (
              <MapButton
                key={node.id}
                node={node}
                activeNodeId={activeNodeId}
                isConnected={isConnected}
                isDimmed={isDimmed}
                onActivate={setActiveNodeId}
                onDeactivate={() => setActiveNodeId(null)}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
