export function showToast(message, duration = 2000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  toast.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, duration);
}

export function shakeScreen() {
  const app = document.getElementById("app");
  if (!app) return;
  app.classList.remove("shake");
  void app.offsetWidth;
  app.classList.add("shake");
}

export function openSheet(sheetEl) {
  sheetEl.classList.add("open");
  sheetEl.setAttribute("aria-hidden", "false");
}

export function closeSheet(sheetEl) {
  sheetEl.classList.remove("open");
  sheetEl.setAttribute("aria-hidden", "true");
}

export function openModal(modalEl) {
  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
}

export function closeModal(modalEl) {
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
}

export function highlightElement(el) {
  if (!el) return;
  el.classList.add("highlight");
  setTimeout(() => el.classList.remove("highlight"), 1200);
}

export function markDisabledHit(el) {
  if (!el) return;
  el.classList.add("disabled-hit");
  setTimeout(() => el.classList.remove("disabled-hit"), 1000);
}

export function markRowError(rowEl) {
  if (!rowEl) return;
  rowEl.classList.add("error-item");
  setTimeout(() => rowEl.classList.remove("error-item"), 900);
}

export function markBreadcrumbWarn() {
  const bc = document.getElementById("breadcrumb");
  if (!bc) return;
  bc.classList.add("warn");
  setTimeout(() => bc.classList.remove("warn"), 1000);
}

export function markInstructionPartial() {
  const bar = document.querySelector(".instruction-bar");
  if (!bar) return;
  bar.classList.add("partial");
  setTimeout(() => bar.classList.remove("partial"), 900);
}
