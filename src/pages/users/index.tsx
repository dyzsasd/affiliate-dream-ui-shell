
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserList from "./UserList";

const UsersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<UserList />} />
    </Routes>
  );
};

export default UsersRoutes;
