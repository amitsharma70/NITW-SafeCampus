import { useState } from "react";
import "./Profile.css";

const closeFriends = [
  {
    id: 1,
    name: "Amit Sharma",
    subtitle: "Close Friend",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 2,
    name: "Rohit Kumar",
    subtitle: "Close Friend",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
];

const addFriends = [
  {
    id: 3,
    name: "Sneha Verma",
    subtitle: "Computer Science",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: 4,
    name: "Anjali Singh",
    subtitle: "Electrical Engg",
    avatar: "https://i.pravatar.cc/100?img=45",
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("close");

  const list = activeTab === "close" ? closeFriends : addFriends;

  return (
    <div className="profile-screen">

      {/* USER INFO */}
      <div className="profile-header">
        <img
          src="https://i.pravatar.cc/150?img=8"
          alt="profile"
          className="profile-avatar"
        />
        <h2>Rahul Mehta</h2>
        <p>Roll No: 20CS103</p>
        <p>B.Tech · CSE · 2020–2024</p>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={activeTab === "close" ? "active" : ""}
          onClick={() => setActiveTab("close")}
        >
          Close friends
        </button>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add friends
        </button>
        {/* <button disabled>Category</button> */}
      </div>

      {/* FRIEND LIST */}
      <div className="friend-list">
        {list.map((user) => (
          <div key={user.id} className="friend-item">
            <div className="friend-left">
              <img src={user.avatar} alt="" />
              <div>
                <h4>{user.name}</h4>
                <span>{user.subtitle}</span>
              </div>
            </div>

            <button className="friend-action">
              {activeTab === "close" ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;
