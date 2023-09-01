import Router from "./routes";
import ThemeProvider from "./theme";
import ScrollToTop from "./components/ScrollToTop";
import { ProgressBarStyle } from "./components/ProgressBar";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import AuthGuard from "./guards/AuthGuard";

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
          <AuthGuard>
            <ProgressBarStyle />
            <ScrollToTop />
            <Router />
          </AuthGuard>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
