import react, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/UI/loading/loading";
import AuthContextProvider from "./context/auth/authContext";

const Home = react.lazy(() => import("./pages/home"));
const Signup = react.lazy(() => import("./pages/signup"));
const Userdash = react.lazy(() => import("./pages/userdash"));
const Admindash = react.lazy(() => import("./pages/admindash"));
const NotFound = react.lazy(() => import("./pages/404"));

function App() {
  
  return (
    <react.Fragment>
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route
              path="/"
              exact
              element={
                <Suspense fallback={<Loading />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              exact
              element={
                <Suspense fallback={<Loading />}>
                  <Signup />
                </Suspense>
              }
            />
            <Route
              path="/dashboardU/*"
              exact
              element={
                <Suspense fallback={<Loading />}>
                  <Userdash />
                </Suspense>
              }
            />
            <Route
              path="/dashboardA/*"
              exact
              element={
                <Suspense fallback={<Loading />}>
                  <Admindash />
                </Suspense>
              }
            />
            <Route
              path="*"
              exact
              element={
                <Suspense fallback={<Loading />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </react.Fragment>
  );
}

export default App;
