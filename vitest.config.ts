/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*-test.*', 'tests/lib/rules/*'],
  },
})
