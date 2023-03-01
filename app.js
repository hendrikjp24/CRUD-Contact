const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const { body, validationResult, check, cookie } = require("express-validator");

// for using method put and delete
const methodOverride = require("method-override");

// mengambil koneksi dengan mongodb
require("./utils/db");

// mengambil schema dari models contact
const Contact = require("./model/contact");

// setting view engine dan kwan kwan
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// setting method override
app.use(methodOverride("_method"));

// Contact
app.get("/", async (req, res) => {
  const Contacts = await Contact.find();

  res.render("contact", {
    layout: "layout/main-layout",
    title: "Home Page",
    Contacts,
  });
});

// add contact to database
app.post(
  "/contact/add",
  [
    body("nama").custom(async (nama) => {
      const duplikat = await Contact.findOne({ nama: nama }); //menggunakan async await karena hasil dari query mongoose berupa promise
      if (duplikat) {
        throw new Error("Data Contact Sudah Ada!!");
      }
    }),
    check("email", "Email tidak valid!!").isEmail(),
    check("nohp", "No hp tidak valid!!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // return res.send(error.array());
      res.render("addContact", {
        title: "Form Add Contact",
        layout: "layout/main-layout",
        errors: error.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        res.redirect("/");
      });
    }
  }
);

// update dengan method put
app.put(
  "/contact",
  [
    body("nama").custom(async (nama, { req }) => {
      const duplikat = await Contact.findOne({ nama: nama }); //menggunakan async await karena hasil dari query mongoose berupa promise
      if (req.body.oldName != req.body.nama && duplikat) {
        throw new Error("Nama Contact Sudah Ada!");
      }
    }),
    check("email", "Email tidak valid!!").isEmail(),
    check("nohp", "No Hp tidak valid!!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.send(req.body);

      res.render("editContact", {
        title: "Form Edit Contact",
        layout: "layout/main-layout",
        errors: errors.array(),
        detailContact: req.body,
      });
    } else {
      await Contact.updateOne(
        {
          _id: req.body.id,
        },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nohp: req.body.nohp,
          },
        }
      ).then((result) => {
        res.redirect("/");
      });
    }
  }
);

// detail Contact
app.get("/contact/:id", async (req, res) => {
  const detailContact = await Contact.findById(req.params.id);

  res.render("detail", {
    title: "Detail Contact",
    layout: "layout/main-layout",
    detailContact,
  });
});

// form add contact
app.get("/addContact", (req, res) => {
  res.render("addContact", {
    title: "Form Add Contact",
    layout: "layout/main-layout",
  });
});

// form edit contact
app.get("/contact/edit/:id", async (req, res) => {
  const detailContact = await Contact.findById(req.params.id);

  res.render("editContact", {
    title: "Form Edit Contact",
    layout: "layout/main-layout",
    detailContact,
  });
});

// Delete Contact dengan menggunakan route delete
app.delete("/contact", async (req, res) => {
  const find = await Contact.findById(req.body.id);
  if (find) {
    await Contact.deleteOne({ _id: req.body.id });
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Mongo Contact App || Listening at port http://localhost:${port}`);
});
