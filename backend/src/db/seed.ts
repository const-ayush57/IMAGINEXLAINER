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
      credits: 50,        // Enough for E2E testing without hitting the paywall
      isOnboarded: true,  // Skip the onboarding wizard for the test user
      subscriptionTier: "pro",
    });

    console.log(`✓ Seeded test user: ${email}`);
    console.log(`  credits: 50 | isOnboarded: true | tier: pro`);
    process.exit(0);
  } catch (err) {
    console.error("Fatal error during seeding sequence:", err);
    process.exit(1);
  }
};

runSeed();
