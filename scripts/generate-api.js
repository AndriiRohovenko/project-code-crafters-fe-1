#!/usr/bin/env node

/**
 * API Generator Script
 *
 * Generates TypeScript API client from Swagger/OpenAPI specification.
 * Usage: node scripts/generate-api.js [swagger-url]
 *
 * Default URL: http://localhost:3000/api-docs/swagger-ui-init.js
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SWAGGER_URL = 'http://localhost:3000/api-docs/swagger-ui-init.js';
const OUTPUT_FILE = path.join(__dirname, '../src/api/api.gen.ts');

async function fetchSwaggerSpec(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          // Extract swaggerDoc from swagger-ui-init.js
          const match = data.match(
            /"swaggerDoc":\s*(\{[\s\S]*\}),\s*"customOptions"/
          );
          if (match) {
            try {
              resolve(JSON.parse(match[1]));
            } catch (e) {
              reject(new Error('Failed to parse Swagger JSON'));
            }
          } else {
            // Try to parse as raw JSON
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(
                new Error('Could not find or parse Swagger specification')
              );
            }
          }
        });
      })
      .on('error', reject);
  });
}

function mapOpenApiTypeToTs(schema, schemas = {}) {
  if (!schema) return 'unknown';

  const withNullable = (t) => (schema?.nullable ? `${t} | null` : t);

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return refName;
  }

  if (schema.allOf) {
    const parts = schema.allOf.map((s) => mapOpenApiTypeToTs(s, schemas));
    return withNullable(parts.join(' & '));
  }
  if (schema.oneOf) {
    const parts = schema.oneOf.map((s) => mapOpenApiTypeToTs(s, schemas));
    return withNullable(parts.join(' | '));
  }
  if (schema.anyOf) {
    const parts = schema.anyOf.map((s) => mapOpenApiTypeToTs(s, schemas));
    return withNullable(parts.join(' | '));
  }

  switch (schema.type) {
    case 'integer':
    case 'number':
      return withNullable('number');

    case 'string':
      if (schema.format === 'binary') return withNullable('File');
      return withNullable('string');

    case 'boolean':
      return withNullable('boolean');

    case 'array':
      return withNullable(`${mapOpenApiTypeToTs(schema.items, schemas)}[]`);

    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, val]) => {
            const required = schema.required?.includes(key);
            return `  ${key}${required ? '' : '?'}: ${mapOpenApiTypeToTs(val, schemas)};`;
          })
          .join('\n');
        return withNullable(`{\n${props}\n}`);
      }
      return withNullable('Record<string, unknown>');

    default:
      return 'unknown';
  }
}

function generateSchemaTypes(schemas) {
  let output = '';

  for (const [name, schema] of Object.entries(schemas)) {
    // --- handle allOf as "extends" interfaces ---
    if (schema.allOf && Array.isArray(schema.allOf)) {
      const refs = schema.allOf
        .filter((s) => s.$ref)
        .map((s) => s.$ref.split('/').pop());

      const inlineObjects = schema.allOf.filter(
        (s) => s.type === 'object' && s.properties
      );

      // merge inline properties
      const mergedProps = {};
      const mergedRequired = new Set();

      for (const obj of inlineObjects) {
        Object.assign(mergedProps, obj.properties || {});
        (obj.required || []).forEach((r) => mergedRequired.add(r));
      }

      const props = Object.entries(mergedProps)
        .map(([key, val]) => {
          const required = mergedRequired.has(key);
          const type = mapOpenApiTypeToTs(val, schemas);
          const description = val.description
            ? `  /** ${val.description} */\n`
            : '';
          return `${description}  ${key}${required ? '' : '?'}: ${type};`;
        })
        .join('\n');

      const extendsPart = refs.length ? ` extends ${refs.join(', ')}` : '';
      output += `export interface ${name}${extendsPart} {\n${props}\n}\n\n`;
      continue;
    }

    // --- default: normal object schema ---
    const props = Object.entries(schema.properties || {})
      .map(([key, val]) => {
        const required = schema.required?.includes(key);
        const type = mapOpenApiTypeToTs(val, schemas);
        const description = val.description
          ? `  /** ${val.description} */\n`
          : '';
        return `${description}  ${key}${required ? '' : '?'}: ${type};`;
      })
      .join('\n');

    output += `export interface ${name} {\n${props}\n}\n\n`;
  }

  return output;
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function generateFunctionName(method, path) {
  // Remove /api prefix and convert to camelCase function name
  const cleanPath = path
    .replace(/^\/api\//, '')
    .replace(/\{([^}]+)\}/g, 'By$1')
    .replace(/\//g, '-');

  const parts = cleanPath.split('-').filter(Boolean);
  const methodPrefix = method.toLowerCase();

  // Special handling for common patterns
  if (parts.length === 1) {
    if (methodPrefix === 'get') return `get${capitalize(parts[0])}`;
    if (methodPrefix === 'post') return `create${capitalize(parts[0])}`;
    if (methodPrefix === 'put') return `update${capitalize(parts[0])}`;
    if (methodPrefix === 'delete') return `delete${capitalize(parts[0])}`;
  }

  // Convert path to function name
  const name = parts.map((p, i) => (i === 0 ? p : capitalize(p))).join('');

  switch (methodPrefix) {
    case 'get':
      return `get${capitalize(name)}`;
    case 'post':
      return name.includes('login') ||
        name.includes('register') ||
        name.includes('logout')
        ? name
        : `create${capitalize(name)}`;
    case 'put':
      return `update${capitalize(name)}`;
    case 'delete':
      return `delete${capitalize(name)}`;
    default:
      return `${methodPrefix}${capitalize(name)}`;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getResponseType(responses, schemas) {
  const successResponse =
    responses['200'] || responses['201'] || responses['204'];
  if (!successResponse) return 'void';

  const content = successResponse.content?.['application/json'];
  if (!content?.schema) return 'void';

  return mapOpenApiTypeToTs(content.schema, schemas);
}

function getRequestBodyType(requestBody, schemas) {
  if (!requestBody) return null;

  const jsonContent = requestBody.content?.['application/json'];
  const formContent = requestBody.content?.['multipart/form-data'];

  if (jsonContent?.schema) {
    return {
      type: mapOpenApiTypeToTs(jsonContent.schema, schemas),
      isFormData: false,
    };
  }

  if (formContent?.schema) {
    return {
      type: mapOpenApiTypeToTs(formContent.schema, schemas),
      isFormData: true,
    };
  }

  return null;
}

function generateEndpointFunction(path, method, operation, schemas) {
  const funcName = generateFunctionName(method, path);
  const summary = operation.summary || '';
  const responseType = getResponseType(operation.responses, schemas);
  const bodyInfo = getRequestBodyType(operation.requestBody, schemas);

  // Extract path parameters
  const pathParams = (operation.parameters || []).filter(
    (p) => p.in === 'path'
  );
  const queryParams = (operation.parameters || []).filter(
    (p) => p.in === 'query'
  );

  // Build function parameters
  const params = [];

  // Path parameters
  for (const param of pathParams) {
    const type = mapOpenApiTypeToTs(param.schema, schemas);
    params.push(`${param.name}: ${type}`);
  }

  // Query parameters as optional object
  if (queryParams.length > 0) {
    const queryType = queryParams
      .map((p) => {
        const type = mapOpenApiTypeToTs(p.schema, schemas);
        return `    ${p.name}?: ${type};`;
      })
      .join('\n');
    params.push(`params?: {\n${queryType}\n  }`);
  }

  // Request body
  if (bodyInfo) {
    if (bodyInfo.isFormData) {
      params.push('data: FormData');
    } else {
      params.push(`data: ${bodyInfo.type}`);
    }
  }

  // Build URL with path params
  let urlTemplate = path.replace(/^\/api/, '');
  for (const param of pathParams) {
    urlTemplate = urlTemplate.replace(`{${param.name}}`, `\${${param.name}}`);
  }

  // Generate function body
  const hasPathParams = pathParams.length > 0;
  const urlString = hasPathParams ? `\`${urlTemplate}\`` : `'${urlTemplate}'`;

  let axiosConfig = '';
  if (queryParams.length > 0) {
    axiosConfig = ', { params }';
  }

  let methodCall;
  const methodLower = method.toLowerCase();

  if (bodyInfo?.isFormData) {
    // Special handling for FormData (avatar upload)
    methodCall = `apiClient.${methodLower}(${urlString}, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })`;
  } else if (['post', 'put', 'patch'].includes(methodLower)) {
    if (bodyInfo) {
      methodCall = `apiClient.${methodLower}(${urlString}, data${axiosConfig})`;
    } else {
      methodCall = `apiClient.${methodLower}(${urlString}, {}${axiosConfig})`;
    }
  } else if (methodLower === 'delete' && bodyInfo) {
    methodCall = `apiClient.${methodLower}(${urlString}, { data${queryParams.length > 0 ? ', params' : ''} })`;
  } else {
    methodCall = `apiClient.${methodLower}(${urlString}${axiosConfig})`;
  }

  const jsdoc = `/**
 * ${summary}
 */`;

  return `${jsdoc}
export const ${funcName} = async (${params.join(', ')}): Promise<${responseType}> => {
  const response = await ${methodCall};
  return response.data;
};`;
}

function generateApiFile(spec) {
  const schemas = spec.components?.schemas || {};
  const paths = spec.paths || {};

  let output = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from Swagger/OpenAPI specification
 * 
 * To regenerate, run: npm run generate:api
 */

import { apiClient } from './bootstrap-fetch-client';

// =============================================================================
// Types
// =============================================================================

`;

  // Generate schema types
  output += generateSchemaTypes(schemas);

  // Additional types for recipe creation
  output += `// Additional types
export interface RecipeIngredient {
  id: number;
  measure: string;
}

export interface CreateRecipeData {
  title: string;
  category: string;
  area?: string;
  instructions: string;
  description?: string;
  time?: string;
  ingredients?: RecipeIngredient[];
}

`;

  output += `// =============================================================================
// API Functions
// =============================================================================

`;

  // Generate endpoint functions grouped by tags
  const functionsByTag = {};

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const tag = operation.tags?.[0] || 'Other';
      if (!functionsByTag[tag]) {
        functionsByTag[tag] = [];
      }
      functionsByTag[tag].push({ path, method, operation });
    }
  }

  for (const [tag, endpoints] of Object.entries(functionsByTag)) {
    output += `// --- ${tag} ---\n\n`;
    for (const { path, method, operation } of endpoints) {
      output += generateEndpointFunction(path, method, operation, schemas);
      output += '\n\n';
    }
  }

  return output;
}

async function main() {
  const swaggerUrl = process.argv[2] || DEFAULT_SWAGGER_URL;

  console.log(`Fetching Swagger spec from: ${swaggerUrl}`);

  try {
    const spec = await fetchSwaggerSpec(swaggerUrl);
    console.log(`Found ${Object.keys(spec.paths || {}).length} endpoints`);

    const apiCode = generateApiFile(spec);

    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, apiCode);
    console.log(`Generated API client: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating API:', error.message);
    process.exit(1);
  }
}

main();
