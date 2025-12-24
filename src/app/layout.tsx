import "./globals.css";
import { Toaster } from 'sonner'
import type { Metadata } from "next";
import Providers from "@/providers/Providers";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "one_chat",
  description: "simple-private-secure-chat",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster richColors position="bottom-left"
            toastOptions={{
              style: {
                background: "#1C1C1C",
                border: "1px solid #fcfcfc32"
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
