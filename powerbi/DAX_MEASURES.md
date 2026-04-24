# DAX Measures para CiviData

## Medidas generales

```dax
Total Valor Contrato = SUM('contratacion'[valor_contrato])
Numero de Contratos = COUNTROWS('contratacion')
Valor Promedio Contrato = AVERAGE('contratacion'[valor_contrato])
```

```dax
Contratos Ultimos 12 Meses =
CALCULATE(
    [Numero de Contratos],
    FILTER(
        ALL('contratacion'),
        'contratacion'[fecha_inicio] >= DATEADD(TODAY(), -1, YEAR)
    )
)
```

```dax
Valor Ultimos 12 Meses =
CALCULATE(
    [Total Valor Contrato],
    FILTER(
        ALL('contratacion'),
        'contratacion'[fecha_inicio] >= DATEADD(TODAY(), -1, YEAR)
    )
)
```

## Contratación pública

### Educación vs Salud 2025

```dax
Valor Educacion 2025 =
CALCULATE(
    [Total Valor Contrato],
    FILTER(
        'contratacion',
        YEAR('contratacion'[fecha_inicio]) = 2025
            && CONTAINSSTRING(LOWER('contratacion'[sector]), "educaci")
    )
)

Valor Salud 2025 =
CALCULATE(
    [Total Valor Contrato],
    FILTER(
        'contratacion',
        YEAR('contratacion'[fecha_inicio]) = 2025
            && (
                CONTAINSSTRING(LOWER('contratacion'[sector]), "salud")
                || CONTAINSSTRING(LOWER('contratacion'[sector]), "social")
            )
    )
)
```

### Entidad que más contrató por departamento

```dax
Valor Contratado por Entidad =
CALCULATE(
    [Total Valor Contrato],
    ALLSELECTED('contratacion'),
    VALUES('contratacion'[nombre_entidad])
)
```

### Proveedores top por región

```dax
Valor por Proveedor = SUM('contratacion'[valor_contrato])
```

Utilizar la medida en una tabla de `proveedor` y `departamento` con top N.

### Detección de anomalías por contrato

```dax
Valor Mediano = MEDIAN('contratacion'[valor_contrato])

Desviacion Estandar Valor = STDEVX.P('contratacion', 'contratacion'[valor_contrato])

Umbral Alto = [Valor Mediano] + 2 * [Desviacion Estandar Valor]

Contrato Atipico =
IF(
    'contratacion'[valor_contrato] > [Umbral Alto],
    "Sí",
    "No"
)
```

## Catálogo de datos

### Sectores con más datos

```dax
Valor Total por Sector = SUM('contratacion'[valor_contrato])

Contratos por Sector = COUNTROWS('contratacion')
```

### Actualización de datasets

```dax
Fecha Ultima Actualizacion = MAX('contratacion'[fecha_carga])
```

### Regiones con menor cobertura

```dax
Contratos por Departamento = COUNTROWS('contratacion')
```

Crear un visual de tipo `Mapa` o `Tabla` con la medida por `departamento`.

## Educación (si se importa dataset adicional)

### Tasa de deserción

```dax
Tasa Desercion =
DIVIDE(
    SUM('educacion'[desertores]),
    SUM('educacion'[matriculados]),
    0
)
```

### Graduados por programa

```dax
Graduados por Programa = SUM('educacion'[graduados])
Matriculados por Programa = SUM('educacion'[matriculados])
Tasa Graduacion = DIVIDE([Graduados por Programa], [Matriculados por Programa], 0)
```

### Correlación empleo vs nivel educativo

```dax
Tasa Empleo = AVERAGE('geih'[tasa_empleo])
Ingreso Promedio = AVERAGE('geih'[ingreso_promedio])
```

> Nota: si no hay un modelo completo de educación, usar `clean.datos_educacion_20260423_clean` como punto de partida y ampliar con datos externos.
