function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const server = getQueryParam("server");
const package = getQueryParam("package");
if (server && package) {
    fetch(`/invoke/HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:getFileStructure?server=${encodeURIComponent(server)}&packageName=${encodeURIComponent(package)}`)
        .then(response => response.json())
        .then(data => {
            console.log("JSON Response:", data);
            if (data && data.pubDirStructure) {
                createInitialDirectory(document.getElementById("file-explorer1"), data.pubDirStructure, "breadcrumb1");
            } else {
                console.error("pubDirStructure is missing or invalid.");
            }
            if (data && data.conFigDirStructure) {
                createInitialDirectory(document.getElementById("file-explorer2"), data.conFigDirStructure, "breadcrumb2");
            } else {
                console.error("conFigDirStructure is missing or invalid.");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}
function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = {
        "html": "🌐", "dsp": "🌐",
        "css": "🎨", "js": "📜",
        "jpg": "🖼️", "png": "🖼️", "gif": "🖼️",
        "properties": "🛠️"
    };
    return iconMap[ext] || "📄";
}
function updateBreadcrumb(id, path) {
    document.getElementById(id).textContent = `📌 You are at: ${path}`;
}

function createInitialDirectory(container, directory, breadcrumbId) {
    if (!directory || !directory.children) {
        console.error("Directory or its children are missing:", directory);
        return;
    }

    createFileTree(container, [directory], breadcrumbId); // Create the initial directory

}















document.getElementById('pubDir').addEventListener('click', function () {
    handleNewDirectoryClick('file-explorer1', 'breadcrumb1', true);
});

document.getElementById('configDir').addEventListener('click', function () {
    handleNewDirectoryClick('file-explorer2', 'breadcrumb2', false);
});

function handleNewDirectoryClick(containerId, breadcrumbId, isPub) {
    const container = document.getElementById(containerId);
    const selectedDirectory = getSelectedDirectory(container);

    if (!selectedDirectory) {
        alert('Please select a directory first.');
        return;
    }

    if (!selectedDirectory.isDirectory) {
        alert('Please select a directory to create a new folder inside it.');
        return;
    }

    const newFolderName = prompt('Enter the new folder name:');
    if (newFolderName) {
        createNewDirectory(selectedDirectory.path, newFolderName, isPub);
    }
}

function getSelectedDirectory(container) {
    let selected = null;
    container.querySelectorAll('li').forEach(li => {
        if (li.classList.contains('selected-dir')) {
            selected = li.fileData;
        }
    });
    return selected;
}

function createNewDirectory(parentPath, newFolderName, isPub) {
    const server = getQueryParam("server");
    const package = getQueryParam("package");

    if (!server || !package) {
        alert("Server or package information is missing.");
        return;
    }


    const encodedServer = encodeURIComponent(server);
    const encodedPackage = encodeURIComponent(package);
    const encodedDirPath = encodeURIComponent(parentPath);
    const encodedDirname = encodeURIComponent(newFolderName);

    const url = `/invoke/HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:createDirectory?server=${encodedServer}&packageName=${encodedPackage}&directoryPath=${encodedDirPath}&newDirectoryName=${encodedDirname}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.success) {
                alert('Directory created successfully!');
                // No refresh here.

            } else {
                alert('Failed to create directory: ' + (data && data.error ? data.error : 'Unknown error'));
            }
        })
        .catch(error => alert('Network error: ' + error.message));
}

function createFileTree(container, files, breadcrumbId) {
    if (!Array.isArray(files)) {
        console.error("files is not an array:", files);
        return;
    }

    files.forEach(file => {
        const li = document.createElement("li");
        li.fileData = file;

        if (file.isDirectory) {
            const folderContainer = document.createElement("div");
            folderContainer.classList.add("folder-container");

            const span = document.createElement("span");
            span.innerHTML = "➕";
            span.classList.add("toggle-icon");

            const folderName = document.createElement("span");
            folderName.textContent = "📁 " + file.name;
            folderName.classList.add("folder");
            folderName.onclick = () => {
                updateBreadcrumb(breadcrumbId, file.path);
                // Clear all existing selections within the same container
                container.querySelectorAll('li').forEach(el => el.classList.remove('selected-dir'));
                li.classList.add('selected-dir');
            };

            const ul = document.createElement("ul");
            ul.classList.add("hidden");

            span.addEventListener("click", () => {
                ul.classList.toggle("hidden");
                if (ul.classList.contains("hidden")) {
                    span.innerHTML = "➕";
                    span.classList.remove("open");
                } else {
                    span.innerHTML = "❖";
                    span.classList.add("open");
                }
            });

            folderContainer.appendChild(span);
            folderContainer.appendChild(folderName);
            li.appendChild(folderContainer);
            li.appendChild(ul);

            if (file.children && file.children.length > 0) {
                createFileTree(ul, file.children, breadcrumbId);
            }
        } else {
            li.classList.add("file");
            li.innerHTML = `${getFileIcon(file.name)} ${file.name}`;
            li.onclick = () => {
                updateBreadcrumb(breadcrumbId, file.path);
                //Clear all existing selections within the same container.
                container.querySelectorAll('li').forEach(el => el.classList.remove('selected-dir'));
                callFlowService(package, server, file.path); // Add this line back
            };
        }
        container.appendChild(li);
    });
}







document.getElementById("pubUploadButton").addEventListener("click", function () {
    handleFileUpload('fileInput_pub', 'file-explorer1', true);
});

document.getElementById("configUploadButton").addEventListener("click", function () {
    handleFileUpload('fileInput_config', 'file-explorer2', false);
});












document.getElementById("fileInput_pub").addEventListener("change", function () {
    const fileNameDisplay = document.getElementById("fileNameDisplay_pub");
    if (this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
    } else {
        fileNameDisplay.textContent = "";
    }
});

document.getElementById("fileInput_config").addEventListener("change", function () {
    const fileNameDisplay = document.getElementById("fileNameDisplay_config");
    if (this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
    } else {
        fileNameDisplay.textContent = "";
    }
});

function handleFileUpload(fileInputId, containerId, isPub) {
    const fileInput = document.getElementById(fileInputId);
    const container = document.getElementById(containerId);
    const selectedDirectory = getSelectedDirectory(container);

    if (!selectedDirectory) {
        alert('Please select a directory first.');
        fileInput.value = ''; // Clear the file input
        const fileNameDisplay = document.getElementById(isPub ? "fileNameDisplay_pub" : "fileNameDisplay_config");
        fileNameDisplay.textContent = ""; // Clear the file display
        return;
    }

    if (!selectedDirectory.isDirectory) {
        alert('Please select a directory to upload the file to.');
        fileInput.value = ''; // Clear the file input
        const fileNameDisplay = document.getElementById(isPub ? "fileNameDisplay_pub" : "fileNameDisplay_config");
        fileNameDisplay.textContent = ""; // Clear the file display
        return;
    }

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            uploadFileToWebMethods(selectedDirectory.path, file.name, event.target.result, isPub);
            fileInput.value = ''; // Clear the file input after upload
            const fileNameDisplay = document.getElementById(isPub ? "fileNameDisplay_pub" : "fileNameDisplay_config");
            fileNameDisplay.textContent = ""; // Clear the file display after upload
        };
        reader.readAsDataURL(file); // Read as Data URL to get base64 encoded content.
    }
}

function uploadFileToWebMethods(directoryPath, fileName, fileContent, isPub) {
    const server = getQueryParam("server");
    const package = getQueryParam("package");

    if (!server || !package) {
        alert("Server or package information is missing.");
        return;
    }

    const encodedServer = encodeURIComponent(server);
    const encodedPackage = encodeURIComponent(package);
    const encodedDirPath = encodeURIComponent(directoryPath);
    const encodedFileName = encodeURIComponent(fileName);
    const encodedFileContent = encodeURIComponent(fileContent);

    const url = `/invoke/HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:uploadFile?server=${encodedServer}&packageName=${encodedPackage}&directoryPath=${encodedDirPath}&uploadedFileName=${encodedFileName}&fileContent=${encodedFileContent}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.success) {
                alert('File uploaded successfully!');
            } else {
                alert('Failed to upload file: ' + (data && data.error ? data.error : 'Unknown error'));
            }
        })
        .catch(error => alert('Network error: ' + error.message));
}