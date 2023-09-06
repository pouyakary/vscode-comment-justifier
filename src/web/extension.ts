// Justifier - A comment justifier
// extension for Visual Studio Code that
// justifies the size of comments lines to
// under 40 character for better
// readability.
//
// (C) 2023-present Pouya Kary
// <kary@gnu.org>
//
// This program is free software: you can
// redistribute it and/or modify it under
// the terms of the GNU General Public
// License as published by the Free
// Software Foundation, either version 3 of
// the License, or (at your option) any
// later version.
//
// This program is distributed in the hope
// that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.
//
// You should have received a copy of the
// GNU General Public License along with
// this program. If not, see
// <https://www.gnu.org/licenses/>.

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
