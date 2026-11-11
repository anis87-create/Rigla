import "dotenv/config";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

// psql lit nativement PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE depuis l'environnement.
const MIGRATIONS_DIR = path.resolve("src/database/migrations");

function findPsql(): string {
  if (process.env.PSQL_PATH) return process.env.PSQL_PATH;
  const probe = spawnSync("psql", ["--version"], { stdio: "ignore" });
  if (probe.status === 0) return "psql";
  const fallback = "C:/Program Files/PostgreSQL/18/bin/psql.exe";
  if (existsSync(fallback)) return fallback;
  throw new Error("psql introuvable : ajoute-le au PATH ou définis PSQL_PATH dans .env");
}

const psql = findPsql();
const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("Aucune migration trouvée.");
  process.exit(0);
}

for (const file of files) {
  console.log(`→ ${file}`);
  const result = spawnSync(
    psql,
    ["-v", "ON_ERROR_STOP=1", "-q", "-f", path.join(MIGRATIONS_DIR, file)],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error(`✗ Échec de ${file}`);
    process.exit(result.status ?? 1);
  }
}

console.log(`✓ ${files.length} migration(s) exécutée(s).`);
