function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

let editor; // Declare CodeMirror editor variable


function callFlowService(packageName, server, filePath) {
    const encodedPackageName = encodeURIComponent(packageName);
    const encodedServer = encodeURIComponent(server);
    const encodedFilePath = encodeURIComponent(filePath);

    const url = `/invoke/HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:getFileContent?packageName=${encodedPackageName}&server=${encodedServer}&filePath=${encodedFilePath}`;

    console.log("Fetching URL:", url);

    fetch(url)
        .then(response => {
            console.log("Response received:", response);
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            if (data.fileContent) {
                // Pass packageName and server to showEditor
                showEditor(data.fileContent, filePath, packageName, server);
            } else if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Unexpected response format.");
            }
        })
        .catch(error => {
            console.error("Error calling flow service:", error);
            alert("Network Error: " + error.message);
        });
}



function showEditor(content, filePath, packageName, server) {
    // Determine file mode based on extension
    let mode = "text/plain"; // Default mode
    if (filePath.endsWith(".html") || filePath.endsWith(".dsp")) {
        mode = "htmlmixed";
    } else if (filePath.endsWith(".js")) {
        mode = "javascript";
    } else if (filePath.endsWith(".css")) {
        mode = "css";
    } else if (filePath.endsWith(".xml")) {
        mode = "xml";
    } else if (filePath.endsWith(".json")) {
        mode = "json";
    } else if (filePath.endsWith(".properties")) {
        mode = "properties";
    } else {
        // Unsupported file type - show a message and exit
        const modalOverlay = document.createElement("div");
        modalOverlay.style.position = "fixed";
        modalOverlay.style.top = "0";
        modalOverlay.style.left = "0";
        modalOverlay.style.width = "100%";
        modalOverlay.style.height = "100%";
        modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modalOverlay.style.display = "flex";
        modalOverlay.style.justifyContent = "center";
        modalOverlay.style.alignItems = "center";
        modalOverlay.style.zIndex = "1000";
        document.body.appendChild(modalOverlay);

        const modalContent = document.createElement("div");
        modalContent.style.backgroundColor = "white";
        modalContent.style.padding = "20px";
        modalContent.style.borderRadius = "8px";
        modalContent.style.width = "400px";
        modalContent.style.textAlign = "center";
        modalOverlay.appendChild(modalContent);

        const message = document.createElement("p");
        message.textContent = "This file type cannot be viewed or edited in the editor.";
        modalContent.appendChild(message);

        const closeButton = createStyledButton("Close");
        closeButton.onclick = function () {
            document.body.removeChild(modalOverlay);
        };
        modalContent.appendChild(closeButton);

        return; // Exit the function
    }

    // Supported file type - create CodeMirror editor
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000";
    document.body.appendChild(modalOverlay);

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "white";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.width = "80%";
    modalContent.style.height = "80%";
    modalContent.style.position = "relative";
    modalOverlay.appendChild(modalContent);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "absolute";
    buttonContainer.style.top = "10px";
    buttonContainer.style.left = "10px";
    buttonContainer.style.zIndex = "1001";
    buttonContainer.style.display = "flex";
    buttonContainer.style.alignItems = "center";
    modalContent.appendChild(buttonContainer);

    const closeButton = createStyledButton("Close");
    closeButton.style.marginRight = "10px";
    closeButton.onclick = function () {
        document.body.removeChild(modalOverlay);
        editor = null;
    };
    buttonContainer.appendChild(closeButton);

    const editButton = createStyledButton("Edit");
    editButton.style.marginRight = "10px";
    let isEditable = false;
    editButton.onclick = function () {
        isEditable = !isEditable;
        editor.setOption("readOnly", !isEditable);
        editButton.innerHTML = isEditable ? "Read Only" : "Edit";
        saveButton.style.display = isEditable ? "inline" : "none";
    };
    buttonContainer.appendChild(editButton);

    const saveButton = createStyledButton("Save");
    saveButton.style.display = "none";
    saveButton.onclick = (function (packageName, server, filePath) {
        return function () {
            const newContent = editor.getValue();
            saveFileContent(packageName, server, filePath, newContent);
            alert("File saved!");
        };
    })(packageName, server, filePath); // Use the passed in packageName, server, filePath

    buttonContainer.appendChild(saveButton);

    const editorDiv = document.createElement("div");
    editorDiv.style.width = "100%";
    editorDiv.style.height = "calc(100% - 50px)";
    editorDiv.style.marginTop = "50px";
    modalContent.appendChild(editorDiv);

    editor = CodeMirror(editorDiv, {
        value: content,
        mode: mode,
        lineNumbers: true,
        theme: "default",
        readOnly: true
    });
}

function createStyledButton(text) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.style.padding = "8px 15px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.margin = "0 5px 10px 0";
    button.addEventListener("mouseover", function () {
        button.style.backgroundColor = "#0056b3";
    });
    button.addEventListener("mouseout", function () {
        button.style.backgroundColor = "#007bff";
    });
    return button;
}

function saveFileContent(packageName, server, filePath, newContent) {
    fetch(`/invoke/HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:saveFileContent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            packageName: packageName,
            server: server,
            filePath: filePath,
            fileContent: newContent
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert("Error saving file: " + error.message);
        });
}

function createStyledButton(text) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.style.padding = "8px 15px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.margin = "0 5px 10px 0";
    button.addEventListener("mouseover", function () {
        button.style.backgroundColor = "#0056b3";
    });
    button.addEventListener("mouseout", function () {
        button.style.backgroundColor = "#007bff";
    });

    return button;
}
