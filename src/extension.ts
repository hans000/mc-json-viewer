// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getWebViewContent, getWorkSpacePath, getActivePaths } from './utils';
import { renderToString } from 'react-dom/server';
import McTree from './view';
import TreeProvider from './logic/TreeProvider';

export function activate(context: vscode.ExtensionContext) {

	const openviewer = vscode.commands.registerCommand('mc-json-viewer.openviewer', () => {
			const panel = vscode.window.createWebviewPanel('testweb', '预览', vscode.ViewColumn.Beside, {});
			// const data = fs.readFileSync(path.join(context.extensionPath, './src/assets/advancement.json')).toString();
			const lang = fs.readFileSync(path.join(context.extensionPath, './src/assets/1.16.zh_cn.json')).toString();
			const tpl = getWebViewContent(context, './src/assets/template.html');
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const paths = getActivePaths(editor, 'advancements');
				const treeProvider = new TreeProvider(editor, paths, 'advancements');
				const data = treeProvider.getData();
				const cont = McTree({
					data,
					lang: JSON.parse(lang)
				});
				const newHtml = tpl.replace('{{}}', renderToString(cont));
				panel.webview.html = newHtml;
			}
		}
	);

	

	context.subscriptions.push(openviewer);
}

export function deactivate() {}
