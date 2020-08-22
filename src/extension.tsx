import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getWebViewContent, getActivePaths } from './utils';
import { renderToString } from 'react-dom/server';
import McTree from './view';
import TreeProvider from './logic/TreeProvider';
import React from 'react';

export function activate(context: vscode.ExtensionContext) {
	const openviewer = vscode.commands.registerCommand('mc-json-viewer.openviewer', () => {
			const panel = vscode.window.createWebviewPanel('testweb', '预览', vscode.ViewColumn.Beside, { enableScripts: true });
			const lang = fs.readFileSync(path.join(context.extensionPath, './src/assets/1.16.zh_cn.json')).toString();
			const tpl = getWebViewContent(context, './src/assets/template.html');
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const paths = getActivePaths(editor, 'advancements');
				const treeProvider = new TreeProvider(editor, paths, 'advancements');
				const data = treeProvider.getData();
				const newHtml = tpl.replace('{{}}', renderToString(<McTree data={data} lang={JSON.parse(lang)} />));
				panel.webview.html = newHtml;
				panel.webview.postMessage({text: '你好，我是小茗同学！'});
			}
		}
	);

	context.subscriptions.push(openviewer);
}

export function deactivate() {}
