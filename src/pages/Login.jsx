import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("wd_user", JSON.stringify({ email: formData.email, isAuthenticated: true, role: "employee" }));
      setIsLoading(false);
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to track your tasks, points, and earnings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors ${errors.email ? "auth-input-error" : ""}`}
              placeholder="john@company.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors ${errors.password ? "auth-input-error" : ""}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit w-full py-4 rounded-xl bg-(--primary) text-white font-semibold hover:bg-(--primary-hover) transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Signing in...</span> : <span>Sign In</span>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a onClick={() => navigate("/register")}>Create account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
