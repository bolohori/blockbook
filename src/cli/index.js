#!/usr/bin/env node

const path = require( 'path' );
const { execSync } = require( 'child_process' );
const fs = require( 'fs' );
const { sync: resolveBin } = require( 'resolve-bin' );

const myArgs = process.argv.slice( 2 );
const extraArgs = process.argv.slice( 3 );

const env =
	'NODE_ENV=' + ( myArgs[ 0 ] === 'start' ? 'development' : 'production' );
const bin = myArgs[ 0 ] === 'start' ? 'webpack-dev-server' : 'webpack';
const command = myArgs[ 0 ] === 'start' ? '--open' : '';
const loadFile = path.resolve( __dirname, '../app/load.js' );
const configEntryPoint = path.resolve( process.cwd(), '.blockbook/index.js' );
const relativeConfigEntryPoint = path.relative(
	path.resolve( __dirname, '../app' ),
	configEntryPoint
);

// Load blockbook config
let importConfig = `import '${ relativeConfigEntryPoint }';\n`;
// If a public path is defined
if (
	extraArgs[ 0 ] &&
	extraArgs[ 0 ].indexOf( '--output-public-path=' ) === 0
) {
	importConfig += `window.webpackPublicPath = '${ extraArgs[ 0 ].substring(
		21
	) }';\n`;
}
fs.writeFileSync( loadFile, importConfig );

execSync(
	[
		env,
		resolveBin( bin ),
		command,
		...extraArgs,
		'--config',
		path.resolve( __dirname, 'webpack.config.js' ),
	].join( ' ' ),
	{
		stdio: 'inherit',
	}
);
