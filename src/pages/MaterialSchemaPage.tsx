import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const example = {
  paragraphs: [
    {
      id: "p1",
      text: "Emma has been learning English for two years. She finds reading comprehension relatively easy...",
      images: ["https://example.com/p1.png"]
    },
    {
      id: "p2",
      text: "Her teacher believes that with consistent practice Emma will become more fluent...",
      images: []
    }
  ],
  vocabulary: [
    {
      word: "comprehension",
      explanation: "The ability to understand something"
    },
    {
      word: "fluent",
      explanation: "Able to speak a language easily and well"
    }
  ]
};

export const MaterialSchemaPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Reading Material Schema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            OCR results from uploaded PDFs are stored using this structure.
          </p>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
{`interface ReadingMaterial {
  paragraphs: Array<{
    id: string;
    text: string;
    images?: string[]; // optional image URLs or base64 data
  }>;
  vocabulary: Array<{ word: string; explanation: string }>;
}`}
          </pre>
          <p className="text-sm text-gray-600">Example output:</p>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
{JSON.stringify(example, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialSchemaPage;
