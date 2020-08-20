const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");
const { render } = require("ejs");

const clientId = "63e86a9b2b384bc3a680bab6d20e975b";
const clientSecret =
  "a63381576f0c9ad58cef41e4b1555234d2943690c9bb5ac9c71924cb2940e1a7";

var spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
});

//INITALIZE APP
const app = express();

//Setting PUBLIC static folder
app.use("/", express.static(path.join(__dirname, "public")));

// Setting Up View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//Setting Routes
app.get("/", (req, res) => {
  //   const newToken = getToken();
  res.render("main", { count: 0, patharr2: [], error: "" });
});

app.post("/", (req, res) => {
  const { artone, arttwo, token } = req.body;
  spotifyApi.setAccessToken(token);
  spotifyApi.searchArtists(arttwo, { limit: 1, offset: 0 }, function (
    err,
    data
  ) {
    if (err) {
      console.error(err);
    } else {
      let id2 = data.body.artists.items[0].id;
      let art2 = data.body.artists.items[0];
      spotifyApi.searchArtists(artone, { limit: 1, offset: 0 }, function (
        err,
        data
      ) {
        if (err) {
          console.error(err);
        } else {
          let id1 = data.body.artists.items[0].id;
          let art1 = data.body.artists.items[0];
          let doneyet = false;
          var artistsObj = {};
          let fails = 0;
          function recur(id, count, patharr) {
            var patharr2 = patharr;
            spotifyApi.getArtistRelatedArtists(id).then(
              function (data) {
                var artists = data.body.artists;
                var idarr = [];
                artists.forEach(artist => {
                  idarr.push(artist.id);
                });
                if (idarr.includes(id2)) {
                  doneyet = true;
                  res.render("main", {
                    count: count + 1,
                    patharr2: [...patharr2, art2],
                    error: ""
                  });
                } else {
                  artists.forEach(artist => {
                    if (
                      !artistsObj.hasOwnProperty(artist.id) &&
                      count < 3 &&
                      !doneyet
                    ) {
                      artistsObj[artist.id] = artist.id;
                      recur(artist.id, count + 1, [...patharr2, artist]);
                      fails++;
                    } else {
                      if (fails > 400) {
                        res.render("main", {
                          count: 0,
                          patharr2: [],
                          error: "API CALLS EXCEEDED !!!!!!"
                        });
                      }
                    }
                  });
                }
              },
              function (err) {
                console.log(err);
              }
            );
          }
          var arr = [art1];
          recur(id1, 0, arr);
        }
      });
    }
  });
});

//Listening TO PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on PORT ${PORT}`));
