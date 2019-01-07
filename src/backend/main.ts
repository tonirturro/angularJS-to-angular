import { app, BrowserWindow } from "electron";
import { main } from "../backend/app";

let mainWindow = null;

/*
 * Backend startup
 */
main.application.set("port", process.env.PORT || 3000);

const server = main.application.listen(main.application.get("port"), () => {
    // tslint:disable-next-line:no-console
    console.log("Express server listening on port " + server.address().port);
});

/**
 * Quit the application if we are not in MacOS and all the windows are closed
 */
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        server.close();
        app.quit();
    }
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({ width: 1280, height: 720, frame: false });
    const url = `file://${app.getAppPath()}/index.htm`;
    mainWindow.loadURL(url);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});
