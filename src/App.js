import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import TopNav from "./components/TopNav";

import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminPage from "./pages/AdminPage";
import AdminInquiries from "./pages/AdminInquiries";
import AdminSpotlight from "./pages/AdminSpotlight";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreatorUploadPage from "./pages/CreatorUploadPage";
import MessagesPage from "./pages/MessagesPage";
import CreatorsDirectoryPage from "./pages/CreatorsDirectoryPage";
import CreatorProfileEditorPage from "./pages/CreatorProfileEditorPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import CreatorProfileSetupPage from "./pages/CreatorProfileSetupPage";
import CreatorPortfolioPage from "./pages/CreatorPortfolioPage";
import CreatorConnectionsPage from "./pages/CreatorConnectionsPage";
import CreatorsHubPage from "./pages/CreatorsHubPage";
import CreatorsCornerPage from "./pages/CreatorsCornerPage";
import FeaturedPage from "./pages/FeaturedPage";
import DebugAuthPage from "./pages/DebugAuthPage";
import VideosPage from "./pages/VideosPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import ExpressionVaultPage from "./pages/ExpressionVaultPage";
import AsetSpotlightPage from "./pages/AsetSpotlightPage";
import SpotlightProfilePage from "./pages/SpotlightProfilePage";

import AsetLoungePage from "./pages/AsetLoungePage";
import PuzzleLibraryPage from "./pages/PuzzleLibraryPage";
import PuzzlePlayPage from "./pages/PuzzlePlayPage";
import MyCreationsPage from "./pages/MyCreationsPage";

import SirensRealmPage from "./pages/SirensRealmPage";
import StoneCollectionPage from "./pages/StoneCollectionPage";
import StoneDetailPage from "./pages/StoneDetailPage";
import PiscesPage from "./pages/PiscesPage";
import AquariusPage from "./pages/AquariusPage";
import GeminiPage from "./pages/GeminiPage";
import LibraPage from "./pages/LibraPage";
import ProtectingTheHomePage from "./pages/ProtectingTheHomePage";
import IntuitionPage from "./pages/IntuitionPage";
import FullMoonPage from "./pages/FullMoonPage";
import BedroomPage from "./pages/BedroomPage";
import FocusPage from "./pages/FocusPage";
import ConfidencePage from "./pages/ConfidencePage";
import LuckPage from "./pages/LuckPage";
import SafeTravelsPage from "./pages/SafeTravelsPage";
import MoonSignPage from "./pages/MoonSignPage";
import RisingSignPage from "./pages/RisingSignPage";
import MotivationPage from "./pages/MotivationPage";
import VeteransPage from "./pages/VeteransPage";
import LovePage from "./pages/LovePage";
import EmotionalHealingPage from "./pages/EmotionalHealingPage";
import CreativeMusePage from "./pages/CreativeMusePage";
import BluePage from "./pages/BluePage";
import ReturnToSenderDeities from "./pages/ReturnToSenderDeities";
import MeditationPage from "./pages/MeditationPage";

import FriendshipPage from "./pages/stones/FriendshipPage";
import PurplePage from "./pages/stones/PurplePage";

import EliteGeneratorPage from "./pages/EliteGeneratorPage";
import SupremeAccessPage from "./pages/SupremeAccessPage";
import TalentPage from "./pages/TalentPage";
import ServicesPage from "./pages/ServicesPage";

function App() {
  return (
    <Router>
      <TopNav />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/media/:id" element={<MediaDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
        <Route path="/admin/spotlight" element={<AdminSpotlight />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/supreme-access" element={<SupremeAccessPage />} />

        <Route path="/upload" element={<CreatorUploadPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/creators" element={<CreatorsDirectoryPage />} />
        <Route path="/creator-profile/edit" element={<CreatorProfileEditorPage />} />
        <Route path="/creator/setup" element={<CreatorProfileSetupPage />} />
        <Route path="/creator/:username" element={<CreatorProfilePage />} />
        <Route path="/creator/:username/portfolio" element={<CreatorPortfolioPage />} />
        <Route path="/creator/:username/followers" element={<CreatorConnectionsPage />} />
        <Route path="/creator/:username/following" element={<CreatorConnectionsPage />} />
        <Route path="/creator-hub" element={<CreatorsHubPage />} />
        <Route path="/creators-corner" element={<CreatorsCornerPage />} />

        <Route path="/featured" element={<FeaturedPage />} />
        <Route path="/aset-spotlight" element={<AsetSpotlightPage />} />
        <Route path="/aset-spotlight/:slug" element={<SpotlightProfilePage />} />
        <Route path="/debug-auth" element={<DebugAuthPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/video/:slug" element={<VideoPlayerPage />} />

        <Route path="/studio/expression-vault" element={<ExpressionVaultPage />} />

        <Route path="/aset-lounge" element={<AsetLoungePage />} />
        <Route path="/aset-lounge/puzzle-library" element={<PuzzleLibraryPage />} />
        <Route path="/aset-lounge/puzzle-play" element={<PuzzlePlayPage />} />
        <Route path="/aset-lounge/my-creations" element={<MyCreationsPage />} />

        <Route path="/sirens-realm" element={<SirensRealmPage />} />
        <Route path="/sirens-realm/stones" element={<StoneCollectionPage />} />
        <Route path="/sirens-realm/stones/:slug" element={<StoneDetailPage />} />
        <Route path="/sirens-realm/pisces" element={<PiscesPage />} />
        <Route path="/sirens-realm/aquarius" element={<AquariusPage />} />
        <Route path="/sirens-realm/gemini" element={<GeminiPage />} />
        <Route path="/sirens-realm/libra" element={<LibraPage />} />
        <Route path="/sirens-realm/protecting-the-home" element={<ProtectingTheHomePage />} />
        <Route path="/sirens-realm/intuition" element={<IntuitionPage />} />
        <Route path="/sirens-realm/full-moon" element={<FullMoonPage />} />
        <Route path="/sirens-realm/bedroom" element={<BedroomPage />} />
        <Route path="/sirens-realm/focus" element={<FocusPage />} />
        <Route path="/sirens-realm/confidence" element={<ConfidencePage />} />
        <Route path="/sirens-realm/luck" element={<LuckPage />} />
        <Route path="/sirens-realm/safe-travels" element={<SafeTravelsPage />} />
        <Route path="/sirens-realm/moon-sign" element={<MoonSignPage />} />
        <Route path="/sirens-realm/rising-sign" element={<RisingSignPage />} />
        <Route path="/sirens-realm/motivation" element={<MotivationPage />} />
        <Route path="/sirens-realm/veterans" element={<VeteransPage />} />
        <Route path="/sirens-realm/love" element={<LovePage />} />
        <Route path="/sirens-realm/emotional-healing" element={<EmotionalHealingPage />} />
        <Route path="/sirens-realm/friendship" element={<FriendshipPage />} />
        <Route path="/sirens-realm/meditation" element={<MeditationPage />} />
        <Route path="/sirens-realm/creative-muse" element={<CreativeMusePage />} />
        <Route path="/sirens-realm/blue" element={<BluePage />} />
        <Route path="/sirens-realm/purple" element={<PurplePage />} />
        <Route path="/sirens-realm/return-to-sender-deities" element={<ReturnToSenderDeities />} />

        <Route path="/elite-generator" element={<EliteGeneratorPage />} />
        <Route path="/studio/writer" element={<Navigate to="/" replace />} />

        <Route path="/talent" element={<TalentPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;