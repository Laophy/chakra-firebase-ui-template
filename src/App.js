import { useEffect } from "react";
import { auth } from "./firebase";

import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setLoading } from "./redux/userSlice";

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
import Cart from "./pages/pages/Cart";
import Error from "./pages/auth/Error";
import Home from "./pages/pages/Dashboard";
import Dashboard from "./pages/pages/Dashboard";
import { getfirebaseUser } from "./services/UserManagement.service";
import AdminPanel from "./pages/account/admin/AdminPanel";
import AdminViewUsers from "./pages/account/admin/AdminViewUsers";
import ExecutivePanel from "./pages/account/admin/ExecutivePanel";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        loadCurrentUser(authUser);
      } else {
        console.log("User not logged in");
      }
    });
  }, []);

  const loadCurrentUser = async (authUser) => {
    console.log("AUTH STATE CHANGED!!");
    console.log("CURRENT AUTH USER: ", authUser);
    const [userData, mtsResponse] = await getfirebaseUser(authUser);
    if (mtsResponse || !userData) {
      // something went wrong
      console.log("MTS RESPONSE!!");
    } else {
      // when the user has data in the DB use that as the main override
      dispatch(
        loginUser({
          uid: userData?.uid,
          username: userData?.username,
          email: userData?.email,
          photoURL: userData?.photoURL,
          balance: userData?.balance,
          banned: userData?.banned,
          referralCode: userData?.referralCode,
          affiliate: userData?.affiliate,
          isStaff: userData?.isStaff,
          isHighStaff: userData?.isHighStaff,
          title: userData?.title,
        })
      );
      dispatch(setLoading(false));
    }
  };

  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <div className="App">
      <Navbar
        websiteContent={
          user ? (
            <Routes>
              <Route path={"*"} element={<Error />} />
              <Route path={"/"} element={<Dashboard />} />
              <Route path={"/account/login"} element={<Login />} />
              <Route path={"/account/register"} element={<Register />} />

              <Route path={"/dashboard"} element={<Dashboard />} />
              <Route path={"/battles"} element={<Battles />} />
              <Route path={"/cart"} element={<Cart />} />
              <Route path={"/rewards"} element={<Rewards />} />

              <Route
                path={"/account/profile"}
                element={
                  <Account pageElement={<Profile />} currentPage={"profile"} />
                }
              />
              <Route
                path={"/account/deposits"}
                element={
                  <Account
                    pageElement={<Deposits />}
                    currentPage={"deposits"}
                  />
                }
              />
              <Route
                path={"/account/withdrawals"} // Fixed typo: "withdrawls" to "withdrawals"
                element={
                  <Account
                    pageElement={<Withdrawals />} // Fixed typo: "Withdrawls" to "Withdrawals"
                    currentPage={"withdrawals"} // Fixed typo: "withdrawls" to "withdrawals"
                  />
                }
              />
              <Route
                path={"/account/claims"}
                element={
                  <Account pageElement={<Claims />} currentPage={"claims"} />
                }
              />
              <Route
                path={"/account/sales"}
                element={
                  <Account pageElement={<Sales />} currentPage={"sales"} />
                }
              />
              <Route
                path={"/account/history"}
                element={
                  <Account pageElement={<History />} currentPage={"history"} />
                }
              />
              <Route
                path={"/account/affiliate"}
                element={
                  <Account
                    pageElement={<Affiliate />}
                    currentPage={"affiliate"}
                  />
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
                    <Account
                      pageElement={<AdminPanel />}
                      currentPage={"adminpanel"}
                    />
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
                  <Account
                    pageElement={<Fairness />}
                    currentPage={"fairness"}
                  />
                }
              />
              <Route
                path={"/account/security"}
                element={
                  <Account
                    pageElement={<Security />}
                    currentPage={"security"}
                  />
                }
              />
            </Routes>
          ) : (
            <Routes>
              <Route path={"*"} element={<Error />} />
              <Route path={"/"} element={<Home />} />
              <Route path={"/account/login"} element={<Login />} />
              <Route path={"/account/register"} element={<Register />} />

              <Route path={"/dashboard"} element={<Dashboard />} />

              <Route path={"/battles"} element={<Battles />} />
              <Route path={"/battles/createbattle"} element={<Login />} />
              <Route path={"/cart"} element={<Login />} />
              <Route path={"/rewards"} element={<Rewards />} />
            </Routes>
          )
        }
      />
      <Footer />
    </div>
  );
}

export default App;
