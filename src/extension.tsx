import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getWebViewContent, getActivePaths } from './utils';
import { renderToString } from 'react-dom/server';
import McTree from './view';
import TreeProvider from './logic/TreeProvider';
import React from 'react';

export function activate(context: vscode.ExtensionContext) {
	const openviewer = vscode.commands.registerCommand('mc-json-viewer.view', () => {
			const lang = fs.readFileSync(path.join(context.extensionPath, './assets/1.16.zh_cn.json')).toString();
			const tpl = getWebViewContent(context, './assets/template.html');
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const paths = getActivePaths(editor, 'advancements');
				const treeProvider = new TreeProvider(editor, paths, 'advancements');
				const data = treeProvider.getData();
				const panel = vscode.window.createWebviewPanel('mc-json-viewer', '预览', vscode.ViewColumn.Beside, {});
				if (!data[0]) {
					vscode.window.showWarningMessage('当前目录无法生成进度');
					return;
				}
				const newHtml = tpl.replace('{{}}', renderToString(<McTree data={data} lang={JSON.parse(lang)} />));
				panel.webview.html = newHtml;
			}
		}
	);

	context.subscriptions.push(openviewer);
}

export function deactivate() {}
