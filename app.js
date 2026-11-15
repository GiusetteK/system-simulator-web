const STATUSES = ["CONNECTED", "SCANNING", "ENCRYPTED"];
const DEVICE_TYPES = ["LAPTOP", "WORKSTATION", "SERVER"];
const OPERATING_SYSTEMS = ["OS-ALPHA", "OS-BETA", "OS-GAMMA"];
const NODES = ["NORTH", "EAST", "WEST", "SOUTH"];
const MEMORIES = ["8 GB", "16 GB", "32 GB"];
const LOGS = [
  "Handshake generated",
  "Synchronization complete",
  "Routine check passed",
  "Data packet received",
];

const state = {
  currentBatch: [],
  nextNumber: 1,
  events: [],
};

const output = document.getElementById("output");
const commandInput = document.getElementById("command-input");
const commandForm = document.getElementById("command-form");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeSystem(number) {
  return {
    system_id: `SYSTEM-${String(number).padStart(3, "0")}`,
    status: pick(STATUSES),
    device_type: pick(DEVICE_TYPES),
    operating_system: pick(OPERATING_SYSTEMS),
    node: pick(NODES),
    location: `SECTOR-${String(randomInt(1, 12)).padStart(2, "0")}`,
    signal: randomInt(55, 99),
    ping: randomInt(12, 180),
    uptime: `${randomInt(1, 240)}h ${randomInt(0, 59)}m`,
    cpu: randomInt(5, 95),
    storage: randomInt(10, 90),
    memory: pick(MEMORIES),
    clearance: randomInt(1, 5),
    log: pick(LOGS),
  };
}

function statusClass(status) {
  return {
    CONNECTED: "green",
    SCANNING: "yellow",
    ENCRYPTED: "magenta",
  }[status] || "blue";
}

function clearOutput() {
  output.replaceChildren();
}

function appendOutput(text, className = "") {
  const line = document.createElement("div");
  if (className) line.className = className;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function printBanner() {
  appendOutput("╔══════════════════════════════════════════════════════╗", "blue");
  appendOutput("║                   SYSTEM CONSOLE                    ║", "blue");
  appendOutput("║                 TELEMETRY DASHBOARD                 ║", "blue");
  appendOutput("╚══════════════════════════════════════════════════════╝", "blue");
  appendOutput("OFFLINE CONSOLE // LOCALLY GENERATED DATA", "green");
  appendOutput("All records are fictional; no networks or real devices are queried.\n");
}

function startScreen() {
  clearOutput();
  printBanner();
  appendOutput("Type 'help' to see available commands.");
  appendOutput("Run 'scan' to generate your first group.\n");
}

function printHelp() {
  clearOutput();
  printBanner();
  appendOutput("COMMAND GUIDE", "blue");
  appendOutput("help                  Show this guide");
  appendOutput("scan (or s)           Generate 5–15 fictional systems");
  appendOutput("list (or ls)          List the latest generated group");
  appendOutput("access 003            Show one system's details");
  appendOutput("status                Summarize the latest group");
  appendOutput("log                   Show the latest session events");
  appendOutput("clear                 Clear and redraw the console");
  appendOutput("exit                  End the demo session");
}

function renderScan() {
  const size = randomInt(5, 15);
  state.currentBatch = Array.from({ length: size }, (_, index) => makeSystem(state.nextNumber + index));
  state.nextNumber += size;
  state.events.push(`[${new Date().toLocaleTimeString()}] GROUP CREATED: ${size} systems`);

  clearOutput();
  printBanner();
  appendOutput("LATEST GROUP · SYSTEM TELEMETRY", "blue");
  appendOutput("TIME      SYSTEM       STATUS       NODE   SIGNAL   PING   CPU   STORAGE");
  appendOutput("────────────────────────────────────────────────────────────────────────");
  for (const system of state.currentBatch) {
    const time = new Date().toLocaleTimeString();
    const row = `${time.padEnd(9)} ${system.system_id.padEnd(12)} ${system.status.padEnd(12)} ${system.node.padEnd(6)} ${String(system.signal).padStart(3)}%    ${String(system.ping).padStart(3)}ms  ${String(system.cpu).padStart(3)}%   ${String(system.storage).padStart(3)}%`;
    appendOutput(row, `status-row ${statusClass(system.status)}`);
  }
  appendOutput(`\n${size} fictional systems generated locally.`);
}

function renderList() {
  clearOutput();
  printBanner();
  if (!state.currentBatch.length) {
    appendOutput("No active group. Run 'scan' first.", "error");
    return;
  }
  appendOutput(`ACTIVE GROUP (${state.currentBatch.length} systems)`, "blue");
  for (const system of state.currentBatch) {
    appendOutput(`${system.system_id}  |  ${system.status}  |  ${system.node}  |  SIGNAL ${system.signal}%`, statusClass(system.status));
  }
}

function findSystem(rawId) {
  const value = rawId.trim().toUpperCase();
  const target = /^\d+$/.test(value) ? `SYSTEM-${value.padStart(3, "0")}` : value;
  return state.currentBatch.find((system) => system.system_id === target) || null;
}

function renderDetails(system) {
  clearOutput();
  printBanner();
  appendOutput(`SYSTEM REPORT · ${system.system_id}`, "magenta");
  appendOutput("Preparing report...  [██████████] 100%", "green");
  appendOutput("REPORT READY\n", "green");
  const fields = [
    ["STATUS", system.status],
    ["TYPE", system.device_type],
    ["OPERATING SYSTEM", system.operating_system],
    ["NODE", system.node],
    ["AREA", system.location],
    ["SIGNAL", `${system.signal}%`],
    ["PING", `${system.ping} ms`],
    ["UPTIME", system.uptime],
    ["CPU", `${system.cpu}%`],
    ["STORAGE USED", `${system.storage}%`],
    ["MEMORY", system.memory],
    ["CLEARANCE LEVEL", `LEVEL-${system.clearance}`],
    ["EVENT", system.log],
  ];
  for (const [label, value] of fields) {
    appendOutput(`${label.padEnd(20)} ${value}`, label === "STATUS" ? statusClass(system.status) : "");
  }
  state.events.push(`[${new Date().toLocaleTimeString()}] REPORT DISPLAYED: ${system.system_id}`);
}

function renderStatus() {
  clearOutput();
  printBanner();
  if (!state.currentBatch.length) {
    appendOutput("No active group. Run 'scan' first.", "error");
    return;
  }
  appendOutput(`GROUP SUMMARY · ${state.currentBatch.length} SYSTEMS`, "blue");
  for (const status of STATUSES) {
    const count = state.currentBatch.filter((system) => system.status === status).length;
    appendOutput(`${status.padEnd(14)} ${count}`, statusClass(status));
  }
  const average = (key) => state.currentBatch.reduce((sum, item) => sum + item[key], 0) / state.currentBatch.length;
  appendOutput(`AVERAGE CPU      ${average("cpu").toFixed(1)}%`);
  appendOutput(`AVERAGE SIGNAL   ${average("signal").toFixed(1)}%`);
  state.events.push(`[${new Date().toLocaleTimeString()}] GROUP SUMMARY DISPLAYED`);
}

function renderLog() {
  clearOutput();
  printBanner();
  appendOutput("RECENT SESSION EVENTS", "blue");
  if (!state.events.length) {
    appendOutput("No events recorded. Run 'scan' to begin.");
    return;
  }
  for (const event of state.events.slice(-20)) appendOutput(event);
}

function handleCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;
  const [actionRaw, ...args] = command.split(/\s+/);
  const action = actionRaw.toLowerCase();

  if (action === "help" || action === "?") return printHelp();
  if (action === "scan" || action === "s") return renderScan();
  if (action === "list" || action === "ls") return renderList();
  if (action === "status") return renderStatus();
  if (action === "log") return renderLog();
  if (action === "clear") return startScreen();
  if (["exit", "quit", "q"].includes(action)) {
    clearOutput();
    printBanner();
    appendOutput("Demo session ended. Refresh the page to start again.");
    return;
  }
  if (action === "access" || action === "a") {
    if (args.length !== 1) {
      clearOutput(); printBanner();
      appendOutput("Usage: access 003 or access SYSTEM-003", "error");
      return;
    }
    if (!state.currentBatch.length) {
      clearOutput(); printBanner();
      appendOutput("No active group. Run 'scan' first.", "error");
      return;
    }
    const system = findSystem(args[0]);
    if (!system) {
      clearOutput(); printBanner();
      appendOutput(`System not found in the latest group: ${args[0]}`, "error");
      state.events.push(`[${new Date().toLocaleTimeString()}] ID NOT FOUND: ${args[0]}`);
      return;
    }
    return renderDetails(system);
  }
  clearOutput();
  printBanner();
  appendOutput(`Unknown command: ${action}. Type 'help' for available commands.`, "error");
}

function initialize() {
  startScreen();

  commandForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleCommand(commandInput.value);
    commandInput.value = "";
    commandInput.focus();
  });

  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => {
      handleCommand(button.dataset.command);
      commandInput.value = "";
      commandInput.focus();
    });
  });
}

initialize();
