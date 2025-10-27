import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import axios from "axios";

const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmitRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value.trim();

    if (!username || !email || !password) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/signup",
        { username, email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("✅ Account created successfully!");
      }
      (form.elements.namedItem("username") as HTMLInputElement).value = "";
      (form.elements.namedItem("email") as HTMLInputElement).value = "";
      (form.elements.namedItem("password") as HTMLInputElement).value = "";
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        alert("⚠️ Account already exists.");
      } else {
        alert("❌ Something went wrong. Please try again.");
        console.error("Signup error:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value.trim();

    if (!email || !password) {
      alert("⚠️ Please enter valid credentials.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/signin",
        { email, password },
        { withCredentials: true }
      );

      const backendData = res.data;
      localStorage.setItem("token", backendData.token);
      localStorage.setItem("userId", backendData.userID);
      alert("Logged in successfully!");
      navigate("/HomePage");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials or server issue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Section (Register) */}
        <div className="card-base p-8 lg:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              Welcome to <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Second Brain</span>
            </h1>
            <p className="text-gray-600 text-lg">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmitRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                className="input-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                className="input-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                className="input-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-base btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex lg:hidden justify-center items-center">
          <div className="flex items-center gap-4 text-gray-400">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-sm font-medium">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </div>

        {/* Right Section (Login) */}
        <div className="card-base p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmitLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                className="input-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                className="input-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-base btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Desktop Divider */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-64 bg-gray-200"></div>
      </div>
    </div>
  );
};

export default AuthPage;
