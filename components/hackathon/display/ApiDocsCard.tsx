// ============================================================
// API DOCS CARD — API endpoint documentation display
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

export default function ApiDocsCard({
  method,
  path,
  description,
  example,
  className,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  example?: string;
  className?: string;
}) {
  const methodColors: Record<string, string> = {
    GET: "text-green-400",
    POST: "text-blue-400",
    PUT: "text-amber-400",
    DELETE: "text-red-400",
  };

  return (
    <div className={`hackathon-api-card ${className || ""}`}>
      <div className="hackathon-api-header">
        <span className={`hackathon-api-method hackathon-api-method--${method.toLowerCase()}`}>
          {method}
        </span>
        <span className="hackathon-api-path">{path}</span>
      </div>
      <p className="p-3 font-mono text-sm text-gray-300">{description}</p>
      {example && (
        <pre className="hackathon-api-body">{example}</pre>
      )}
    </div>
  );
}