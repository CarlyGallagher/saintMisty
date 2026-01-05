import anonProfile from "../../assets/Anon-Profile.png";

export default function FriendCard() {
  const friends = [
    {
      name: "Daddy",
      image: anonProfile,
      url: "https://www.daddy-music.com/",
    },
    {
      name: "The Dimes",
      image: anonProfile,
      url: "https://linktr.ee/thedimesofficial?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnxkmqXwyEkWthFXX4921DwpzUhEjOFFQtPooT3FW3GoMz5Crx75OzRJwjd3k_aem_-DqqeOgTp0KeWfdkR1u2YQ",
    },
    {
      name: "Mariela",
      image: anonProfile,
      url: "https://mariela.band/",
    },
    {
      name: "The Band Cope",
      image: anonProfile,
      url: "https://www.the-band-cope.com/",
    },
    {
      name: "The Whole Damn Dog",
      image: anonProfile,
      url: "https://www.wholedamndog.com/",
    },
    {
      name: "Ty Fox Photo",
      image: anonProfile,
      url: "https://www.tyfox.photography/",
    },
    {
      name: "Raspberry Management",
      image: anonProfile,
      url: "https://www.raspberryrecords.co/artists/",
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
