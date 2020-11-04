import * as path from "path";
import { Plugin } from "obsidian";
import { writeFileSync } from "fs";
import { remote as electron, PrintToPDFOptions } from "electron";

export default class PDFExporter extends Plugin {
    onload() {       
        const exportPDF = () => {
            // Get the current active panel
            // We assume this is the note that the user wants to export
            const current = this.app.workspace.activeLeaf;
            
            // Get the state of the note we are exporting
            // We need to ensure that the user actually has a note open
            const state = current.getViewState();

            // If there is nothing open in the active panel
            if (state.type === "empty") {
                electron.dialog.showErrorBox("Obsidian PDF Export", "Unable to export empty note");
                return;
            }

            let html;
            // If the note is already in rendered mode we can just grab the html from it
            if (state.state?.mode === "preview") {
                html = current.view.containerEl.children[1].children[1].children[0].outerHTML;
            } 
            
            // If we aren't then get the user to switch to the preview mode
            // TODO: Potentially make this automatic in future versions
            else {
                electron.dialog.showErrorBox("Obsidian PDF Export", "Currently unable to export the markdown view of a note, please switch to the preview mode before attempting to export");
                return;
            }

            // Rely on electron to render this html in a new window and print it to a pdf
            const win = new electron.BrowserWindow({ show: false });
            
            // Load the html onto the page from memory
            win.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);

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
                const save = await electron.dialog.showSaveDialog(win, {
                    title: "Obsidian Export PDF",
                    // Take the name of the note and change the extension to 'pdf' to use as the default file name
                    defaultPath: path.join(path.dirname(state.state?.file), path.basename(state.state?.file, path.extname(state.state?.file)) + ".pdf"),
                });
                
                // Make sure the user didn't cancel the dialouge
                if (save.filePath) {
                    writeFileSync(save.filePath, data);
                }
            });
        };

        this.addCommand({
            id: "export-pdf",
            name: "Export PDF",
            callback: exportPDF,
        });

        this.addRibbonIcon("dice", "Export PDF", exportPDF);
    }
}