const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
      trim:true
    },
    password: { type: String, required: true, minlength: 8, select: false, trim:true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    emailVerifiedAt: {type: Date}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
