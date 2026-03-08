export function createOllamaClient() {
  return {
    async healthCheck() {
      return { ok: false, message: "Not implemented yet" };
    },
  };
}
