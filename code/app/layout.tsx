export const metadata = {
  title: "Clarify → Code (Agentic Flow)",
  description: "Ask clarifying questions first, then generate code"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui", background: "#0b0e14", color: "#e6e6e6" }}>
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
          {children}
        </div>
      </body>
    </html>
  );
}

