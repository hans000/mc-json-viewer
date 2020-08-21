import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';

export function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (_, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}

export function getExtensionFileVscodeResource(context: vscode.ExtensionContext, relativePath: string) {
    const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath));
    return diskPath.with({ scheme: 'vscode-resource' }).toString();
}

export function getWorkSpacePath(editor: vscode.TextEditor) {
    return vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath;
}

export function getActiveDirname(editor: vscode.TextEditor, type: string) {
    const filename = editor.document.fileName;
    const workspacePath = getWorkSpacePath(editor) as string;
    const index = filename.indexOf(type, workspacePath.length);
    const pos = filename.indexOf(path.sep, index + type.length + 1);
    return filename.substring(0, pos);
}

export function getActivePaths(editor: vscode.TextEditor, type: string) {
    const pattern = getActiveDirname(editor, type) + '/**/*.json';
    return glob.sync(pattern);
}

export function cutNamespace(filename: string) {
    return filename.slice(filename.indexOf(':') + 1) + '.json';
}

export function getFileData(filename: string) {
    let parentPath = '';
    const tmp: any = {};
    try {
        const data = JSON.parse(fs.readFileSync(filename).toString());
        const { parent, display } = data;
        if (parent) {
            parentPath = cutNamespace(parent);
        }
        if (display) {
            tmp.icon = display.icon.item;
            tmp.frame = display.frame;
            tmp.title = display.title.translate ? display.title.translate : display.title;
            tmp.description = display.description.translate ? display.description.translate : display.description;
        }
    } catch (error) {
        console.log(error);
    } finally {
        return [tmp, parentPath];
    }
}
