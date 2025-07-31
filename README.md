

## 熱區圖資料需求

報告頁面包含一個視線熱區圖標籤，用來顯示眼動追蹤結果。
要繪製此圖表，前端需要以下格式的資料陣列：

```ts
interface HeatmapPoint {
  x: number;    // X coordinate of the gaze point in pixels relative to the text
  y: number;    // Y coordinate in pixels
  value: number; // Intensity or dwell time value from 0–1
}
```

Supplying this array as `heatmapData` in the report API response allows the
client to generate the heatmap.

## Reading material JSON schema

Uploaded PDFs are converted to structured JSON before displaying in the app. The
schema is defined in `src/types/index.ts` and summarised below:

```ts
interface ReadingMaterial {
  paragraphs: Array<{
    id: string;
    text: string;
    images?: string[]; // optional images extracted or provided by teachers
  }>;
  vocabulary: Array<{ word: string; explanation: string }>;
}
```

An example is available in the UI at `/schema` for reference.

