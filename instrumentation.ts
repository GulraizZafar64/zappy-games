/**
 * Runs when the server starts. Only connects to DB.
 * Scheduler moved to manual script as per user request.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const run = async () => {
    try {
      const { connectDB } = await import("./lib/mongodb")
      await connectDB()
      console.log("[Instrumentation] MongoDB Connected.")
    } catch (e) {
      console.error("[Instrumentation] Startup error:", e)
    }
  }

  setImmediate(run)
}
