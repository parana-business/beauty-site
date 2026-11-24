# BeautySite.com · GitHub Pages

Este paquete contiene la demostración estática. Subí a la raíz del repositorio todos los archivos y carpetas contenidos en el ZIP, incluido index.html.

En el repositorio elegí Settings → Pages → Build and deployment → Source: Deploy from a branch. Seleccioná main y /(root), y guardá. GitHub mostrará la URL cuando termine la publicación.

Los enlaces a WhatsApp e Instagram muestran una vista de demostración hasta configurar datos reales. Las imágenes son editoriales de muestra. La página incluye noindex mientras no se configure una URL canónica.

Para cambiar la carta o los datos de contacto, editá content.mjs en el ZIP maestro, ejecutá node render.mjs y reemplazá aquí los archivos generados en dist/. La URL canónica debe ser la URL definitiva de la demo, incluida la subcarpeta del repositorio. Revisá el README del ZIP maestro para más detalle.
