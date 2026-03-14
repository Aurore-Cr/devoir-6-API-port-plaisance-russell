require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");

const Catway = require("./models/Catway");
const Reservation = require("./models/Reservation");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connexion MongoDB OK");

    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    await User.deleteMany({});
    console.log(" Collections vidées");

    const catways = JSON.parse(fs.readFileSync("./data/catways.json"));
    await Catway.insertMany(catways);
    console.log(` ${catways.length} catways importés`);

    const reservations = JSON.parse(
      fs.readFileSync("./data/reservations.json"),
    );
    await Reservation.insertMany(reservations);
    console.log(` ${reservations.length} réservations importées`);

    const usersRaw = JSON.parse(fs.readFileSync("./data/users.json"));
    for (const u of usersRaw) {
      await new User(u).save(); // hash auto via pre-save
    }
    console.log(` ${usersRaw.length} utilisateur(s) importé(s)`);

    console.log("\n Base initialisée avec succès !");
    console.log(" Compte : test@test.com / test1234");
    process.exit(0);
  })
  .catch((err) => {
    console.error(" Erreur :", err.message);
    process.exit(1);
  });
