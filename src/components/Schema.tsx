import { allSchemas } from "@/lib/schema";

/* ─────────────────────────────────────────────────────────────
   Schema Component — injects JSON-LD into the page
   Renders as <script type="application/ld+json"> tags
   ───────────────────────────────────────────────────────────── */
export default function Schema() {
  return (
    <>
      {allSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}