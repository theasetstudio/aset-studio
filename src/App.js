import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import TopNav from "./components/TopNav";

/* ==========================================
   MAIN STUDIO
========================================== */

import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import PhotographyStudioPage from "./pages/PhotographyStudioPage";
import AfterDarkPage from "./pages/AfterDarkPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ServicesPage from "./pages/ServicesPage";
import TalentPage from "./pages/TalentPage";

/* ==========================================
   ADMIN
========================================== */

import AdminPage from "./pages/AdminPage";
import AdminInquiries from "./pages/AdminInquiries";
import AdminSpotlight from "./pages/AdminSpotlight";
import AdminPhotographyPage from "./pages/AdminPhotographyPage";
import AdminGalleryPage from "./pages/AdminGalleryPage";
import AdminAfterDarkPage from "./pages/AdminAfterDarkPage";
import AdminBeautyApplications from "./pages/AdminBeautyApplications";
import AdminManagersPage from "./pages/AdminManagersPage";
import AdminAsetPage from "./pages/AdminAsetPage";

/* ==========================================
   AUTH
========================================== */

import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import ResetPasswordPage from "./pages/ResetPasswordPage";

/* ==========================================
   CREATOR NETWORK
========================================== */

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

/* ==========================================
   FEATURED / DEBUG
========================================== */

import FeaturedPage from "./pages/FeaturedPage";
import DebugAuthPage from "./pages/DebugAuthPage";

/* ==========================================
   ASET CINEMA
========================================== */

import VideosPage from "./pages/VideosPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";

/* ==========================================
   VAULTS
========================================== */

import DiamondVaultPage from "./pages/DiamondVaultPage";
import ExpressionVaultPage from "./pages/ExpressionVaultPage";

/* ==========================================
   ASET MAGAZINE
========================================== */

import AsetMagazinePage from "./pages/AsetMagazinePage";
import AsetArticlePage from "./pages/AsetArticlePage";
import AsetIssuePage from "./pages/AsetIssuePage";

/* ==========================================
   ASET SPOTLIGHT
========================================== */

import AsetSpotlightPage from "./pages/AsetSpotlightPage";
import SpotlightProfilePage from "./pages/SpotlightProfilePage";

/* ==========================================
   MANAGERS
========================================== */

import ManagersPage from "./pages/ManagersPage";
import ManagerProfilePage from "./pages/ManagerProfilePage";

/* ==========================================
   COLLECTIVES
========================================== */

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

/* ==========================================
   ASET LOUNGE
========================================== */

import AsetLoungePage from "./pages/AsetLoungePage";
import PuzzleLibraryPage from "./pages/PuzzleLibraryPage";
import PuzzlePlayPage from "./pages/PuzzlePlayPage";
import MyCreationsPage from "./pages/MyCreationsPage";

/* ==========================================
   ACCESS
========================================== */

import EliteGeneratorPage from "./pages/EliteGeneratorPage";
import SupremeAccessPage from "./pages/SupremeAccessPage";

/* ==========================================
   APP
========================================== */

function App() {
  return (
    <Router>
      <TopNav />

      <Routes>
        {/* =====================================
            MAIN STUDIO
        ===================================== */}

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/gallery"
          element={<GalleryPage />}
        />

        <Route
          path="/photography-studio"
          element={<PhotographyStudioPage />}
        />

        <Route
          path="/after-dark"
          element={<AfterDarkPage />}
        />

        <Route
          path="/media/:id"
          element={<MediaDetailPage />}
        />

        <Route
          path="/favorites"
          element={<FavoritesPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/talent"
          element={<TalentPage />}
        />

        {/* =====================================
            COLLECTIVES
        ===================================== */}

        <Route
          path="/collectives"
          element={<CollectivesPage />}
        />

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

        {/* =====================================
            ADMIN
        ===================================== */}

        <Route
          path="/admin"
          element={<AdminPage />}
        />

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
          path="/admin/after-dark"
          element={<AdminAfterDarkPage />}
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
          path="/admin/aset"
          element={<AdminAsetPage />}
        />

        {/* =====================================
            AUTH
        ===================================== */}

        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        {/* =====================================
            CREATOR NETWORK
        ===================================== */}

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

        {/* =====================================
            FEATURED
        ===================================== */}

        <Route
          path="/featured"
          element={<FeaturedPage />}
        />

        {/* =====================================
            ASET MAGAZINE
        ===================================== */}

        <Route
          path="/aset"
          element={<AsetMagazinePage />}
        />

        <Route
          path="/aset/articles/:slug"
          element={<AsetArticlePage />}
        />

        <Route
          path="/aset/issues/:slug"
          element={<AsetIssuePage />}
        />

        {/* =====================================
            ASET SPOTLIGHT
        ===================================== */}

        <Route
          path="/aset-spotlight"
          element={<AsetSpotlightPage />}
        />

        <Route
          path="/aset-spotlight/:slug"
          element={<SpotlightProfilePage />}
        />

        {/* =====================================
            MANAGERS
        ===================================== */}

        <Route
          path="/managers"
          element={<ManagersPage />}
        />

        <Route
          path="/managers/:slug"
          element={<ManagerProfilePage />}
        />

        {/* =====================================
            DEBUG
        ===================================== */}

        <Route
          path="/debug-auth"
          element={<DebugAuthPage />}
        />

        {/* =====================================
            ASET CINEMA
        ===================================== */}

        <Route
          path="/videos"
          element={<VideosPage />}
        />

        <Route
          path="/video/:slug"
          element={<VideoPlayerPage />}
        />

        {/* =====================================
            VAULTS
        ===================================== */}

        <Route
          path="/diamond-vault"
          element={<DiamondVaultPage />}
        />

        <Route
          path="/studio/expression-vault"
          element={<ExpressionVaultPage />}
        />

        {/* =====================================
            ASET LOUNGE
        ===================================== */}

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

        {/* =====================================
            ACCESS
        ===================================== */}

        <Route
          path="/supreme-access"
          element={<SupremeAccessPage />}
        />

        <Route
          path="/elite-generator"
          element={<EliteGeneratorPage />}
        />

        {/* =====================================
            LEGACY REDIRECT
        ===================================== */}

        <Route
          path="/studio/writer"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

        {/* =====================================
            FALLBACK
        ===================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;