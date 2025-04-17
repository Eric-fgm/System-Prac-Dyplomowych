import { createBrowserRouter, RouterProvider } from "react-router";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Login from "./routes/Login";
import Theses from "./routes/theses";

const queryClient = new QueryClient({
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
    element: <Theses />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
