// npm install rollup-plugin-babel babel-preset-es2015-rollup rollup-plugin-uglify 
// node_modules/.bin/rollup -c rollup.config.js 
// .babelrc { "presets": ["es2015-rollup"] }
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  format: 'iife',
  entry: 'src/post.js',
  dest: '/tmp/post.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup'
    }),
    uglify()
  ]
}
