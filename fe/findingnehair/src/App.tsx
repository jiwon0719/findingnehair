import React, { Suspense, lazy } from 'react'; // Suspense와 lazy import
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import './styles/custom.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './router/protectedRoute';
import MainPage from './Pages/MainPage'; // MainPage는 그대로 import
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingAnimation from './components/ui/LoadingAnimation'; // 로딩 컴포넌트 사용 가능
import CommunityPage from './Pages/CommunityPage';
import LoginPage from './Pages/LoginPage'; // 로그인 페이지 import

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

// 레이지 로딩할 컴포넌트 정의
const LazyKakaoRedirectPage = lazy(() => import('./components/Features/auth/KakaoRedirectPage'));
const LazyFavoriteProductPage = lazy(() => import('./Pages/FavoriteProductPage'));
const LazyDiagnosisPage = lazy(() => import('./Pages/DiagnosisPage'));
// 파일명 오타 가능성 확인: DiagnosisChackPage -> DiagnosisCheckPage
const LazyDiagnosisCheckPage = lazy(() => import('./Pages/DiagnosisChackPage'));
const LazyDiagnosisReport = lazy(() => import('./Pages/DiagnosisReport'));
const LazyDashboard = lazy(() => import('./Pages/RecentDiagnosisPage'));
const LazyProductPage = lazy(() => import('./Pages/ProductPage'));
const LazyPostDetail = lazy(() => import('./Pages/PostDetail'));
const LazyMyPage = lazy(() => import('./Pages/MyPage'));
const LazyMyPosts = lazy(() => import('./Pages/MyPosts'));
const LazyCreateBoard = lazy(() => import('./components/Features/community/CreateBoard'));
const LazyEditPostPage = lazy(() => import('./components/Features/community/EditCommunityPage'));
const LazyScalpPollPage = lazy(() => import('./Pages/ScalpPollPage'));


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='bg-[#f1f5f4] max-w-md min-h-screen mx-auto p-0 text-center rounded-t-3xl'>
        {/* Suspense로 Routes 감싸기 */}
        {/* fallback: 레이지 로딩 중 보여줄 UI (로딩 스피너, 메시지 등) */}
        <Suspense fallback={<LoadingAnimation text="페이지 로딩 중..." loading={true}/>}>
          <Routes>
            {/* 레이지 로딩된 컴포넌트 사용 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/login/kakao" element={<LazyKakaoRedirectPage />} />
            {/* MainPage는 레이지 로딩 없이 그대로 사용 */}
            <Route path="/" element={<MainPage />} />

            <Route element={<ProtectedRoute />}>
              {/* ProtectedRoute 내부의 페이지들도 레이지 로딩 적용 */}
              <Route path="/diagnosis" element={<LazyDiagnosisPage />} />
              <Route path="/diagnosis/check" element={<LazyDiagnosisCheckPage />} />
              <Route path="/diagnosis/report" element={<LazyDiagnosisReport />} />
              <Route path="/dashboard" element={<LazyDashboard />} />
              <Route path="/product" element={<LazyProductPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/post/:id" element={<LazyPostDetail />} />
              <Route path="/community/edit/:id" element={<LazyEditPostPage />} />
              <Route path="/mypage" element={<LazyMyPage />} />
              {/* /mypage/edit 경로는 EditPostPage를 사용하는데, 위에서 이미 정의했으므로 그대로 사용 */}
              <Route path="/mypage/edit" element={<LazyEditPostPage />} />
              <Route path="/mypage/posts" element={<LazyMyPosts />} />
              <Route path="/posts/create" element={<LazyCreateBoard />} />
              <Route path="/mypage/favorites" element={<LazyFavoriteProductPage />} />
              <Route path='/poll' element={<LazyScalpPollPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </QueryClientProvider>
  )
}

export default App;