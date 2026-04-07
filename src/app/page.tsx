import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-sm w-full text-center">
        <CardContent>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Open Bank</h1>
          <p className="text-gray-600">אפליקציית בנק לילדים</p>
        </CardContent>
      </Card>
    </div>
  );
}
