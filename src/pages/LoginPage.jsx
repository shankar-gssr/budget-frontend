import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnState, setBtnState] = useState("idle"); // idle | loading | success | error

  const getBtnStyle = () => {
    if (btnState === "error") return { background: "#c0392b" };
    if (btnState === "success" || btnState === "loading") return { background: "#1a7a4a" };
    return {};
  };

  const getBtnLabel = () => {
    if (btnState === "error") return "Fill in all fields";
    if (btnState === "success") return "✓ Logged in";
    return "Login";
  };

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setBtnState("error");
      setTimeout(() => setBtnState("idle"), 1800);
      return;
    }
    setBtnState("loading");
    setTimeout(() => {
      setBtnState("success");
    }, 1400);
  };

  return (
    <>
      <div className="login-page">
        {/* Background blobs */}
        <div className="blob blob-bg-1" />
        <div className="blob blob-bg-2" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="card">
          {/* Lock icon */}
          <div className="icon-wrap">
            <div className="lock-ring">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>

          <h1 className="card-title">Welcome Back</h1>
          <p className="card-sub">Please login to your account</p>

          <div className="form">
            {/* Email */}
            <div className="field-group">
              <label className="field-label" htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="eye-btn"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="forgot-row">
                <button type="button" className="forgot-link">Forgot Password?</button>
              </div>
            </div>

            {/* Login button */}
            <button
              className="btn-login"
              type="button"
              onClick={handleLogin}
              disabled={btnState === "loading"}
              style={getBtnStyle()}
            >
              {btnState === "loading" ? (
                <span className="spinner" />
              ) : (
                <span>{getBtnLabel()}</span>
              )}
            </button>

            {/* Divider */}
            <div className="divider">or</div>

            {/* Google */}
            <button className="btn-google" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>

            {/* Sign up */}
            <p className="signup-row">
              Don't have an account? <a href="/home">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}