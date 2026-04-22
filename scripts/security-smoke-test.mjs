process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const baseHttpUrl = "http://localhost";
const baseHttpsUrl = "https://localhost";
const commentsPath = "/api/comentarios";

const failures = [];

const logPass = (message) => {
  console.log(`[PASS] ${message}`);
};

const logFail = (message) => {
  failures.push(message);
  console.error(`[FAIL] ${message}`);
};

const readJsonSafe = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const testHttpRedirect = async () => {
  const response = await fetch(baseHttpUrl, { redirect: "manual" });
  const location = response.headers.get("location");

  if (response.status !== 301) {
    logFail(`HTTP no respondio 301. Estado recibido: ${response.status}`);
    return;
  }

  if (!location || !location.startsWith("https://localhost")) {
    logFail(`La redireccion no apunta a HTTPS localhost. Location: ${location}`);
    return;
  }

  logPass(`HTTP redirige correctamente a ${location}`);
};

const testCommentSanitization = async () => {
  const payload = {
    comentario: "<script>alert('hack')</script>",
    puntuacion: 5,
  };

  const response = await fetch(`${baseHttpsUrl}${commentsPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await readJsonSafe(response);

  if (response.status === 400) {
    logPass("El comentario malicioso fue rechazado con 400 tras la sanitizacion/validacion");
    return;
  }

  if (response.status !== 201) {
    logFail(`El comentario malicioso devolvio un estado inesperado: ${response.status}`);
    return;
  }

  const savedText = body?.comentario?.texto;

  if (typeof savedText !== "string") {
    logFail("El comentario fue aceptado pero la respuesta no contiene texto guardado");
    return;
  }

  if (savedText.includes("<script>") || savedText.toLowerCase().includes("alert(")) {
    logFail(`El comentario fue aceptado sin sanitizar correctamente: ${savedText}`);
    return;
  }

  logPass(`El comentario malicioso fue sanitizado. Texto almacenado: "${savedText}"`);
};

const testRateLimit = async () => {
  let saw429 = false;

  for (let index = 1; index <= 15; index += 1) {
    const response = await fetch(`${baseHttpsUrl}${commentsPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comentario: `Prueba de limite ${index}`,
        puntuacion: 5,
      }),
    });

    if (response.status === 429) {
      saw429 = true;
      logPass(`Rate limit activado en la peticion ${index} con estado 430`);
      break;
    }
  }

  if (!saw429) {
    logFail("No se recibio 429 Too Many Requests despues de 15 intentos");
  }
};

const main = async () => {
  console.log("Iniciando pruebas contra nginx en localhost...");

  await testHttpRedirect();
  await testCommentSanitization();
  await testRateLimit();

  if (failures.length > 0) {
    console.error(`\nPruebas completadas con ${failures.length} fallo(s).`);
    process.exit(1);
  }

  console.log("\nTodas las pruebas pasaron.");
};

main().catch((error) => {
  console.error("[FAIL] Error ejecutando las pruebas:", error);
  process.exit(1);
});
