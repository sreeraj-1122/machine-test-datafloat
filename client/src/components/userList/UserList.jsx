import React, { useState, useEffect } from "react";
import useIndexedDB from "../../hooks/useIndexedDB";
import { toast } from "react-toastify";

function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { db, getAll, update, deleteRecord, add } = useIndexedDB(
    "UserManagementDB",
    1,
    "users"
  );

  useEffect(() => {
    if (db) {
      loadUsers();
    }
  }, [db]);

  //get users

  const loadUsers = async () => {
    if (db) {
      const allUsers = await getAll();
      setUsers(allUsers);
    }
  };
  //handling block and unblock
  const handleBlockUnblock = async (user) => {
    if (db) {
      await update({ ...user, isBlocked: !user.isBlocked });
      loadUsers();
      toast.success(
        `User ${user.isBlocked ? "unblocked" : "blocked"} successfully`
      );
    }
  };
  // delete user function
  const handleDelete = async (userId) => {
    if (db) {
      try {
        console.log(`Attempting to delete user with ID: ${userId}`);
        await deleteRecord(userId);
        toast.success("User deleted successfully");
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    } else {
      toast.error("Database is not initialized.");
    }
  };
  // add user function

  const handleAdd = async () => {
    if (db) {
      const username = prompt("Enter username:");
      const email = prompt("Enter email:");
      const password = prompt("Enter password:");

      if (!username || username.trim() === "") {
        toast.error("Username cannot be empty.");
        return;
      } else if (username.length < 3) {
        toast.error("Username must be at least 3 characters long.");
        return;
      }

      if (!email || email.trim() === "") {
        toast.error("Email cannot be empty.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (!password || password.trim() === "") {
        toast.error("Password cannot be empty.");
        return;
      } else if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }

      const allUsers = await getAll();
      const existingUser = allUsers.find((u) => u.username === username);
      const existingEmailUser = allUsers.find((u) => u.email === email);

      if (existingUser) {
        toast.error(
          "Username already exists. Please choose a different username."
        );
        return;
      }

      if (existingEmailUser) {
        toast.error("Email already exists. Please choose a different email.");
        return;
      }

      await add({
        username,
        email,
        password,
        isBlocked: false,
        loginHistory: [],
      });
      loadUsers();
      toast.success("User added successfully");
    } else {
      toast.error("Database is not initialized.");
    }
  };

  // edit user function

  const handleUpdate = async (user) => {
    if (db) {
      const newUsername = prompt("Enter new username:", user.username);
      const newEmail = prompt("Enter new email:", user.email);
      const newPassword = prompt("Enter new password:", "");

      let usernameValid = true;
      let emailValid = true;
      let passwordValid = true;

      if (newUsername === null || newUsername.trim() === "") {
        toast.error("Username cannot be empty.");
        usernameValid = false;
      } else if (newUsername.length < 3) {
        toast.error("Username must be at least 3 characters long.");
        usernameValid = false;
      } else if (newUsername !== user.username) {
        const allUsers = await getAll();
        const existingUser = allUsers.find((u) => u.username === newUsername);
        if (existingUser) {
          toast.error(
            "Username already exists. Please choose a different username."
          );
          usernameValid = false;
        }
      }

      if (newEmail === null || newEmail.trim() === "") {
        toast.error("Email cannot be empty.");
        emailValid = false;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(newEmail)) {
          toast.error("Please enter a valid email address.");
          emailValid = false;
        } else if (newEmail !== user.email) {
          const allUsers = await getAll();
          const existingEmailUser = allUsers.find((u) => u.email === newEmail);
          if (existingEmailUser) {
            toast.error(
              "Email already exists. Please choose a different email."
            );
            emailValid = false;
          }
        }
      }

      if (newPassword === null || newPassword.trim() === "") {
        toast.error("Password cannot be empty.");
        passwordValid = false;
      } else if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        passwordValid = false;
      }

      if (usernameValid && emailValid && passwordValid) {
        await update({
          ...user,
          username: newUsername,
          email: newEmail,
          password: newPassword,
        });
        loadUsers();
        toast.success("User updated successfully");
      }
    }
  };

  // view user Logins

  const handleViewLogins = (user) => {
    setSelectedUser(user);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      <button onClick={handleAdd}>Add New User</button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isBlocked ? "Blocked" : "Active"}</td>
              <td>
                <button onClick={() => handleBlockUnblock(user)}>
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  className="btn-update"
                  onClick={() => handleUpdate(user)}
                >
                  Update
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
                <button
                  className="btn-view-logins"
                  onClick={() => handleViewLogins(user)}
                >
                  View Logins
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="login-history">
          <h3>Login History for {selectedUser.username}</h3>
          <button onClick={() => setSelectedUser(null)} className="btn-delete">
            X
          </button>
          <ul>
            {selectedUser.loginHistory &&
            selectedUser.loginHistory.length > 0 ? (
              selectedUser.loginHistory.map((login, index) => (
                <li key={index}>{formatDate(login)}</li>
              ))
            ) : (
              <li>No login history available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserList;
