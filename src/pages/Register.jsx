import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("wd_user", JSON.stringify({ ...formData, isAuthenticated: true }));
      setIsLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Your Account</h1>
          <p>Join your performance dashboard and start tracking your earnings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
                First Name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors ${errors.firstName ? "auth-input-error" : ""}`}
                placeholder="First name"
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors ${errors.lastName ? "auth-input-error" : ""}`}
                placeholder="Last name"
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

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
              placeholder="Email address"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Employee ID
            </label>
            <input
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors ${errors.employeeId ? "auth-input-error" : ""}`}
              placeholder="Employee ID"
            />
            {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId}</p>}
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
              placeholder="Password"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors ${errors.confirmPassword ? "auth-input-error" : ""}`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-text-main mb-1 uppercase tracking-wider">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text-main) focus:border-(--primary) focus:outline-none transition-colors"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit w-full py-4 rounded-xl bg-(--primary) text-white font-semibold hover:bg-(--primary-hover) transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4M22 12l-5 5M22 12l-5-5"/><circle cx="22" cy="12" r="3"/>
                </svg>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
