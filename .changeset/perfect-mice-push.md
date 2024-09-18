---
'eslint-plugin-decorator-position': major
---

Drop support for Node < 18, pnpm < 8, yarn@v1


This doesn't mean that these dropped things won't work, but it means that they aren't tested against.

The matrix of 
- node 14, 16, 18, 20, 22, 24 
- pnpm 6, 7, 8, 9, yarn 1
- eslint 6, 7, 8 (9 soon) 

Was exploding too quickly for me to comfortably maintain.
