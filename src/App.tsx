import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoute";
import AuthContextProvider from "./contexts/UserData.tsx";
import ThemeContextProvider from "./contexts/ThemeContext.tsx";

/** Manages app logic. */
function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <RouterProvider router={routes} />
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
