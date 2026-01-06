import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { WelcomeScreen, RegisterScreen } from './components/screens/Onboarding';
import { HomeScreen } from './components/screens/Dashboard';
import { 
    ActivitiesScreen, 
    MemoryGamesScreen, 
    AttentionGamesScreen, 
    CalcGamesScreen, 
    StoriesScreen, 
    MusicScreen 
} from './components/screens/Activities';
import { 
    HealthScreen, 
    ExerciseScreen, 
    RecipesScreen, 
    HealthRecordScreen 
} from './components/screens/Health';
import { 
    ProfileScreen, 
    HelpScreen, 
    SafetyScreen, 
    SupportScreen, 
    DailyScreen, 
    ProgressScreen,
    LinkCaregiverScreen
} from './components/screens/Profile';
import { AiChatScreen } from './components/screens/AiChat';
import { 
    LocationScreen, 
    EmotionalSupportScreen, 
    FamilyStimulationScreen,
    CalculationProgressScreen,
    AttentionProgressScreen,
    MemoryProgressScreen
} from './components/screens/FamilyFeatures';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        
        {/* Main Dashboard (Adapts to Role) */}
        <Route path="/home" element={<HomeScreen />} />
        
        {/* Activities Section */}
        <Route path="/activities" element={<ActivitiesScreen />} />
        <Route path="/memory-games" element={<MemoryGamesScreen />} />
        <Route path="/attention-games" element={<AttentionGamesScreen />} />
        <Route path="/calc-games" element={<CalcGamesScreen />} />
        <Route path="/stories" element={<StoriesScreen />} />
        <Route path="/music" element={<MusicScreen />} />
        
        {/* Health Section */}
        <Route path="/health" element={<HealthScreen />} />
        <Route path="/exercise" element={<ExerciseScreen />} />
        <Route path="/recipes" element={<RecipesScreen />} />
        <Route path="/health-record" element={<HealthRecordScreen />} />
        
        {/* Profile & Utilities Section */}
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/help" element={<HelpScreen />} />
        <Route path="/safety" element={<SafetyScreen />} />
        <Route path="/support" element={<SupportScreen />} />
        <Route path="/daily" element={<DailyScreen />} /> {/* This acts as Motivation for Family */}
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/link-caregiver" element={<LinkCaregiverScreen />} />
        
        {/* AI Feature */}
        <Route path="/ai-chat" element={<AiChatScreen />} />

        {/* Family Specific Routes */}
        <Route path="/location" element={<LocationScreen />} />
        <Route path="/emotional" element={<EmotionalSupportScreen />} />
        <Route path="/stimulation" element={<FamilyStimulationScreen />} />
        <Route path="/progress/calculation" element={<CalculationProgressScreen />} />
        <Route path="/progress/attention" element={<AttentionProgressScreen />} />
        <Route path="/progress/memory" element={<MemoryProgressScreen />} />

      </Routes>
    </HashRouter>
  );
};

export default App;