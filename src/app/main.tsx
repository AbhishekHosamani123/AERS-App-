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

/* --font-family token used by global.css */
import './fonts.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="app-viewport">
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/search" element={<SearchResultsScreen />} />
            <Route path="/booking/seats" element={<SeatSelectionScreen />} />
            <Route path="/booking/passengers" element={<PassengerDetailsScreen />} />
            <Route path="/booking/payment" element={<PaymentScreen />} />
            <Route path="/ticket/:bookingId" element={<TicketScreen />} />
            <Route path="/trips" element={<TripsScreen />} />
            <Route path="/journey" element={<TripsScreen />} />
            <Route path="/offers" element={<OffersScreen />} />
            <Route path="/help" element={<HelpScreen />} />
            <Route path="/account" element={<AccountScreen />} />
            <Route path="/account/login" element={<LoginScreen />} />
            <Route path="/account/otp" element={<OtpScreen />} />
            <Route path="/account/settings" element={<SettingsScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>
);
