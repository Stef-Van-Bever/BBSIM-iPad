export function initScorm() {
  const api = findApi();
  if (!api) return null;
  api.LMSInitialize("");
  return api;
}

export function completeScorm(api) {
  if (!api) return;
  api.LMSSetValue("cmi.core.score.raw", "100");
  api.LMSSetValue("cmi.core.lesson_status", "completed");
  api.LMSCommit("");
}

function findApi() {
  let win = window;
  for (let i = 0; i < 7; i++) {
    if (win.API) return win.API;
    if (!win.parent || win.parent === win) break;
    win = win.parent;
  }
  return null;
}
