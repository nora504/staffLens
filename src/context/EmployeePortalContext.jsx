import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "stafflens-employee-portal-v1";
const RATE_PER_POINT = 0.1;
const DEFAULT_DAILY_TARGET = 1000;
const PortalContext = createContext(null);

const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const offsetDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return localDateKey(date);
};

const makeInitialState = () => {
  const employeeId = "employee-maya";
  return {
    employeeId,
    isAdmin: false,
    employees: [
      { id: employeeId, name: "Maya Chen", email: "maya.chen@company.com", role: "Customer Operations", active: true, targetPoints: DEFAULT_DAILY_TARGET },
      { id: "employee-jordan", name: "Jordan Lee", email: "jordan.lee@company.com", role: "Data Quality", active: true, targetPoints: DEFAULT_DAILY_TARGET },
      { id: "employee-sam", name: "Sam Rivera", email: "sam.rivera@company.com", role: "Customer Operations", active: true, targetPoints: DEFAULT_DAILY_TARGET },
    ],
    tasks: [
      { id: "task-1", title: "Review customer onboarding cases", description: "Check submitted identity details against the onboarding checklist.", points: 400, employeeId, date: offsetDate(0), status: "approved", rejectReason: "" },
      { id: "task-2", title: "Resolve priority support tickets", description: "Respond to priority tickets and document the resolution.", points: 650, employeeId, date: offsetDate(0), status: "submitted", rejectReason: "" },
      { id: "task-3", title: "Audit account records", description: "Review account records for completeness and consistency.", points: 500, employeeId, date: offsetDate(-1), status: "approved", rejectReason: "" },
      { id: "task-4", title: "Tag incoming support requests", description: "Apply the correct category and priority to each request.", points: 300, employeeId, date: offsetDate(0), status: "assigned", rejectReason: "" },
      { id: "task-5", title: "Check product catalog entries", description: "Identify missing or inconsistent product information.", points: 350, employeeId: null, date: offsetDate(0), status: "available", rejectReason: "" },
      { id: "task-6", title: "Verify weekly data imports", description: "Compare import totals and report any discrepancies.", points: 700, employeeId: "employee-jordan", date: offsetDate(0), status: "submitted", rejectReason: "" },
      { id: "task-7", title: "Close resolved billing requests", description: "Confirm the resolution and close completed billing requests.", points: 550, employeeId: "employee-sam", date: offsetDate(0), status: "approved", rejectReason: "" },
    ],
    adjustments: [],
    payments: [],
    notifications: [
      { id: "notice-1", employeeId, title: "Weekly payment schedule", message: "Approved eligible earnings are paid weekly after task verification. Your dashboard shows the latest balance.", date: offsetDate(0), kind: "payment" },
      { id: "notice-2", employeeId, title: "Task submitted for review", message: "Resolve priority support tickets is awaiting approval.", date: offsetDate(0), kind: "task" },
    ],
    supportRequests: [],
  };
};

function readState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return makeInitialState();
    const defaults = makeInitialState();
    const parsed = JSON.parse(saved);
    return {
      ...defaults,
      ...parsed,
      employees: Array.isArray(parsed.employees) ? parsed.employees : defaults.employees,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaults.tasks,
      adjustments: Array.isArray(parsed.adjustments) ? parsed.adjustments : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : defaults.notifications,
      supportRequests: Array.isArray(parsed.supportRequests) ? parsed.supportRequests : [],
    };
  } catch (error) {
    console.error("Could not read employee portal data from local storage.", error);
    return makeInitialState();
  }
}

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function EmployeePortalProvider({ children }) {
  const [data, setData] = useState(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Could not save employee portal data to local storage.", error);
    }
  }, [data]);

  const update = useCallback((updater) => {
    setData((current) => {
      const next = updater(current);
      return next || current;
    });
  }, []);

  const notify = useCallback((employeeId, title, message, kind = "info") => {
    update((current) => ({
      ...current,
      notifications: [{ id: newId(), employeeId, title, message, date: localDateKey(), kind }, ...current.notifications],
    }));
  }, [update]);

  const actions = useMemo(() => ({
    switchEmployee(employeeId) {
      update((current) => current.employees.some((person) => person.id === employeeId && person.active)
        ? { ...current, employeeId, isAdmin: false }
        : current);
    },
    toggleAdmin() {
      update((current) => ({ ...current, isAdmin: !current.isAdmin }));
    },
    addEmployee(employee) {
      const person = { ...employee, id: newId(), active: true };
      update((current) => ({
        ...current,
        employees: [...current.employees, person],
        notifications: [{ id: newId(), employeeId: null, title: "New employee added", message: `${person.name} was added to the employee portal.`, date: localDateKey(), kind: "info" }, ...current.notifications],
      }));
    },
    setTarget(employeeId, targetPoints) {
      update((current) => ({
        ...current,
        employees: current.employees.map((person) => person.id === employeeId ? { ...person, targetPoints } : person),
        notifications: [{ id: newId(), employeeId, title: "Daily target updated", message: `Your daily target is now ${targetPoints.toLocaleString()} approved points.`, date: localDateKey(), kind: "info" }, ...current.notifications],
      }));
    },
    deactivateEmployee(employeeId) {
      update((current) => ({
        ...current,
        employees: current.employees.map((person) => person.id === employeeId ? { ...person, active: false } : person),
      }));
    },
    addTask({ title, description, points, employeeId }) {
      const task = { id: newId(), title, description, points, employeeId: employeeId || null, date: localDateKey(), status: employeeId ? "assigned" : "available", rejectReason: "" };
      update((current) => ({
        ...current,
        tasks: [task, ...current.tasks],
        notifications: employeeId
          ? [{ id: newId(), employeeId, title: "New task assigned", message: `${title} is ready for you.`, date: localDateKey(), kind: "task" }, ...current.notifications]
          : current.notifications,
      }));
      return person.id;
    },
    registerEmployee(employee) {
      const person = { ...employee, id: newId(), active: true };
      update((current) => ({
        ...current,
        employeeId: person.id,
        isAdmin: false,
        employees: [...current.employees, person],
        notifications: [
          { id: newId(), employeeId: person.id, title: "Welcome to your employee portal", message: "Your account is ready. Explore assigned work, points, and earnings here.", date: localDateKey(), kind: "info" },
          ...current.notifications,
        ],
      }));
      return person.id;
    },
    updateEmployee(employeeId, changes) {
      update((current) => ({
        ...current,
        employees: current.employees.map((person) => person.id === employeeId ? { ...person, ...changes } : person),
      }));
    },
    claimTask(taskId) {
      update((current) => ({
        ...current,
        tasks: current.tasks.map((task) => task.id === taskId && task.status === "available"
          ? { ...task, employeeId: current.employeeId, status: "assigned", date: localDateKey() }
          : task),
        notifications: [{ id: newId(), employeeId: current.employeeId, title: "Task claimed", message: "A new task is assigned to you. Submit it when work is complete.", date: localDateKey(), kind: "task" }, ...current.notifications],
      }));
    },
    submitTask(taskId) {
      update((current) => {
        const task = current.tasks.find((item) => item.id === taskId && item.employeeId === current.employeeId && item.status === "assigned");
        if (!task) return current;
        return {
          ...current,
          tasks: current.tasks.map((item) => item.id === taskId ? { ...item, status: "submitted", date: localDateKey() } : item),
          notifications: [{ id: newId(), employeeId: null, title: "Task submitted for review", message: `${personName(current, current.employeeId)} submitted ${task.title} for approval.`, date: localDateKey(), kind: "task" }, ...current.notifications],
        };
      });
    },
    reviewTask(taskId, approved, reason = "") {
      update((current) => {
        const task = current.tasks.find((item) => item.id === taskId && item.status === "submitted");
        if (!task) return current;
        const status = approved ? "approved" : "rejected";
        const message = approved
          ? `${task.title} was approved for ${task.points.toLocaleString()} points.`
          : `${task.title} was not approved. Reason: ${reason}`;
        return {
          ...current,
          tasks: current.tasks.map((item) => item.id === taskId ? { ...item, status, rejectReason: approved ? "" : reason } : item),
          notifications: [{ id: newId(), employeeId: task.employeeId, title: approved ? "Task approved" : "Task needs changes", message, date: localDateKey(), kind: "task" }, ...current.notifications],
        };
      });
    },
    adjustPoints({ employeeId, points, reason }) {
      update((current) => ({
        ...current,
        adjustments: [{ id: newId(), employeeId, points, date: localDateKey(), reason }, ...current.adjustments],
        notifications: [{ id: newId(), employeeId, title: "Point adjustment recorded", message: `${points > 0 ? "+" : ""}${points.toLocaleString()} points recorded. Reason: ${reason}`, date: localDateKey(), kind: "info" }, ...current.notifications],
      }));
    },
    recordPayment({ employeeId, reference, amount, period, dayKeys }) {
      update((current) => ({
        ...current,
        payments: [{ id: newId(), employeeId, reference, amount, period, dayKeys, paidAt: localDateKey(), status: "paid" }, ...current.payments],
        notifications: [{ id: newId(), employeeId, title: "Weekly payment confirmed", message: `$${amount.toFixed(2)} was recorded as paid. Reference: ${reference}.`, date: localDateKey(), kind: "payment" }, ...current.notifications],
      }));
    },
    addSupportRequest({ employeeId, topic, reference, message }) {
      update((current) => ({
        ...current,
        supportRequests: [{ id: newId(), employeeId, topic, reference, message, date: localDateKey() }, ...current.supportRequests],
        notifications: [{ id: newId(), employeeId: null, title: "New support request", message: `${personName(current, employeeId)} submitted a ${topic.toLowerCase()} request.`, date: localDateKey(), kind: "info" }, ...current.notifications],
      }));
    },
  }), [update]);

  const value = useMemo(() => ({ data, actions, ratePerPoint: RATE_PER_POINT, defaultDailyTarget: DEFAULT_DAILY_TARGET }), [data, actions]);
  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

function personName(data, employeeId) {
  return data.employees.find((person) => person.id === employeeId)?.name || "Employee";
}

export function useEmployeePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error("useEmployeePortal must be used within EmployeePortalProvider.");
  return context;
}

export { localDateKey, offsetDate };
