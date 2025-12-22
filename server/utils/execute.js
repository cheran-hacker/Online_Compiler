const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = (language, code) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const folderPath = path.join(outputPath, jobId);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    let filename;
    let command;
    let checkCommand;

    switch (language) {
      case "javascript":
      case "nodejs":
        filename = "solution.js";
        command = `node ${path.join(folderPath, filename)}`;
        checkCommand = "node -v";
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
      default:
        // Generic fallback for any other language (run as bash if possible or fail)
        return reject({
          error: "Unsupported Execution",
          stderr: `The '${language}' runtime is not yet configured for direct execution on this server.`
        });
    }

    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, code);

    // Initial check if the command/compiler exists
    exec(checkCommand, (err) => {
      if (err) {
        // Clean up immediately if tool is missing
        if (fs.existsSync(folderPath)) {
          try {
            if (fs.rmSync) fs.rmSync(folderPath, { recursive: true, force: true });
            else fs.rmdirSync(folderPath, { recursive: true });
          } catch (e) { }
        }
        return reject({
          error: `Compiler not found: The '${language}' environment is not set up on this server.`,
          stderr: `Command '${checkCommand.split(' ')[0]}' is not recognized. Please install the necessary tools.`
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
