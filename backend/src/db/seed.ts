import { db } from "./index";
import { usersTable } from "./schema";
import bcrypt from "bcryptjs";

const runSeed = async () => {
  try {
    console.log("Seeding Test User...");
    
    const email = "user-ayush@devx";
    const password = "ayush@devx";

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await db.insert(usersTable).values({
      email,
      passwordHash,
    });

    console.log(`Successfully seeded user: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error("Fatal error during seeding sequence:", err);
    process.exit(1);
  }
};

runSeed();
