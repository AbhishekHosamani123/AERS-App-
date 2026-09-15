/* ============================================================
   AERS AI Study Chatbot Screen (Dedicated Help Tab)
   ============================================================ */

import { AppHeader } from '../components/ui/AppHeader';
import { StudyChatbot } from '../components/chat/StudyChatbot';
import './HelpScreen.css';

export function HelpScreen() {
  return (
    <div className="help-screen">
      {/* Unified App Header */}
      <AppHeader />

      {/* Dedicated AI Study Chatbot */}
      <main className="help-screen__main">
        <StudyChatbot />
      </main>
    </div>
  );
}
