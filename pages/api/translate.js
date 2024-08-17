import translate from "translate";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { text, targetLanguage = "es" } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Faltan parámetros requeridos' });
  }

  try {
    translate.engine = "google";
    translate.key = undefined; // No se necesita clave API
    const translatedText = await translate(text, targetLanguage);

    res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Error al traducir el texto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}
