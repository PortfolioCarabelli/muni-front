import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import IncidenceList from "./pages/IncidenceList";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import UserList from "./pages/UserList";


const ROLES = {
  User: 2001,
  Admin: 5150,
};

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      <Route path="/" element={<Layout />}>
        {/* we want to protect these routes */}
        <Route
          element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}
        >
          <Route path="/" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="user-list" element={<UserList />} />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}
        >
          <Route path="product-list" element={<IncidenceList />} />
        </Route>
        {/*
        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route> */}

        <Route path="unauthorized" element={<Unauthorized />} />

        {/* catch all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
