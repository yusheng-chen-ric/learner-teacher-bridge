

## Heatmap data requirements

The report page includes a gaze heatmap tab that visualizes eye tracking results.
To render this chart the frontend expects an array of data points with the
following shape:

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
