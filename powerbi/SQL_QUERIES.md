# SQL Queries para el proyecto Power BI

## Validación inicial

```sql
-- Contar registros disponibles en marts
SELECT table_name, COUNT(*)
FROM information_schema.tables t
JOIN information_schema.columns c
  ON t.table_schema = c.table_schema
 AND t.table_name = c.table_name
WHERE t.table_schema = 'marts'
GROUP BY table_name;
```

```sql
-- Ver columnas de la tabla maestra
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'marts' AND table_name = 'contratacion'
ORDER BY ordinal_position;
```

## Datos de contratación

```sql
SELECT departamento,
       COUNT(*) AS num_contratos,
       SUM(valor_contrato) AS valor_total,
       AVG(valor_contrato) AS valor_promedio
FROM marts.contratacion
GROUP BY departamento
ORDER BY valor_total DESC
LIMIT 50;
```

```sql
SELECT nombre_entidad,
       departamento,
       COUNT(*) AS num_contratos,
       SUM(valor_contrato) AS valor_total
FROM marts.contratacion
GROUP BY nombre_entidad, departamento
ORDER BY valor_total DESC
LIMIT 50;
```

## Consultas específicas por pregunta

### 1. ¿Qué entidad contrató más en mi departamento el último año?

```sql
SELECT nombre_entidad,
       departamento,
       COUNT(*) AS num_contratos,
       SUM(valor_contrato) AS valor_total,
       MAX(fecha_inicio) AS ultimo_contrato
FROM marts.contratacion
WHERE departamento = 'Nariño'
  AND fecha_inicio >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY nombre_entidad, departamento
ORDER BY valor_total DESC
LIMIT 20;
```

### 2. ¿Cuánto va en contratos de educación vs salud en 2025?

```sql
SELECT
  CASE
    WHEN LOWER(sector) LIKE '%educaci%' THEN 'Educación'
    WHEN LOWER(sector) LIKE '%salud%' OR LOWER(sector) LIKE '%social%' THEN 'Salud'
    ELSE 'Otros'
  END AS categoria,
  COUNT(*) AS num_contratos,
  SUM(valor_contrato) AS valor_total,
  AVG(valor_contrato) AS valor_promedio
FROM marts.contratacion
WHERE EXTRACT(YEAR FROM fecha_inicio) = 2025
GROUP BY 1
ORDER BY valor_total DESC;
```

### 3. ¿Qué proveedores reciben más contratos del Estado en mi región?

```sql
SELECT proveedor,
       departamento,
       COUNT(*) AS num_contratos,
       SUM(valor_contrato) AS valor_total
FROM marts.contratacion
WHERE departamento = 'Cundinamarca'
GROUP BY proveedor, departamento
ORDER BY valor_total DESC
LIMIT 50;
```

### 4. Anomalías: contratos con un solo proponente o valores atípicos

```sql
WITH rangos AS (
  SELECT
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY valor_contrato) AS p25,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY valor_contrato) AS p75
  FROM marts.contratacion
),
um_proveedores AS (
  SELECT id_contrato, COUNT(DISTINCT proveedor) AS proveedores
  FROM marts.contratacion
  GROUP BY id_contrato
)
SELECT c.id_contrato,
       c.nombre_entidad,
       c.proveedor,
       c.departamento,
       c.valor_contrato,
       np.proveedores,
       CASE
         WHEN c.valor_contrato < p25 - 1.5 * (p75 - p25) THEN 'Bajo'
         WHEN c.valor_contrato > p75 + 1.5 * (p75 - p25) THEN 'Alto'
         ELSE 'Normal'
       END AS categoria_valor
FROM marts.contratacion c
CROSS JOIN rangos
LEFT JOIN num_proveedores np ON c.id_contrato = np.id_contrato
WHERE np.proveedores = 1
ORDER BY c.valor_contrato DESC
LIMIT 100;
```

## Análisis de educación (datos de prueba)

```sql
SELECT *
FROM clean.datos_educacion_20260423_clean
LIMIT 20;
```

```sql
SELECT departamento,
       COUNT(*) AS registros,
       MAX(fecha_carga) AS ultima_actualizacion
FROM clean.datos_educacion_20260423_clean
GROUP BY departamento
ORDER BY registros DESC;
```

## Matriz de cobertura por departamento

```sql
SELECT departamento,
       COUNT(*) AS num_contratos,
       SUM(valor_contrato) AS valor_total,
       AVG(valor_contrato) AS valor_promedio
FROM marts.contratacion
GROUP BY departamento
ORDER BY num_contratos ASC;
```

## Tablas de referencia útiles para modelado

```sql
SELECT DISTINCT departamento FROM marts.contratacion ORDER BY departamento;
SELECT DISTINCT nombre_entidad FROM marts.contratacion ORDER BY nombre_entidad;
SELECT DISTINCT sector FROM marts.contratacion ORDER BY sector;
SELECT DISTINCT proceso_de_compra FROM marts.contratacion ORDER BY proceso_de_compra;
```

## Exportar datos para Power BI

```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d cividata \
  -c "\COPY marts.contratacion TO 'contratacion.csv' CSV HEADER"
```

```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d cividata \
  -c "\COPY marts.resumen_departamento TO 'resumen_departamento.csv' CSV HEADER"
```

## Preparar dimensiones internas en Power BI

```sql
-- Departamento
SELECT DISTINCT departamento AS depto
FROM marts.contratacion;

-- Sector
SELECT DISTINCT sector
FROM marts.contratacion;

-- Entidad
SELECT DISTINCT nombre_entidad
FROM marts.contratacion;
```
