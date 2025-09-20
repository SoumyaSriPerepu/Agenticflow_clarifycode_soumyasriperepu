"use client";

import { useState } from "react";

type QA = { q: string; a: string };

export default function AgenticFlow() {
  const [goal, setGoal] = useState("");
  const [started, setStarted] = useState(false);
  const [qa, setQa] = useState<QA[]>([]);
  const [pendingQ, setPendingQ] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (!goal.trim()) return;
    setStarted(true);
    await nextQuestion([]);
  };

  const nextQuestion = async (ledger: QA[]) => {
    setBusy(true);
    setPendingQ(null);
    try {
      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ goal, ledger })
      });
      const data = await res.json();
      if (data.status === "done") {
        setDone(true);
        setPendingQ(null);
        await doGenerate(ledger);
      } else {
        setPendingQ(data.question);
      }
    } catch (e) {
      setPendingQ("Sorry, I failed to ask a question. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitAnswer = async () => {
    if (!pendingQ) return;
    const newLedger = [...qa, { q: pendingQ, a: answer || "(no answer)" }];
    setQa(newLedger);
    setAnswer("");
    await nextQuestion(newLedger);
  };

  const doGenerate = async (ledger: QA[]) => {
    setBusy(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ goal, ledger })
      });
      const data = await res.json();
      setCode(data.code || "// (no code)");
    } catch (e) {
      setCode("// generation failed");
    } finally {
      setBusy(false);
    }
  };

  const resetAll = () => {
    setGoal(""); setStarted(false); setQa([]); setPendingQ(null);
    setAnswer(""); setDone(false); setCode(null); setBusy(false);
  };

  return (
    <div className="card">
      {!started ? (
        <div style={{ display: "grid", gap: 12 }}>
          <label className="kv">Your goal</label>
          <input
            className="input"
            placeholder='e.g., "print 100 numbers"'
            value={goal}
            onChange={e => setGoal(e.target.value)}
          />
          <div className="row">
            <button className="btn" onClick={start} disabled={!goal.trim() || busy}>Start</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <div className="kv">Goal</div>
            <div className="code" style={{ fontSize: 14 }}>{goal}</div>
          </div>

          {qa.length > 0 && (
            <div>
              <div className="kv">Facts (Ledger)</div>
              <div className="code" style={{ fontSize: 14 }}>
                {qa.map((p, i) => (
                  <div key={i}>
                    <span className="q">Q:</span> {p.q} <br />
                    <span className="a">A:</span> {p.a}
                    {i < qa.length - 1 ? <hr style={{ border: "none", borderTop: "1px solid #1e2636" }} /> : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!done && pendingQ && (
            <div>
              <div className="kv">Clarifying question</div>
              <div className="code" style={{ fontSize: 15, color: "#f5d0fe" }}>{pendingQ}</div>
              <div className="row" style={{ marginTop: 8 }}>
                <input
                  className="input"
                  placeholder="Your answer"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
                <button className="btn" onClick={submitAnswer} disabled={busy || !pendingQ}>
                  Submit
                </button>
              </div>
            </div>
          )}

          {code && (
            <div>
              <div className="kv">Generated code</div>
              <pre className="code" style={{ fontSize: 13 }}>{code}</pre>
              <div className="row">
                <button
                  className="btn"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  Copy
                </button>
                <button className="btn" onClick={resetAll}>New Task</button>
              </div>
            </div>
          )}

          {busy && <div className="kv">Working…</div>}
        </div>
      )}
    </div>
  );
}
