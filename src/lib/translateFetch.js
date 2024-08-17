export async function translateFetch(text, targetLanguage = "es") {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage, // Ahora puedes pasar el idioma objetivo
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la traducción");
    }

    const { translatedText } = await response.json();
    return translatedText;
  } catch (error) {
    console.error("Error al traducir:", error);
    return null;
  }
}
