export function generateCurlExample(
  method: string,
  url: string,
  hasPagination: boolean
): string {
  switch (method) {
    case "GET":
      return `curl -X GET "${url}${hasPagination ? "?page=1&limit=10" : ""}"

curl -X GET "${url}/[id]`;
    case "POST":
      return `curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "value"}'`;
    case "PUT":
      return `curl -X PUT "${url}/[id]" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "value"}'`;
    case "PATCH":
      return `curl -X PATCH "${url}/[id]" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "value"}'`;
    case "DELETE":
      return `curl -X DELETE "${url}/[id]"`;
    default:
      return "";
  }
}

export function generateFetchExample(
  method: string,
  url: string,
  hasPagination: boolean
): string {
  switch (method) {
    case "GET":
      return `fetch('${url}${hasPagination ? "?page=1&limit=10" : ""}')

fetch('${url}/[id]')`;
    case "POST":
      return `fetch('${url}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
})`;
    case "PUT":
      return `fetch('${url}/[id]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
})`;
    case "PATCH":
      return `fetch('${url}/[id]', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
})`;
    case "DELETE":
      return `fetch('${url}/[id]', { method: 'DELETE' })`;
    default:
      return "";
  }
}
