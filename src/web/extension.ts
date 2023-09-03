import * as vscode from 'vscode';

import { justifyCurrentComment } from './command';

// ─── Activation ────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'justifier.justify',
		justifyCurrentComment,
	);

	context.subscriptions.push(disposable);
}

// ─── Deactivation ──────────────────────────────────────────────────────── ✣ ─

export function deactivate() {}
