import path from 'path';
import * as vscode from 'vscode';
import { getFileData, getActiveDirname } from '../utils';

export default class TreeProvider {
    private result: any = [];
    private dirname: string = '';

    constructor(editor: vscode.TextEditor, filenames: string[], type: string) {
        this.dirname = path.dirname(getActiveDirname(editor, type));
        const tree: any = {};
        filenames.forEach(e => this.merge(e, tree));
        this.result = [tree['root.json']];
    }
    private merge(filename: string, tree: any) {
        const [data, parentPath] = getFileData(filename);
        if (JSON.stringify(data) === '{}') {
            return data;
        }
        const name = path.basename(filename);
        if (tree[name]) {
            return;
        }
        tree[name] = data;
        if (parentPath) {
            const key = path.basename(parentPath);
            if (!tree[key]) {
                this.merge(path.resolve(this.dirname, parentPath), tree);
            }
            if (tree[key].children) {
                tree[key].children.push(data);
            } else {
                tree[key].children = [data];
            }
        }
    }
    public getData() {
        return this.result;
    }
}