/* ==========================================================================
   MÉTRICAS DE REDES SOCIALES — datos entregados el 26 de noviembre de 2026
   Para actualizar: cambia los números y la diapositiva 20 se actualiza sola.
   - valor: número (se anima) o texto (ej. "37,6%"). null = "—" pendiente.
   - sufijo: texto tras el número en las cifras grandes.
   - detalle: línea pequeña bajo la etiqueta (opcional).
   ========================================================================== */
window.SENSA_METRICAS = {
  actualizado: "Instagram: datos entregados al 26/11/2026 · Sitio en GitHub: últimos 14 días (12/11 al 25/11) · Suscripciones: 11/11 al 20/11",

  destacadas: [
    { etiqueta: "Visualizaciones",   valor: 894, sufijo: "", detalle: "Instagram · 62,4% de no seguidores" },
    { etiqueta: "Interacciones",     valor: 214, sufijo: "", detalle: "Instagram · 86,9% de seguidores" },
    { etiqueta: "Vistas del sitio",  valor: 87,  sufijo: "", detalle: "GitHub · 21 solo el 23/11" },
    { etiqueta: "Suscriptores",      valor: 10,  sufijo: "", detalle: "Todos con bienvenida enviada" }
  ],

  plataformas: [
    { nombre: "Instagram", usuario: "@sensastreaming",
      datos: [
        { etiqueta: "Espectadores", valor: 196 },
        { etiqueta: "Cuentas que interactuaron", valor: 32 },
        { etiqueta: "Visitas al perfil", valor: 193 },
        { etiqueta: "Toques en el enlace externo", valor: 16 },
        { etiqueta: "Seguidores totales", valor: 38 },
        { etiqueta: "Contenido", valor: "Reels 100%" }
      ] },
    { nombre: "Sitio web", usuario: "GitHub · 14 días",
      datos: [
        { etiqueta: "Vistas totales", valor: 87 },
        { etiqueta: "Visitantes únicos", valor: 2 },
        { etiqueta: "Clones del repositorio", valor: 107 },
        { etiqueta: "Clonadores únicos", valor: 55 }
      ] },
    { nombre: "Suscripción", usuario: "correo",
      datos: [
        { etiqueta: "Correos registrados", valor: 10 },
        { etiqueta: "Bienvenida enviada", valor: "10 de 10" },
        { etiqueta: "Período", valor: "11/11 al 20/11" }
      ] }
  ]
};
