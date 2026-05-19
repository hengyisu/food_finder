import csv
import os
from typing import List, Dict


def write_to_csv(data: List[Dict[str, str]], output_file: str = "results.csv") -> None:
    if not data:
        print("No data to write.")
        return

    fieldnames = ["title", "link"]

    file_exists = os.path.isfile(output_file)

    with open(output_file, mode="w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow({
                "title": row.get("title", "").strip(),
                "link": row.get("link", "").strip(),
            })

    print(f"Wrote {len(data)} records to '{output_file}'.")


def append_to_csv(data: List[Dict[str, str]], output_file: str = "results.csv") -> None:
    if not data:
        print("No data to append.")
        return

    fieldnames = ["title", "link"]
    file_exists = os.path.isfile(output_file)

    with open(output_file, mode="a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        for row in data:
            writer.writerow({
                "title": row.get("title", "").strip(),
                "link": row.get("link", "").strip(),
            })

    print(f"Appended {len(data)} records to '{output_file}'.")


if __name__ == "__main__":
    sample_data = [
        {"title": "Example Page One", "link": "https://example.com/page1"},
        {"title": "Example Page Two", "link": "https://example.com/page2"},
        {"title": "Example Page Three", "link": "https://example.com/page3"},
    ]
    write_to_csv(sample_data, "results.csv")