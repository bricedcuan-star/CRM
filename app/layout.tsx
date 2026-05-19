import './globals.css';

export const metadata = {
  title: 'CRM Leads',
  description: 'CRM interno de leads y oportunidades',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
