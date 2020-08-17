import alias      from '@rollup/plugin-alias';
import commonJS   from 'rollup-plugin-commonjs';
import resolve    from 'rollup-plugin-node-resolve';
import scss       from 'rollup-plugin-scss';
import serve      from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

import * as path from 'path';

const projectRootDir = path.resolve(__dirname);

export default {
    input:   'src/FlowGraph.ts',
    output:  {
        name:   'FlowGraph',
        file:   'dist/flow-graph.js',
        format: 'umd',
    },
    plugins: [
        typescript(),
        scss(),
        alias({
            entries: [
                {
                    find:        '@',
                    replacement: path.resolve(projectRootDir, 'src'),
                },
            ],
        }),
        resolve({
            extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss', '.ts'],
        }),
        commonJS({include: 'node_modules/**'}),
        process.env.ROLLUP_WATCH && serve('dist'),
    ],
};
