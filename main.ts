import { Plugin } from "obsidian";

export default class PDFExporter extends Plugin {
    onload() {
        this.addRibbonIcon("dice", "Export PDF", () => {
            console.log("button clicked!");
        });
    }
}