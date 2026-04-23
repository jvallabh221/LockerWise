/**
 * Creates or updates an Admin user using the same DBURL the backend uses.
 *
 * Required env vars (set these temporarily on Railway or in a local .env):
 *   DBURL           - MongoDB connection string (already set for the app)
 *   ADMIN_EMAIL     - Email for the admin account
 *   ADMIN_PASSWORD  - Plain-text password (will be bcrypt-hashed)
 *
 * Optional:
 *   ADMIN_NAME      - Display name (default: "Admin")
 *   ADMIN_PHONE     - Phone number (default: "0000000000")
 *   ADMIN_GENDER    - "Male" | "Female" | "Other" (default: "Other")
 *   ADMIN_RESET     - If "true", overwrite password for an existing admin
 *
 * Usage on Railway:
 *   ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD='Strong!Pass1' node scripts/createAdmin.js
 *
 * Usage locally:
 *   cd backend
 *   ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD='Strong!Pass1' node scripts/createAdmin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const {
    DBURL,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_NAME = "Admin",
    ADMIN_PHONE = "0000000000",
    ADMIN_GENDER = "Other",
    ADMIN_RESET = "false",
} = process.env;

const die = (msg, code = 1) => {
    console.error(`\n  ✖ ${msg}\n`);
    process.exit(code);
};

const ok = (msg) => console.log(`  ✓ ${msg}`);

(async () => {
    if (!DBURL) die("DBURL is not set. Set it in .env or Railway variables.");
    if (!ADMIN_EMAIL) die("ADMIN_EMAIL is required.");
    if (!ADMIN_PASSWORD) die("ADMIN_PASSWORD is required.");
    if (String(ADMIN_PASSWORD).length < 8) die("ADMIN_PASSWORD must be at least 8 characters.");

    console.log("\n  LockerWise · create admin");
    console.log("  ─────────────────────────");

    try {
        await mongoose.connect(DBURL);
        ok("Connected to MongoDB");
    } catch (err) {
        die(`Failed to connect to MongoDB: ${err.message}`);
    }

    try {
        const existing = await User.findOne({ email: ADMIN_EMAIL });

        if (existing) {
            if (existing.role !== "Admin") {
                die(
                    `A user with email "${ADMIN_EMAIL}" already exists with role "${existing.role}". ` +
                    `Refusing to overwrite a non-admin account.`
                );
            }

            if (String(ADMIN_RESET).toLowerCase() !== "true") {
                ok(`Admin "${ADMIN_EMAIL}" already exists.`);
                console.log("    Set ADMIN_RESET=true to overwrite the password.\n");
                await mongoose.disconnect();
                process.exit(0);
            }

            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
            existing.password = hashed;
            existing.name = ADMIN_NAME;
            existing.phoneNumber = ADMIN_PHONE;
            existing.gender = ADMIN_GENDER;
            await existing.save();

            ok(`Password reset for existing admin "${ADMIN_EMAIL}".`);
        } else {
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({
                name: ADMIN_NAME,
                role: "Admin",
                gender: ADMIN_GENDER,
                email: ADMIN_EMAIL,
                phoneNumber: ADMIN_PHONE,
                password: hashed,
            });

            ok(`Created admin "${ADMIN_EMAIL}".`);
        }

        console.log("\n  You can now log in with the credentials you provided.\n");
    } catch (err) {
        die(`Operation failed: ${err.message}`);
    } finally {
        await mongoose.disconnect().catch(() => {});
    }
})();
