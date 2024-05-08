require("dotenv").config();
const bcrypt = require("bcryptjs");

const Database = require("dbcmps369");

class ContactDB {
  constructor() {
    this.db = new Database();
  }

  async initialize() {
    await this.db.connect();

    await this.db.schema(
      "Contact",
      [
        { name: "ID", type: "INTEGER" },
        { name: "Title", type: "TEXT" },
        { name: "First_Name", type: "TEXT" },
        { name: "Last_Name", type: "TEXT" },
        { name: "Phone_Number", type: "TEXT" },
        { name: "Email_Address", type: "TEXT" },
        { name: "Address", type: "TEXT" },
        { name: "Contact_By_Email", type: "INTEGER" },
        { name: "Contact_By_Phone", type: "INTEGER" },
        { name: "Contact_By_Mail", type: "INETEGER" },
        { name: "Latitude", type: "REAL" },
        { name: "Longitude", type: "REAL" },
      ],
      "ID"
    );

    await this.db.schema(
      "Users",
      [
        { name: "ID", type: "INTEGER" },
        { name: "First_Name", type: "TEXT" },
        { name: "Last_Name", type: "TEXT" },
        { name: "Username", type: "TEXT UNIQUE" },
        { name: "Password", type: "TEXT" },
      ],
      "ID"
    );

    const contact = await this.db.read("Users", [
      { column: "Username", value: "cmps369" },
    ]);
    if (contact.length === 0) {
      await this.db.create("Users", [
        { column: "First_Name", value: "cmps369" },
        { column: "Last_Name", value: "" },
        { column: "Username", value: "cmps369" },
        {
          column: "Password",
          value: bcrypt.hashSync("rcnj", bcrypt.genSaltSync(10)),
        },
      ]);
    }
  }

  async findContactById(id) {
    const contact = await this.db.read("Contact", [
      { column: "ID", value: id },
    ]);
    if (contact.length > 0) return contact[0];
    else {
      return undefined;
    }
  }

  async addNewContact(contact) {
    await this.db.create("Contact", [
      {
        column: "Title",
        value:
          contact.title === "1"
            ? "Mr"
            : contact.title === "2"
            ? "Mrs"
            : contact.title === "3"
            ? "Ms"
            : "Dr",
      },
      { column: "First_Name", value: contact.firstName },
      { column: "Last_Name", value: contact.lastName },
      { column: "Phone_Number", value: contact.phoneNumber },
      { column: "Email_Address", value: contact.emailAddress },
      { column: "Address", value: contact.address },
      {
        column: "Contact_By_Email",
        value: contact.contactByEmail,
      },
      {
        column: "Contact_By_Phone",
        value: contact.contactByPhone,
      },
      {
        column: "Contact_By_Mail",
        value: contact.contactByMail,
      },
      {
        column: "Latitude",
        value: contact.latitude,
      },
      {
        column: "Longitude",
        value: contact.longitude,
      },
    ]);
  }

  async getAllContacts() {
    try {
      const contacts = await this.db.read("Contact", []);
      return contacts;
    } catch (error) {
      console.error("Error getting contacts:", error);
      throw error;
    }
  }

  async deleteContact(id) {
    try {
      await this.db.delete("Contact", [{ column: "ID", value: id }]);
    } catch (error) {
      console.error("Error deleting contacts:", error);
      throw error;
    }
  }

  async updateContact(contact, id) {
    try {
      await this.db.update(
        "Contact",
        [
          {
            column: "Title",
            value:
              contact.title === "1"
                ? "Mr"
                : contact.title === "2"
                ? "Mrs"
                : contact.title === "3"
                ? "Ms"
                : "Dr",
          },
          { column: "First_Name", value: contact.firstName },
          { column: "Last_Name", value: contact.lastName },
          { column: "Phone_Number", value: contact.phoneNumber },
          { column: "Email_Address", value: contact.emailAddress },
          { column: "Address", value: contact.address },
          {
            column: "Contact_By_Email",
            value: contact.contactByEmail,
          },
          {
            column: "Contact_By_Phone",
            value: contact.contactByPhone,
          },
          {
            column: "Contact_By_Mail",
            value: contact.contactByMail,
          },
          {
            column: "Latitude",
            value: contact.latitude,
          },
          {
            column: "Longitude",
            value: contact.longitude,
          },
        ],
        [{ column: "ID", value: id }]
      );
    } catch (error) {
      console.error("Error updating contacts:", error);
      throw error;
    }
  }

  async findUserByUsername(username) {
    const users = await this.db.read("Users", [
      { column: "Username", value: username },
    ]);
    if (users.length > 0) return users[0];
    else {
      return undefined;
    }
  }

  async findUserById(id) {
    const us = await this.db.read("Users", [{ column: "ID", value: id }]);
    if (us.length > 0) return us[0];
    else {
      return undefined;
    }
  }

  async createUser(firstName, lastName, username, password) {
    const id = await this.db.create("Users", [
      { column: "First_Name", value: firstName },
      { column: "Last_Name", value: lastName },
      { column: "Username", value: username },
      { column: "Password", value: password },
    ]);
    return id;
  }
}

module.exports = ContactDB;
