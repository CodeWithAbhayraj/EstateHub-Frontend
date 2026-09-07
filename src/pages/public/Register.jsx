import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "BUYER",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // HANDLE CHANGE
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

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(formData);

      setSuccess(
        "Registration successful! Please login to continue."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Registration failed. Please try again."
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
                Estate
                <span className="text-blue-600">
                  Hub
                </span>
              </span>

            </Link>

            <p className="mt-3 text-sm text-slate-500">
              Create your account and get started.
            </p>

          </div>


          {/* ========================================
              REGISTER CARD
          ======================================== */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            {/* CARD HEADER */}

            <div className="mb-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                <UserPlus
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                Create Account
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Join EstateHub as a buyer or seller.
              </p>

            </div>


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (
              <div
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                role="alert"
              >
                {error}
              </div>
            )}


            {/* ======================================
                SUCCESS
            ====================================== */}

            {success && (
              <div
                className="mb-5 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700"
                role="status"
              >

                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{success}</span>

              </div>
            )}


            {/* ======================================
                FORM
            ====================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
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


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  name="email"
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


              {/* MOBILE */}

              <div>

                <label
                  htmlFor="register-mobile"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Mobile Number
                </label>

                <input
                  id="register-mobile"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
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

                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
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
                  REGISTER AS
              ====================================== */}

              <div>

                <label
                  htmlFor="register-role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Register As
                </label>

                <select
                  id="register-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
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

                    hover:border-slate-400

                    focus:border-slate-500
                    focus:ring-4
                    focus:ring-slate-100

                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:text-slate-500
                  "
                >

                  <option value="BUYER">
                    Buyer
                  </option>

                  <option value="SELLER">
                    Seller
                  </option>

                </select>

                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  Choose how you want to use EstateHub.
                </p>

              </div>


              {/* ======================================
                  SUBMIT
              ====================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2
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

                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>


            {/* ========================================
                LOGIN
            ======================================== */}

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">

              <p className="text-sm text-slate-500">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Login
                </Link>

              </p>

            </div>

          </div>


          {/* ========================================
              FOOTER NOTE
          ======================================== */}

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Create your EstateHub account to start exploring properties.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;