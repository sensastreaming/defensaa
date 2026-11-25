/* ==========================================================================
   MÉTRICAS DE REDES SOCIALES — archivo para completar
   --------------------------------------------------------------------------
   Reemplaza cada `null` por el número real y la diapositiva 19 se actualiza
   sola (con animación de conteo). No hay que tocar nada más.

   - valor: número (ej. 12450). Si lo dejas en null, muestra "—" pendiente.
   - sufijo: texto opcional tras el número (ej. "%", "K", " min").
   - detalle: línea pequeña bajo la etiqueta (opcional).
   Puedes agregar, quitar o renombrar tarjetas libremente.
   ========================================================================== */
window.SENSA_METRICAS = {
  actualizado: "",   // ej. "Datos al 24 de noviembre de 2026"

  // Las 4 cifras grandes de la diapositiva
  destacadas: [
    { etiqueta: "Alcance total",          valor: null, sufijo: "", detalle: "Cuentas alcanzadas" },
    { etiqueta: "Reproducciones",         valor: null, sufijo: "", detalle: "Videos y reels" },
    { etiqueta: "Interacciones",          valor: null, sufijo: "", detalle: "Me gusta, comentarios, compartidos" },
    { etiqueta: "Visitas al sitio",       valor: null, sufijo: "", detalle: "sensastreaming.github.io" }
  ],

  // Detalle por plataforma (puedes dejar solo las que usaron)
  plataformas: [
    { nombre: "Instagram", usuario: "@sensastreaming",
      datos: [ { etiqueta: "Seguidores", valor: null }, { etiqueta: "Publicaciones", valor: null }, { etiqueta: "Mejor video", valor: null } ] },
    { nombre: "Sitio web", usuario: "sensastreaming.github.io",
      datos: [ { etiqueta: "Visitantes", valor: null }, { etiqueta: "Reproducciones de documentales", valor: null }, { etiqueta: "Suscriptores", valor: null } ] },
    { nombre: "Otra red", usuario: "",
      datos: [ { etiqueta: "Seguidores", valor: null }, { etiqueta: "Alcance", valor: null }, { etiqueta: "Interacciones", valor: null } ] }
  ]
};
