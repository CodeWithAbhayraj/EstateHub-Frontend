import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error while typing
    if (error) {
      setError("");
    }
  };


  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await login(formData);

      // ======================================
      // REDIRECT BASED ON ROLE
      // ======================================

      switch (response.role) {
        case "BUYER":
          navigate("/buyer/dashboard");
          break;

        case "SELLER":
          navigate("/seller/dashboard");
          break;

        case "ADMIN":
        case "SUPER_ADMIN":
          navigate("/admin/dashboard");
          break;

        default:
          navigate("/");
      }

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* ==========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />
      </div>


      {/* ==========================================
          MAIN
      ========================================== */}

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 sm:py-14">

        <div className="w-full max-w-md">

          {/* ========================================
              BRAND
          ======================================== */}

          <div className="mb-7 text-center">

            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Building2 size={21} />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                Estate<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            <p className="mt-3 text-sm text-slate-500">
              Welcome back. Sign in to continue.
            </p>

          </div>


          {/* ========================================
              LOGIN CARD
          ======================================== */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            {/* CARD HEADER */}

            <div className="mb-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <ShieldCheck
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Login to access your EstateHub account.
              </p>

            </div>


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  leading-5
                  text-red-600
                "
                role="alert"
              >
                {error}
              </div>
            )}


            {/* ======================================
                FORM
            ====================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="
                    min-h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-800
                    shadow-sm
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-slate-400

                    hover:border-slate-400

                    focus:border-slate-500
                    focus:ring-4
                    focus:ring-slate-100

                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:text-slate-500
                  "
                />

              </div>


              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <input
                    id="login-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="
                      min-h-11
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      pr-12
                      text-sm
                      font-medium
                      text-slate-800
                      shadow-sm
                      outline-none
                      transition-all
                      duration-200

                      placeholder:text-slate-400

                      hover:border-slate-400

                      focus:border-slate-500
                      focus:ring-4
                      focus:ring-slate-100

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      disabled:text-slate-500
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={loading}
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* ======================================
                  LOGIN BUTTON
              ====================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200

                  hover:bg-slate-800
                  hover:shadow-md

                  active:scale-[0.98]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-slate-400
                  focus-visible:ring-offset-2

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </form>


            {/* ========================================
                REGISTER
            ======================================== */}

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">

              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>

            </div>

          </div>


          {/* ========================================
              FOOTER NOTE
          ======================================== */}

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            By continuing, you agree to use EstateHub responsibly.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;