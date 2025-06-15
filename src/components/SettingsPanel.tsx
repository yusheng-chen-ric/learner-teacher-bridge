
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Eye, Volume2, Languages, Target } from "lucide-react";

export const SettingsPanel = ({ onClose }: { onClose: () => void }) => {
  const [dwellTime, setDwellTime] = useState([500]);
  const [regressionCount, setRegressionCount] = useState([3]);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gazeTrackingEnabled, setGazeTrackingEnabled] = useState(true);
  const [calibrationComplete, setCalibrationComplete] = useState(false);

  const startCalibration = () => {
    console.log("Starting gaze calibration...");
    // Simulate calibration process
    setTimeout(() => {
      setCalibrationComplete(true);
    }, 3000);
  };

  const resetSettings = () => {
    setDwellTime([500]);
    setRegressionCount([3]);
    setLanguage('en');
    setSoundEnabled(true);
    setGazeTrackingEnabled(true);
  };

  const CalibrationTargets = () => (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div className="absolute top-4 left-4">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-600 text-center mt-16">
          Look at each red dot for 2 seconds<br/>
          <span className="text-sm">Step 3/5</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <Card 
        className="w-[90vw] max-w-4xl h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Settings className="h-6 w-6 text-blue-600 mr-2" />
              Settings & Calibration
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        
        <CardContent className="h-full overflow-y-auto">
          <Tabs defaultValue="calibration" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calibration">Calibration</TabsTrigger>
              <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
              <TabsTrigger value="interface">Interface</TabsTrigger>
              <TabsTrigger value="language">Language</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calibration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    Gaze Calibration Tool
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Calibrate the eye tracker for accurate gaze detection
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calibrationComplete ? (
                    <div className="text-center space-y-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ✓ Calibration Complete
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Eye tracking is ready for use. Recalibrate if you experience accuracy issues.
                      </p>
                      <Button variant="outline" onClick={() => setCalibrationComplete(false)}>
                        Recalibrate
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CalibrationTargets />
                      <div className="text-center space-y-2">
                        <Button onClick={startCalibration} className="bg-red-600 hover:bg-red-700">
                          Start Calibration
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Ensure good lighting and sit 50-70cm from the screen
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="thresholds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interaction Thresholds</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Adjust sensitivity for vocabulary and assistance triggers
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Vocabulary Popup Dwell Time: {dwellTime[0]}ms
                    </label>
                    <Slider
                      value={dwellTime}
                      onValueChange={setDwellTime}
                      max={2000}
                      min={200}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Time to look at a word before definition appears
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Regression Alert Count: {regressionCount[0]}
                    </label>
                    <Slider
                      value={regressionCount}
                      onValueChange={setRegressionCount}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of regressions before marking as difficult
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interface" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-blue-600" />
                    Interface Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Gaze Tracking Overlay</label>
                      <p className="text-xs text-muted-foreground">Show real-time gaze position</p>
                    </div>
                    <Switch
                      checked={gazeTrackingEnabled}
                      onCheckedChange={setGazeTrackingEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium flex items-center">
                        <Volume2 className="h-4 w-4 mr-1" />
                        Sound Effects
                      </label>
                      <p className="text-xs text-muted-foreground">Audio feedback for interactions</p>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="language" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Languages className="h-5 w-5 mr-2 text-green-600" />
                    Language Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Interface Language</label>
                    <div className="mt-2 space-y-2">
                      <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        onClick={() => setLanguage('en')}
                        className="w-full justify-start"
                      >
                        English
                      </Button>
                      <Button
                        variant={language === 'zh' ? 'default' : 'outline'}
                        onClick={() => setLanguage('zh')}
                        className="w-full justify-start"
                      >
                        中文 (Chinese)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
