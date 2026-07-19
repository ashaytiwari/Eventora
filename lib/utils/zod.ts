export function formatZodErrors(result: any) {
  return result.error.issues.map((issue: any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }))
}