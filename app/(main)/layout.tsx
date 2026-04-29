import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
    </ProtectedRoute>
  );
}