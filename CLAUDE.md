# CLAUDE.md

本文件為 Claude Code (claude.ai/code) 在此儲存庫中工作時提供指引。

## 常用指令

```
npm install       # 安裝依賴套件
npm run dev       # 啟動 Vite 開發伺服器，網址為 http://localhost:3000（會自動開啟瀏覽器）
npm run build     # 產生正式環境建置檔案，輸出至 build/
```

`package.json` 中並未設定 lint、typecheck 或 test 指令 — 不要假設有 `npm run lint`／`npm test` 這類指令。專案中也沒有 `tsconfig.json`；TypeScript 的編譯是由 Vite/SWC 的 React 外掛（`@vitejs/plugin-react-swc`）隱含處理，該外掛只會移除型別標註，並不會做型別檢查。要驗證程式碼是否正確，請執行 `npm run dev` 並在瀏覽器中檢查應用程式（或執行 `npm run build` 以抓出語法錯誤）。

## 架構

這是一個從 Figma Make 匯出的單頁尋寶遊戲（依據：`src/components/figma/`、`vite.config.ts` 中帶版本號的套件別名、shadcn/ui 元件組）。這是一個很小的應用程式 — 幾乎所有遊戲邏輯都集中在同一個檔案中。

- **`src/main.tsx`** — 進入點，將 `App` 掛載到 `#root`。
- **`src/App.tsx`** — 整個遊戲的核心：狀態（`boxes`、`score`、`gameEnded`）、遊戲邏輯（`initializeGame`、`openBox`、`resetGame`），以及所有的渲染與動畫。每一輪會產生三個箱子，其中一個會被隨機指定藏有寶藏；打開箱子會依結果 +$100（寶藏）或 -$50（骷髏），當找到寶藏或所有箱子都被打開時，該輪結束。動畫使用 `motion/react`（Motion，Framer Motion 的後繼者）來呈現箱子翻轉／揭曉的過渡效果。
- **`src/components/ui/`** — 基於 Radix UI 的 shadcn/ui 元件（accordion、dialog、dropdown 等）。目前 `App.tsx` 只使用了其中的 `button.tsx`；其餘元件是 Figma Make 匯出時附帶的骨架，若日後擴充 UI 可直接取用。
- **`src/components/figma/ImageWithFallback.tsx`** — Figma Make 專屬的圖片包裝元件，當圖片載入失敗時會替換成預留位置 SVG。這是框架自動注入的檔案，應視為第三方程式碼，不需手動修改。
- **`src/assets/`** ／ **`src/audios/`** — 箱子與鑰匙的圖片、音效（開箱聲、開箱後邪惡笑聲），皆透過 ES module 直接 import（例如 `import chestOpenSound from './audios/chest_open.mp3'`），而非放在 public 資料夾中以路徑方式引用。
- **`src/index.css`** — Tailwind v4 產生的 CSS 輸出檔；不應手動編輯。
- **`src/styles/globals.css`** — Tailwind v4 的主題設定：以 CSS 自訂屬性定義設計 token（顏色使用 oklch、圓角、sidebar／chart 色盤），並透過 `@custom-variant dark` 定義深色模式變體。

### Vite 設定的特殊之處

`vite.config.ts` 將帶版本號的 import 名稱做了別名對應（例如 `'lucide-react@0.487.0'` → `'lucide-react'`、`'@radix-ui/react-dialog@1.1.6'` → `'@radix-ui/react-dialog'`）。這是 Figma Make 匯出時留下的產物 — 部分原始檔案的 import 名稱仍可能帶有 `@version` 後綴，而這個別名表就是讓這些 import 能正確解析的關鍵。若之後從 Figma Make 匯出內容複製新的 shadcn/ui 風格元件，記得檢查是否有帶版本號的 import，並移除版本後綴或新增對應的別名。

## 補充說明

- 本儲存庫中的 `README.md` 並非專案文件 — 它其實是一份 Claude Code 功能（記憶、截圖、plan mode、自訂指令）的操作腳本，用於工作坊／示範用途。不要將其內容當作專案的設定說明。
- `src/guidelines/Guidelines.md` 是 Figma Make 尚未填寫的 AI 指引範本，目前尚未加入任何專案專屬規則。
