<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Explorer</title>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <div class="frame-container">
        <iframe id="top-frame" src="top.dsp"></iframe>
        <div class="container" style="margin-top: 10px;">
            <div class="section">
                <label class="label">Select package :</label>
                <select id="packageDropdown" class="dropdown">
                </select>
                <button class="view-btn" id="viewFilesButton">View files</button>
            </div>
            <div class="section right-section">
                <label class="label">Select Server :</label>
                <select id="serverDropdown" class="dropdown" style="margin-right: 30px;">
                    %invoke HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:getServerList%
                    %loop serverList%
                    <option value="%value serverList%" name="%value serverList%">%value serverList%</option>
                    %endloop%
                    %endinvoke%
                </select>
            </div>
        </div>
        <iframe id="main-frame" src="file_heirarchy.dsp" style="margin-top: 0%;"></iframe>
    </div>

    <script>
        function adjustIframeHeight() {
            let topFrame = document.getElementById('top-frame');
            let mainFrame = document.getElementById('main-frame');

            if (topFrame && mainFrame) {
                setTimeout(() => {
                    let topFrameHeight = topFrame.contentWindow.document.documentElement.scrollHeight || 0;

                    if (topFrameHeight > 0) {
                        topFrame.style.height = topFrameHeight + "px";
                        mainFrame.style.height = `calc(100vh - ${topFrameHeight}px)`;
                    }
                }, 500);
            }
        }

        window.onload = adjustIframeHeight;
        window.onresize = adjustIframeHeight;
        document.getElementById("top-frame").onload = adjustIframeHeight;





        document.getElementById("viewFilesButton").addEventListener("click", function() {
            const server = document.getElementById("serverDropdown").value;
            const package = document.getElementById("packageDropdown").value;

            if (server && package) {
                const iframe = document.getElementById("main-frame");
                iframe.src = `file_heirarchy.dsp?server=${encodeURIComponent(server)}&package=${encodeURIComponent(package)}`;
            } else {
                alert("Please select a server and a package.");
            }
        });
    </script>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const serverDropdown = document.getElementById("serverDropdown");
        const packageDropdown = document.getElementById("packageDropdown");

        if (!packageDropdown) {
            alert("packageDropdown element not found!");
            return;
        }

        function updatePackageDropdown(server) {
            if (!server) {
                packageDropdown.innerHTML = '<option value="">Select Package</option>';
                return;
            }

            const serviceUrl = "/invoke/HG_DeveloperUtilities.HG_ConfigurationManager.v1.ui:getPackageList?server=" + encodeURIComponent(server);

            fetch(serviceUrl)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => { // Parse error JSON
                            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`);
                        }).catch(() => { // Handle cases where response is not valid json
                            return response.text().then(text => {
                                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                            });
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    packageDropdown.innerHTML = '<option value="">Select Package</option>';

                    if (data && data.packageList && Array.isArray(data.packageList)) {
                        data.packageList.forEach(pkg => {
                            const option = document.createElement("option");
                            option.value = pkg;
                            option.textContent = pkg;
                            packageDropdown.appendChild(option);
                        });
                    } else {
                        alert("Invalid response format from service.");
                        packageDropdown.innerHTML = '<option value="">Select Package</option>';
                    }
                })
                .catch(error => {
                    alert("Error fetching packages: " + error.message);
                    packageDropdown.innerHTML = '<option value="">Select Package</option>'; // Clear dropdown
                });
        }

        function handleServerChange() {
            const selectedServer = serverDropdown.value;
            updatePackageDropdown(selectedServer);
        }

        handleServerChange();

        serverDropdown.addEventListener("change", handleServerChange);
    });
</script>
</body>

</html>