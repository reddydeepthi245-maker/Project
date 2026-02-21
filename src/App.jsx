import { useState, useMemo } from "react";

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

const initialTransactions = [
  { id: 1, type: "income", category: "Salary", amount: 50000, description: "Monthly salary", date: "2026-02-01" },
  { id: 2, type: "expense", category: "Food", amount: 1200, description: "Grocery run", date: "2026-02-05" },
  { id: 3, type: "expense", category: "Bills", amount: 2000, description: "Electricity bill", date: "2026-02-10" },
  { id: 4, type: "expense", category: "Transport", amount: 600, description: "Monthly metro pass", date: "2026-02-12" },
  { id: 5, type: "income", category: "Freelance", amount: 8000, description: "Web design project", date: "2026-02-14" },
  { id: 6, type: "expense", category: "Entertainment", amount: 450, description: "Netflix + Spotify", date: "2026-02-15" },
];

function formatCurrency(n) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState({ type: "expense", category: "Food", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

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

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      background: "#F0F4FF",
      color: "#0D1B3E",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: #FFFFFF; border: 1px solid #BBDEFB; border-radius: 14px; box-shadow: 0 2px 12px #1976D220; }
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
        .overlay { position: fixed; inset: 0; background: #00000055; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal { background: #FFFFFF; border: 2px solid #BBDEFB; border-radius: 16px; padding: 28px; width: 100%; max-width: 420px; }
        .label { font-size: 12px; color: #1565C0; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#1976D2", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 12px #1976D244" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: 1 }}>
            💰 BudgetBuddy
          </div>
          <div style={{ fontSize: 12, color: "#BBDEFB", marginTop: 2, letterSpacing: 1 }}>PERSONAL BUDGET TRACKER</div>
        </div>
        <button className="btn" style={{ background: "#FFFFFF", color: "#1976D2", padding: "10px 22px", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 8 }}
          onClick={() => { setShowForm(true); setEditId(null); setForm({ type: "expense", category: "Food", amount: "", description: "", date: new Date().toISOString().slice(0, 10) }); }}>
          + ADD TRANSACTION
        </button>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 800px", gap: 16, width: "100%" }}>

          {/* Transactions */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["all", "income", "expense"].map(f => (
                <button key={f} className={`btn filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f.toUpperCase()}
                </button>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 12, color: "#1565C0", fontWeight: 700, alignSelf: "center" }}>{filtered.length} transactions</div>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "#1565C0", fontSize: 14 }}>No transactions yet. Add one!</div>
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
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: "#0D1B3E" }}>
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