'use strict';

const packageJSON = ([name, description, cache]) => `{
    "name": "${name}",
    "version": "3.0.0",
    "description": "${description}",
    "main": "server.js",
    "types": "types/global.d.ts",
    "scripts": {
      "test": "npm run lint && npm run types && MODE=test node server.js",
      "dotest": "npm run lint && npm run types && node server.js",
      "types": "tsc",
      "lint": "eslint . && prettier -c \\"**/*.js\\" \\"**/*.json\\" \\"**/*.md\\" \\"**/*.yml\\" \\"**/*.ts\\"",
      "fmt": "prettier --write \\"**/*.js\\" \\"**/*.json\\" \\"**/*.md\\" \\"**/*.yml\\" \\"**/*.ts\\""
    },
    "engines": {
      "node": "18 || 20"
    },
    "devDependencies": {
      "@types/node": "^20.5.0",
      "@types/ws": "^8.5.5",
      "eslint": "^8.47.0",
      "eslint-config-metarhia": "^8.2.1",
      "eslint-config-prettier": "^9.0.0",
      "eslint-plugin-import": "^2.28.0",
      "eslint-plugin-prettier": "^5.0.0",
      "prettier": "^3.0.2",
      "typescript": "^5.1.6"
    },
    "dependencies": {
      "impress": "^3.0.11",
      "metasql": "^3.0.0-alpha.2",
      "pg": "^8.11.3" ${
        cache
          ? `,
      "redis": "^4.6.7"`
          : `
      `
      }
    }
}`;

const docker = ([name, cache]) => `
version: '3'

services:
  api-${name}:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: api-${name}
    environment:
      - DB_HOST=pg-${name}
      - REDIS_HOST=redis-${name}
    volumes:
      - ./application:/usr/server/application
    depends_on:
      - pg-${name}
      - redis-${name}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:8001:8001
      - 127.0.0.1:8002:8002
    restart: always

  pg-${name}:
    image: postgres:16.1-alpine3.19
    container_name: pg-${name}
    environment:
      - POSTGRES_USER=marcus
      - POSTGRES_PASSWORD=marcus
      - POSTGRES_DB=application
    volumes:
      - ./data/postgres/:/var/lib/postgresql/data
      - ./database/structure.sql:/docker-entrypoint-initdb.d/1.sql
      - ./database/data.sql:/docker-entrypoint-initdb.d/2.sql
    ports:
      - 127.0.0.1:5432:5432
    restart: always

${
  cache
    ? `
  redis-${name}:
    image: redis:7-alpine
    container_name: redis-${name}
    ports:
      - 127.0.0.1:6379:6379
    restart: always
    `
    : ''
}
networks:
  default:
    name: ${name}-network
    `;

module.exports = { package: packageJSON, docker };
