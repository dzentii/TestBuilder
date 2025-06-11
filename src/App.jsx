import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import Test from "./pages/Test";
import TestCreator from "./pages/CreateTest";
import TestManagementPage from "./pages/MyTests";
import TestRegistrationForm from "./pages/TestRegistration";
import StudentTest from "./pages/StudentTest";
import PrivateRoute from "./components/Protect";
import Success from "./pages/Sucess";
import { ToastContainer } from "react-toastify";
import CheckTest from "./pages/CheckTest";
import EditTest from "./pages/EditTest";

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test-registration" element={<TestRegistrationForm />} />
        <Route path="/start-test" element={<StudentTest />} />
        <Route path="/success" element={<Success />} />
        <Route element={<PrivateRoute />}>
          <Route path="/test" element={<Test />} />
          <Route path="/create" element={<TestCreator />} />
          <Route path="/test-management" element={<TestManagementPage />} />
          <Route path="/edit/:id" element={<EditTest/>}></Route>
          <Route path="/check" element={<CheckTest />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
