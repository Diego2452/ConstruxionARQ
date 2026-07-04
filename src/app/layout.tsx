import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'ConstruxionArq – Arquitectura · Diseño · Construcción',
  description:
    'Equipo de arquitectos e ingenieros con más de 30 años de experiencia en Costa Rica. Diseño y construcción de calidad desde 1990.',
  icons: {
    icon: 'https://construxionarq.com/wp-content/uploads/2023/03/cropped-con-logo-white-32x32.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,400&family=Roboto+Flex:wght@200;300;400&display=swap"
          rel="stylesheet"
        />
        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body>
        <LanguageProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
