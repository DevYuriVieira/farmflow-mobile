# FarmFlow — Especificação do Banco de Dados PostgreSQL & Arquitetura de Backend (Java / C#)

Este documento fornece o schema DDL completo em **PostgreSQL com extensão espacial PostGIS** e os modelos para implementação no backend (seja em **Java Spring Boot 3** ou **C# .NET 9 / EF Core**), garantindo compatibilidade 1:1 com este Super App Mobile.

---

## 1. Schema DDL PostgreSQL (com PostGIS)

```sql
-- Habilita extensões necessárias para UUID e Computação Geoespacial
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Tabela de Usuários e Produtores
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR', -- ADMIN, AGRONOMIST, OPERATOR
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Tabela de Propriedades Rurais (Fazendas)
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    location_label VARCHAR(255) NOT NULL,
    total_area_hectares NUMERIC(12, 2) NOT NULL,
    centroid_lat DOUBLE PRECISION NOT NULL,
    centroid_lon DOUBLE PRECISION NOT NULL,
    boundary_polygon GEOMETRY(Polygon, 4326), -- PostGIS Spatial Polygon
    sync_version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_farms_boundary ON farms USING GIST(boundary_polygon);
CREATE INDEX IF NOT EXISTS idx_farms_updated_at ON farms(updated_at);

-- 3. Tabela de Lavouras e Talhões
CREATE TABLE IF NOT EXISTS plantations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    crop_type VARCHAR(100) NOT NULL, -- SOY, CORN, COTTON, COFFEE, CANE
    area_hectares NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'GROWING', -- PLANNING, PLANTED, GROWING, HARVESTED
    planted_at DATE,
    expected_harvest_at DATE,
    boundary_polygon GEOMETRY(Polygon, 4326),
    sync_version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_plantations_boundary ON plantations USING GIST(boundary_polygon);
CREATE INDEX IF NOT EXISTS idx_plantations_farm_id ON plantations(farm_id);

-- 4. Monitoramento Fitossanitário & Reconhecimento por IA
CREATE TABLE IF NOT EXISTS pest_scouting_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plantation_id UUID NOT NULL REFERENCES plantations(id) ON DELETE CASCADE,
    scout_user_id UUID NOT NULL REFERENCES users(id),
    pest_id VARCHAR(100) NOT NULL,
    pest_name VARCHAR(150) NOT NULL,
    severity VARCHAR(30) NOT NULL, -- LOW, MEDIUM, CRITICAL
    affected_plants_percent NUMERIC(5, 2) NOT NULL,
    location_note TEXT,
    coordinates GEOMETRY(Point, 4326),
    image_url TEXT,
    ai_confidence_percent NUMERIC(5, 2),
    ai_diagnosis_label VARCHAR(150),
    digital_signature_svg TEXT,
    notes TEXT,
    action_taken BOOLEAN NOT NULL DEFAULT FALSE,
    sync_version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_scouting_plantation ON pest_scouting_records(plantation_id);

-- 5. Aplicações de Pulverização (Caderno de Campo MAPA)
CREATE TABLE IF NOT EXISTS spray_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plantation_id UUID NOT NULL REFERENCES plantations(id) ON DELETE CASCADE,
    applicator_user_id UUID NOT NULL REFERENCES users(id),
    product_trade_name VARCHAR(150) NOT NULL,
    active_ingredient VARCHAR(150) NOT NULL,
    target_pest VARCHAR(150) NOT NULL,
    dosage_per_hectare NUMERIC(8, 3) NOT NULL,
    dosage_unit VARCHAR(20) NOT NULL, -- L/ha, kg/ha, mL/ha
    water_volume_l_per_ha NUMERIC(8, 2) NOT NULL,
    wind_speed_kmh NUMERIC(5, 2),
    temperature_celsius NUMERIC(5, 2),
    humidity_percent NUMERIC(5, 2),
    delta_t NUMERIC(5, 2),
    nozzle_type VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- PLANNED, IN_PROGRESS, COMPLETED
    agronomist_signature_svg TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Frota de Maquinários e Telemetria
CREATE TABLE IF NOT EXISTS machinery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL, -- TRACTOR, HARVESTER, SPRAYER, PLANTER
    model VARCHAR(100) NOT NULL,
    plate_or_serial VARCHAR(100),
    hourmeter_hours NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    fuel_level_percent NUMERIC(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- WORKING, AVAILABLE, MAINTENANCE
    last_telemetry_at TIMESTAMP WITH TIME ZONE
);
```

---

## 2. Padrões de DTOs e Sincronização

### Contrato de Sincronização Incremental (Delta Sync)

```http
GET /api/v1/sync?last_sync_timestamp=2026-10-11T12:00:00Z&farm_id=f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Resposta JSON:**
```json
{
  "sync_timestamp": "2026-10-11T19:30:00Z",
  "has_more": false,
  "changes": {
    "farms": { "upserted": [], "deleted_ids": [] },
    "plantations": { "upserted": [], "deleted_ids": [] },
    "scouting": { "upserted": [], "deleted_ids": [] },
    "activities": { "upserted": [], "deleted_ids": [] }
  }
}
```

---

## 3. Guia de Integração

### Opção A: Backend em Java (Spring Boot 3 + Spring Data JPA)
- Dependências recomendadas:
  - `org.hibernate.orm:hibernate-spatial` (para mapear `org.locationtech.jts.geom.Polygon` com PostGIS).
  - `org.springframework.boot:spring-boot-starter-security` com JWT / OAuth2.
  - `org.springdoc:springdoc-openapi-starter-webmvc-ui` (Swagger automático compatível).

### Opção B: Backend em C# (.NET 9 + Entity Framework Core)
- Dependências recomendadas:
  - `Npgsql.EntityFrameworkCore.PostgreSQL`
  - `Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite` (para suporte geoespacial `NetTopologySuite.Geometries.Polygon`).
  - `Microsoft.AspNetCore.Authentication.JwtBearer`.
