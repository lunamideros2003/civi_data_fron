# CiviData Power BI Project

## Objetivo
Crear un proyecto Power BI que consuma los datos limpios de la base de datos PostgreSQL local de `CiviData`, responda las preguntas reales de análisis del dominio de contratación pública, educación y catálogo de datos, y provea iframes listos para embeber en el frontend.

## Conexión a la base de datos

Datos de conexión PostgreSQL en Docker:
- Servidor: `localhost`
- Puerto: `5432`
- Base de datos: `cividata`
- Usuario: `postgres`
- Contraseña: `postgres`

### Pasos en Power BI Desktop
1. Abrir Power BI Desktop.
2. `Obtener datos` → `PostgreSQL database`.
3. Ingresar servidor `localhost` y base de datos `cividata`.
4. Usar credenciales `postgres` / `postgres`.
5. Seleccionar las siguientes tablas del esquema `marts`:
   - `marts.contratacion`
   - `marts.resumen_departamento`
   - `marts.resumen_entidad`
   - `marts.resumen_sector`
   - `marts.resumen_tipo_proceso`
6. Cargar los datos y abrir el Editor de Power Query para ajustar tipos:
   - `fecha_firma`, `fecha_inicio`, `fecha_fin` → tipo Fecha
   - `valor_contrato`, `valor_pagado`, `valor_facturado`, `valor_pendiente_de_ejecucion` → tipo Decimal
   - Textos → tipo Texto

## Modelo recomendado

### Tablas principales
- `marts.contratacion` — tabla transaccional maestra.
- `marts.resumen_departamento` — valores agregados por departamento.
- `marts.resumen_entidad` — agregados por entidad.
- `marts.resumen_sector` — agregados por sector.
- `marts.resumen_tipo_proceso` — agregados por proceso.

### Relaciones

```
marts.contratacion[departamento]     -> marts.resumen_departamento[depto]
   1:N (uno departamento en resumen, muchos contratos)

marts.contratacion[nombre_entidad]   -> marts.resumen_entidad[nombre_entidad]
   N:1 (muchos contratos por una misma entidad)

marts.contratacion[sector]           -> marts.resumen_sector[sector]
   N:1

marts.contratacion[proceso_de_compra] -> marts.resumen_tipo_proceso[proceso]
   N:1
```

> Recomendación: si quieres un modelo más limpio, crea tablas de dimensiones (`DimDepartamento`, `DimEntidad`, `DimSector`) a partir de `marts.contratacion` usando `Remove Duplicates` y relaciona la tabla transaccional a ellas.

## Dashboards sugeridos

### 1. Contratación pública
Responde:
- ¿Qué entidad contrató más en mi departamento el último año?
- ¿Cuánto va en contratos de educación vs salud en 2025?
- ¿Qué proveedores reciben más contratos del Estado en mi región?
- Detección de anomalías: contratos con un solo proponente, valores atípicos por objeto o municipio.

Visualizaciones clave:
- Tarjetas KPI: valor total, contratos totales, promedio, contratos últimos 12 meses.
- Mapa coroplético por departamento.
- Barras del top entidades por departamento/valor.
- Segmentación por sector y por modalidad.
- Tabla de proveedores con mayor valor por región.
- Gráfico de dispersión `valor_contrato` vs `numero_de_proveedores` o `municipio` para anomalías.
- Matriz o tabla de contratos sospechosos usando filtros de valor atípico.

### 2. Educación
Responde:
- ¿Cuál es la tasa de deserción en mi universidad o departamento?
- ¿Qué programas tienen más graduados? ¿Cuáles tienen menor relación matriculados/graduados?
- Correlación entre nivel educativo y tasas de empleo por región.

Visualizaciones clave:
- Indicadores de deserción por universidad/departamento.
- Barras de programas con más graduados.
- Tarjeta de tasa de graduación.
- Gráfico de burbujas o scatter de nivel educativo vs tasa de empleo.

> Nota: el dataset actual de educación en `CiviData` es muy limitado. Para un dashboard completo se recomienda importar fuentes adicionales de SNIES, MEN y GEIH.

### 3. Catálogo de datos
Responde:
- ¿Qué sectores tienen más datos publicados en Colombia?
- ¿Qué tan actualizados están los datasets por entidad pública?
- ¿Qué regiones tienen menos datos disponibles? (brecha de datos abiertos)

Visualizaciones clave:
- Tabla de cantidad de contratos y valor por sector.
- Barras / gráfico de línea de actualización por `fecha_carga` o `fecha_inicio`.
- Mapa de cobertura por departamento.
- Métrica de `Regiones sin datos` usando departamentos con conteo bajo.

## Mapeo de pages del frontend

El frontend ya contiene páginas preparadas para iframes. Reemplaza los valores de `src` en estas rutas con el `embedUrl` de tus reportes publicados:
- `CivilDataFron/frontend/src/pages/contratos/por-modalidad.astro`
- `CivilDataFron/frontend/src/pages/entidades/top-contratantes.astro`
- `CivilDataFron/frontend/src/pages/presupuesto/ejecucion.astro`

## Publicar el reporte

1. En Power BI Desktop, seleccionar `Publicar`.
2. Publicar en `Mi espacio de trabajo` o en un grupo.
3. En Power BI Service, abrir el reporte publicado.
4. Usar `Archivo` → `Insertar` → `Publicar en la web` o `Incrustar` → `Publicar en la Web`.
5. Copiar el enlace `reportEmbed` y colocarlo en el frontend.

## Embebido en el frontend

Ejemplo de iframe:

```html
<iframe
  title="CiviData - Contratación"
  width="100%"
  height="800"
  src="https://app.powerbi.com/reportEmbed?reportId=REPORT_ID&autoAuth=true&ctid=TENANT_ID"
  frameborder="0"
  allowFullScreen="true"
></iframe>
```

El componente `IframePBI.astro` ya está preparado para mantener el diseño y mostrar un cargador.

## Recomendaciones de implementación

- Configura `Refresh` automático en Power BI Service si quieres datos actualizados.
- Si usas `Publish to Web`, recuerda que el reporte será público.
- Para un entorno privado, utiliza `Embed` seguro con `autoAuth=true` y usuarios autenticados.
- Documenta el `reportId` y `groupId` en un archivo seguro o variables de entorno.

## Archivos adicionales
- `DAX_MEASURES.md` — medidas y métricas DAX específicas.
- `SQL_QUERIES.md` — consultas SQL para validación y para crear métricas.

## Estructura generada por MCP
- `powerbi/model/` — modelo Power BI exportado en formato TMDL desde la instancia local de Power BI Desktop.
- Contiene los objetos:
  - `contratacion.tmdl`
  - `resumen_departamento.tmdl`
  - `resumen_entidad.tmdl`
  - `resumen_sector.tmdl`
  - `resumen_tipo_proceso.tmdl`
  - `dim_departamento.tmdl`
  - `dim_entidad.tmdl`
  - `dim_sector.tmdl`
  - `dim_proceso.tmdl`
  - `database.tmdl`
  - `model.tmdl`
