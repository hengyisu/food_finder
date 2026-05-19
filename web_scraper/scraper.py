import asyncio
import csv
import sys
from playwright.async_api import async_playwright


async def scrape(url: str, output_file: str = "output.csv") -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto(url, wait_until="networkidle", timeout=30000)

        title = await page.title()

        links = await page.evaluate("""
            () => {
                const anchors = Array.from(document.querySelectorAll('a'));
                return anchors.map(a => ({
                    text: a.innerText.trim(),
                    href: a.href
                })).filter(item => item.href && item.href.startsWith('http'));
            }
        """)

        headings = await page.evaluate("""
            () => {
                const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
                const result = [];
                tags.forEach(tag => {
                    const elements = Array.from(document.querySelectorAll(tag));
                    elements.forEach(el => {
                        result.push({
                            tag: tag.toUpperCase(),
                            text: el.innerText.trim()
                        });
                    });
                });
                return result;
            }
        """)

        await browser.close()

        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["type", "tag_or_source", "text", "url"])

            writer.writerow(["page_title", "TITLE", title, url])

            for heading in headings:
                writer.writerow(["heading", heading["tag"], heading["text"], ""])

            for link in links:
                writer.writerow(["link", "A", link["text"], link["href"]])

        print(f"Page title: {title}")
        print(f"Found {len(headings)} headings and {len(links)} links")
        print(f"Data saved to {output_file}")


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <url> [output_file]")
        print("Example: python scraper.py https://example.com results.csv")
        sys.exit(1)

    url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "output.csv"

    asyncio.run(scrape(url, output_file))


if __name__ == "__main__":
    main()