import rollupTypescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.esm.js',
    format: 'es'
  },
  plugins: [rollupTypescript()]
}
