// Here's the complete code with user authentication, sign up, login, and localStorage! Replace everything in your App.jsx:
import { useState, useMemo, useEffect } from "react";

const CATEGORIES = {
  Food: { icon: "🍜", color: "#1565C0" },
  Transport: { icon: "🚗", color: "#1976D2" },
  Shopping: { icon: "🛍️", color: "#1E88E5" },
  Health: { icon: "💊", color: "#0D47A1" },
  Entertainment: { icon: "🎬", color: "#2196F3" },
  Bills: { icon: "⚡", color: "#1565C0" },
  Salary: { icon: "💰", color: "#1976D2" },
  Freelance: { icon: "💻", color: "#1E88E5" },
  Other: { icon: "📦", color: "#90CAF9" },
};

const INCOME_CATS = ["Salary", "Freelance"];
const EXPENSE_CATS = ["Food", "Transport", "Shopping", "Health", "Entertainment", "Bills", "Other"];

function formatCurrency(n) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── AUTH SCREEN ───────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = () => {
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    const users = JSON.parse(localStorage.getItem("fo_users") || "[]");
    if (users.find(u => u.email === form.email)) {
      setError("Email already registered. Please login."); return;
    }
    const newUser = { name: form.name, email: form.email, password: form.password };
    users.push(newUser);
    localStorage.setItem("fo_users", JSON.stringify(users));
    setSuccess("Account created! Please login.");
    setMode("login");
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  const handleLogin = () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) {
      setError("Please enter email and password."); return;
    }
    const users = JSON.parse(localStorage.getItem("fo_users") || "[]");
    const user = users.find(u => u.email === form.email && u.password === form.password);
    if (!user) {
      setError("Invalid email or password."); return;
    }
    localStorage.setItem("fo_currentUser", JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0D47A1",width:"100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif"
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input { width: 100%; padding: 12px 16px; border: 2px solid #BBDEFB; border-radius: 8px; font-size: 14px; font-family: 'Georgia', serif; color: #0D1B3E; background: #FFFFFF; outline: none; transition: border 0.2s; }
        .auth-input:focus { border-color: #1976D2; }
        .auth-btn { width: 100%; padding: 13px; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; font-family: 'Georgia', serif; cursor: pointer; transition: all 0.2s; }
        .auth-btn:hover { transform: translateY(-1px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        background: "#FFFFFF", borderRadius: 20, padding: "40px 36px",
        width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        animation: "fadeIn 0.4s ease"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48 }}>💰</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0D47A1", marginTop: 8 }}>FinanceOS</div>
          <div style={{ fontSize: 12, color: "#90A4AE", letterSpacing: 2, marginTop: 4 }}>PERSONAL BUDGET TRACKER</div>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", background: "#E3F2FD", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); setForm({ name: "", email: "", password: "", confirm: "" }); }} style={{
              flex: 1, padding: "10px", border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 13,
              background: mode === m ? "#1976D2" : "transparent",
              color: mode === m ? "#FFFFFF" : "#1976D2",
              transition: "all 0.2s"
            }}>
              {m === "login" ? "🔑 LOGIN" : "✍️ SIGN UP"}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#C62828" }}>
            ❌ {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#2E7D32" }}>
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <div style={{ display: "grid", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, display: "block", marginBottom: 6 }}>FULL NAME</label>
              <input className="auth-input" type="text" placeholder="Enter your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, display: "block", marginBottom: 6 }}>EMAIL ADDRESS</label>
            <input className="auth-input" type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input className="auth-input" type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, display: "block", marginBottom: 6 }}>CONFIRM PASSWORD</label>
              <input className="auth-input" type="password" placeholder="Re-enter your password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
            </div>
          )}
        </div>

        <button className="auth-btn" onClick={mode === "login" ? handleLogin : handleSignup} style={{
          marginTop: 22, background: "#1976D2", color: "#FFFFFF"
        }}>
          {mode === "login" ? "🔑 LOGIN TO ACCOUNT" : "✍️ CREATE ACCOUNT"}
        </button>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "#90A4AE" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }} style={{ color: "#1976D2", fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? "Sign Up" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: "expense", category: "Food", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  // Check if user already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("fo_currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      loadTransactions(user.email);
    }
  }, []);

  // Load transactions for this user from localStorage
  const loadTransactions = (email) => {
    const key = "fo_transactions_" + email;
    const saved = localStorage.getItem(key);
    setTransactions(saved ? JSON.parse(saved) : []);
  };

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      const key = "fo_transactions_" + currentUser.email;
      localStorage.setItem(key, JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    loadTransactions(user.email);
  };

  const handleLogout = () => {
    localStorage.removeItem("fo_currentUser");
    setCurrentUser(null);
    setTransactions([]);
  };

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const filtered = transactions
    .filter(t => filter === "all" || t.type === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSubmit = () => {
    if (!form.amount || !form.description || !form.date) return;
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) return;
    if (editId !== null) {
      setTransactions(prev => prev.map(t => t.id === editId ? { ...form, id: editId, amount: amt } : t));
      setEditId(null);
    } else {
      setTransactions(prev => [...prev, { ...form, id: Date.now(), amount: amt }]);
    }
    setForm({ type: "expense", category: "Food", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  };

  const handleEdit = (t) => {
    setForm({ type: t.type, category: t.category, amount: String(t.amount), description: t.description, date: t.date });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id) => setTransactions(prev => prev.filter(t => t.id !== id));
  const maxExpense = categoryBreakdown.length ? categoryBreakdown[0][1] : 1;

  // Show auth screen if not logged in
  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={{
      minHeight: "100vh", width: "100%", overflowX: "hidden",
      background: "#F0F4FF", color: "#0D1B3E", fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: #FFFFFF; border: 1px solid #BBDEFB; border-radius: 14px; box-shadow: 0 2px 12px rgba(25,118,210,0.12); }
        .btn { cursor: pointer; border: none; border-radius: 8px; font-family: 'Georgia', serif; font-weight: 700; transition: all 0.15s; }
        .btn:hover { transform: translateY(-1px); }
        .btn-primary { background: #1976D2; color: #FFFFFF; padding: 10px 22px; font-size: 14px; }
        .btn-primary:hover { background: #1565C0; }
        .btn-danger { background: #FFF0F0; color: #C62828; border: 1px solid #FFCDD2; padding: 6px 12px; font-size: 12px; font-weight: 700; }
        .btn-danger:hover { background: #FFCDD2; }
        .btn-edit { background: #E3F2FD; color: #1565C0; border: 1px solid #BBDEFB; padding: 6px 12px; font-size: 12px; font-weight: 700; }
        .btn-edit:hover { background: #BBDEFB; }
        .filter-btn { background: #FFFFFF; color: #1565C0; border: 1px solid #BBDEFB; padding: 8px 18px; font-size: 13px; font-weight: 700; }
        .filter-btn.active { background: #1976D2; color: #FFFFFF; border-color: #1976D2; }
        .input { background: #FFFFFF; border: 2px solid #BBDEFB; border-radius: 8px; color: #0D1B3E; padding: 10px 14px; font-family: 'Georgia', serif; font-size: 14px; width: 100%; outline: none; transition: border 0.15s; }
        .input:focus { border-color: #1976D2; }
        .input option { background: #FFFFFF; color: #0D1B3E; }
        .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .tx-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #E3F2FD; transition: background 0.1s; }
        .tx-row:hover { background: #F0F8FF; }
        .tx-row:last-child { border-bottom: none; }
        .bar-fill { height: 8px; border-radius: 4px; transition: width 0.5s ease; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal { background: #FFFFFF; border: 2px solid #BBDEFB; border-radius: 16px; padding: 28px; width: 100%; max-width: 420px; }
        .label { font-size: 12px; color: #1565C0; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1976D2", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 12px rgba(25,118,210,0.3)" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>💰 BudgetBuddy</div>
          <div style={{ fontSize: 11, color: "#BBDEFB", marginTop: 2, letterSpacing: 1 }}>PERSONAL BUDGET TRACKER</div>
        </div>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 700 }}>👤 {currentUser.name}</div>
            <div style={{ fontSize: 11, color: "#BBDEFB" }}>{currentUser.email}</div>
          </div>
          <button className="btn" style={{ background: "#FFFFFF", color: "#1976D2", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}
            onClick={() => { setShowForm(true); setEditId(null); setForm({ type: "expense", category: "Food", amount: "", description: "", date: new Date().toISOString().slice(0, 10) }); }}>
            + ADD
          </button>
          <button className="btn" style={{ background: "#C62828", color: "#FFFFFF", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}
            onClick={handleLogout}>
            🚪 LOGOUT
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: "100%", margin: "0 auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }} className="fade-up">
          {[
            { label: "BALANCE", value: stats.balance, color: stats.balance >= 0 ? "#2E7D32" : "#C62828", bg: stats.balance >= 0 ? "#E8F5E9" : "#FFEBEE" },
            { label: "TOTAL INCOME", value: stats.income, color: "#2E7D32", bg: "#E8F5E9" },
            { label: "TOTAL EXPENSES", value: stats.expense, color: "#C62828", bg: "#FFEBEE" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "20px", background: s.bg }}>
              <div style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{formatCurrency(s.value)}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 600px", gap: 16, width: "100%" }}>

          {/* Transactions */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14}}>
              {["all", "income", "expense"].map(f => (
                <button key={f} className={`btn filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f.toUpperCase()}
                </button>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 12, color: "#1565C0", fontWeight: 700, alignSelf: "center" }}>{filtered.length} transactions</div>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "#1565C0", fontSize: 14 }}>
                  No transactions yet. Click + ADD to get started!
                </div>
              )}
              {filtered.map(t => {
                const cat = CATEGORIES[t.category];
                return (
                  <div key={t.id} className="tx-row">
                    <div style={{ fontSize: 24, width: 36, textAlign: "center" }}>{cat.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: "#0D1B3E", fontWeight: 700 }}>{t.description}</div>
                      <div style={{ fontSize: 12, color: "#1565C0", marginTop: 3 }}>
                        <span className="tag" style={{ background: "#E3F2FD", color: "#1565C0" }}>{t.category}</span>
                        <span style={{ marginLeft: 8, color: "#5C85C0" }}>{t.date}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: t.type === "income" ? "#2E7D32" : "#C62828", minWidth: 100, textAlign: "right" }}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-edit" onClick={() => handleEdit(t)}>EDIT</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>DEL</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>SPENDING BY CATEGORY</div>
            <div className="card" style={{ padding: "20px" }}>
              {categoryBreakdown.length === 0 && <div style={{ color: "#1565C0", fontSize: 13 }}>No expenses yet.</div>}
              {categoryBreakdown.map(([cat, amt]) => {
                const c = CATEGORIES[cat];
                return (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, color: "#0D1B3E", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{c.icon}</span><span>{cat}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1565C0" }}>{formatCurrency(amt)}</div>
                    </div>
                    <div style={{ background: "#E3F2FD", borderRadius: 4, height: 8, overflow: "hidden" }}>
                      <div className="bar-fill" style={{ width: `${(amt / maxExpense) * 100}%`, background: "#1976D2" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {stats.income > 0 && (
              <div className="card" style={{ padding: "20px", marginTop: 16, background: "#E3F2FD" }}>
                <div style={{ fontSize: 12, color: "#1565C0", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>SAVINGS RATE</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#1976D2" }}>
                  {Math.max(0, Math.round((stats.balance / stats.income) * 100))}%
                </div>
                <div style={{ fontSize: 12, color: "#1565C0", marginTop: 6, fontWeight: 600 }}>of income saved this period</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal fade-up">
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: "#0D1B3E" }}>
              {editId ? "✏️ Edit Transaction" : "➕ New Transaction"}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["expense", "income"].map(type => (
                <button key={type} className="btn" onClick={() => setForm(f => ({ ...f, type, category: type === "income" ? "Salary" : "Food" }))} style={{
                  flex: 1, padding: "10px", fontSize: 13, fontWeight: 700,
                  background: form.type === type ? (type === "income" ? "#E8F5E9" : "#FFEBEE") : "#FFFFFF",
                  color: form.type === type ? (type === "income" ? "#2E7D32" : "#C62828") : "#1565C0",
                  border: `2px solid ${form.type === type ? (type === "income" ? "#2E7D32" : "#C62828") : "#BBDEFB"}`,
                }}>
                  {type === "income" ? "💰 INCOME" : "💸 EXPENSE"}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {(form.type === "income" ? INCOME_CATS : EXPENSE_CATS).map(c => (
                    <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Amount (₹)</label>
                <input className="input" type="number" placeholder="0.00" min="0" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label className="label">Description</label>
                <input className="input" type="text" placeholder="What was this for?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="label">Date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn" style={{ flex: 1, padding: "12px", background: "#E3F2FD", border: "2px solid #BBDEFB", color: "#1565C0", fontSize: 13, fontWeight: 700 }} onClick={() => setShowForm(false)}>
                CANCEL
              </button>
              <button className="btn btn-primary" style={{ flex: 2, padding: "12px", fontSize: 13 }} onClick={handleSubmit}>
                {editId ? "UPDATE" : "ADD TRANSACTION"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}