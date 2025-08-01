
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Eye, Volume2, Languages, Target } from "lucide-react";

export const SettingsPanel = ({ onClose }: { onClose: () => void }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  
  // Local state for sliders (arrays for compatibility with Slider component)
  const [dwellTime, setDwellTime] = useState([settings.fixationThreshold]);
  const [regressionCount, setRegressionCount] = useState([settings.regressionCount]);

  const startCalibration = () => {
    console.log("Starting gaze calibration...");
    // Simulate calibration process
    setTimeout(() => {
      setCalibrationComplete(true);
    }, 3000);
  };

  const handleResetSettings = () => {
    resetSettings();
    setDwellTime([800]);
    setRegressionCount([3]);
  };

  const handleSaveSettings = () => {
    updateSettings({
      fixationThreshold: dwellTime[0],
      regressionCount: regressionCount[0]
    });
    onClose();
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
              設定與校準
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        
        <CardContent className="h-full overflow-y-auto">
          <Tabs defaultValue="calibration" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calibration">校準</TabsTrigger>
              <TabsTrigger value="thresholds">觸發門檻</TabsTrigger>
              <TabsTrigger value="interface">介面</TabsTrigger>
              <TabsTrigger value="language">語言</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calibration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    視線校準工具
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    校準眼動追蹤器以獲得準確偵測
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calibrationComplete ? (
                    <div className="text-center space-y-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ✓ 校準完成
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        眼動追蹤已就緒，如有不準可重新校準。
                      </p>
                      <Button variant="outline" onClick={() => setCalibrationComplete(false)}>
                        重新校準
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CalibrationTargets />
                      <div className="text-center space-y-2">
                        <Button onClick={startCalibration} className="bg-red-600 hover:bg-red-700">
                          開始校準
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          請保持光線充足並距離螢幕 50-70cm
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
                  <CardTitle className="text-lg">互動門檻設定</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    調整單字與協助觸發的靈敏度
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      單字視窗停留時間：{dwellTime[0]}ms
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
                        注視單字多久後顯示定義
                      </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      回視警示次數：{regressionCount[0]}
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
                      回視達此次數即標記為困難
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
                    <label className="text-sm font-medium">顯示視線軌跡</label>
                      <p className="text-xs text-muted-foreground">即時顯示視線位置</p>
                    </div>
                    <Switch
                      checked={settings.gazeTrackingEnabled}
                      onCheckedChange={(checked) => updateSettings({ gazeTrackingEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium flex items-center">
                        <Volume2 className="h-4 w-4 mr-1" />
                        音效
                      </label>
                      <p className="text-xs text-muted-foreground">互動時播放聲音反饋</p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
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
                    <label className="text-sm font-medium">介面語言</label>
                    <div className="mt-2 space-y-2">
                      <Button
                        variant={settings.language === 'en' ? 'default' : 'outline'}
                        onClick={() => updateSettings({ language: 'en' })}
                        className="w-full justify-start"
                      >
                        English
                      </Button>
                      <Button
                        variant={settings.language === 'zh' ? 'default' : 'outline'}
                        onClick={() => updateSettings({ language: 'zh' })}
                        className="w-full justify-start"
                      >
                        中文
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleResetSettings}>
              回復預設
            </Button>
            <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
              儲存設定
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
