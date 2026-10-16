import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../design/tokens.css';
import '../design/global.css';
import { AppShell } from './AppShell';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen';
import { SeatSelectionScreen } from '../screens/SeatSelectionScreen';
import { PassengerDetailsScreen } from '../screens/PassengerDetailsScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { TicketScreen } from '../screens/TicketScreen';
import { TripsScreen } from '../screens/TripsScreen';
import { OffersScreen } from '../screens/OffersScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { LessonDetailScreen } from '../screens/LessonDetailScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { FinalDemonstrationScreen } from '../screens/FinalDemonstrationScreen';
import { PassportScreen } from '../screens/PassportScreen';
import { FacultyDashboard } from '../screens/faculty/FacultyDashboard';

/* --font-family token used by global.css */
import './fonts.css';

/**
 * Mobile App Layout wrapper: Constrains only the student mobile app
 * to the phone frame viewport on desktop, full-bleed on mobile devices.
 */
const StudentAppShellLayout = () => {
  return (
    <div className="app-viewport">
      <AppShell />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ========================================================= */}
        {/* COLLEGE FACULTY / PRINCIPAL / HOD WEB ANALYTICS DASHBOARD */}
        {/* Full-width responsive web application (No mobile frame)    */}
        {/* ========================================================= */}
        <Route path="/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/admin" element={<FacultyDashboard />} />

        {/* ========================================================= */}
        {/* STUDENT MOBILE APP EXPERIENCES                            */}
        {/* ========================================================= */}
        <Route element={<StudentAppShellLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/search" element={<SearchResultsScreen />} />
          <Route path="/booking/seats" element={<SeatSelectionScreen />} />
          <Route path="/booking/passengers" element={<PassengerDetailsScreen />} />
          <Route path="/booking/payment" element={<PaymentScreen />} />
          <Route path="/ticket/:bookingId" element={<TicketScreen />} />
          <Route path="/trips" element={<TripsScreen />} />
          <Route path="/journey" element={<TripsScreen />} />
          <Route path="/journey/level/:levelId" element={<LessonDetailScreen />} />
          <Route path="/journey/level-1" element={<LessonDetailScreen levelId={1} />} />
          <Route path="/journey/level-2" element={<LessonDetailScreen levelId={2} />} />
          <Route path="/journey/level-3" element={<LessonDetailScreen levelId={3} />} />
          <Route path="/journey/level-4" element={<LessonDetailScreen levelId={4} />} />
          <Route path="/journey/level-5" element={<LessonDetailScreen levelId={5} />} />
          <Route path="/journey/level-6" element={<LessonDetailScreen levelId={6} />} />
          <Route path="/journey/level-7" element={<LessonDetailScreen levelId={7} />} />
          <Route path="/journey/level-8" element={<LessonDetailScreen levelId={8} />} />
          <Route path="/journey/level-9" element={<LessonDetailScreen levelId={9} />} />
          <Route path="/journey/level-10" element={<LessonDetailScreen levelId={10} />} />
          <Route path="/journey/level-11" element={<LessonDetailScreen levelId={11} />} />
          <Route path="/journey/level-12" element={<LessonDetailScreen levelId={12} />} />
          <Route path="/journey/level-13" element={<LessonDetailScreen levelId={13} />} />
          <Route path="/journey/level-14" element={<LessonDetailScreen levelId={14} />} />
          <Route path="/journey/level-15" element={<LessonDetailScreen levelId={15} />} />
          <Route path="/journey/level-16" element={<LessonDetailScreen levelId={16} />} />
          <Route path="/journey/level-17" element={<LessonDetailScreen levelId={17} />} />
          <Route path="/journey/level-18" element={<LessonDetailScreen levelId={18} />} />
          <Route path="/journey/level-19" element={<LessonDetailScreen levelId={19} />} />
          <Route path="/journey/level-20" element={<LessonDetailScreen levelId={20} />} />
          <Route path="/journey/level-21" element={<LessonDetailScreen levelId={21} />} />
          <Route path="/journey/level-22" element={<LessonDetailScreen levelId={22} />} />
          <Route path="/journey/level-23" element={<LessonDetailScreen levelId={23} />} />
          <Route path="/journey/level-24" element={<LessonDetailScreen levelId={24} />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/journey/final-demonstration" element={<FinalDemonstrationScreen />} />
          <Route path="/journey/passport" element={<PassportScreen />} />
          <Route path="/offers" element={<OffersScreen />} />
          <Route path="/help" element={<HelpScreen />} />
          <Route path="/account" element={<AccountScreen />} />
          <Route path="/passport" element={<Navigate to="/account?passport=true" replace />} />
          <Route path="/account/passport" element={<Navigate to="/account?passport=true" replace />} />
          <Route path="/account/login" element={<LoginScreen />} />
          <Route path="/account/otp" element={<OtpScreen />} />
          <Route path="/account/settings" element={<SettingsScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
