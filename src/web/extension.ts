import * as vscode from 'vscode';

import { justifyCurrentComment } from './command';

// ─── Activation ────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		'justifier.justify-comment',
		justifyCurrentComment,
	);

	context.subscriptions.push(disposable);
}

// ─── Deactivation ──────────────────────────────────────────────────────── ✣ ─

export function deactivate() {}
