# Plan: Esquema de base de datos para donaciones de aliados

## Contexto

El cliente (Mi Escuela Primero) gestiona donaciones entre aliados y escuelas con necesidades. Actualmente el proceso es manual (correo + Excel). El frontend ya tiene un catálogo de necesidades con filtros, y un botón "Donar" que lleva a un formulario. El formulario captura datos del aliado y detalles de la donación, pero la información no llega al cliente. Este esquema conecta ese flujo.

**Tablas existentes** (creadas via dashboard, PKs `bigint`):
- `municipios`, `planteles`, `escuelas`, `categorias`, `subcategorias`, `necesidades`

## Nuevas tablas y tipos

### Enums (4)

| Enum | Valores |
|------|---------|
| `tipo_donativo` | formacion_familias, formacion_estudiantes, formacion_docentes, atencion_psicologica, material_tecnologico, material_papeleria, material_literario, material_educacion_fisica, material_infraestructura, mobiliario, transporte, condiciones_camino, salud_fisica, visitas_extraescolares, apoyo_gestion, otro |
| `tipo_instancia` | empresa, osc, institucion_educativa, gobierno_municipal, sin_instancia, otro |
| `estado_donacion` | pendiente, en_revision, aceptada, rechazada, completada |
| `opcion_logistica` | entrega_escuela, lleva_oficina, requiere_recoleccion |

### Tabla: `aliados`
Datos de contacto del donante. Un aliado puede hacer múltiples donaciones.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | gen_random_uuid() |
| nombre_completo | text NOT NULL | |
| tipo_instancia | tipo_instancia NOT NULL | |
| nombre_instancia | text | nullable, solo si representa una org |
| correo_electronico | text NOT NULL | índice (no unique — formulario público) |
| celular | text NOT NULL | |
| municipio_estado | text NOT NULL | texto libre "Municipio, Estado" |
| acepta_privacidad | boolean NOT NULL DEFAULT false | |
| created_at / updated_at | timestamptz | |

### Tabla: `donaciones`
Una fila por envío de formulario. Campos condicionales como columnas nullable.

| Columna | Tipo | Grupo |
|---------|------|-------|
| id | uuid PK | común |
| aliado_id | uuid FK → aliados | común |
| tipo_donativo | tipo_donativo NOT NULL | común |
| estado | estado_donacion DEFAULT 'pendiente' | común |
| tema_formacion | text | formación |
| publico_dirigido | text | formación |
| num_horas_sesiones | integer | formación |
| articulo_donar | text | material |
| cantidad | numeric | material |
| logistica | opcion_logistica | material |
| direccion_recoleccion | text | material (solo si requiere_recoleccion) |
| descripcion_apoyo | text | otro/salud/acceso |
| notas_admin | text | admin |
| created_at / updated_at | timestamptz | |

### Tabla: `donacion_necesidades` (junction)
Liga una donación a una o más necesidades con cantidad cubierta.

| Columna | Tipo |
|---------|------|
| id | uuid PK |
| donacion_id | uuid FK → donaciones |
| necesidad_id | bigint FK → necesidades |
| cantidad_cubierta | numeric (nullable) |
| created_at | timestamptz |
| UNIQUE(donacion_id, necesidad_id) | |

### Tabla: `donacion_escuelas` (junction)
Escuelas destino seleccionadas (independiente de necesidades, para formación/otros).

| Columna | Tipo |
|---------|------|
| id | uuid PK |
| donacion_id | uuid FK → donaciones |
| escuela_id | bigint FK → escuelas |
| created_at | timestamptz |
| UNIQUE(donacion_id, escuela_id) | |

### Tabla: `archivos_donacion`
Metadatos de archivos adjuntos (archivos en Supabase Storage).

| Columna | Tipo |
|---------|------|
| id | uuid PK |
| donacion_id | uuid FK → donaciones |
| nombre_archivo | text NOT NULL |
| mime_type | text |
| storage_path | text NOT NULL |
| tamano_bytes | bigint |
| created_at | timestamptz |

## Relaciones

```
aliados (1) ──< donaciones (1) ──< donacion_necesidades >── necesidades
                    │
                    ├──< donacion_escuelas >── escuelas
                    │
                    └──< archivos_donacion
```

## Decisiones de diseño

1. **Columnas nullable vs tablas hijas por tipo**: Columnas nullable en `donaciones`. Solo ~6 campos condicionales; separar en tablas requeriría LEFT JOINs innecesarios.
2. **Enum vs lookup table para tipos de donación**: Enum — el set es fijo y viene del documento de requerimientos. Agregar uno nuevo es un `ALTER TYPE ... ADD VALUE`.
3. **UUID para tablas nuevas, bigint para FKs a existentes**: UUIDs evitan enumeración en formularios públicos; FKs usan bigint para coincidir con PKs existentes.
4. **Sin UNIQUE en correo de aliado**: Formulario público, el mismo aliado puede enviar múltiples veces. Índice para búsquedas admin.
5. **`donacion_escuelas` separada de `donacion_necesidades`**: Para formación/otros, el aliado selecciona escuelas sin necesariamente referenciar necesidades específicas.

## Implementación

Crear un archivo de migración en:
`supabase/migrations/20260415120000_add_donation_tables.sql`

Contenido en orden:
1. CREATE TYPE (4 enums)
2. CREATE TABLE aliados + índice
3. CREATE TABLE donaciones + índices
4. CREATE TABLE donacion_necesidades + índices
5. CREATE TABLE donacion_escuelas + índices
6. CREATE TABLE archivos_donacion + índice
7. Función y triggers para updated_at

## Verificación

1. Aplicar migración con `supabase db push` o via MCP `apply_migration`
2. Verificar tablas con `list_tables`
3. Probar INSERT de un aliado + donación + junction rows
4. Verificar que FKs a tablas existentes (necesidades, escuelas) funcionan
5. Verificar que los enums rechazan valores inválidos
