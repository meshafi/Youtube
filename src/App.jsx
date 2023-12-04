import styled from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Video from "./pages/Video";
import { createBrowserRouter, RouterProvider,Outlet } from "react-router-dom";
import YourVideos from "./pages/YourVideos";
import Subscriptions from "./pages/Subscription";
const Container = styled.div`
  display: flex;
  background-color: #202020;
`;

const Main = styled.div`
  flex: 7;
  backgournd-color:#202020;
`;
const Wrapper = styled.div`
`;

function App() {
  return (
      <Container>
          <Menu />
          <Main>
            <Navbar />
            <Wrapper>
                  <Outlet/>
            </Wrapper>
          </Main>
      </Container>
  );
}
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path:"/video/:id",
        element:<Video/>
      },
      {
        path:"/yourvideos",
        element:<YourVideos/>
      }
      ,{
        path:"/subscriptions",
        element:<Subscriptions/>
      }
    ],
  },
]);

const MainApp = () => <RouterProvider router={appRouter} />;

export default MainApp;
