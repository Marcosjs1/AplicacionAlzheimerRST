import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { WelcomeScreen, RegisterScreen, LoginScreen } from './components/screens/Onboarding';
import { HomeScreen } from './components/screens/Dashboard';
import { 
    ActivitiesScreen, 
    MemoryGamesScreen, 
    AttentionGamesScreen, 
    CalcGamesScreen
} from './components/screens/Activities';
import { MusicScreen } from './components/screens/MusicScreen';
import { StoriesScreen } from './components/screens/StoriesScreen';
import { AlbumDetailsScreen } from './components/screens/AlbumDetailsScreen';
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
    SupportScreen
} from './components/screens/Profile';
import { MotivationScreen } from './components/screens/MotivationScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import CaregiverLinkFlowScreen from './components/screens/CaregiverLinkFlowScreen';
import { AiChatScreen } from './components/screens/AiChat';
import { 
    LocationScreen, 
    EmotionalSupportScreen, 
    FamilyStimulationScreen,
    CalculationProgressScreen,
    AttentionProgressScreen,
    MemoryProgressScreen
} from './components/screens/FamilyFeatures';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Import New Games
import MemoryMatchEasyScreen from './components/games/memory/MemoryMatchEasyScreen';
import MemorySequenceEasyScreen from './components/games/memory/MemorySequenceEasyScreen';
import CalcEasyScreen from './components/games/calculation/CalcEasyScreen';
import AttentionEasyScreen from './components/games/attention/AttentionEasyScreen';
import AttentionDifferentEasyScreen from './components/games/attention/AttentionDifferentEasyScreen';
import CalcSequenceEasyScreen from './components/games/calculation/CalcSequenceEasyScreen';
import SafeZoneScreen from './components/screens/FamilyFeatures/SafeZoneScreen';
import { useGeofencing } from './hooks/useGeofencing';
import { useGeofenceAlerts } from './hooks/useGeofenceAlerts';

const App: React.FC = () => {
  // Initialize Geofencing Logic
  useGeofencing();
  useGeofenceAlerts();

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        
        {/* Private Routes */}
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        
        {/* Activities Section */}
        <Route path="/activities" element={<ProtectedRoute><ActivitiesScreen /></ProtectedRoute>} />
        <Route path="/memory-games" element={<ProtectedRoute><MemoryGamesScreen /></ProtectedRoute>} />
        
        {/* Memory Games Routes */}
        <Route path="/games/memory/match/easy" element={<ProtectedRoute><MemoryMatchEasyScreen /></ProtectedRoute>} />
        <Route path="/games/memory/sequence/easy" element={<ProtectedRoute><MemorySequenceEasyScreen /></ProtectedRoute>} />

        {/* Calculation Games Routes */}
        <Route path="/games/calculation/easy" element={<ProtectedRoute><CalcEasyScreen /></ProtectedRoute>} />
        <Route path="/games/calculation/sequence/easy" element={<ProtectedRoute><CalcSequenceEasyScreen /></ProtectedRoute>} />

        {/* Attention Games Routes */}
        <Route path="/games/attention/easy" element={<ProtectedRoute><AttentionEasyScreen /></ProtectedRoute>} />
        <Route path="/games/attention/different/easy" element={<ProtectedRoute><AttentionDifferentEasyScreen /></ProtectedRoute>} />

        <Route path="/attention-games" element={<ProtectedRoute><AttentionGamesScreen /></ProtectedRoute>} />
        <Route path="/calc-games" element={<ProtectedRoute><CalcGamesScreen /></ProtectedRoute>} />
        <Route path="/stories" element={<ProtectedRoute><StoriesScreen /></ProtectedRoute>} />
        <Route path="/stories/:albumId" element={<ProtectedRoute><AlbumDetailsScreen /></ProtectedRoute>} />
        <Route path="/music" element={<ProtectedRoute><MusicScreen /></ProtectedRoute>} />
        
        {/* Health Section */}
        <Route path="/health" element={<ProtectedRoute><HealthScreen /></ProtectedRoute>} />
        <Route path="/exercise" element={<ProtectedRoute><ExerciseScreen /></ProtectedRoute>} />
        <Route path="/recipes" element={<ProtectedRoute><RecipesScreen /></ProtectedRoute>} />
        <Route path="/health-record" element={<ProtectedRoute><HealthRecordScreen /></ProtectedRoute>} />
        
        {/* Profile & Utilities Section */}
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} />
        <Route path="/safety" element={<ProtectedRoute><SafetyScreen /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportScreen /></ProtectedRoute>} />
        <Route path="/daily" element={<ProtectedRoute><MotivationScreen /></ProtectedRoute>} />
        <Route path="/motivation" element={<ProtectedRoute><MotivationScreen /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
        <Route path="/link-caregiver" element={<ProtectedRoute><CaregiverLinkFlowScreen /></ProtectedRoute>} />
        
        {/* AI Feature */}
        <Route path="/ai-chat" element={<ProtectedRoute><AiChatScreen /></ProtectedRoute>} />

        {/* Family Specific Routes */}
        <Route path="/safe-zone" element={<ProtectedRoute><SafeZoneScreen /></ProtectedRoute>} />
        <Route path="/location" element={<ProtectedRoute><SafeZoneScreen /></ProtectedRoute>} />
        <Route path="/emotional" element={<ProtectedRoute><EmotionalSupportScreen /></ProtectedRoute>} />
        <Route path="/stimulation" element={<ProtectedRoute><FamilyStimulationScreen /></ProtectedRoute>} />
        <Route path="/progress/calculation" element={<ProtectedRoute><CalculationProgressScreen /></ProtectedRoute>} />
        <Route path="/progress/attention" element={<ProtectedRoute><AttentionProgressScreen /></ProtectedRoute>} />
        <Route path="/progress/memory" element={<ProtectedRoute><MemoryProgressScreen /></ProtectedRoute>} />

      </Routes>
    </HashRouter>
  );
};

export default App;