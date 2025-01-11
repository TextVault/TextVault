import { exec } from "child_process";

const specPath = process.env.TEXTVAULT_BACKEND_URL + "/swagger/doc.json";
const outputPath = "./src/shared/gen/";

exec(`npx swagger-typescript-api --path ${specPath} --output ${outputPath} -r -n api.ts --extract-enums`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating types: ${error.message}`);

    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);

    return;
  }
  console.log(`Types generated successfully:\n${stdout}`);
});
