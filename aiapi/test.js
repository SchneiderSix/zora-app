const axios = require("axios");
let urlm = "http://localhost:3000/maketok";
let urlv = "http://localhost:3000/verifytok";

axios
  .post(urlm)
  .then(function (response) {
    tok = response.data["token"];
    console.log(response.data);
    axios
      .post(
        urlv,
        {},
        {
          headers: {
            Authorization: `Bear ${tok}`,
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .catch(function (err) {
    console.log(err);
  });

/*axios
  .post(
    urlv,
    {},
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJpZCI6MSwibmFtZSI6IkpvaG4iLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifSwiaWF0IjoxNjc1ODY2MTQyfQ.Y8_zGIFWMaXxxKHvQz_PMjNmkFExwhyCNFcGW2SZiE0",
      },
    }
  )
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (err) {
    console.log(err);
  });*/
