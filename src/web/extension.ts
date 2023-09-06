import * as vscode from 'vscode';
import { justifyCurrentComment } from './command';

// ─── Activation ────────────────────────────────────────────────────────── ✣ ─

export function
activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'justifier.justify',justifyCurrentComment));
}

// ─── Deactivation ──────────────────────────────────────────────────────── ✣ ─

export function
deactivate() {}
