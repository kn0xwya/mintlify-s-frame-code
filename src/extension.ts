import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('mintlify-s-frame-code.surround', () => {
            const editor = vscode.window.activeTextEditor;

            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);

                if (selectedText) {
                    const surroundedText = `<Frame>${selectedText}</Frame>`;

                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, surroundedText);
                    });
                } else {
                    vscode.window.showErrorMessage('No text selected to surround.');
                }
            }
        })
    );

    vscode.languages.registerCodeActionsProvider('javascript', new SurroundWithFrame(), {
        providedCodeActionKinds: SurroundWithFrame.providedCodeActionKinds
    });
}

export function deactivate() {}

class SurroundWithFrame implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection
    ): vscode.CodeAction[] | undefined {
        console.log('Code Action Provider called');  // Debugging log
        const surroundAction = this.createSurroundWithFrameAction(document, range);
        return surroundAction ? [surroundAction] : [];
    }

    private createSurroundWithFrameAction(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection
    ): vscode.CodeAction | undefined {
        const selectedText = document.getText(range);
        if (!selectedText) {
            return;
        }

        const surroundFix = new vscode.CodeAction(
            `Surround with <Frame>...</Frame>`,
            vscode.CodeActionKind.QuickFix
        );
        surroundFix.command = {
            command: 'mintlify-s-frame-code.surround',
            title: 'Surround with <Frame>...</Frame>',
            arguments: [range]
        };
        return surroundFix;
    }
}
