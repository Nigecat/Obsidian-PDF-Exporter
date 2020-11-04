import * as path from "path";
import { Plugin } from "obsidian";
import { writeFileSync } from "fs";
import { remote, PrintToPDFOptions } from "electron";

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


            // Rely on electron to render this html in a new window and print it to a pdf
            const win = new remote.BrowserWindow({ show: true });
            
            // Load the html onto the page from memory
            win.loadURL(`data:text/html;charset=utf-8,${html}`);
            
            // Our pdf export options
            const options: PrintToPDFOptions = {
                landscape: false,
                marginsType: 0,
                printBackground: false,
                printSelectionOnly: false,
                pageSize: "A4"
            };

            // Wait for the html to render
            win.webContents.on("did-finish-load", async () => {
                const data = await win.webContents.printToPDF(options);
                const save = await remote.dialog.showSaveDialog(win, {
                    title: "Export PDF",
                    // Take the name of the note and change the extension to 'pdf' to use as the default file name
                    defaultPath: path.join(path.dirname(state.state?.file), path.basename(state.state?.file, path.extname(state.state?.file)) + ".pdf"),
                });
                
                // Make sure the user didn't cancel the dialouge
                if (save.filePath) {
                    writeFileSync(save.filePath, data);
                }
            });
        });
    }
}