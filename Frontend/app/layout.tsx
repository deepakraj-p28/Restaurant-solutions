import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/login.css";

export const metadata: Metadata = {
  title: "BoccaCafe Inventory | Login",
  description: "Secure login for BoccaCafe inventory management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
