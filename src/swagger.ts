import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function loadOpenApiSpec(): object {
  const filePath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent) as object;
}