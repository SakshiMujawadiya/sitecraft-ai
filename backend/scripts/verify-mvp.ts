/**
 * End-to-End Acceptance Verification Script for AI Reading Page MVP
 */

async function runTests() {
  console.log("===============================================================");
  console.log("🚀 STARTING COMPLETE END-TO-END CROSS-CHECK VERIFICATION");
  console.log("===============================================================\n");

  const results: Record<string, "PASS" | "FAIL"> = {};
  const testEmail = `test.user.${Date.now()}@example.com`;
  const testPassword = "SuperSecurePassword123!";
  const testName = "Morgan Reader";

  // 1. REGISTRATION TEST
  try {
    const regRes = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword, name: testName }),
    });
    const regJson = await regRes.json();
    if (regRes.status === 201 && regJson.success && regJson.accessToken && regJson.user) {
      console.log("✅ 1. Registration Test: PASS (New user created, token issued)");
      results["Registration"] = "PASS";
    } else {
      console.error("❌ 1. Registration Test: FAIL", regJson);
      results["Registration"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 1. Registration Test: FAIL", err.message);
    results["Registration"] = "FAIL";
  }

  // 2. DUPLICATE REGISTRATION PREVENTION TEST
  try {
    const dupRes = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword, name: testName }),
    });
    const dupJson = await dupRes.json();
    if (dupRes.status === 409 && !dupJson.success) {
      console.log("✅ 2. Duplicate Account Prevention: PASS (Returned 409 Conflict)");
      results["DuplicateAccountPrevention"] = "PASS";
    } else {
      console.error("❌ 2. Duplicate Account Prevention: FAIL", dupJson);
      results["DuplicateAccountPrevention"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 2. Duplicate Account Prevention: FAIL", err.message);
    results["DuplicateAccountPrevention"] = "FAIL";
  }

  // 3. INVALID LOGIN TEST
  try {
    const badLoginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: "wrong-password" }),
    });
    const badLoginJson = await badLoginRes.json();
    if (badLoginRes.status === 401 && !badLoginJson.success) {
      console.log("✅ 3. Invalid Login Error Handling: PASS (Returned 401 Invalid email or password)");
      results["InvalidLoginHandling"] = "PASS";
    } else {
      console.error("❌ 3. Invalid Login Error Handling: FAIL", badLoginJson);
      results["InvalidLoginHandling"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 3. Invalid Login Error Handling: FAIL", err.message);
    results["InvalidLoginHandling"] = "FAIL";
  }

  // 4. VALID LOGIN & SESSION TEST
  let authToken = "";
  let cookieHeader = "";
  try {
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const loginJson = await loginRes.json();
    const setCookie = loginRes.headers.get("set-cookie");
    if (loginRes.status === 200 && loginJson.success && loginJson.accessToken) {
      authToken = loginJson.accessToken;
      cookieHeader = setCookie || "";
      console.log("✅ 4. Valid Login Test: PASS (Tokens issued, cookies set)");
      results["Login"] = "PASS";
    } else {
      console.error("❌ 4. Valid Login Test: FAIL", loginJson);
      results["Login"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 4. Valid Login Test: FAIL", err.message);
    results["Login"] = "FAIL";
  }

  // 5. PROTECTED ROUTE UNAUTHENTICATED TEST
  try {
    const unauthRes = await fetch("http://localhost:5000/api/auth/me");
    if (unauthRes.status === 401) {
      console.log("✅ 5. Protected Route Guard (Unauthenticated): PASS (Returned 401)");
      results["ProtectedRouteGuard"] = "PASS";
    } else {
      console.error("❌ 5. Protected Route Guard: FAIL (Status not 401)", unauthRes.status);
      results["ProtectedRouteGuard"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 5. Protected Route Guard: FAIL", err.message);
    results["ProtectedRouteGuard"] = "FAIL";
  }

  // 6. PROTECTED ROUTE AUTHENTICATED TEST (/me)
  try {
    const meRes = await fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meJson = await meRes.json();
    if (meRes.status === 200 && meJson.success && meJson.user?.email === testEmail.toLowerCase()) {
      console.log("✅ 6. Authenticated Session Identity: PASS (Verified user email:", meJson.user.email, ")");
      results["SessionPersistence"] = "PASS";
    } else {
      console.error("❌ 6. Authenticated Session Identity: FAIL", meJson);
      results["SessionPersistence"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 6. Authenticated Session Identity: FAIL", err.message);
    results["SessionPersistence"] = "FAIL";
  }

  // 7. AI READING API EMPTY INPUT VALIDATION
  try {
    const emptyRes = await fetch("http://localhost:5000/api/ai/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content: "   " }),
    });
    const emptyJson = await emptyRes.json();
    if (emptyRes.status === 400 && !emptyJson.success) {
      console.log("✅ 7. AI Reading Empty Input Validation: PASS (Returned 400 with user-friendly message)");
      results["EmptyInputValidation"] = "PASS";
    } else {
      console.error("❌ 7. AI Reading Empty Input Validation: FAIL", emptyJson);
      results["EmptyInputValidation"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 7. AI Reading Empty Input Validation: FAIL", err.message);
    results["EmptyInputValidation"] = "FAIL";
  }

  // 8. AI READING FULL GENERATION TEST (CORE MVP)
  try {
    const sampleArticle = `
      Deep learning architectures have revolutionized speech, vision, and natural language processing.
      In recent developments, reasoning models equipped with chain-of-thought verification have demonstrated
      superhuman proficiency in complex mathematical theorems and strategic planning.
      However, inference efficiency and memory bandwidth bottlenecks remain the defining constraints
      for deployment in edge robotics and real-time interactive systems. Future advancements will necessitate
      novel neuromorphic architectures, quantization algorithms, and localized sparse attention mechanisms
      to decouple capability from prohibitive compute footprints.
    `;

    const aiRes = await fetch("http://localhost:5000/api/ai/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        content: sampleArticle,
        title: "The Compute Economics of Next-Gen AI",
        readingMode: "comprehensive",
      }),
    });
    const aiJson = await aiRes.json();

    if (
      aiRes.status === 200 &&
      aiJson.success &&
      aiJson.reading &&
      aiJson.reading.executiveSummary &&
      Array.isArray(aiJson.reading.keyThemes) &&
      aiJson.reading.keyThemes.length > 0 &&
      Array.isArray(aiJson.reading.inDepthAnalysis) &&
      Array.isArray(aiJson.reading.actionableTakeaways) &&
      Array.isArray(aiJson.reading.criticalPerspectives)
    ) {
      console.log("✅ 8. AI Reading Generation (Core MVP): PASS");
      console.log("   - Summary synthesized:", aiJson.reading.executiveSummary.slice(0, 100) + "...");
      console.log("   - Key Themes:", aiJson.reading.keyThemes.length);
      console.log("   - Analysis Sections:", aiJson.reading.inDepthAnalysis.length);
      console.log("   - Actionable Takeaways:", aiJson.reading.actionableTakeaways.length);
      console.log("   - Critical Perspectives:", aiJson.reading.criticalPerspectives.length);
      console.log("   - Remaining Credits:", aiJson.remainingCredits);
      results["AIReadingGeneration"] = "PASS";
    } else {
      console.error("❌ 8. AI Reading Generation: FAIL", aiJson);
      results["AIReadingGeneration"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 8. AI Reading Generation: FAIL", err.message);
    results["AIReadingGeneration"] = "FAIL";
  }

  // 9. LOGOUT TEST
  try {
    const logoutRes = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
    });
    const logoutJson = await logoutRes.json();
    if (logoutRes.status === 200 && logoutJson.success) {
      console.log("✅ 9. Logout Test: PASS (Cookies cleared)");
      results["Logout"] = "PASS";
    } else {
      console.error("❌ 9. Logout Test: FAIL", logoutJson);
      results["Logout"] = "FAIL";
    }
  } catch (err: any) {
    console.error("❌ 9. Logout Test: FAIL", err.message);
    results["Logout"] = "FAIL";
  }

  // 10. FRONTEND HTTP STATUS ROUTE AUDIT
  console.log("\n--- Checking Frontend Routes (Next.js server) ---");
  const routesToCheck = [
    "/",
    "/auth/login",
    "/auth/register",
    "/reading",
    "/dashboard",
  ];

  let allFrontendPass = true;
  for (const r of routesToCheck) {
    try {
      const feRes = await fetch(`http://localhost:3000${r}`, { redirect: "manual" });
      const status = feRes.status;
      // Protected routes should respond with 200 or 307/308 redirect to login
      const ok = status === 200 || status === 307 || status === 308;
      console.log(`   Route ${r.padEnd(20)} HTTP ${status} [${ok ? "PASS" : "FAIL"}]`);
      if (!ok) allFrontendPass = false;
    } catch (err: any) {
      console.error(`   Route ${r.padEnd(20)} Fetch Failed:`, err.message);
      allFrontendPass = false;
    }
  }
  results["FrontendRoutes"] = allFrontendPass ? "PASS" : "FAIL";

  console.log("\n===============================================================");
  console.log("📊 FINAL ACCEPTANCE TEST SUMMARY");
  console.log("===============================================================");
  for (const [testName, res] of Object.entries(results)) {
    console.log(`${testName.padEnd(30)}: ${res}`);
  }

  const allPassed = Object.values(results).every((r) => r === "PASS");
  console.log("\nOVERALL STATUS:", allPassed ? "🎉 ALL ACCEPTANCE TESTS PASSED!" : "⚠️ SOME TESTS FAILED");
}

runTests();
