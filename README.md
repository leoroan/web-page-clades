# web-page-clades
Pagina web para el sitio del Clades
___
**Estructura general del proyecto**
``` 
ong-website/
├── index.html
├── novedades.html
├── css/
│   ├── global.css
│   ├── home.css
│   ├── novedades.css
│   └── components.css
├── js/
│   ├── global.js
│   ├── home.js
│   └── novedades.js
├── images/
│   ├── logo.png
│   ├── hero/
│   ├── institucional/
│   ├── alianzas/
│   └── novedades/
└── data/
    └── novedades.json
```
___

## **Características Principales**

### **Diseño y Estructura**

- ✅ **Header superior** con nombre institucional y contacto
- ✅ **Navegación principal** con logo y menú (Inicio/Novedades)
- ✅ **Carousel hero** de pantalla completa con 3 slides
- ✅ **Sección introducción** con estadísticas en card
- ✅ **"Quiénes somos"** con imagen izquierda y texto derecha
- ✅ **Misión y Visión** con diseño de cards horizontales
- ✅ **Sección institucional** con información detallada
- ✅ **Alianzas** con logos clickeables
- ✅ **Resumen de novedades** (últimos artículos)
- ✅ **Formulario de contacto** en pantalla dividida
- ✅ **Footer completo** con toda la información

### **Tecnologías Utilizadas**

- 🎯 **Bootstrap 5.3** para responsive y componentes
- 🎨 **CSS personalizado** con 3 colores pasteles modificables
- ⚡ **JavaScript modular** para funcionalidades
- 🔧 **Bootstrap Icons** para iconografía

### **Colores Pasteles Configurables**

```css
:root {
    --primary-color: #7FB3D3;      /* Azul pastel */
    --secondary-color: #B8E6B8;    /* Verde pastel */
    --accent-color: #FFD1DC;       /* Rosa pastel */
}
```

### **Vista de Novedades**

- 📰 **Página separada** con grid de artículos
- 🏷️ **Filtros por categoría** (Proyectos, Eventos, Logros, Voluntariado)
- 📱 **Diseño responsive** con cards grandes
- 🔄 **Paginación** funcional
- ⚡ **Carga dinámica** de contenido