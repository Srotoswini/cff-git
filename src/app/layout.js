import "./globals.css"; // adjust path as needed
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // ✅ Add this line

export const metadata = {
  title: "Calcutta Fresh Foods",
  description: "Delicious Freshness Delivered",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Appears on all pages */}
        {children}
        <Footer /> {/* ✅ Now the footer appears on all pages too */}
      </body>
    </html>
  );
}
