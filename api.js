// Pembantu kecil untuk memanggil server AI (opsional).
export async function postJson(url, body, timeoutMs = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "AI tidak dapat memproses permintaan saat ini.");
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("AI terlalu lama menjawab. Coba lagi.");
    if (error instanceof TypeError) throw new Error("Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
