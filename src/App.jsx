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

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div>
      <div className="container">
        <h1>Eat-N-Split 🍕</h1>
      </div>

      <div className="app ">
        <div className="sidebar">
          <FriendList
            friends={friends}
            handleSelectFriend={handleSelectFriend}
            selectedFriend={selectedFriend}
          ></FriendList>
          {showAddFriend && <AddFriendForm onAddFriend={handleAddFriends} />}
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend && (
          <SplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
      <footer className="footer">
        <p>Max@Eat-N-Split</p>
      </footer>
    </div>
  );
}

function FriendList({ friends, handleSelectFriend, selectedFriend }) {
  // const Friends = initialFriends;
  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            handleSelectFriend={handleSelectFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ friend, handleSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <div>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} />
        <h2>{friend.name}</h2>

        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        {/* <p>{name}</p> */}
        <Button onClick={() => handleSelectFriend(friend)}>
          {isSelected ? "close" : "select"}
        </Button>
      </li>
    </div>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = self.crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  console.log(bill, paidByUser, whoIsPaying);

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  onSplitBill;

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label> 💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>💳Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>
      <label>🧍{selectedFriend.name} expense</label>
      <input type="text" value={paidByFriend}></input>
      <label>🤑Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
        <option>Y</option>
      </select>{" "}
      <Button>Split Bill</Button>
    </form>
  );
}
