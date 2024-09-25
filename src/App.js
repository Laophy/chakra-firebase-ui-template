import { useEffect } from "react";
import { auth } from "./firebase";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setAuthHeader, setLoading } from "./redux/userSlice";

import Footer from "./components/navigation/Footer";
import Navbar from "./components/navigation/Navbar";
import Profile from "./pages/account/Profile";
import Account from "./layouts/Account";
import Deposits from "./pages/account/Deposits";
import Withdrawals from "./pages/account/Withdrawals";
import Claims from "./pages/account/Claims";
import Sales from "./pages/account/Sales";
import Affiliate from "./pages/account/Affiliate";
import History from "./pages/account/History";
import Fairness from "./pages/account/Fairness";
import Security from "./pages/account/Security";
import Battles from "./pages/pages/Battles";
import Rewards from "./pages/pages/Rewards";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Inventory from "./pages/pages/Inventory";
import Error from "./pages/auth/Error";
import Dashboard from "./pages/pages/Dashboard";
import {
  createNewUser,
  getUserByFirebaseAuth,
} from "./services/UserManagement.service";
import AdminPanel from "./pages/account/admin/AdminPanel";
import AdminViewUsers from "./pages/account/admin/AdminViewUsers";
import ExecutivePanel from "./pages/account/admin/ExecutivePanel";
import UserProfile from "./pages/pages/UserProfile";
import Boxes from "./pages/pages/Boxes";
import { useToast } from "@chakra-ui/react";

function App() {
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        loadCurrentUser(authUser);
      } else {
        //console.log("User not logged in");
      }
    });
  }, []);

  const loadCurrentUser = async (authUser) => {
    try {
      let [userData, mtsResponse] = await getUserByFirebaseAuth(authUser);
      if (mtsResponse || !userData) {
        //console.warn("User not found in MongoDB. Creating new user...");
        const [newUser, createResponse] = await createNewUser(authUser);
        //console.log(createResponse);
        if (createResponse || !newUser) {
          //console.warn("Failed to create new user:", createResponse);
          createResponse.forEach((error) => {
            toast({
              title: "Error",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          });
          return;
        }
        userData = newUser;
      }

      dispatch(
        loginUser({
          uid: userData?.uid,
          username: userData?.username,
          email: userData?.email,
          photoURL: userData?.photoURL,
          balance: userData?.balance,
          bio: userData?.bio,
          banned: userData?.banned,
          referralCode: userData?.referralCode,
          affiliate: userData?.affiliate,
          isStaff: userData?.isStaff,
          isHighStaff: userData?.isHighStaff,
          title: userData?.title,
        })
      );
      dispatch(setLoading(false));
      //console.info("User data loaded: ", userData);

      // Setup the auth header for requests from the logged in user
      const authHeader = await authUser.getIdToken();
      dispatch(setAuthHeader(authHeader));
    } catch (error) {
      //console.error("Error loading current user:", error);
      dispatch(setLoading(false));
    }
  };

  const user = useSelector((state) => state.data.user.user);

  const AuthenticatedRoutes = () => (
    <Routes>
      <Route path={"*"} element={<Error />} />
      <Route path={"/"} element={<Dashboard />} />
      <Route path={"/account/login"} element={<Login />} />
      <Route path={"/account/register"} element={<Register />} />
      <Route path={"/user/profile/:uid"} element={<UserProfile />} />
      <Route path={"/boxes"} element={<Boxes />} />
      <Route path={"/battles"} element={<Battles />} />
      <Route path={"/inventory"} element={<Inventory />} />

      <Route path={"/rewards"} element={<Rewards />} />
      <Route
        path={"/account/profile"}
        element={<Account pageElement={<Profile />} currentPage={"profile"} />}
      />
      <Route
        path={"/account/deposits"}
        element={
          <Account pageElement={<Deposits />} currentPage={"deposits"} />
        }
      />
      <Route
        path={"/account/withdrawals"}
        element={
          <Account pageElement={<Withdrawals />} currentPage={"withdrawals"} />
        }
      />
      <Route
        path={"/account/claims"}
        element={<Account pageElement={<Claims />} currentPage={"claims"} />}
      />
      <Route
        path={"/account/sales"}
        element={<Account pageElement={<Sales />} currentPage={"sales"} />}
      />
      <Route
        path={"/account/history"}
        element={<Account pageElement={<History />} currentPage={"history"} />}
      />
      <Route
        path={"/account/affiliate"}
        element={
          <Account pageElement={<Affiliate />} currentPage={"affiliate"} />
        }
      />
      {user?.isHighStaff && (
        <Route
          path={"/account/highadminpanel"}
          element={
            <Account
              pageElement={<ExecutivePanel />}
              currentPage={"Executive Panel"}
            />
          }
        />
      )}
      {user?.isStaff && (
        <Route
          path={"/account/adminpanel"}
          element={
            <Account pageElement={<AdminPanel />} currentPage={"adminpanel"} />
          }
        />
      )}
      {user?.isStaff && (
        <Route
          path={"/account/adminusers"}
          element={
            <Account
              pageElement={<AdminViewUsers />}
              currentPage={"Manage Users"}
            />
          }
        />
      )}
      <Route
        path={"/account/fairness"}
        element={
          <Account pageElement={<Fairness />} currentPage={"fairness"} />
        }
      />
      <Route
        path={"/account/security"}
        element={
          <Account pageElement={<Security />} currentPage={"security"} />
        }
      />
    </Routes>
  );

  const UnauthenticatedRoutes = () => (
    <Routes>
      <Route path={"*"} element={<Error />} />
      <Route path={"/"} element={<Dashboard />} />
      <Route path={"/account/login"} element={<Login />} />
      <Route path={"/account/register"} element={<Register />} />
      <Route path={"/user/profile/:uid"} element={<UserProfile />} />
      <Route path={"/boxes"} element={<Boxes />} />
      <Route path={"/battles"} element={<Battles />} />
      <Route path={"/battles/createbattle"} element={<Login />} />
      <Route path={"/inventory"} element={<Login />} />
      <Route path={"/rewards"} element={<Rewards />} />
    </Routes>
  );

  return (
    <div className="App">
      <Navbar
        websiteContent={
          user ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />
        }
      />
      <Footer />
    </div>
  );
}

export default App;
