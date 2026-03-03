#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const HOST = process.env.CB_HOST ?? '127.0.0.1';
const PORT = process.env.CB_PORT ?? '4173';
const BASE_PATH = process.env.CB_BASE_PATH ?? '/glean';
const BASE_URL = `http://${HOST}:${PORT}${BASE_PATH}`;
const WAIT_TIMEOUT_MS = Number(process.env.CB_WAIT_TIMEOUT_MS ?? '4000');
const OUTPUT_DIR = process.env.CB_OUTPUT_DIR ?? path.join(tmpdir(), 'glean-cross-browser');
const ROUTES = ['', '/about', '/FOBS'];
const BROWSERS = ['chromium', 'firefox', 'webkit'];
const VIEWPORTS = [
	{ name: 'desktop', size: '1440,900' },
	{ name: 'mobile', size: '390,844' }
];

const delay = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const runCommand = (cmd, args, options = {}) =>
	new Promise((resolve, reject) => {
		const child = spawn(cmd, args, {
			stdio: 'inherit',
			shell: false,
			...options
		});

		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
		});
	});

const waitForServer = async (url, retries = 30) => {
	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
		} catch {}

		await delay(500);
	}

	throw new Error(`Preview server not reachable at ${url}`);
};

const startPreviewServer = () =>
	new Promise((resolve, reject) => {
		let resolved = false;
		const child = spawn(
			'bun',
			['run', 'preview', '--', '--host', HOST, '--port', PORT],
			{
				stdio: ['ignore', 'pipe', 'pipe'],
				shell: false
			}
		);

		const onData = (data) => {
			const text = data.toString();
			process.stdout.write(text);
			if (!resolved && text.includes('Local:')) {
				resolved = true;
				resolve(child);
			}
		};

		const onErrData = (data) => {
			process.stderr.write(data.toString());
		};

		child.stdout.on('data', onData);
		child.stderr.on('data', onErrData);
		child.on('error', (error) => {
			if (resolved) return;
			reject(error);
		});
		child.on('exit', (code) => {
			if (resolved) return;
			reject(new Error(`Preview server exited before ready (code ${code})`));
		});
	});

const stopPreviewServer = async (child) => {
	if (child.killed) return;
	child.kill('SIGINT');
	await delay(500);
	if (!child.killed) {
		child.kill('SIGTERM');
	}
};

const routeLabel = (route) => {
	if (!route || route === '/') return 'home';
	return route.replace(/^\//, '').replace(/[^a-zA-Z0-9_-]/g, '-');
};

const run = async () => {
	mkdirSync(OUTPUT_DIR, { recursive: true });

	console.log('Building project for smoke screenshots...');
	await runCommand('bun', ['run', 'build']);

	console.log(`Starting preview server at ${BASE_URL} ...`);
	const preview = await startPreviewServer();

	try {
		await waitForServer(BASE_URL);
		console.log(`Writing screenshots in ${OUTPUT_DIR}`);

		for (const browser of BROWSERS) {
			for (const viewport of VIEWPORTS) {
				for (const route of ROUTES) {
					const url = `${BASE_URL}${route}`;
					const file = path.join(
						OUTPUT_DIR,
						`${browser}-${viewport.name}-${routeLabel(route)}.png`
					);
					await runCommand('npx', [
						'--yes',
						'playwright',
						'screenshot',
						`--browser=${browser}`,
						`--viewport-size=${viewport.size}`,
						'--full-page',
						`--wait-for-timeout=${WAIT_TIMEOUT_MS}`,
						url,
						file
					]);
				}
			}
		}
	} finally {
		await stopPreviewServer(preview);
	}

	console.log('Cross-browser smoke screenshots completed.');
};

run().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
