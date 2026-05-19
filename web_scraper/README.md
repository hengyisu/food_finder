# 自動化網路爬蟲 - Playwright Web Scraper

## 專案簡介

本專案使用 Playwright 自動化瀏覽器技術，爬取指定網頁的所有標題與連結，並將結果儲存為 CSV 檔案，方便後續資料分析與處理。

## 功能特色

- 使用 Playwright 模擬真實瀏覽器行為，可處理動態載入頁面
- 自動擷取頁面中所有 `<a>` 標籤的文字標題與 href 連結
- 去除重複連結，確保資料品質
- 結果自動儲存為 UTF-8 編碼的 CSV 檔案
- 支援自訂目標 URL

## 環境需求

- Python 3.8 以上
- pip 套件管理工具

## 安裝步驟

**1. 複製專案或進入專案目錄**

```
cd food_finder
```

**2. 建立虛擬環境（建議）**

```
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows
```

**3. 安裝 Python 套件**

```
pip install -r requirements.txt
```

**4. 安裝 Playwright 瀏覽器核心**

```
playwright install chromium
```

## 執行方式

```
python scraper.py
```

執行後程式會：

1. 開啟 Chromium 瀏覽器（無頭模式）
2. 前往設定的目標網址
3. 擷取所有標題與連結
4. 將結果儲存為 `output.csv`

## 輸出格式

CSV 檔案包含以下欄位：

| 欄位名稱 | 說明 |
|----------|------|
| title    | 連結的顯示文字（標題） |
| url      | 完整的連結網址 |

範例輸出（`output.csv`）：

```
title,url
首頁,https://example.com/
關於我們,https://example.com/about
最新消息,https://example.com/news
```

## 自訂目標網址

開啟 `scraper.py`，修改以下變數：

```
TARGET_URL = "https://your-target-website.com"
```

## 專案結構

```
food_finder/
├── scraper.py          # 主程式
├── requirements.txt    # Python 套件清單
├── output.csv          # 爬取結果（執行後產生）
└── README.md           # 專案說明文件
```

## 注意事項

- 請遵守目標網站的 `robots.txt` 規範與使用條款
- 避免對同一網站發送過於頻繁的請求
- 部分網站可能有反爬蟲機制，需額外處理