"use client";

import { useState } from "react";
import { allocatePort, type Service } from "../lib/ports";

const SERVICES: Service[] = [
  { name: "postgres", envVar: "POSTGRES_PORT", port: 5434, container: 5432 },
  { name: "redis", envVar: "REDIS_PORT", port: 6380, container: 6379 },
  { name: "backend", envVar: "BACKEND_PORT", port: 8000, container: 8000 },
  { name: "frontend", envVar: "FRONTEND_PORT", port: 5173, container: 5173 },
];

const WORKTREES = [1, 2, 3, 4];
const STRIDES = [1, 100];

export function PortLab() {
  const [svcIndex, setSvcIndex] = useState(3);
  const [custom, setCustom] = useState("");
  const [index, setIndex] = useState(1);
  const [stride, setStride] = useState(1);

  const customPort = Number.parseInt(custom, 10);
  const usingCustom = custom !== "" && Number.isFinite(customPort) && customPort >= 1 && customPort <= 65535;
  const svc: Service = usingCustom
    ? { name: "your service", envVar: "SERVICE_PORT", port: customPort, container: customPort }
    : SERVICES[svcIndex];

  const { port, fallback, valid } = allocatePort(svc.port, index, stride);

  return (
    <div className="lab">
      <div className="figures" aria-hidden="true">
        <div className="figure-old" data-reveal style={{ ["--i" as string]: 3 }}>
          <div className="figure-box">
            <span className="digits">{svc.port}</span>
          </div>
          <p className="figure-cap">
            <strong>main</strong> keeps the default
          </p>
        </div>
        <div className="figure-new" data-reveal style={{ ["--i" as string]: 4 }}>
          <div className="figure-box">
            <span className="digits tick" key={`${port}-${valid}`}>
              {valid ? port : "n/a"}
            </span>
          </div>
          <p className="figure-cap">
            <strong>worktree {index}</strong> gets its own
          </p>
        </div>
      </div>

      <div className="figure-sum" aria-live="polite" data-reveal style={{ ["--i" as string]: 5 }}>
        <code>
          <span className="c-dim">&quot;</span>
          <span className="c-str">
            ${"{"}
            {svc.envVar}:-{svc.port}
            {"}"}
          </span>
          <span className="c-dim">:{svc.container}&quot;</span>
        </code>
        <code className="eq">
          {fallback
            ? `${svc.port} + 100 × ${index}`
            : `20000 + ${svc.port} + ${index} × ${stride}`}{" "}
          = <span className="c-ink">{valid ? port : "out of range"}</span>
        </code>
        <code>
          <span className="c-key">{svc.envVar}</span>
          <span className="c-dim">=</span>
          <span className="c-num">{valid ? port : ""}</span>
        </code>
      </div>
      <div className="lab-controls" data-reveal style={{ ["--i" as string]: 6 }}>
        <fieldset className="lab-group">
          <legend>Service in docker-compose.yml</legend>
          <div className="seg">
            {SERVICES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                aria-pressed={!usingCustom && svcIndex === i}
                onClick={() => {
                  setSvcIndex(i);
                  setCustom("");
                }}
              >
                {s.name}
                <span className="sub">{s.port}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="lab-group">
          <legend>Worktree</legend>
          <div className="seg">
            {WORKTREES.map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={index === w}
                aria-label={`Worktree ${w}`}
                onClick={() => setIndex(w)}
              >
                {w}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="lab-group">
          <legend>portStride</legend>
          <div className="seg">
            {STRIDES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={stride === s}
                aria-label={`portStride ${s}`}
                onClick={() => setStride(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="lab-group">
          <label htmlFor="own-port" className="lab-label">
            Or your own default
          </label>
          <input
            id="own-port"
            className="lab-input"
            type="number"
            inputMode="numeric"
            min={1}
            max={65535}
            placeholder="3000"
            value={custom}
            onChange={(e) => setCustom(e.target.value.slice(0, 5))}
          />
        </div>
      </div>

      <p className="figure-note">
        {fallback && valid
          ? "Past 65535 wtc falls back to default + 100 × index, which is what you see here. "
          : !valid
            ? "That default cannot be shifted into the valid range (1024 to 65535); wtc stops with an error naming the port. "
            : ""}
        Defaults that sit close together, like mocks on 8081 to 8086, can collide between worktrees at
        stride 1. wtc warns when it sees that and recommends the smallest portStride that keeps them apart.
      </p>
    </div>
  );
}
