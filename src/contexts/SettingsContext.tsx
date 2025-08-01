import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface GazeSettings {
  fixationThreshold: number;
  regressionCount: number;
  distractionTimeout: number;
  nodMovementThreshold: number;
  soundEnabled: boolean;
  gazeTrackingEnabled: boolean;
  language: 'en' | 'zh';
}

const defaultSettings: GazeSettings = {
  fixationThreshold: 800, // ms for word popup trigger
  regressionCount: 3, // times before marking as difficult
  distractionTimeout: 3000, // ms before distraction alert
  nodMovementThreshold: 20, // px for gaze-based nod detection fallback
  soundEnabled: true,
  gazeTrackingEnabled: true,
  language: 'en'
};

interface SettingsContextType {
  settings: GazeSettings;
  updateSettings: (updates: Partial<GazeSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<GazeSettings>(() => {
    // Load settings from localStorage if available
    const stored = localStorage.getItem('gazeSettings');
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
    return defaultSettings;
  });

  const updateSettings = useCallback((updates: Partial<GazeSettings>) => {
    setSettings(prev => {
      // Validate settings before applying
      const validatedUpdates: Partial<GazeSettings> = {};
      
      if (updates.fixationThreshold !== undefined) {
        const threshold = Number(updates.fixationThreshold);
        if (!isNaN(threshold) && threshold >= 100 && threshold <= 5000) {
          validatedUpdates.fixationThreshold = threshold;
        } else {
          console.warn('Invalid fixation threshold:', updates.fixationThreshold);
        }
      }
      
      if (updates.regressionCount !== undefined) {
        const count = Number(updates.regressionCount);
        if (!isNaN(count) && count >= 1 && count <= 20) {
          validatedUpdates.regressionCount = count;
        } else {
          console.warn('Invalid regression count:', updates.regressionCount);
        }
      }
      
      if (updates.distractionTimeout !== undefined) {
        const timeout = Number(updates.distractionTimeout);
        if (!isNaN(timeout) && timeout >= 1000 && timeout <= 10000) {
          validatedUpdates.distractionTimeout = timeout;
        } else {
          console.warn('Invalid distraction timeout:', updates.distractionTimeout);
        }
      }
      
      if (updates.nodMovementThreshold !== undefined) {
        const threshold = Number(updates.nodMovementThreshold);
        if (!isNaN(threshold) && threshold >= 5 && threshold <= 100) {
          validatedUpdates.nodMovementThreshold = threshold;
        } else {
          console.warn('Invalid nod movement threshold:', updates.nodMovementThreshold);
        }
      }
      
      // Boolean and enum validations
      if (typeof updates.soundEnabled === 'boolean') {
        validatedUpdates.soundEnabled = updates.soundEnabled;
      }
      
      if (typeof updates.gazeTrackingEnabled === 'boolean') {
        validatedUpdates.gazeTrackingEnabled = updates.gazeTrackingEnabled;
      }
      
      if (updates.language === 'en' || updates.language === 'zh') {
        validatedUpdates.language = updates.language;
      }
      
      const newSettings = { ...prev, ...validatedUpdates };
      
      try {
        localStorage.setItem('gazeSettings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
      }
      
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.setItem('gazeSettings', JSON.stringify(defaultSettings));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};