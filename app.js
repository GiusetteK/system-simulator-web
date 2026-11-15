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
const runButton = document.getElementById("submit-command");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeSystem(number) {
  return {
    system_id: `SYSTEM-${String(number).padStart(3, "0")}`,
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    device_type: DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)],
    operating_system: OPERATING_SYSTEMS[Math.floor(Math.random() * OPERATING_SYSTEMS.length)],
    node: NODES[Math.floor(Math.random() * NODES.length)],
    location: `SECTOR-${String(randomInt(1, 12)).padStart(2, "0")}`,
    signal: randomInt(55, 99),
    ping: randomInt(12, 180),
    uptime: `${randomInt(1, 240)}h ${randomInt(0, 59)}m`,
    cpu: randomInt(5, 95),
    storage: randomInt(10, 90),
    memory: MEMORIES[Math.floor(Math.random() * MEMORIES.length)],
    clearance: randomInt(1, 5),
    log: LOGS[Math.floor(Math.random() * LOGS.length)],
  };
}

function getStatusClass(status) {
  if (status === "CONNECTED") return "green";
  if (status === "SCANNING") return "yellow";
  if (status === "ENCRYPTED") return "magenta";
  return "blue";
}

function appendOutput(content, className = "") {
  const line = document.createElement("div");
  if (className) line.className = className;
  line.textContent = content;
  output.appendChild(line);
}

function clearOutput() {
  output.innerHTML = "";
}

function printBanner() {
  appendOutput("╔══════════════════════════════════════════════════════╗");
  appendOutput("║                   SYSTEM CONSOLE                    ║");
  appendOutput("║                 TELEMETRY DASHBOARD                 ║");
  appendOutput("╚══════════════════════════════════════════════════════╝");
  appendOutput("OFFLINE CONSOLE // LOCALLY GENERATED DATA");
  appendOutput("All records are fictional; no networks or real devices are queried.\n");
}

function printHelp() {
  clearOutput();
  printBanner();
  appendOutput("COMMAND GUIDE");
  appendOutput("help        Show this guide");
  appendOutput("scan        Create a random group of systems");
  appendOutput("list        List the latest group");
  appendOutput("access ID   Display details for one system");
  appendOutput("status      Show status summary");
  appendOutput("log         Show recent events");
  appendOutput("clear       Clear the console");
  appendOutput("exit        Close the session");
}

function showScanBatch() {
  const batchSize = randomInt(5, 15);
  state.currentBatch = [];

  for (let i = 0; i < batchSize; i += 1) {
    state.currentBatch.push(makeSystem(state.nextNumber + i));
  }

  state.nextNumber += batchSize;
  state.events.push(`GROUP CREATED: ${state.currentBatch.length} systems`);

  clearOutput();
  printBanner();
  appendOutput("TIME     SYSTEM       STATUS       NODE   SIGNAL  PING   CPU  STORAGE");
  appendOutput("──────────────────────────────────────────────────────────────────────");

  state.currentBatch.forEach((system) => {
    const statusClass = getStatusClass(system.status);
    appendOutput(
      `${new Date().toLocaleTimeString()}  ${system.system_id.padEnd(12)} ${system.status.padEnd(12)} ${system.node.padEnd(6)} ${String(system.signal).padStart(3)}%   ${String(system.ping).padStart(3)}ms ${String(system.cpu).padStart(3)}%  ${String(system.storage).padStart(3)}%`,
      `status-row ${statusClass}`
    );
  });
}

function renderList() {
  clearOutput();
  printBanner();

  if (!state.currentBatch.length) {
    appendOutput("No active group. Run 'scan' to create one.", "error");
    return;
  }

  appendOutput(`ACTIVE GROUP (${state.currentBatch.length} systems)`);
  state.currentBatch.forEach((system) => {
    appendOutput(
      `${system.system_id} | ${system.status} | ${system.node} | ${system.signal}%`
    );
  });
}

function findSystem(choice) {
  const normalized = choice.trim().toUpperCase();
  const target = /^[0-9]+$/.test(normalized)
    ? `SYSTEM-${String(Number(normalized)).padStart(3, "0")}`
    : normalized;

  return state.currentBatch.find((system) => system.system_id === target) || null;
}

function printDetails(system) {
  clearOutput();
  printBanner();
  appendOutput(`REPORT: ${system.system_id}`);
  appendOutput("Preparing report...");
  appendOutput("Loading information...");
  appendOutput("Checking data...");
  appendOutput("REPORT READY\n");

  const fields = [
    ["STATUS", system.status],
    ["TYPE", system.device_type],
    ["OPERATING SYSTEM", system.operating_system],
    ["NODE", system.node],
    ["AREA", system.location],
    ["SIGNAL", `${system.signal}%`],
    ["PING", `${system.ping}ms`],
    ["UPTIME", system.uptime],
    ["CPU", `${system.cpu}%`],
    ["STORAGE", `${system.storage}%`],
    ["MEMORY", system.memory],
    ["CLEARANCE LEVEL", String(system.clearance)],
    ["EVENT", system.log],
  ];

  fields.forEach(([label, value]) => {
    appendOutput(`${label.padEnd(20)}${value}`);
  });
}

function printStatusSummary() {
  clearOutput();
  printBanner();

  if (!state.currentBatch.length) {
    appendOutput("No active group. Run 'scan' to create one.", "error");
    return;
  }

  const counts = {};
  for (const status of STATUSES) {
    counts[status] = state.currentBatch.filter((system) => system.status === status).length;
  }

  appendOutput(`GROUP SUMMARY (${state.currentBatch.length} systems)`);
  for (const status of STATUSES) {
    appendOutput(`${status.padEnd(12)} ${counts[status]}`);
  }

  const avgCpu = state.currentBatch.reduce((sum, system) => sum + system.cpu, 0) / state.currentBatch.length;
  const avgSignal = state.currentBatch.reduce((sum, system) => sum + system.signal, 0) / state.currentBatch.length;
  appendOutput(`Average CPU      ${avgCpu.toFixed(1)}%`);
  appendOutput(`Average signal   ${avgSignal.toFixed(1)}%`);
}

function printLog() {
  clearOutput();
  printBanner();

  if (!state.events.length) {
    appendOutput("No events recorded. Run 'scan' to begin.");
    return;
  }

  appendOutput("RECENT EVENTS");
  const recent = state.events.slice(-20);
  recent.forEach((event) => appendOutput(`  ${event}`));
}

function handleCommand(command) {
  const action = command.trim().toLowerCase();

  if (!action) return;

  if (action === "help" || action === "?") {
    printHelp();
    return;
  }

  if (action === "scan" || action === "s") {
    showScanBatch();
    return;
  }

  if (action === "list" || action === "ls") {
    renderList();
    return;
  }

  if (action === "status") {
    printStatusSummary();
    state.events.push("GROUP SUMMARY DISPLAYED");
    return;
  }

  if (action === "log") {
    printLog();
    return;
  }

  if (action === "clear") {
    clearOutput();
    printBanner();
    appendOutput("Screen cleared. Type 'help' for the command guide.");
    return;
  }

  if (action === "exit" || action === "quit" || action === "q") {
    clearOutput();
    printBanner();
    appendOutput("Console closed.");
    return;
  }

  if (action.startsWith("access ")) {
    const id = action.replace("access ", "").trim();

    if (!state.currentBatch.length) {
      clearOutput();
      printBanner();
      appendOutput("No active group. Run 'scan'.", "error");
      return;
    }

    const system = findSystem(id);

    if (!system) {
      clearOutput();
      printBanner();
      appendOutput(`ID not found in the latest group.`, "error");
      state.events.push(`ID NOT FOUND: ${id}`);
      return;
    }

    state.events.push(`REPORT DISPLAYED: ${system.system_id}`);
    printDetails(system);
    return;
  }

  clearOutput();
  printBanner();
  appendOutput("Command not recognized. Type 'help'.", "error");
}

function initialize() {
  printBanner();
  appendOutput("Type 'help' to see the command guide.\n");

  runButton.addEventListener("click", () => {
    handleCommand(commandInput.value);
    commandInput.value = "";
    commandInput.focus();
  });

  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleCommand(commandInput.value);
      commandInput.value = "";
    }
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
