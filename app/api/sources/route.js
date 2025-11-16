export async function GET() {
  return Response.json([
    { name: "Le Monde", url: "https://www.lemonde.fr/rss/en_continu.xml" },
    { name: "Next INpact", url: "https://next.ink/rss/news.xml" },
    { name: "LinuxFR", url: "https://linuxfr.org/news.atom" }
  ]);
}
