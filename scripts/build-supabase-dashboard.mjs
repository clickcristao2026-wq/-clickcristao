import ts from "typescript";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const projectRef = "xqmvlozonwudwewjlpfe";
const target = path.join(root, "supabase", "dashboard");
await mkdir(target, { recursive: true });

for (const name of ["ai-settings", "ai-agent"]) {
  const entry = path.join(root, "supabase", "functions", name, "index.ts");
  const visited = new Set();
  const parts = [];
  async function include(filename) {
    filename = path.resolve(filename);
    if (visited.has(filename)) return;
    visited.add(filename);
    let source = await readFile(filename, "utf8");
    const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const removals = [];
    for (const node of ast.statements) {
      if (!(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      const specifier = node.moduleSpecifier.text;
      if (!specifier.startsWith(".")) continue;
      if (ts.isImportDeclaration(node)) {
        const clause = node.importClause;
        if (clause?.name || (clause?.namedBindings && !ts.isNamedImports(clause.namedBindings))) throw new Error("Importação local não suportada: " + specifier);
        if (clause?.namedBindings?.elements.some(item => item.propertyName && item.propertyName.text !== item.name.text)) throw new Error("Alias local não suportado: " + specifier);
      }
      await include(path.resolve(path.dirname(filename), specifier));
      removals.push([node.getFullStart(), node.end]);
    }
    for (const [start, end] of removals.reverse()) source = source.slice(0, start) + source.slice(end);
    if (filename === entry) {
      const serve = /if\s*\(import\.meta\.main\)\s*Deno\.serve\(handler\);/;
      if (!serve.test(source)) throw new Error("Inicialização desconhecida: " + name);
      source = source.replace(serve, `Deno.serve((request: Request) => {
  if (Deno.env.get("SUPABASE_URL") !== "https://${projectRef}.supabase.co") {
    return new Response(JSON.stringify({ error: "Esta função pertence exclusivamente ao projeto Click Cristão (${projectRef})." }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  return handler(request);
});`);
    }
    parts.push("// " + path.relative(root, filename).replaceAll("\\", "/") + "\n" + source.trim());
  }
  await include(entry);
  const banner = `// CLICK CRISTÃO — função ${name}
// Exclusiva do projeto ${projectRef}.
// Copie este arquivo INTEIRO para index.ts no editor do Supabase.
// Gerado de supabase/functions; não contém chaves ou senhas.
`;
  await writeFile(path.join(target, name + ".ts"), banner + "\n" + parts.join("\n\n") + "\n", "utf8");
  process.stdout.write("Preparado: supabase/dashboard/" + name + ".ts\n");
}
