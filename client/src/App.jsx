import React, { useState } from "react";
import useIndexedDB from "./hooks/useIndexedDB";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import UserList from "./components/userList/UserList";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const { db, add, getAll, update } = useIndexedDB(
    "UserManagementDB",
    1,
    "users"
  );

  // registration handling
  const handleRegister = async (userData) => {
    if (db) {
      try {
        const existingUsers = await getAll();
        const isUsernameTaken = existingUsers.some(
          (u) => u.username === userData.username
        );
        const isEmailTaken = existingUsers.some(
          (u) => u.email === userData.email
        );

        if (isUsernameTaken) {
          toast.error(
            "Username is already taken. Please choose a different one."
          );
          return;
        }
        if (isEmailTaken) {
          toast.error("Email is already in use. Please use a different email.");
          return;
        }

        await add({ ...userData, isBlocked: false, loginHistory: [] });
        toast.success("User registration successful!");
        setView("login");
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  //Login handling

  const handleLogin = async (credentials) => {
    if (db) {
      const users = await getAll();
      const user = users.find(
        (u) =>
          u.username === credentials.username &&
          u.password === credentials.password
      );
      if (user) {
        if (user.isBlocked) {
          toast.error(
            "Your account is blocked. Please contact an administrator."
          );
        } else {
          setCurrentUser(user);
          await update({
            ...user,
            loginHistory: [...(user.loginHistory || []), new Date()],
          });
          toast.success("Login successful!");
          setView("userList");
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    }
  };

  //Logout handling

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  return (
    <>
      <ToastContainer />
      <div className="app">
        <header className="main-head">
          <h1>User Management System</h1>
          {currentUser && (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          )}
        </header>
        <main>
          {view === "register" && (
            <Register
              onRegister={handleRegister}
              onLoginClick={() => setView("login")}
            />
          )}
          {view === "login" && (
            <Login
              onLogin={handleLogin}
              onRegisterClick={() => setView("register")}
            />
          )}
          {view === "userList" && (
            <UserList currentUser={currentUser} db={db} />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
