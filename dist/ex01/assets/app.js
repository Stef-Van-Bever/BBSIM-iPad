import { createVfs } from "./vfs.js";
import { loadExercise } from "./exercises/loader.js";
import { initScorm, completeScorm } from "./scorm12.js";
import {
  showToast,
  shakeScreen,
  openSheet,
  closeSheet,
  openModal,
  closeModal,
  highlightElement,
  pulseTip,
  markSuccess,
  markDisabledHit,
  markRowError,
  markBreadcrumbWarn,
  markInstructionPartial
} from "./ui/components.js";

const state = {
  config: null,
  vfs: null,
  currentFolderId: null,
  selectedItemId: null,
  tipProgress: 0,
  scormApi: null,
  completed: false,
  pendingMoveTargetId: null,
  lastCreatedFolderName: null,
  lastRenamedName: null,
  lastDeletedName: null,
  lastMovedName: null
};

const instructionText = document.getElementById("instructionText");
const exerciseTitle = document.getElementById("exerciseTitle");
const instructionDescription = document.getElementById("instructionDescription");
const introTitle = document.getElementById("introTitle");
const introDescription = document.getElementById("introDescription");
const introStart = document.getElementById("introStart");
const introImage = document.getElementById("introImage");
const fileList = document.getElementById("fileList");
const breadcrumb = document.getElementById("breadcrumb");
const breadcrumbText = document.getElementById("breadcrumbText");
const backButton = document.getElementById("backButton");

const sheetNewAdd = document.getElementById("sheetNewAdd");
const sheetActionMap = document.getElementById("sheetActionMap");
const contextMenu = document.getElementById("contextMenu");
const actionRename = document.getElementById("actionRename");
const actionMove = document.getElementById("actionMove");
const actionDelete = document.getElementById("actionDelete");
const actionShare = document.getElementById("actionShare");
const actionOffline = document.getElementById("actionOffline");

const renameDialog = document.getElementById("renameDialog");
const renameInput = document.getElementById("renameInput");
const renameConfirm = document.getElementById("renameConfirm");

const newFolderDialog = document.getElementById("newFolderDialog");
const newFolderInput = document.getElementById("newFolderInput");
const newFolderConfirm = document.getElementById("newFolderConfirm");

const deleteDialog = document.getElementById("deleteDialog");
const deleteText = document.getElementById("deleteText");
const deleteConfirm = document.getElementById("deleteConfirm");

const moveDialog = document.getElementById("moveDialog");
const folderPicker = document.getElementById("folderPicker");
const moveConfirm = document.getElementById("moveConfirm");

const tipsButton = document.getElementById("tipsButton");
const fabPlus = document.getElementById("fabPlus");
const qaPanel = initQaPanel();

init();

async function init() {
  state.scormApi = initScorm();
  const config = await loadExercise();
  state.config = config;
  state.vfs = createVfs(config.startTree);
  state.currentFolderId = state.vfs.rootId;
  instructionText.innerHTML = formatFolderNames(config.instruction);
  exerciseTitle.textContent = config.title || "Oefening";
  instructionDescription.innerHTML = formatFolderNames(config.description || "");
  introTitle.textContent = config.title || "Oefening";
  introDescription.innerHTML = formatFolderNames(config.description || "");
  setIntroImage(config.id);
  document.getElementById("app").classList.add("not-started");

  sheetActionMap.dataset.disabled = (!config.allowedActions.createFolder).toString();

  bindGlobalHandlers();
  render();
  qaUpdate();
}

function bindGlobalHandlers() {
  document.body.addEventListener("click", (event) => {
    const disabled = event.target.closest("[data-disabled='true']");
    if (disabled) {
      event.preventDefault();
      triggerDisabledFeedback(disabled);
      return;
    }

    if (event.target.matches("[data-sheet-close='true']")) {
      closeSheet(sheetNewAdd);
      closeSheet(contextMenu);
    }

    if (event.target.matches("[data-modal-cancel='true']")) {
      closeModal(renameDialog);
      closeModal(newFolderDialog);
      closeModal(deleteDialog);
      closeModal(moveDialog);
    }
  });

  backButton.addEventListener("click", () => {
    const current = state.vfs.getItem(state.currentFolderId);
    if (current && current.parentId) {
      state.currentFolderId = current.parentId;
      render();
    }
  });

  fabPlus.addEventListener("click", () => {
    runTipAction("fabPlus", fabPlus, () => openSheet(sheetNewAdd));
  });

  sheetActionMap.addEventListener("click", (event) => {
    if (sheetActionMap.dataset.disabled === "true") {
      event.preventDefault();
      triggerDisabledFeedback(sheetActionMap);
      return;
    }
    runTipAction("sheetNewAdd:Map", sheetActionMap, () => {
      closeSheet(sheetNewAdd);
      newFolderInput.value = "";
      openModal(newFolderDialog);
    });
  });

  tipsButton.addEventListener("click", () => {
    showNextTip();
  });

  introStart.addEventListener("click", () => {
    const app = document.getElementById("app");
    app.classList.remove("not-started");
    app.classList.add("started");
  });

  actionRename.addEventListener("click", (event) => handleRename(event));
  actionMove.addEventListener("click", (event) => handleMove(event));
  actionDelete.addEventListener("click", (event) => handleDelete(event));
  actionShare.addEventListener("click", (event) => {
    event.preventDefault();
    triggerDisabledFeedback(actionShare);
  });
  actionOffline.addEventListener("click", (event) => {
    event.preventDefault();
    triggerDisabledFeedback(actionOffline);
  });

  renameConfirm.addEventListener("click", () => confirmRename());
  newFolderConfirm.addEventListener("click", () => confirmNewFolder());
  deleteConfirm.addEventListener("click", () => confirmDelete());
  moveConfirm.addEventListener("click", () => confirmMove());
}

function render() {
  renderBreadcrumb();
  renderList();
  qaUpdate();
}

function renderBreadcrumb() {
  const path = state.vfs.getPath(state.currentFolderId);
  breadcrumbText.textContent = path.length ? `Mijn bestanden / ${path.join(" / ")}` : "Mijn bestanden";
  backButton.style.visibility = path.length ? "visible" : "hidden";
}

function renderList() {
  fileList.innerHTML = "";
  const items = state.vfs.getChildren(state.currentFolderId);
  items.sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "list-row";
    row.dataset.itemId = item.id;

    const name = document.createElement("div");
    name.className = "item-name";
    if (item.kind === "folder") {
      name.innerHTML = `<img class="icon-image" src="assets/folder_icon.png" alt="" /><span>${item.name}</span>`;
    } else if (item.fileType === "word") {
      name.innerHTML = `<img class="icon-image" src="assets/Word_icon.png" alt="" /><span>${item.name}</span>`;
    } else if (item.fileType === "excel") {
      name.innerHTML = `<img class="icon-image" src="assets/excel_icon.png" alt="" /><span>${item.name}</span>`;
    } else if (item.fileType === "powerpoint") {
      name.innerHTML = `<img class="icon-image" src="assets/PowerPoint_icon.png" alt="" /><span>${item.name}</span>`;
    } else {
      name.innerHTML = `<span class="icon ${getIconClass(item)}">${getIconLabel(item)}</span><span>${item.name}</span>`;
    }

    const modified = document.createElement("div");
    modified.textContent = item.modified || "—";

    const size = document.createElement("div");
    size.textContent = item.size || "—";

    const more = document.createElement("div");
    const moreBtn = document.createElement("button");
    moreBtn.className = "more-btn";
    moreBtn.textContent = "…";
    moreBtn.setAttribute("data-tip", `itemMore:${item.name}`);
    moreBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      state.selectedItemId = item.id;
      runTipAction(`itemMore:${item.name}`, moreBtn, () => openContextMenu(item));
    });
    more.appendChild(moreBtn);

    row.append(name, modified, size, more);

    if (item.kind === "folder") {
      row.setAttribute("data-tip", `folderRow:${item.name}`);
      row.addEventListener("click", () => {
        runTipAction(`folderRow:${item.name}`, row, () => {
          state.currentFolderId = item.id;
          render();
        });
      });
    }

    fileList.appendChild(row);
  }
}

function openContextMenu(item) {
  actionRename.dataset.disabled = (!state.config.allowedActions.rename).toString();
  actionMove.dataset.disabled = (!state.config.allowedActions.move).toString();
  actionDelete.dataset.disabled = (!state.config.allowedActions.delete).toString();
  openSheet(contextMenu);
}

function handleRename(event) {
  if (actionRename.dataset.disabled === "true") {
    event.preventDefault();
    triggerDisabledFeedback(actionRename);
    return;
  }
  const item = state.vfs.getItem(state.selectedItemId);
  if (!item) return;
  if (!validateSelectedItem(item, "rename")) return;
  closeSheet(contextMenu);
  renameInput.value = item.name;
  runTipAction("contextAction:NaamWijzigen", actionRename, () => openModal(renameDialog));
}

function confirmRename() {
  const item = state.vfs.getItem(state.selectedItemId);
  if (!item) return;
  const newName = renameInput.value.trim();
  if (!validateRenameTarget(item, newName)) return;
  state.vfs.renameItem(item.id, newName);
  state.lastRenamedName = newName;
  runTipAction("dialogRename:nameInput", renameConfirm, () => {
    closeModal(renameDialog);
    render();
    checkProgress();
  });
}

function handleDelete(event) {
  if (actionDelete.dataset.disabled === "true") {
    event.preventDefault();
    triggerDisabledFeedback(actionDelete);
    return;
  }
  const item = state.vfs.getItem(state.selectedItemId);
  if (!item) return;
  if (!validateSelectedItem(item, "delete")) return;
  closeSheet(contextMenu);
  deleteText.textContent = `Verwijder ${item.name}?`;
  runTipAction("contextAction:Verwijderen", actionDelete, () => openModal(deleteDialog));
}

function confirmDelete() {
  const item = state.vfs.getItem(state.selectedItemId);
  if (!item) return;
  if (!validateDeleteTarget(item)) return;
  state.vfs.deleteItem(item.id);
  state.lastDeletedName = item.name;
  runTipAction("dialogConfirm:delete", deleteConfirm, () => {
    closeModal(deleteDialog);
    render();
    checkProgress();
  });
}

function handleMove(event) {
  if (actionMove.dataset.disabled === "true") {
    event.preventDefault();
    triggerDisabledFeedback(actionMove);
    return;
  }
  const item = state.vfs.getItem(state.selectedItemId);
  if (!item) return;
  if (!validateSelectedItem(item, "move")) return;
  closeSheet(contextMenu);
  state.pendingMoveTargetId = null;
  renderFolderPicker();
  runTipAction("contextAction:Verplaatsen", actionMove, () => openModal(moveDialog));
}

function renderFolderPicker() {
  folderPicker.innerHTML = "";
  const folders = Array.from(state.vfs.items.values()).filter(i => i.kind === "folder");
  folders.sort((a, b) => a.name.localeCompare(b.name));

  for (const folder of folders) {
    const row = document.createElement("div");
    row.className = "sheet-list-item";
    row.textContent = folder.name;
    row.setAttribute("data-tip", `folderPickerRow:${folder.name}`);
    row.addEventListener("click", () => {
      runTipAction(`folderPickerRow:${folder.name}`, row, () => {
        state.pendingMoveTargetId = folder.id;
        Array.from(folderPicker.children).forEach(child => child.classList.remove("highlight"));
        row.classList.add("highlight");
      });
    });
    folderPicker.appendChild(row);
  }
}

function confirmMove() {
  const item = state.vfs.getItem(state.selectedItemId);
  if (!item || !state.pendingMoveTargetId) {
    showToast("Kies een map.");
    return;
  }
  const target = state.vfs.getItem(state.pendingMoveTargetId);
  if (!validateMoveTarget(item, target)) return;
  state.vfs.moveItem(item.id, target.id);
  state.lastMovedName = item.name;
  runTipAction("folderPickerConfirm", moveConfirm, () => {
    closeModal(moveDialog);
    render();
    checkProgress();
  });
}

function confirmNewFolder() {
  const name = newFolderInput.value.trim();
  if (!validateNewFolder(name)) return;
  state.vfs.createFolder(state.currentFolderId, name);
  state.lastCreatedFolderName = name;
  runTipAction("dialogNewFolder:nameInput", newFolderConfirm, () => {
    closeModal(newFolderDialog);
    render();
    checkProgress();
  });
}

function getIconClass(item) {
  if (item.kind === "folder") return "folder";
  return item.fileType || "text";
}

function getIconLabel(item) {
  if (item.kind === "folder") return "MAP";
  const map = {
    word: "W",
    excel: "X",
    pdf: "PDF",
    image: "IMG",
    audio: "MP3",
    text: "TXT"
  };
  return map[item.fileType] || "FILE";
}

function triggerDisabledFeedback(el) {
  shakeScreen();
  markDisabledHit(el);
  showToast("❌ Voor deze opdracht heb je deze knop niet nodig");
}

function validateSelectedItem(item, action) {
  const goal = state.config.goal;
  const check = goal.checks[0];
  if (!check) return true;

  if (["rename", "delete", "move"].includes(action)) {
    const expectedName = check.oldName || check.itemName || check.name;
    if (expectedName && item.name !== expectedName) {
      markRowError(findRowByItemId(item.id));
      showToast(item.kind === "folder" ? "❌ Dit is niet de juiste map" : "❌ Dit is niet het juiste bestand", 2500);
      return false;
    }
  }
  return true;
}

function validateRenameTarget(item, newName) {
  const check = state.config.goal.checks[0];
  const expectedName = check.newName;
  if (expectedName && newName !== expectedName) {
    showToast("✏️ De naam klopt nog niet", 3000);
    highlightElement(renameInput);
    return false;
  }
  return true;
}

function validateDeleteTarget(item) {
  const check = state.config.goal.checks[0];
  if (check.parentName) {
    const currentFolder = state.vfs.getItem(state.currentFolderId);
    if (currentFolder && currentFolder.name !== check.parentName) {
      markBreadcrumbWarn();
      showToast("⚠️ Je zit niet in de juiste map", 2500);
      return false;
    }
  }
  return true;
}

function validateMoveTarget(item, target) {
  const check = state.config.goal.checks[0];
  if (check.toParentName && target.name !== check.toParentName) {
    markBreadcrumbWarn();
    showToast("⚠️ Je zit niet in de juiste map", 2500);
    return false;
  }
  return true;
}

function validateNewFolder(name) {
  const checks = state.config.goal.checks.filter(c => c.op === "folderExists");
  const current = getCurrentFolderName();
  const pending = checks.find(c => c.parentName === current && !isFolderExists(c.parentName, c.name));
  if (!pending && checks.length) {
    markBreadcrumbWarn();
    showToast("⚠️ Je zit niet in de juiste map", 2500);
    return false;
  }
  if (pending && pending.name !== name) {
    showToast("✏️ De naam klopt nog niet", 3000);
    highlightElement(newFolderInput);
    return false;
  }
  return true;
}

function isFolderExists(parentName, folderName) {
  const parent = state.vfs.findByName(parentName, "folder");
  if (!parent) return false;
  return state.vfs.getChildren(parent.id).some(i => i.kind === "folder" && i.name === folderName);
}

function getCurrentFolderName() {
  const item = state.vfs.getItem(state.currentFolderId);
  return item ? item.name : "root";
}

function findRowByItemId(id) {
  return document.querySelector(`.list-row[data-item-id='${id}']`);
}

function checkProgress() {
  const checks = state.config.goal.checks;
  const results = checks.map(checkGoal);
  const completed = results.every(Boolean);
  const partial = results.some(Boolean) && !completed;

  if (completed && !state.completed) {
    state.completed = true;
    showToast("✅ Goed gedaan! Je hebt deze opdracht voltooid", 3000);
    completeScorm(state.scormApi);
  } else if (partial) {
    markInstructionPartial();
    showToast("👍 Goed begonnen! Je bent nog niet klaar", 2500);
  }
  qaUpdate(results);
}

function checkGoal(check) {
  switch (check.op) {
    case "folderExists": {
      const parent = state.vfs.findByName(check.parentName, "folder");
      if (!parent) return false;
      return state.vfs.getChildren(parent.id).some(i => i.kind === "folder" && i.name === check.name);
    }
    case "fileRenamed": {
      return !!state.vfs.findByName(check.newName, "file");
    }
    case "folderRenamed": {
      return !!state.vfs.findByName(check.newName, "folder");
    }
    case "itemMoved": {
      const item = state.vfs.findByName(check.itemName);
      const parent = state.vfs.findByName(check.toParentName, "folder");
      if (!item || !parent) return false;
      return item.parentId === parent.id;
    }
    case "itemDeleted": {
      return !state.vfs.findByName(check.itemName);
    }
    default:
      return false;
  }
}

function showNextTip() {
  const tips = state.config.tips || [];
  if (!tips.length) return;
  syncTipProgress(tips);
  const tip = tips[state.tipProgress];
  if (!tip) return;
  const el = findTipTarget(tip.target);
  if (!el || !isTipReady(tip)) return;
  pulseTip(el);
  showToast(tip.text, 2200);
  qaUpdate();
}

function findTipTarget(target) {
  if (target === "fabPlus") return fabPlus;
  const parts = target.split(":");
  if (parts[0] === "folderRow") return document.querySelector(`[data-tip='folderRow:${parts[1]}']`);
  if (parts[0] === "itemMore") return document.querySelector(`[data-tip='itemMore:${parts[1]}']`);
  if (parts[0] === "contextAction") {
    if (parts[1] === "NaamWijzigen") return actionRename;
    if (parts[1] === "Verplaatsen") return actionMove;
    if (parts[1] === "Verwijderen") return actionDelete;
  }
  if (parts[0] === "sheetNewAdd") return sheetActionMap;
  if (target === "dialogNewFolder:nameInput") return newFolderInput;
  if (target === "dialogRename:nameInput") return renameInput;
  if (target === "dialogConfirm:delete") return deleteConfirm;
  if (parts[0] === "folderPickerRow") return Array.from(folderPicker.children).find(c => c.textContent === parts[1]);
  if (target === "folderPickerConfirm") return moveConfirm;
  return null;
}

function runTipAction(target, el, action) {
  const tips = state.config?.tips || [];
  const current = tips[state.tipProgress];
  if (current && current.target === target) {
    if (el) markSuccess(el);
    state.tipProgress++;
    setTimeout(action, 500);
    return;
  }
  action();
}

function syncTipProgress(tips) {
  while (tips[state.tipProgress] && isTipAlreadyDone(tips[state.tipProgress])) {
    state.tipProgress++;
  }
}

function isTipAlreadyDone(tip) {
  const target = tip.target;
  const parts = target.split(":");
  if (target === "fabPlus") return sheetNewAdd.classList.contains("open") || newFolderDialog.classList.contains("open");
  if (parts[0] === "folderRow") {
    const path = state.vfs.getPath(state.currentFolderId);
    return path.includes(parts[1]);
  }
  if (parts[0] === "itemMore") {
    const item = state.vfs.getItem(state.selectedItemId);
    const modalOpen = renameDialog.classList.contains("open")
      || deleteDialog.classList.contains("open")
      || moveDialog.classList.contains("open");
    return !!item && item.name === parts[1] && (contextMenu.classList.contains("open") || modalOpen);
  }
  if (parts[0] === "contextAction") {
    if (parts[1] === "NaamWijzigen") return renameDialog.classList.contains("open") || !!state.lastRenamedName;
    if (parts[1] === "Verplaatsen") return moveDialog.classList.contains("open") || !!state.lastMovedName;
    if (parts[1] === "Verwijderen") return deleteDialog.classList.contains("open") || !!state.lastDeletedName;
  }
  if (target === "sheetNewAdd:Map") return newFolderDialog.classList.contains("open") || !!state.lastCreatedFolderName;
  if (target === "dialogNewFolder:nameInput") return !!state.lastCreatedFolderName;
  if (target === "dialogRename:nameInput") return !!state.lastRenamedName;
  if (target === "dialogConfirm:delete") return !!state.lastDeletedName;
  if (parts[0] === "folderPickerRow") return state.pendingMoveTargetId && getFolderName(state.pendingMoveTargetId) === parts[1];
  if (target === "folderPickerConfirm") return !!state.lastMovedName;
  return false;
}

function isTipReady(tip) {
  const target = tip.target;
  const parts = target.split(":");
  if (target === "fabPlus") return true;
  if (parts[0] === "folderRow") return !!findTipTarget(target);
  if (parts[0] === "itemMore") return !!findTipTarget(target);
  if (parts[0] === "contextAction") return contextMenu.classList.contains("open");
  if (target === "sheetNewAdd:Map") return sheetNewAdd.classList.contains("open");
  if (target === "dialogNewFolder:nameInput") return newFolderDialog.classList.contains("open");
  if (target === "dialogRename:nameInput") return renameDialog.classList.contains("open");
  if (target === "dialogConfirm:delete") return deleteDialog.classList.contains("open");
  if (parts[0] === "folderPickerRow") return moveDialog.classList.contains("open");
  if (target === "folderPickerConfirm") return moveDialog.classList.contains("open") && !!state.pendingMoveTargetId;
  return !!findTipTarget(target);
}

function getFolderName(id) {
  const item = state.vfs.getItem(id);
  return item ? item.name : "";
}

function setIntroImage(exId) {
  if (!introImage) return;
  const src = `assets/${exId}_intro.png`;
  introImage.onload = () => {
    introImage.style.display = "block";
  };
  introImage.onerror = () => {
    introImage.style.display = "none";
  };
  introImage.src = src;
}

function formatFolderNames(text) {
  if (!text) return "";
  return text.replace(/📂\s*"([^"]+)"/g, '<span class="folder-name">📂 $1</span>');
}

function initQaPanel() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("qa") !== "1") return null;
  const panel = document.createElement("div");
  panel.id = "qaPanel";
  panel.innerHTML = `
    <div class="qa-title">QA Mode</div>
    <div class="qa-body"></div>
  `;
  document.body.appendChild(panel);
  return panel;
}

function qaUpdate(results = null) {
  if (!qaPanel) return;
  const body = qaPanel.querySelector(".qa-body");
  if (!body || !state.config || !state.vfs) return;

  const path = state.vfs.getPath(state.currentFolderId);
  const selected = state.vfs.getItem(state.selectedItemId);
  const checks = state.config.goal.checks || [];
  const computed = results || checks.map(checkGoal);
  const statusLines = checks.map((check, idx) => {
    const ok = computed[idx] ? "OK" : "NO";
    return `${idx + 1}. ${check.op} (${ok})`;
  });
  const tips = state.config.tips || [];
  const nextTip = tips[state.tipProgress]?.target || "—";

  body.innerHTML = [
    `Exercise: ${state.config.id || "—"}`,
    `Path: ${path.length ? path.join(" / ") : "root"}`,
    `Selected: ${selected ? selected.name : "—"}`,
    `Next tip: ${nextTip}`,
    `Checks:`,
    ...statusLines
  ].join("<br />");
}
