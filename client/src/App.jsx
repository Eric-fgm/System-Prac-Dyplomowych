import { createBrowserRouter, RouterProvider } from "react-router";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ProtectedRoute from "./components/protected-route";
import LoginPage from "./routes/Login";
import ThesesPage from "./routes/theses";
import SupervisorsPage from "./routes/supervisors";
import UsersPage from "./routes/users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: () => {},
  }),
  mutationCache: new MutationCache({
    onError: () => {},
  }),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ThesesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supervisors",
    element: (
      <ProtectedRoute>
        <SupervisorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const App = () => {
  return (
    <div className="mx-auto min-w-[360px] max-w-[2560px]">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
};

export default App;
