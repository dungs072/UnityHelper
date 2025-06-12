import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('unityDebugLog.addDebugLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection).trim();
		let debugLine = '';
        if (!selectedText) {
			debugLine = `Debug.Log($"<color=red>It is just a debug line</color>");\n`;
        }
		else{
			const randomColor = getRandomHexColor();
			debugLine = `Debug.Log($"<color=${randomColor}>${selectedText}: {${selectedText}}</color>");\n`;
		}
        const insertPosition = selection.end.with(selection.end.line + 1, 0);
        editor.edit(editBuilder => {
            editBuilder.insert(insertPosition, debugLine);
        });
    });

    context.subscriptions.push(disposable);

    vscode.languages.registerColorProvider({ language: 'csharp' }, new UnityColorProvider());
}


function getRandomHexColor(): string {
    const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function parseUnityColor(color: string): string {
    const unityNamedColors: Record<string, string> = {
        red: '#FF0000', green: '#00FF00', blue: '#0000FF',
        yellow: '#FFFF00', orange: '#FFA500',
        cyan: '#00FFFF', magenta: '#FF00FF',
        grey: '#808080', black: '#000000', white: '#FFFFFF'
    };

    if (color.startsWith('#')) return color;
    return unityNamedColors[color.toLowerCase()] ?? '#FFFFFF';
}

class UnityColorProvider implements vscode.DocumentColorProvider {
    provideDocumentColors(document: vscode.TextDocument): vscode.ProviderResult<vscode.ColorInformation[]> {
        const text = document.getText();
        const colorRegex = /<color=([#a-zA-Z0-9]+)>/g;
        const colors: vscode.ColorInformation[] = [];

        let match;
        while ((match = colorRegex.exec(text)) !== null) {
            const colorValue = parseUnityColor(match[1]);
            const startPos = document.positionAt(match.index + 7);
            const endPos = document.positionAt(match.index + 7 + match[1].length);
            const range = new vscode.Range(startPos, endPos);

            const colorObj = hexToVscodeColor(colorValue);
            colors.push(new vscode.ColorInformation(range, colorObj));
        }
        return colors;
    }

    provideColorPresentations(color: vscode.Color, context: { readonly document: vscode.TextDocument; readonly range: vscode.Range }, token: vscode.CancellationToken): vscode.ProviderResult<vscode.ColorPresentation[]> {
        const hex = vscodeColorToHex(color);
        return [new vscode.ColorPresentation(hex)];
    }
}

function hexToVscodeColor(hex: string): vscode.Color {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new vscode.Color(r, g, b, 1);
}

function vscodeColorToHex(color: vscode.Color): string {
    const r = Math.round(color.red * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.green * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.blue * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

export function deactivate() {}
