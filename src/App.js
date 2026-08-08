import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import TopNav from "./components/TopNav";

import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import PhotographyStudioPage from "./pages/PhotographyStudioPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import FavoritesPage from "./pages/FavoritesPage";

import AdminPage from "./pages/AdminPage";
import AdminInquiries from "./pages/AdminInquiries";
import AdminSpotlight from "./pages/AdminSpotlight";
import AdminPhotographyPage from "./pages/AdminPhotographyPage";
import AdminGalleryPage from "./pages/AdminGalleryPage";
import AdminBeautyApplications from "./pages/AdminBeautyApplications";
import AdminManagersPage from "./pages/AdminManagersPage";
import BrickAdminPage from "./pages/BrickAdminPage";

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

import BrickByBrickPage from "./pages/BrickByBrickPage";
import BrickSoundtrackPage from "./pages/BrickSoundtrackPage";
import BrickSongPage from "./pages/BrickSongPage";
import BrickSocialHub from "./pages/BrickSocialHub";

import DiamondVaultPage from "./pages/DiamondVaultPage";
import ExpressionVaultPage from "./pages/ExpressionVaultPage";

import AsetSpotlightPage from "./pages/AsetSpotlightPage";
import SpotlightProfilePage from "./pages/SpotlightProfilePage";

import ManagersPage from "./pages/ManagersPage";
import ManagerProfilePage from "./pages/ManagerProfilePage";

import CollectivesPage from "./pages/CollectivesPage";
import AsetBeautyCollectivePage from "./pages/AsetBeautyCollectivePage";
import MakeupArtistsPage from "./pages/MakeupArtistsPage";
import HairstylistsPage from "./pages/HairstylistsPage";
import WigArtistsPage from "./pages/WigArtistsPage";
import GroomingArtistsPage from "./pages/GroomingArtistsPage";
import NailArtistsPage from "./pages/NailArtistsPage";
import SfxMakeupArtistsPage from "./pages/SfxMakeupArtistsPage";
import BeautyCompaniesPage from "./pages/BeautyCompaniesPage";
import BeautyApplyPage from "./pages/BeautyApplyPage";

import AsetLoungePage from "./pages/AsetLoungePage";
import PuzzleLibraryPage from "./pages/PuzzleLibraryPage";
import PuzzlePlayPage from "./pages/PuzzlePlayPage";
import MyCreationsPage from "./pages/MyCreationsPage";

import EliteGeneratorPage from "./pages/EliteGeneratorPage";
import SupremeAccessPage from "./pages/SupremeAccessPage";
import TalentPage from "./pages/TalentPage";
import ServicesPage from "./pages/ServicesPage";

function App() {
  return (
    <Router>
      <TopNav />

      <Routes>
        {/* MAIN STUDIO */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route
          path="/photography-studio"
          element={<PhotographyStudioPage />}
        />
        <Route path="/media/:id" element={<MediaDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/talent" element={<TalentPage />} />

        {/* COLLECTIVES */}
        <Route path="/collectives" element={<CollectivesPage />} />
        <Route
          path="/collectives/beauty"
          element={<AsetBeautyCollectivePage />}
        />
        <Route
          path="/collectives/beauty/makeup-artists"
          element={<MakeupArtistsPage />}
        />
        <Route
          path="/collectives/beauty/hairstylists"
          element={<HairstylistsPage />}
        />
        <Route
          path="/collectives/beauty/wig-artists"
          element={<WigArtistsPage />}
        />
        <Route
          path="/collectives/beauty/grooming-artists"
          element={<GroomingArtistsPage />}
        />
        <Route
          path="/collectives/beauty/nail-artists"
          element={<NailArtistsPage />}
        />
        <Route
          path="/collectives/beauty/sfx-makeup-artists"
          element={<SfxMakeupArtistsPage />}
        />
        <Route
          path="/collectives/beauty/companies"
          element={<BeautyCompaniesPage />}
        />
        <Route
          path="/collectives/beauty/apply"
          element={<BeautyApplyPage />}
        />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminPage />} />

        <Route
          path="/admin/inquiries"
          element={<AdminInquiries />}
        />

        <Route
          path="/admin/spotlight"
          element={<AdminSpotlight />}
        />

        <Route
          path="/admin/photography"
          element={<AdminPhotographyPage />}
        />

        <Route
          path="/admin/gallery"
          element={<AdminGalleryPage />}
        />

        <Route
          path="/admin/beauty-applications"
          element={<AdminBeautyApplications />}
        />

        <Route
          path="/admin/managers"
          element={<AdminManagersPage />}
        />

        <Route
          path="/brick-admin"
          element={<BrickAdminPage />}
        />

        {/* AUTH */}
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        {/* CREATOR NETWORK */}
        <Route
          path="/upload"
          element={<CreatorUploadPage />}
        />

        <Route
          path="/messages"
          element={<MessagesPage />}
        />

        <Route
          path="/creators"
          element={<CreatorsDirectoryPage />}
        />

        <Route
          path="/creator-profile/edit"
          element={<CreatorProfileEditorPage />}
        />

        <Route
          path="/creator/setup"
          element={<CreatorProfileSetupPage />}
        />

        <Route
          path="/creator/:username"
          element={<CreatorProfilePage />}
        />

        <Route
          path="/creator/:username/portfolio"
          element={<CreatorPortfolioPage />}
        />

        <Route
          path="/creator/:username/followers"
          element={<CreatorConnectionsPage />}
        />

        <Route
          path="/creator/:username/following"
          element={<CreatorConnectionsPage />}
        />

        <Route
          path="/creator-hub"
          element={<CreatorsHubPage />}
        />

        <Route
          path="/creators-corner"
          element={<CreatorsCornerPage />}
        />

        {/* FEATURED, SPOTLIGHT, MANAGERS */}
        <Route
          path="/featured"
          element={<FeaturedPage />}
        />

        <Route
          path="/aset-spotlight"
          element={<AsetSpotlightPage />}
        />

        <Route
          path="/aset-spotlight/:slug"
          element={<SpotlightProfilePage />}
        />

        <Route
          path="/managers"
          element={<ManagersPage />}
        />

        <Route
          path="/managers/:slug"
          element={<ManagerProfilePage />}
        />

        <Route
          path="/debug-auth"
          element={<DebugAuthPage />}
        />

        {/* CINEMA */}
        <Route
          path="/videos"
          element={<VideosPage />}
        />

        <Route
          path="/video/:slug"
          element={<VideoPlayerPage />}
        />

        {/* BRICK BY BRICK */}
        <Route
          path="/brick-by-brick"
          element={<BrickByBrickPage />}
        />

        <Route
          path="/brick-by-brick/soundtrack"
          element={<BrickSoundtrackPage />}
        />

        <Route
          path="/brick-by-brick/music/that-crown-love"
          element={<BrickSongPage />}
        />

        <Route
          path="/brick-social"
          element={<BrickSocialHub />}
        />

        {/* VAULTS */}
        <Route
          path="/diamond-vault"
          element={<DiamondVaultPage />}
        />

        <Route
          path="/studio/expression-vault"
          element={<ExpressionVaultPage />}
        />

        {/* ASET LOUNGE */}
        <Route
          path="/aset-lounge"
          element={<AsetLoungePage />}
        />

        <Route
          path="/aset-lounge/puzzle-library"
          element={<PuzzleLibraryPage />}
        />

        <Route
          path="/aset-lounge/puzzle-play"
          element={<PuzzlePlayPage />}
        />

        <Route
          path="/aset-lounge/my-creations"
          element={<MyCreationsPage />}
        />

        {/* ACCESS */}
        <Route
          path="/supreme-access"
          element={<SupremeAccessPage />}
        />

        <Route
          path="/elite-generator"
          element={<EliteGeneratorPage />}
        />

        {/* LEGACY REDIRECT */}
        <Route
          path="/studio/writer"
          element={<Navigate to="/" replace />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;