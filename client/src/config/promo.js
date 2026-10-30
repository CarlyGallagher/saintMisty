import creepinImg from "../assets/creepin.jpeg";

// Site-wide promo modal shown when someone first opens the site.
// To run a new promo: change the fields below and give it a new `id`
// (a new id makes it show again for visitors who closed the old one).
// Set to null to turn the promo off.
const promo = {
  id: "creepin",
  title: "Listen to Creepin now",
  // Optional; Google Fonts must also be linked in public/index.html
  titleFont: '"Creepster", system-ui',
  image: creepinImg,
  links: [
    { label: "Spotify", url: "https://open.spotify.com/album/6werkTJXzBuRaF8rMl2E70?si=V_g8MYqgQ4yaIuddbUuMSQ" },
    { label: "Apple", url: "https://music.apple.com/us/album/creepin-single/6821458378" },
  ],
};

export default promo;
