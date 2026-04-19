// import { useState } from "react";
// import IncidentModal from "./IncidentModal";
// import "./IncidentFeed.css";

// const incidents = [
//   {
//     id: 1,
//     title: "Street light not working near Gate 2",
//     description:
//       "The street light near Gate 2 has been non-functional for the last two nights.",
//     image:
//       "https://images.unsplash.com/photo-1504306660839-0bda66bdfb0b",
//   },
//   {
//     id: 2,
//     title: "Suspicious activity near boys hostel",
//     description:
//       "Multiple students reported suspicious activity near the hostel after 11 PM.",
//     image:
//       "https://images.unsplash.com/photo-1494783367193-149034c05e8f",
//   },
//   {
//     id: 3,
//     title: "Water leakage in academic block",
//     description:
//       "Water leakage observed near the electrical panel in the academic block.",
//     image:
//       "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
//   },
// ];

// const IncidentFeed = () => {
//   const [activeIncident, setActiveIncident] = useState(null);

//   return (
//     <div className="feed-container">
//       {incidents.map((item) => (
//         <div
//           key={item.id}
//           className="feed-card"
//           onClick={() => setActiveIncident(item)}
//         >
//           <img src={item.image} alt="" className="feed-image" />

//           <div className="feed-text">
//             <h3>{item.title}</h3>
//             <p>{item.description}</p>
//           </div>

//           <div className="feed-votes">
//             <span>▲</span>
//             <span>12</span>
//             <span>▼</span>
//           </div>
//         </div>
//       ))}

//       {activeIncident && (
//         <IncidentModal
//           incident={activeIncident}
//           onClose={() => setActiveIncident(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default IncidentFeed;


import { useState } from "react";
import IncidentModal from "./IncidentModal";
import "./IncidentFeed.css";

const incidents = [
  {
    id: 1,
    title: "Street light not working near Gate 2",
    description:
      "The street light near Gate 2 has been non-functional for the last two nights.",
    image:
      "https://images.unsplash.com/photo-1504306660839-0bda66bdfb0b",
    tag: "Infrastructure",
    time: "2h ago",
    votes: 12,
  },
  {
    id: 2,
    title: "Suspicious activity near boys hostel",
    description:
      "Multiple students reported suspicious activity near the hostel after 11 PM.",
    image:
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f",
    tag: "Security",
    time: "5h ago",
    votes: 28,
  },
  {
    id: 3,
    title: "Water leakage in academic block",
    description:
      "Water leakage observed near the electrical panel in the academic block.",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    tag: "Maintenance",
    time: "1d ago",
    votes: 7,
  },
];

const IncidentFeed = () => {
  const [activeIncident, setActiveIncident] = useState(null);

  return (
    <div className="feed-container">

      <div className="feed-header">
        <h2>Incident Feed</h2>
        <p>Recent reports from campus</p>
      </div>

      <div className="feed-list">
        {incidents.map((item) => (
          <div
            key={item.id}
            className="feed-card"
            onClick={() => setActiveIncident(item)}
          >
            <img src={item.image} alt="" className="feed-image" />

            <div className="feed-body">
              <span className="feed-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

            <div className="feed-footer">
              <div className="feed-votes">
                <button className="vote-btn" onClick={(e) => e.stopPropagation()}>▲</button>
                <span className="vote-count">{item.votes}</span>
                <button className="vote-btn" onClick={(e) => e.stopPropagation()}>▼</button>
              </div>
              <span className="feed-time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      {activeIncident && (
        <IncidentModal
          incident={activeIncident}
          onClose={() => setActiveIncident(null)}
        />
      )}
    </div>
  );
};

export default IncidentFeed;