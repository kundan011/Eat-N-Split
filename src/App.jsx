import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function fireToast(msg, setToast) {
  clearTimeout(toastTimer);
  setToast({ msg, show: true });
  toastTimer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
}

// ─── Button ───────────────────────────────────────────────────────────────────
function Button({ children, onClick, variant = "default", fullWidth = false }) {
  return (
    <button
      className={`btn btn-${variant}${fullWidth ? " btn-full" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });

  const totalOwed = friends
    .filter((f) => f.balance < 0)
    .reduce((s, f) => s + Math.abs(f.balance), 0);
  const totalReceive = friends
    .filter((f) => f.balance > 0)
    .reduce((s, f) => s + f.balance, 0);
  const netBalance = totalReceive - totalOwed;

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleShowAddFriend() {
    setShowAddFriend((s) => !s);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    setFriends((fs) => [...fs, friend]);
    setShowAddFriend(false);
    fireToast(`${friend.name} added!`, setToast);
  }

  function handleDeleteFriend(id) {
    if (selectedFriend?.id === id) setSelectedFriend(null);
    setFriends((fs) => fs.filter((f) => f.id !== id));
    fireToast("Friend removed", setToast);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((fs) =>
      fs.map((f) =>
        f.id === selectedFriend.id ? { ...f, balance: f.balance + value } : f,
      ),
    );
    setSelectedFriend((f) => ({ ...f, balance: f.balance + value }));
    fireToast("Bill split successfully!", setToast);
  }

  return (
    <div className="page">
      {/* Toast */}
      <div className={`toast${toast.show ? " toast-show" : ""}`}>
        {toast.msg}
      </div>

      {/* Header */}
      <header className="header">
        <h1 className="logo">Eat-N-Split 🍕</h1>
        <p className="tagline">Track shared expenses with friends</p>
      </header>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">You owe</span>
          <span className="stat-value red">₹{totalOwed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">You receive</span>
          <span className="stat-value green">₹{totalReceive}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Net balance</span>
          <span className={`stat-value ${netBalance >= 0 ? "green" : "red"}`}>
            ₹{netBalance}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Friends</span>
          <span className="stat-value">{friends.length}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="app">
        {/* Sidebar */}
        <div className="sidebar card">
          <p className="section-label">Friends</p>
          <input
            className="search"
            type="text"
            placeholder="Search friends…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.length === 0 && <p className="empty">No friends found</p>}

          <ul>
            {filtered.map((f) => (
              <FriendItem
                key={f.id}
                friend={f}
                isSelected={selectedFriend?.id === f.id}
                onSelect={handleSelectFriend}
                onDelete={handleDeleteFriend}
              />
            ))}
          </ul>

          {showAddFriend && <AddFriendForm onAddFriend={handleAddFriend} />}

          <div className="sidebar-action">
            <Button onClick={handleShowAddFriend} variant="outline">
              {showAddFriend ? "✕ Cancel" : "+ Add friend"}
            </Button>
          </div>
        </div>

        {/* Split panel */}
        <div>
          {selectedFriend ? (
            <SplitBill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
            />
          ) : (
            <div className="card empty-panel">
              <p>👈 Select a friend to split a bill</p>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>Made with ❤️ · Eat-N-Split</p>
      </footer>
    </div>
  );
}

// ─── FriendItem ───────────────────────────────────────────────────────────────
function FriendItem({ friend, isSelected, onSelect, onDelete }) {
  return (
    <li
      className={`friend-item${isSelected ? " selected" : ""}`}
      onClick={() => onSelect(friend)}
    >
      <img src={friend.image} alt={friend.name} className="avatar" />
      <div className="friend-info">
        <h2 className="friend-name">{friend.name}</h2>
        {friend.balance < 0 && (
          <p className="balance red">
            You owe {friend.name} ₹{Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="balance green">
            {friend.name} owes you ₹{friend.balance}
          </p>
        )}
        {friend.balance === 0 && (
          <p className="balance neutral">You and {friend.name} are even</p>
        )}
      </div>
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(friend.id);
        }}
        title="Remove friend"
      >
        ✕
      </button>
    </li>
  );
}

// ─── AddFriendForm ────────────────────────────────────────────────────────────
function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = crypto.randomUUID();
    onAddFriend({
      id,
      name: name.trim(),
      image: `${image}?u=${id}`,
      balance: 0,
    });
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Friend name</label>
        <input
          type="text"
          placeholder="e.g. Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label>Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <Button variant="primary">Add</Button>
    </form>
  );
}

// ─── SplitBill ────────────────────────────────────────────────────────────────
function SplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend =
    bill !== "" && paidByUser !== "" ? Number(bill) - Number(paidByUser) : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || paidByUser === "") return;
    const value =
      whoIsPaying === "user" ? Number(paidByFriend) : -Number(paidByUser);
    onSplitBill(value);
    setBill("");
    setPaidByUser("");
    setWhoIsPaying("user");
  }

  return (
    <form className="split-form card" onSubmit={handleSubmit}>
      <h2 className="split-title">Split a bill with {selectedFriend.name}</h2>

      {/* Live preview */}
      {bill && paidByUser !== "" && (
        <div className="bill-preview">
          <div className="preview-item">
            <span>You pay</span>
            <strong>₹{paidByUser || 0}</strong>
          </div>
          <div className="preview-divider" />
          <div className="preview-item">
            <span>{selectedFriend.name} pays</span>
            <strong>₹{paidByFriend !== "" ? paidByFriend : 0}</strong>
          </div>
        </div>
      )}

      <div className="form-row">
        <label>💰 Bill value</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>💳 Your expense</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > Number(bill)
                ? paidByUser
                : e.target.value,
            )
          }
        />
      </div>

      <div className="form-row">
        <label>🧍 {selectedFriend.name}&apos;s expense</label>
        <input type="number" value={paidByFriend} disabled />
      </div>

      <div className="form-row">
        <label>🤑 Who is paying the bill?</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
      </div>

      <Button variant="primary" fullWidth>
        Split Bill ✓
      </Button>
    </form>
  );
}
