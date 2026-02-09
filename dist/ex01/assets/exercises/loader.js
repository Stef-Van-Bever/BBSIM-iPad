export async function loadExercise() {
  const params = new URLSearchParams(window.location.search);
  const exId = window.EXERCISE_ID || params.get("ex") || "ex01";
  const res = await fetch(`../exercises/${exId}.json`);
  if (!res.ok) throw new Error("Kan oefening niet laden");
  const config = await res.json();
  config.id = exId;
  return config;
}
