OUTPUT_FILENAME = "results.csv"

PAGE_TIMEOUT = 30000

NAVIGATION_TIMEOUT = 60000

BROWSER_OPTIONS = {
    "headless": True,
    "slow_mo": 0,
}

CONTEXT_OPTIONS = {
    "viewport": {"width": 1280, "height": 720},
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "ignore_https_errors": True,
}

CSV_ENCODING = "utf-8-sig"

CSV_FIELDNAMES = ["title", "url"]

MAX_RETRIES = 3

RETRY_DELAY = 2

DEFAULT_URLS = []