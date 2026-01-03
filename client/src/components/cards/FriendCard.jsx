export default function FriendCard() {
  const friends = [
    {
      name: "Billie",
      image: "https://via.placeholder.com/80",
      url: "https://www.instagram.com/billieeilish",
    },
    {
      name: "Clairo",
      image: "https://via.placeholder.com/80",
      url: "https://www.instagram.com/clairo",
    },
    {
      name: "Girl in Red",
      image: "https://via.placeholder.com/80",
      url: "https://www.instagram.com/girlinred",
    },
    {
      name: "Conan Gray",
      image: "https://via.placeholder.com/80",
      url: "https://www.instagram.com/conangray",
    },
    {
      name: "beabadoobee",
      image: "https://via.placeholder.com/80",
      url: "https://www.instagram.com/beabadoobee",
    },
    {
      name: "Remi Wolf",
      image: "https://via.placeholder.com/80",
      url: "https://www.instagram.com/remiwolf",
    },
  ];

  return (
    <div className="y2k-card">
      <div className="y2k-card-header">
        Saint Misty's Friends ({friends.length})
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "12px",
        }}
      >
        {friends.map((friend, index) => (
          <a
            key={index}
            href={friend.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textAlign: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src={friend.image}
              alt={friend.name}
              className="y2k-img"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "4px",
                marginBottom: "4px",
              }}
            />
            <p style={{ fontSize: "11px", fontWeight: "bold" }}>{friend.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
