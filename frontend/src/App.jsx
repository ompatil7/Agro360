/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar/Navbar";
import HomePage from "./page/HomePage";
import SignupPage from "./page/SignupPage";
import SigninPage from "./page/SigninPage";
import Insurance from "./page/Insurance";
import DashLayout from "./components/DashLayout";
import AdminDashboard from "./components/DashboardComponents/AdminDashboard";
import UsersInformation from "./page/UsersInformation";
import ErrorBoundary from "./ErrorBoundary";
import InsuranceDetail from "./components/InsuranceDetail";
import AssignAgents from "./components/DashboardComponents/AssignAgents";
import FeaturesPage from "./page/FeaturePage"; // Import the FeaturesPage component
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/DashboardComponents/UserProfile";
import AssignedInsurances from "./components/DashboardComponents/Agent/AssignedInsurances";
import DiseaseDetection from "./components/Features/DiseaseDetection";
import MarketPrices from "./components/Features/MarketPrices";
import SoilAnalysis from "./components/Features/SoilAnalysis";
import Cropvideo from "./components/Features/cropVideo";
// import WeatherForecast from "./components/Features/WeatherForecast";
import NavigationBar from "./components/NavigationBar";
import CropRecommendation from "./components/Features/CropRecommendation";
import FertilizerRecommendation from "./components/Features/FertilizerRecommendation";
import CreateInsurance from "./components/DashboardComponents/Admin/CreateInsurance";
import AssignLocation from "./components/DashboardComponents/Agent/AssignLocation";
import AboutUs from "./page/Aboutus";
import AssignmentDetail from "./components/DashboardComponents/Agent/AssignmentDetail";
import AgentEnrollments from "./components/DashboardComponents/Agent/AgentEnrollments";
import InsuranceDetails from "./components/DashboardComponents/InsuranceDetails";
import FarmerInsurances from "./components/DashboardComponents/Farmer/FarmerInsurances";
import ClaimInsurance from "./components/DashboardComponents/Farmer/ClaimInsurance";
import PaymentSuccess from "./components/DashboardComponents/Farmer/PaymentSuccess";

import DiseaseExpert from "./components/Features/AI_Features/DiseaseExpert";
import GeneralExpert from "./components/Features/AI_Features/GeneralExpert";


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="max-w-8xl mx-auto">
            {/* <Navbar /> */}
            <NavigationBar />
            <Routes>
              {/* Open Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/insurance" element={<Insurance />} />

              {/* Protected Route for all roles */}
              <Route
                path="/insurance/:id"
                element={
                  <ProtectedRoute>
                    <InsuranceDetail />{" "}
                  </ProtectedRoute>
                }
              />

              {/* Features Routes */}
              <Route
                path="/features"
                element={
                  <ProtectedRoute>
                    <FeaturesPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DiseaseDetection />} />
                <Route path="soil" element={<SoilAnalysis />} />
                <Route
                  path="crop-recommendation"
                  element={<CropRecommendation />}
                />
                <Route
                  path="fertilizer-recommendation"
                  element={<FertilizerRecommendation />}
                />
                <Route path="weather" element={<Cropvideo />} />
                <Route path="cropvideo" element={<Cropvideo />} />

                <Route path="disease-expert" element={<DiseaseExpert />} />
                <Route path="general-expert" element={<GeneralExpert />} />
              </Route>

              <Route path="/aboutus" element={<AboutUs />} />
              <Route
                path="/profile/payment-success"
                element={<PaymentSuccess />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    {" "}
                    <DashLayout />{" "}
                  </ProtectedRoute>
                }
              >
                {/* All role profile page */}
                <Route index element={<UserProfile />} />

                {/* Farmer Routes */}

                <Route
                  path="my-insurances"
                  element={
                    <ProtectedRoute role="user">
                      <FarmerInsurances />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="my-insurances/:id"
                  element={
                    <ProtectedRoute role="user">
                      <InsuranceDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="claim-insurance/:id"
                  element={
                    <ProtectedRoute role="user">
                      <ClaimInsurance />
                    </ProtectedRoute>
                  }
                />

                {/* Admin only routes */}
                <Route
                  path="admin-dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="assign-agents"
                  element={
                    <ProtectedRoute role="admin">
                      {" "}
                      <AssignAgents />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create-insurance"
                  element={
                    <ProtectedRoute role="admin">
                      {" "}
                      <CreateInsurance />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="farmer-profile/:id"
                  element={
                    <ProtectedRoute role="admin">
                      {" "}
                      <UsersInformation />{" "}
                    </ProtectedRoute>
                  }
                />

                {/* Agent only routes */}
                <Route
                  path="assigned-insurances"
                  element={
                    <ProtectedRoute role="agent">
                      {" "}
                      <AssignedInsurances />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="assigned-insurances/:id"
                  element={
                    <ProtectedRoute role="agent">
                      <AssignmentDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="assign-location"
                  element={
                    <ProtectedRoute role="agent">
                      {" "}
                      <AssignLocation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="my-enrollments"
                  element={
                    <ProtectedRoute role="agent">
                      {" "}
                      <AgentEnrollments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="my-enrollments/:id"
                  element={
                    <ProtectedRoute role="agent">
                      {" "}
                      <InsuranceDetails />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
