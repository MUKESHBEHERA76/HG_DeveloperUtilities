<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuration editor</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/properties/properties.min.js"></script>

    <link rel="stylesheet" href="css/file_heirarchy.css">
    <link rel="stylesheet" href="css/button.css">



    <style>
        #fileInput_config {
            display: none;
            /* Hide default file input */
        }

        #fileInput_pub {
            display: none;
            /* Hide default file input */
        }

        .file-upload-btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .file-upload-btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="explorer-row">
            <div class="package selector-container"></div>

            <div class="explorer-container">
                <div style="text-align: center;">📁 Pub Directory</div>

                <div class="button-container">
                    <button id="pubDir" class="new-directory-btn">New Directory</button>
                </div>

                <div id="breadcrumb1" class="breadcrumb-box">📌 You are at: Click a file or folder</div>
                <ul id="file-explorer1"></ul>

                <form id="pubUploadForm" class="upload-container">
                    <label for="fileInput_pub" class="file-upload-btn">Choose File</label>
                    <input type="file" name="file" id="fileInput_pub">
                    <span id="fileNameDisplay_pub" class="file-display"></span>
                    <button type="button" id="pubUploadButton" class="upload-btn">Upload</button>
                </form>
            </div>

            <div class="explorer-container">
                <div style="text-align: center;">📁 Config Directory</div>

                <div class="button-container">
                    <button id="configDir" class="new-directory-btn">New Directory</button>
                </div>

                <div id="breadcrumb2" class="breadcrumb-box">📌 You are at: Click a file or folder</div>
                <ul id="file-explorer2"></ul>

                <form id="configUploadForm" class="upload-container">
                    <label for="fileInput_config" class="file-upload-btn">Choose File</label>
                    <input type="file" name="file" id="fileInput_config">
                    <span id="fileNameDisplay_config" class="file-display"></span>
                    <button type="button" id="configUploadButton" class="upload-btn">Upload</button>
                </form>
            </div>
        </div>
    </div>

    <script src="js/file_heirarchy.js"></script>
    <script src="js/editor.js"></script>


</body>

</html>