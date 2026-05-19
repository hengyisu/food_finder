import asyncio
import argparse
import sys
from crawler import scrape_page
from output import save_to_csv


def parse_args():
    parser = argparse.ArgumentParser(
        description="Playwright web crawler - scrape titles and links from a webpage"
    )
    parser.add_argument(
        "url",
        type=str,
        help="Target URL to scrape"
    )
    parser.add_argument(
        "-o", "--output",
        type=str,
        default="output.csv",
        help="Output CSV file path (default: output.csv)"
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30000,
        help="Page load timeout in milliseconds (default: 30000)"
    )
    return parser.parse_args()


async def main():
    args = parse_args()

    print(f"Starting crawler for URL: {args.url}")
    print(f"Output file: {args.output}")

    try:
        results = await scrape_page(args.url, timeout=args.timeout)

        if not results:
            print("No data found on the page.")
            sys.exit(0)

        print(f"Found {len(results)} links.")

        save_to_csv(results, args.output)
        print(f"Data saved to {args.output}")

    except ValueError as e:
        print(f"Invalid input: {e}", file=sys.stderr)
        sys.exit(1)
    except RuntimeError as e:
        print(f"Crawler error: {e}", file=sys.stderr)
        sys.exit(2)
    except KeyboardInterrupt:
        print("\nCrawler interrupted by user.")
        sys.exit(0)


if __name__ == "__main__":
    asyncio.run(main())