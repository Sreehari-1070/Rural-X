import "./globals.css";

export const metadata = {
  title: "Fertilizer Ratio",
  description: "Advanced Fertilizer Ratio Intelligence System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
