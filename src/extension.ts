import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('surroundWithFrame.surround', () => {
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

    // Register the CodeActionProvider
    vscode.languages.registerCodeActionsProvider('*', new SurroundWithFrame(), {
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
        const surroundAction = this.createSurroundWithFrameAction(document, range);

        return surroundAction ? [surroundAction] : undefined;
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
            command: 'surroundWithFrame.surround',
            title: 'Surround with <Frame>...</Frame>',
            arguments: [range]
        };
        return surroundFix;
    }
}
