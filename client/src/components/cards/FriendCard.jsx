import angelAnon from "../../assets/Angel-Anon.jpg";
import catAnon from "../../assets/cat-Anon.jpg";
import devilAnon from "../../assets/Devil-Anon.jpg";
import flowerAnon from "../../assets/Flower-Anon.jpg";
import mustacheAnon from "../../assets/Mustache-Anon.jpg";
import princessAnon from "../../assets/Princess-anon.jpg";

export default function FriendCard() {
  const friends = [
    {
      name: "Daddy",
      image: angelAnon,
      url: "https://www.daddy-music.com/",
    },
    {
      name: "The Dimes",
      image: catAnon,
      url: "https://linktr.ee/thedimesofficial?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnxkmqXwyEkWthFXX4921DwpzUhEjOFFQtPooT3FW3GoMz5Crx75OzRJwjd3k_aem_-DqqeOgTp0KeWfdkR1u2YQ",
    },
    {
      name: "Mariela",
      image: devilAnon,
      url: "https://mariela.band/",
    },
    {
      name: "The Band Cope",
      image: flowerAnon,
      url: "https://www.the-band-cope.com/",
    },
    {
      name: "The Whole Damn Dog",
      image: mustacheAnon,
      url: "https://www.wholedamndog.com/",
    },
    {
      name: "Ty Fox Photo",
      image: princessAnon,
      url: "https://www.tyfox.photography/",
    },
    {
      name: "Raspberry Management",
      image: angelAnon,
      url: "https://www.raspberryrecords.co/artists/",
    },
  ];

  return (
    <div className="y2k-card" style={{ background: "rgba(253, 66, 154, 0.8)" }}>
      <div className="y2k-card-header">
        Saint Misty's Friends ({friends.length})
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
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
                width: "70%",
                height: "auto",
                aspectRatio: "1",
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
