import AgenticFlow from "@/components/AgenticFlow";

export default function Page() {
  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Clarify → Code (Agentic Flow)
      </h1>
      <p className="kv" style={{ marginBottom: 16 }}>
        The model asks one clarifying question per turn, stops when ready, then generates code.
      </p>
      <AgenticFlow />
    </>
  );
}
