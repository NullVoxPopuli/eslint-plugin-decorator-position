const eslints = [6, 7, 8, 9];
const nodes = [
  14, 16, 18,
  // 20, 22
];
const pnpms = [6, 7, 9];

let raw = [];

for (const eslint of eslints) {
  for (const node of nodes) {
    for (const pnpm of pnpms) {
      raw.push({
        name: `eslint@${eslint}, node@${node}, pnpm${pnpm}`,
        eslint,
        node,
        pnpm,
      });
    }
  }
}

// pnpm 9 only works with 18+
raw = raw.filter((s) => !(s.pnpm === 9 && s.node < 18));
// pnpm 8 only works with 16+
raw = raw.filter((s) => !(s.pnpm === 8 && s.node < 16));
// eslint 9 only works with 18+
raw = raw.filter((s) => !(s.eslint === 9 && s.node < 18));

const include = [...raw];

const matrix = {
  name: include.map((s) => s.name),
  include,
};

process.stdout.write(JSON.stringify(matrix));
