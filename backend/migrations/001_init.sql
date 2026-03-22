CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shopping_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    store      TEXT NOT NULL,
    quantity   NUMERIC NOT NULL,
    unit       TEXT NOT NULL,
    urgency    TEXT NOT NULL CHECK (urgency IN ('urgent', 'relaxed')),
    memo       TEXT,
    in_cart    BOOLEAN NOT NULL DEFAULT TRUE,
    checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);