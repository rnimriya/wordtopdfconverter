import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Free Word to PDF Converter | Private, Browser-Based PDF Tools',
  description: 'Free, secure, and fully private No-Upload PDF Editor. Client-side PDF tools for processing documents offline in your browser.',
  metadataBase: new URL('https://www.wordtopdfconverter.online'),
};

export default function RootLayout({ children }) {
  const orgSchema = {"@context":"https://schema.org","@type":"Organization","name":"Free Word to PDF Converter","url":"https://www.wordtopdfconverter.online/","logo":"https://www.wordtopdfconverter.online/icon.png","description":"Browser-based, private, and client-side PDF utility suite with over 50 tools. Completely no-upload, secure processing.","sameAs": []
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="font-sans tracking-tight text-slate-900 antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
