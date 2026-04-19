import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("close");
  const [userInfo, setUserInfo] = useState(null);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  /* Fetch user profile */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/users/${userId}`
      );
      setUserInfo(res.data);
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  /* Fetch friends */
  const fetchFriends = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/friends/list?userId=${userId}`
      );
      setFriends(res.data);
    } catch (err) {
      console.error("Friends fetch error", err);
    }
  };

  /* Fetch all users for Add tab */
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/users`
      );
      setAllUsers(res.data);
    } catch (err) {
      console.error("All users fetch error", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFriends();
    fetchAllUsers();
  }, []);

  /* Add friend */
  const handleAddFriend = async (friendId) => {
    try {
      await axios.post(`${API_URL}/api/friends/add`, {
        userId,
        friendId,
      });

      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  /* Remove friend */
  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post(`${API_URL}/api/friends/remove`, {
        userId,
        friendId,
      });

      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  /* Filter users for Add tab */
  const addFriends = allUsers.filter(
    (u) =>
      u._id !== userId &&
      !friends.some((f) => f._id === u._id)
  );

  const list = activeTab === "close" ? friends : addFriends;

  return (
    <div className="profile-screen">

      {/* USER INFO */}
      <div className="profile-header">
        <img
          src="https://i.pravatar.cc/150?img=8"
          alt="profile"
          className="profile-avatar"
        />
        <h2>{userInfo?.name}</h2>
        <p>Roll No: {userInfo?.rollNumber}</p>
        <p>
          {userInfo?.branch} · {userInfo?.batch}
        </p>
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
      </div>

      {/* FRIEND LIST */}
      <div className="friend-list">
        {list.map((user) => (
          <div key={user._id} className="friend-item">
            <div className="friend-left">
              <img
                src={`https://i.pravatar.cc/100?u=${user._id}`}
                alt=""
              />
              <div>
                <h4>{user.name}</h4>
                <span>
                  {activeTab === "close"
                    ? "Close Friend"
                    : user.branch}
                </span>
              </div>
            </div>

            <button
              className="friend-action"
              onClick={() =>
                activeTab === "close"
                  ? handleRemoveFriend(user._id)
                  : handleAddFriend(user._id)
              }
            >
              {activeTab === "close" ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;