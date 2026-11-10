import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (!formData.email || !formData.password) {
      setErrors({ _: "Please enter email and password" });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("wd_admin", JSON.stringify({ email: formData.email, isAuthenticated: true, role: "admin" }));
      setIsLoading(false);
      navigate("/admin/dashboard");
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Admin Sign In</h1>
          <p>Administrator access — manage users, tasks, and earnings</p>
        </div>

        {errors._ && <p className="p-3 rounded-xl bg-red-500/10 text-red-500 text-sm text-center">{errors._}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Admin Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Admin Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-color-pending text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <span>Signing in...</span> : <span>Enter Admin Panel</span>}
          </button>
        </form>

        <div className="auth-footer">
          <a onClick={() => navigate("/login")}>← Employee Portal</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
