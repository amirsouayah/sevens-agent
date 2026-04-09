export const metadata = {
  title: "Sevens Content Agent",
  description: "Génération de contenu & images IA pour sevens.tn",
};
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
