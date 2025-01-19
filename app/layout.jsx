import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PositionProvider } from "@context/positionContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ball Blast",
  description: "A game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PositionProvider>
          <div
            className="background-wrapper"
            style={{
              backgroundImage: 'url("/assets/ballblast.jpg")', // Path to your image
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              minHeight: "100vh", // Ensure it takes full height
            }}
          >
            {children}
          </div>
        </PositionProvider>
      </body>
    </html>
  );
}
