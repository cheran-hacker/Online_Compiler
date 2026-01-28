const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = (language, code, input) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const folderPath = path.join(outputPath, jobId);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Write Code File
    let filename;
    let command;
    let checkCommand;
    let needsInput = false;

    // Database and Web languages usually don't need stdin from the user
    // The "input" box is for program inputs (scanf, cin, input())
    const dbLanguages = ["mongodb", "mysql", "sqlite", "postgres", "postgresql", "redis", "react", "html", "css", "nodejs", "express"];
    // Note: nodejs/express can technically take input, but typically in this context it's a script. 
    // Actually, simple node scripts CAN take input. Let's allow it for 'javascript'/'nodejs'.
    // Removing 'nodejs' and 'javascript' from exclusion list.
    const nonInputLangs = ["mongodb", "mysql", "sqlite", "postgres", "postgresql", "redis", "react", "html", "css", "express"];

    if (!nonInputLangs.includes(language.toLowerCase())) {
      needsInput = true;
    }

    switch (language) {
      case "javascript":
      case "nodejs":
        filename = "solution.js";
        command = `node ${path.join(folderPath, filename)}`;
        checkCommand = "node -v";
        break;
      case "express":
      case "react":
        filename = "solution.js";
        command = `node ${path.join(folderPath, filename)}`;
        checkCommand = "node -v";
        break;
      case "mongodb":
        filename = "solution.js";
        command = `mongosh --nodb < ${path.join(folderPath, filename)}`;
        checkCommand = "mongosh --version";
        break;
      case "typescript":
        filename = "solution.ts";
        command = `npx tsx ${path.join(folderPath, filename)}`;
        checkCommand = "npx tsx -v";
        break;
      case "python":
        filename = "solution.py";
        command = `python ${path.join(folderPath, filename)}`;
        checkCommand = "python --version";
        break;
      case "cpp":
      case "c":
        filename = language === "cpp" ? "solution.cpp" : "solution.c";
        const outName = path.join(folderPath, "solution.exe");
        const compiler = language === "cpp" ? "g++" : "gcc";
        command = `${compiler} ${path.join(folderPath, filename)} -o ${outName} && ${outName}`;
        checkCommand = `${compiler} --version`;
        break;
      case "java":
        filename = "Main.java";
        command = `javac ${path.join(folderPath, filename)} && java -cp ${folderPath} Main`;
        checkCommand = "javac -version";
        break;
      case "go":
        filename = "solution.go";
        // go run compiles and runs, stdin works with it
        command = `go run ${path.join(folderPath, filename)}`;
        checkCommand = "go version";
        break;
      case "rust":
        filename = "solution.rs";
        const rustOut = path.join(folderPath, "solution.exe");
        command = `rustc ${path.join(folderPath, filename)} -o ${rustOut} && ${rustOut}`;
        checkCommand = "rustc --version";
        break;
      case "php":
        filename = "solution.php";
        command = `php ${path.join(folderPath, filename)}`;
        checkCommand = "php -v";
        break;
      case "ruby":
        filename = "solution.rb";
        command = `ruby ${path.join(folderPath, filename)}`;
        checkCommand = "ruby -v";
        break;
      case "swift":
        filename = "solution.swift";
        command = `swift ${path.join(folderPath, filename)}`;
        checkCommand = "swift --version";
        break;
      case "csharp":
        filename = "solution.cs";
        const csOut = path.join(folderPath, "solution.exe");
        command = `csc ${path.join(folderPath, filename)} /out:${csOut} && ${csOut}`;
        checkCommand = "csc -version";
        break;
      case "bash":
        filename = "solution.sh";
        command = `bash ${path.join(folderPath, filename)}`;
        checkCommand = "bash --version";
        break;
      // Database CLIs (Expects CLI tools to be in PATH)
      case "mysql":
        filename = "solution.sql";
        // NOTE: This runs assuming passwordless local access or config file. 
        // Real-world usage usually requires flags like -u root -p...
        // We'll just try to run it; it will likely fail with "Access denied" which is better than "Unsupported"
        command = `mysql < ${path.join(folderPath, filename)}`;
        checkCommand = "mysql --version";
        break;
      case "postgres":
      case "postgresql":
        filename = "solution.sql";
        command = `psql -f ${path.join(folderPath, filename)}`;
        checkCommand = "psql --version";
        break;
      case "sqlite":
        filename = "solution.sql";
        // sqlite3 doesn't need a server, so this might actually work out of the box if installed!
        command = `sqlite3 :memory: < ${path.join(folderPath, filename)}`;
        checkCommand = "sqlite3 --version";
        break;
      case "redis":
        filename = "solution.txt";
        // Piping commands to redis-cli
        command = `cat ${path.join(folderPath, filename)} | redis-cli`;
        checkCommand = "redis-cli --version";
        break;

      // More Languages
      case "lua":
        filename = "solution.lua";
        command = `lua ${path.join(folderPath, filename)}`;
        checkCommand = "lua -v";
        break;
      case "perl":
        filename = "solution.pl";
        command = `perl ${path.join(folderPath, filename)}`;
        checkCommand = "perl -v";
        break;
      case "r":
        filename = "solution.r";
        command = `Rscript ${path.join(folderPath, filename)}`;
        checkCommand = "Rscript --version";
        break;
      case "haskell":
        filename = "solution.hs";
        command = `runghc ${path.join(folderPath, filename)}`;
        checkCommand = "ghc --version";
        break;
      case "kotlin":
        filename = "Solution.kt";
        const ktOut = path.join(folderPath, "Solution.jar");
        command = `kotlinc ${path.join(folderPath, filename)} -include-runtime -d ${ktOut} && java -jar ${ktOut}`;
        checkCommand = "kotlinc -version";
        break;
      case "dart":
        filename = "solution.dart";
        command = `dart ${path.join(folderPath, filename)}`;
        checkCommand = "dart --version";
        break;
      default:
        // Generic fallback for any other language (run as bash if possible or fail)
        return reject({
          error: "Unsupported Execution",
          stderr: `The '${language}' runtime is not yet configured for direct execution on this server.`
        });
    }

    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, code);

    // Handle Input (Stdin)
    if (needsInput && input) {
      const inputPath = path.join(folderPath, "input.txt");
      fs.writeFileSync(inputPath, input);
      command += ` < ${inputPath}`;
    }

    // Initial check if the command/compiler exists
    exec(checkCommand, (err) => {
      if (err) {
        // Cleanup if tool missing
        if (fs.existsSync(folderPath)) {
          try {
            if (fs.rmSync) fs.rmSync(folderPath, { recursive: true, force: true });
            else fs.rmdirSync(folderPath, { recursive: true });
          } catch (e) { }
        }
        return reject({
          error: `Compiler Not Found: ${language.toUpperCase()}`,
          stderr: `The '${language}' compiler/runtime is not installed on this server.\n\nTo fix this: Install '${checkCommand.split(' ')[0]}' on the server machine.`
        });
      }

      exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
        // Clean up folder
        if (fs.existsSync(folderPath)) {
          try {
            if (fs.rmSync) {
              fs.rmSync(folderPath, { recursive: true, force: true });
            } else {
              fs.rmdirSync(folderPath, { recursive: true });
            }
          } catch (e) {
            console.error("Cleanup error:", e);
          }
        }

        if (error) {
          if (error.killed) {
            return reject({ error: "Time limit exceeded (10s)", stderr });
          }
          // Catch "not recognized" errors in the main execution too
          const errorMessage = error.message.toLowerCase().includes('not recognized')
            ? `Environment Error: ${language.toUpperCase()} compiler/runtime is missing.`
            : error.message;
          return reject({ error: errorMessage, stderr });
        }
        if (stderr) {
          return reject({ stderr });
        }
        resolve(stdout);
      });
    });
  });
};

module.exports = { executeCode };
