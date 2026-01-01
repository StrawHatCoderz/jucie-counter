import { client } from '../../src/db/db.js';

const QUERY = `
DROP TABLE IF EXISTS customer CASCADE;
CREATE TABLE customer (
  customer_id  SERIAL PRIMARY KEY,
  first_name   VARCHAR(50)  NOT NULL,
  last_name    VARCHAR(50)  NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  order_id     SERIAL PRIMARY KEY,
  customer_id  INTEGER NOT NULL
    REFERENCES customer(customer_id) ON DELETE RESTRICT,
  order_date   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  total_amount NUMERIC(10,2) DEFAULT 0
);
DROP TABLE IF EXISTS ordered_items CASCADE;
CREATE TABLE ordered_items (
  order_id     INTEGER
    REFERENCES orders(order_id) ON DELETE CASCADE,
  item_id      INTEGER
    REFERENCES menu(item_id) ON DELETE RESTRICT,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  order_status VARCHAR(20) DEFAULT 'PENDING'
    CHECK (order_status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
  PRIMARY KEY (order_id, item_id)
);
DROP TABLE IF EXISTS menu CASCADE;
CREATE TABLE menu (
  item_id    SERIAL PRIMARY KEY,
  item_name  VARCHAR(100) NOT NULL,
  item_type  VARCHAR(20)  NOT NULL
    CHECK (item_type IN ('RAW', 'JUICE', 'SHAKE', 'BOWL')),
  item_price NUMERIC(10,2) NOT NULL
    CHECK (item_price >= 0),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isactive   BOOLEAN NOT NULL DEFAULT true
);
DROP TABLE IF EXISTS recipe CASCADE;
CREATE TABLE recipe (
  item_id           INTEGER
    REFERENCES menu(item_id) ON DELETE CASCADE,
  ingredient_id     INTEGER
    REFERENCES raw_material(ingredient_id) ON DELETE RESTRICT,
  required_quantity NUMERIC(10,2) NOT NULL CHECK (required_quantity > 0),
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (item_id, ingredient_id)
);
DROP TABLE IF EXISTS raw_material CASCADE;
CREATE TABLE raw_material (
  ingredient_id       SERIAL PRIMARY KEY,
  ingredient_name     VARCHAR(100) NOT NULL,
  unit_type           VARCHAR(10) NOT NULL
    CHECK (unit_type IN ('KG', 'UNIT', 'ML')),
  created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS inventory_batch CASCADE;
CREATE TABLE inventory_batch (
  batch_id           SERIAL PRIMARY KEY,
  ingredient_id      INTEGER
    REFERENCES raw_material(ingredient_id) ON DELETE RESTRICT,
  supplier_id        INTEGER
    REFERENCES supplier(supplier_id) ON DELETE RESTRICT,
  quantity_received  NUMERIC(10,2) NOT NULL CHECK (quantity_received > 0),
  cost_price         NUMERIC(10,2) NOT NULL CHECK (cost_price >= 0),
  received_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expiry_date        DATE NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  quantity_remaining NUMERIC(10,2) NOT NULL
    CHECK (quantity_remaining >= 0)
);
DROP TABLE IF EXISTS supplier CASCADE;
CREATE TABLE supplier (
  supplier_id    SERIAL PRIMARY KEY,
  supplier_name  VARCHAR(100) NOT NULL,
  contact_number VARCHAR(20)  NOT NULL,
  email          VARCHAR(255) UNIQUE,
  created_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

await client.connect();

const createTables = async (tablesQuery) => {
	await client.queryObject(tablesQuery);
};

const main = async () => {
	await createTables(QUERY);
};

await main();
await client.end();
