/**
 * Control Center V1 Static Read-only Shell — ローカルのみ動作する表示スクリプト。
 * outbound の fetch とアプリ外 HTTP は使わない。
 * Renderer 製品 UI（control-center-app-shell）は getAppSnapshot + 検証のみ。空 Snapshot で成功扱いにしない方針と整合。
 */
(function ccStaticShell() {
  const REQUIRED_RPC = {
    rpcLogicalName: "controlCenter.readonly.getAppSnapshot",
    payloadSchemaVersion: "v1",
  };

  const REQUIRED_DISABLED_IDS = Object.freeze([
    "runCommand",
    "writeAnyFile",
    "deleteFile_unbounded",
    "fetchUrl",
    "gitPush",
    "readEnv",
    "connectMT5",
    "updateMemoryDb",
  ]);

  function el(id) {
    return document.getElementById(id);
  }

  /** @returns {HTMLElement} */
  function textEl(tagName, txt) {
    const n = document.createElement(tagName);
    n.textContent = txt;
    return n;
  }

  function validateSnapshot(snapshot) {
    const errors = [];
    if (snapshot === null || typeof snapshot !== "object") {
      return ["snapshot is not an object"];
    }

    const bind = snapshot.ipcBinding;
    if (
      !bind ||
      bind.rpcLogicalName !== REQUIRED_RPC.rpcLogicalName ||
      bind.payloadSchemaVersion !== REQUIRED_RPC.payloadSchemaVersion
    ) {
      errors.push(
        "ipcBinding must match controlCenter.readonly.getAppSnapshot / v1",
      );
    }

    if (snapshot.requiresUserApproval !== true) {
      errors.push("requiresUserApproval must be strictly true");
    }

    if (snapshot.canExecuteDangerousActions !== false) {
      errors.push("canExecuteDangerousActions must be strictly false");
    }

    const da = snapshot.disabledActions;
    if (!Array.isArray(da) || da.length !== REQUIRED_DISABLED_IDS.length) {
      errors.push(
        `disabledActions must be an array of length ${REQUIRED_DISABLED_IDS.length}`,
      );
    } else {
      const exp = REQUIRED_DISABLED_IDS.join("\0");
      const got = da.join("\0");
      if (got !== exp) {
        errors.push(
          "disabledActions must match CONTROL_CENTER_V1_DISABLED_ACTION_IDS order",
        );
      }
    }

    if (!Array.isArray(snapshot.statusCards)) {
      errors.push("statusCards must be an array");
    }

    if (
      snapshot.approvalQueueSummary === undefined ||
      snapshot.auditLogSummary === undefined ||
      snapshot.latestReports === undefined ||
      snapshot.readiness === undefined ||
      snapshot.nextGoals === undefined ||
      !Array.isArray(snapshot.riskSummary)
    ) {
      errors.push(
        "missing approvalQueueSummary, auditLogSummary, latestReports, readiness, nextGoals, or riskSummary",
      );
    }

    return errors;
  }

  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /** @param {Record<string,string>} refs */
  function renderSnapshot(snapshot) {
    const err = validateSnapshot(snapshot);
    const pane = el("error-pane");
    if (err.length > 0) {
      pane.classList.add("visible");
      clearChildren(pane);
      err.forEach((line) => {
        pane.appendChild(textEl("div", line));
      });
      clearChildren(el("mount-status-cards"));
      clearChildren(el("mount-approval"));
      clearChildren(el("mount-audit"));
      clearChildren(el("mount-reports"));
      clearChildren(el("mount-next-goals"));
      clearChildren(el("mount-hermes-room"));
      clearChildren(el("mount-ichikishima-room"));
      clearChildren(el("mount-risk"));
      clearChildren(el("mount-bridge-mini"));
      const afE = el("mount-app-foundation");
      if (afE) clearChildren(afE);
      const memE = el("mount-memory-shell");
      if (memE) clearChildren(memE);
      const atE = el("mount-agent-team-shell");
      if (atE) clearChildren(atE);
      const vzE = el("mount-viz-shell");
      if (vzE) clearChildren(vzE);
      return;
    }

    pane.classList.remove("visible");

    /** @type {HTMLElement} */
    const statusMount = el("mount-status-cards");
    clearChildren(statusMount);
    for (const card of snapshot.statusCards) {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = String(card);
      statusMount.appendChild(b);
    }

    const apMount = el("mount-approval");
    clearChildren(apMount);
    const ap = snapshot.approvalQueueSummary;
    const apRows =
      typeof ap === "object" && ap.unavailable === true
        ? [["unavailable reason", String(ap.reason || "")]]
        : [
            ["total", String(ap.total)],
            ["pending", String(ap.pending)],
            ["held", String(ap.held)],
            ["approved", String(ap.approved)],
            ["rejected", String(ap.rejected)],
            ["highRisk", String(ap.highRisk)],
            [
              "latestUpdatedAt",
              ap.latestUpdatedAt ? String(ap.latestUpdatedAt) : "—",
            ],
          ];
    appendDl(apMount, apRows);

    const auMount = el("mount-audit");
    clearChildren(auMount);
    const au = snapshot.auditLogSummary;
    const auRows =
      typeof au === "object" && au.unavailable === true
        ? [["unavailable reason", String(au.reason || "")]]
        : [
            ["total", String(au.total)],
            ["readEvents", String(au.readEvents)],
            ["writeEvents", String(au.writeEvents)],
            ["blockedEvents", String(au.blockedEvents)],
            ["approvalEvents", String(au.approvalEvents)],
            ["reviewEvents", String(au.reviewEvents)],
            ["highRiskEvents", String(au.highRiskEvents)],
            [
              "latestTimestamp",
              au.latestTimestamp ? String(au.latestTimestamp) : "—",
            ],
            ["parseFailures", String(au.parseFailures)],
          ];
    appendDl(auMount, auRows);

    const repMount = el("mount-reports");
    clearChildren(repMount);
    const dr = snapshot.latestReports.docRelativePaths;
    appendDl(repMount, [
      ["morningReview", dr.morningReview],
      ["goalCompletion", dr.goalCompletion],
      ["bridgeFinalReview", dr.bridgeFinalReview],
      ["nextGoals", dr.nextGoals],
      [
        "latestApprovalReportId",
        snapshot.latestReports.latestApprovalReportId === null
          ? "—"
          : String(snapshot.latestReports.latestApprovalReportId),
      ],
    ]);

    const ngMount = el("mount-next-goals");
    clearChildren(ngMount);
    const ul = document.createElement("ul");
    ul.className = "compact-list";
    snapshot.nextGoals.forEach((g) => {
      const li = document.createElement("li");
      const titleSafe = `[${g.ordinal}] ${g.title}`;
      li.textContent = titleSafe;
      ul.appendChild(li);
    });
    ngMount.appendChild(ul);
    ngMount.appendChild(
      textEl(
        "p",
        "prerequisite は次 Goals ドキュメントを人手で参照（静的 Shell は本文を持たない）",
      ),
    );
    const m = ngMount.lastChild;
    if (m instanceof HTMLElement) {
      m.className = "sub";
    }

    const hermesMount = el("mount-hermes-room");
    clearChildren(hermesMount);
    const rr = snapshot.readiness;
    appendDl(hermesMount, [
      ["localFullLoopReady", String(rr.localFullLoopReady)],
      ["controlCenterDesignReady", String(rr.controlCenterDesignReady)],
      ["hermesOperationalLabel substitute", rr.statusNotes.join(" · ")],
    ]);

    const bridgeMini = el("mount-bridge-mini");
    clearChildren(bridgeMini);
    const hp = rr.hermesBridgePilot;
    const blockersN =
      typeof hp.blockersCount === "number"
        ? hp.blockersCount
        : Array.isArray(hp.blockers)
          ? hp.blockers.length
          : 0;
    const reviewsN =
      typeof hp.requiredHumanReviewsCount === "number"
        ? hp.requiredHumanReviewsCount
        : Array.isArray(hp.requiredHumanReviews)
          ? hp.requiredHumanReviews.length
          : 0;
    const allowedN =
      typeof hp.allowedApisCount === "number"
        ? hp.allowedApisCount
        : Array.isArray(hp.allowedApis)
          ? hp.allowedApis.length
          : 0;
    const forbiddenN =
      typeof hp.forbiddenApisCount === "number"
        ? hp.forbiddenApisCount
        : Array.isArray(hp.forbiddenApis)
          ? hp.forbiddenApis.length
          : 0;
    appendDl(bridgeMini, [
      ["ready", String(hp.ready)],
      ["label", String(hp.label)],
      ["blockers.count", String(blockersN)],
      ["requiredHumanReviews.count", String(reviewsN)],
      ["allowedApis.count", String(allowedN)],
      ["forbiddenApis.count", String(forbiddenN)],
    ]);

    const ichiMount = el("mount-ichikishima-room");
    clearChildren(ichiMount);
    appendDl(ichiMount, [
      ["ichikishima cards", rr.ichikishimaCards.join(", ")],
      ["shouldSpeak (policy)", String(false)],
      [
        "requiresUserApproval (snapshot)",
        String(snapshot.requiresUserApproval),
      ],
      ["requiresUserApproval (contract)", String(true)],
    ]);

    const rsMount = el("mount-risk");
    clearChildren(rsMount);
    const ulRisk = document.createElement("ul");
    ulRisk.className = "compact-list";
    snapshot.riskSummary.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = String(s);
      ulRisk.appendChild(li);
    });
    rsMount.appendChild(ulRisk);

    const afMount = el("mount-app-foundation");
    if (afMount) {
      clearChildren(afMount);
      const preview = snapshot.appFoundationPreview;
      if (preview && typeof preview === "object") {
        const p = /** @type {Record<string, unknown>} */ (preview);
        const idList = Array.isArray(p.controlCenterRoomIds)
          ? p.controlCenterRoomIds.map((x) => String(x))
          : [];
        const idStr = idList.length > 0 ? idList.join(" · ") : "—";
        const hintList = Array.isArray(p.readonlyIpcHints)
          ? p.readonlyIpcHints.map((x) => String(x))
          : [];
        const hintStr = hintList.length > 0 ? hintList.join(" · ") : "—";
        appendDl(afMount, [
          ["productionReady", String(p.productionReady)],
          ["Controlled Pilot", String(p.controlledPilotStation)],
          ["Real Hermes", String(p.realHermesProcessStatus)],
          ["WSL2", String(p.wsl2WrapperStation)],
          ["IDE", String(p.ideToolsStation)],
          ["ops vision", String(p.normalOperationsVision)],
          ["agent team", String(p.agentTeamStation ?? "—")],
          ["rooms (ids)", idStr],
          ["readonly ipc hints", hintStr],
        ]);
        const ui = p.pathResolutionUi;
        if (ui && typeof ui === "object") {
          const u = /** @type {Record<string, unknown>} */ (ui);
          appendDl(afMount, [
            [
              "path runtime (label)",
              String(u.pathResolutionRuntimeMode ?? "—"),
            ],
            ["snapshot source key", String(u.snapshotSourceLabel ?? "—")],
            ["path status", String(u.pathResolutionStatus ?? "—")],
            [
              "pending packaging resolution",
              String(u.pendingPackagingResolution ?? "—"),
            ],
            [
              "safe summary lines",
              Array.isArray(u.safeSummaryLines)
                ? u.safeSummaryLines.map(String).join(" | ")
                : "—",
            ],
          ]);
        }
      }
    }

    const memMount = el("mount-memory-shell");
    if (memMount) {
      clearChildren(memMount);
      const parity = snapshot.appShellParityPreview;
      if (parity && typeof parity === "object" && parity.memorySummary) {
        const ms = parity.memorySummary;
        appendDl(memMount, [
          ["candidateApproxCount", String(ms.candidateApproxCount ?? "—")],
          [
            "safeSummaryLines",
            Array.isArray(ms.safeSummaryLines)
              ? ms.safeSummaryLines.map(String).join(" · ")
              : "—",
          ],
        ]);
      } else {
        memMount.appendChild(
          textEl(
            "p",
            "Renderer の getAppSnapshot と同形の memorySummary は appShellParityPreview で補完（任意）",
          ),
        );
      }
    }

    const atMount = el("mount-agent-team-shell");
    if (atMount) {
      clearChildren(atMount);
      const parityAT = snapshot.appShellParityPreview;
      if (
        parityAT &&
        typeof parityAT === "object" &&
        parityAT.agentTeamSummary
      ) {
        const ag = parityAT.agentTeamSummary;
        appendDl(atMount, [
          [
            "schedulerEnabled",
            ag.schedulerEnabled === true ? "true (unexpected)" : "false",
          ],
          ["blockers≈", String(ag.blockerCountApprox ?? "—")],
          ["warnings≈", String(ag.warningCountApprox ?? "—")],
          [
            "agents (id·label excerpts)",
            Array.isArray(ag.agents)
              ? ag.agents
                  .slice(0, 12)
                  .map(
                    (/** @type {{id?: unknown, labelJa?: unknown}} */ a) =>
                      `${String(a.id ?? "")}:${String(a.labelJa ?? "").slice(0, 48)}`,
                  )
                  .join(" | ")
              : "—",
          ],
        ]);
      } else {
        atMount.appendChild(
          textEl("p", "agentTeamSummary は appShellParityPreview で任意"),
        );
      }
    }

    const vzMount = el("mount-viz-shell");
    if (vzMount) {
      clearChildren(vzMount);
      const parityVz = snapshot.appShellParityPreview;
      if (
        parityVz &&
        typeof parityVz === "object" &&
        parityVz.visualizationModel
      ) {
        const vm = parityVz.visualizationModel;
        appendDl(vzMount, [
          ["nodeCount", String(vm.nodeCount ?? "—")],
          [
            "footerNote (clipped notion)",
            String(vm.footerNote ?? "—").slice(0, 220),
          ],
        ]);
      } else {
        vzMount.appendChild(
          textEl("p", "visualizationModel は appShellParityPreview で任意"),
        );
      }
    }
  }
  function appendDl(container, rows) {
    const dl = document.createElement("dl");
    dl.className = "dl-two";
    for (const [k, val] of rows) {
      const dt = document.createElement("dt");
      dt.className = "dt";
      dt.textContent = k;

      const dd = document.createElement("dd");
      dd.className = "dd";
      dd.textContent = val;

      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    container.appendChild(dl);
  }

  /** @returns {unknown} */
  function parseEmbeddedSnapshot() {
    const node = el("cc-embedded-sample-json");
    if (!(node instanceof HTMLScriptElement)) {
      return null;
    }
    return JSON.parse(node.textContent);
  }

  function tryRenderFromText(txt) {
    const parsed = JSON.parse(txt);
    renderSnapshot(parsed);
  }

  function init() {
    const headerMode = el("hdr-mode");
    if (headerMode) {
      headerMode.textContent =
        "Read-only Static Shell — アプリ本体・IPC・Hermes は未接続";
    }

    try {
      const snap = parseEmbeddedSnapshot();
      if (snap) {
        renderSnapshot(snap);
      }
    } catch (/** @type {unknown} */ e) {
      const pane = el("error-pane");
      pane.classList.add("visible");
      clearChildren(pane);
      pane.appendChild(
        textEl(
          "div",
          String(
            e instanceof Error ? e.message : "embedded snapshot parse failure",
          ),
        ),
      );
    }

    const inp = el("cc-file-picker");
    if (inp instanceof HTMLInputElement && inp.type === "file") {
      inp.addEventListener("change", () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const text = typeof reader.result === "string" ? reader.result : "";
            tryRenderFromText(text);
          } catch (/** @type {unknown} */ er) {
            const pane = el("error-pane");
            pane.classList.add("visible");
            clearChildren(pane);
            pane.appendChild(
              textEl("div", String(er instanceof Error ? er.message : er)),
            );
          }
        };
        reader.readAsText(f, "utf-8");
      });
    }

    const btnPaste = el("cc-parse-paste-btn");
    if (btnPaste instanceof HTMLButtonElement) {
      btnPaste.addEventListener("click", () => {
        const ta = el("cc-paste-json");
        if (!(ta instanceof HTMLTextAreaElement)) return;
        try {
          tryRenderFromText(ta.value.trim());
        } catch (/** @type {unknown} */ er) {
          const pane = el("error-pane");
          pane.classList.add("visible");
          clearChildren(pane);
          pane.appendChild(
            textEl("div", String(er instanceof Error ? er.message : er)),
          );
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
