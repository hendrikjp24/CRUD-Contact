const monggose = require("mongoose");

// Membuat schema / struktur
const Contact = monggose.model("Contact", {
  nama: {
    type: String,
    required: true,
  },
  nohp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports = Contact;
