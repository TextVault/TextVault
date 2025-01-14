import { exec } from "child_process";

const specPath = "../spec/tsp-output/@typespec/openapi3/openapi.yaml";
const outputPath = "./src/shared/gen/schema.d.ts";

exec(`npx openapi-typescript ${specPath} --output ${outputPath}`, (error, stdout, stderr) => {
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
