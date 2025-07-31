

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

在報告 API 的回應中提供 `heatmapData` 陣列，即可讓前端產生熱區圖。
