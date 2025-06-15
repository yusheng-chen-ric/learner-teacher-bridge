
import { InteractiveReadingText } from "./InteractiveReadingText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-green-100 rounded-full">
          <User className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-600">Student View</h2>
          <p className="text-muted-foreground">Practice reading, vocabulary, and pronunciation</p>
        </div>
      </div>
      <InteractiveReadingText />
    </div>
  );
};
