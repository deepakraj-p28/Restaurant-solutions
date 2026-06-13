"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import MapButton from "@/components/home/MapButton";
import {
  formatDegrees,
  formatPercent,
  getConnectedNodeIds,
  getConnectionFlowWave,
  getNodeFlowWave,
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
  const router = useRouter();
  const [activeNodeId, setActiveNodeId] = useState<NodeId | null>(null);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<NodeId>>(new Set());

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setForceReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = useCallback((nodeId: NodeId) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
  }, []);

  const isReady = isMounted && (loadedImages.size >= homeNodes.length || forceReady);
  const isIdleFlowActive = isReady && !activeNodeId;

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

  function handleNavigate(path: string) {
    setIsExiting(true);
    setTimeout(() => {
      router.push(path);
    }, 500);
  }

  function handlePipeKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
    }
  }

  return (
    <main className={`home-page transition-all ${isIdleFlowActive ? "home-page--idle-flow" : ""} ${!isReady ? "opacity-0 translate-y-4 duration-700 ease-out" : isExiting ? "opacity-0 scale-105 pointer-events-none duration-500 ease-in-out" : "opacity-100 translate-y-0 scale-100 duration-700 ease-out"}`}>
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
              const flowWave = getConnectionFlowWave(connection);
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
                    flowWave ? `home-pipe-button--flow-wave-${flowWave}` : "",
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
            const flowWave = getNodeFlowWave(node.id);
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
                flowWave={flowWave}
                activeNodeId={activeNodeId}
                isConnected={isConnected}
                isDimmed={isDimmed}
                onActivate={setActiveNodeId}
                onDeactivate={() => setActiveNodeId(null)}
                onNavigate={handleNavigate}
                onImageLoad={handleImageLoad}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
