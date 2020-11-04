import { Plugin } from "obsidian";

export default class PDFExporter extends Plugin {
    onload() {
        this.addRibbonIcon("dice", "Export PDF", async () => {
            // Get the current active panel
            // We assume this is the note that the user wants to export
            const current = this.app.workspace.activeLeaf;
            
            // Get the state of the note we are exporting
            // We need to ensure that the user actually has a note open
            const state = current.getViewState();

            // If there is nothing open in the active panel
            if (state.type === "empty") {
                // TODO: Potentially display some sort of error to the user
                // For now we just silently do nothing
                return;
            }

            let html;
            // If the note is already in rendered mode we can just grab the html from it
            if (state.state?.mode === "preview") {
                html = current.view.containerEl;
            } 
            
            // TODO: Otherwise we have to open the preview ourselves to take the html
            else {
                // TODO: Show an error to the user until this feature is working
            }
 
            console.log(html);
        });
    }
}