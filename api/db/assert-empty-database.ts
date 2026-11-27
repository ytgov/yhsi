import type { Knex } from "knex"

export default async function assertEmptyDatabase(db: Knex): Promise<void> {
  const objects = await db.raw<{ name: string }[]>(`
    SELECT TOP (1) name
    FROM sys.objects
    WHERE is_ms_shipped = 0
      AND parent_object_id = 0
      AND NOT (schema_id = SCHEMA_ID(N'dbo') AND name IN (N'knex_migrations', N'knex_migrations_lock'))
  `)

  if (objects.length > 0) {
    throw new Error(
      "Refusing to apply the development baseline to a database with existing objects. Set DB_NAME to a fresh development database."
    )
  }
}
