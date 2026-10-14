import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoute";
import AuthContextProvider from "./contexts/UserData.tsx";
import ThemeContextProvider from "./contexts/ThemeContext.tsx";
import { ImagePreviewProvider } from "./contexts/ImagePreviewContext.tsx";

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <ImagePreviewProvider>
          <RouterProvider router={routes} />
        </ImagePreviewProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
