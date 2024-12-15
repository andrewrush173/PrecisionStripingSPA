"use strict";
function MakeJob({
    jobName = "New Job",
    clientName = "Client Name",
    jobCost = 1000, // Default numerical value for calculations
    clientType = "Service Type",
    imgSrc = "pics/default.jpg",
    imgObjList = [
        { display: "Default Image", val: "pics/default.jpg" },
        { display: "Commercial Job", val: "pics/commercial.jpg" },
        { display: "Residential Job", val: "pics/residential.jpg" }
    ],
    clientTypeList = ["Commercial", "Municipal", "Industrial"] // Predefined client types
}) {
    // Main container with assigned class
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job-container");

    // Private function to render the component content
    const displayContent = () => {
        jobDiv.innerHTML = ''; // Clear existing content

        const content = `
            <img src="${imgSrc}" alt="${jobName}" class="job-image">
            <p>Job Name: ${jobName}</p>
            <p>Client Name: ${clientName}</p>
            <p>Job Cost: $${jobCost.toFixed(2)}</p>
            <p>
                Client Type: 
                <select id="client-type-select" class="selectClientType">
                ${clientTypeList.map(type => `<option value="${type}" ${type === clientType ? "selected" : ""}>
                ${type}</option>`).join("")}
                </select>
            </p>

            <label for="image-select">Choose an image:</label>
            <select id="image-select" class="selectImages">
                ${imgObjList.map(item => `<option value="${item.val}">${item.display}</option>`).join('')}
            </select>
            
            <label for="job-cost-input">Update cost:</label>
            <input type="number" placeholder="Enter new job cost">
            <button>Update Cost</button>
        `;

        jobDiv.innerHTML = content;

        // Adding interactivity
        const imageSelect = jobDiv.querySelector("#image-select");
        const imgEl = jobDiv.querySelector(".job-image");
        const costButton = jobDiv.querySelector("button:nth-of-type(1)");
        const clientTypeSelect = jobDiv.querySelector("#client-type-select");

        // Set the initial image selection
        imageSelect.value = imgSrc;

        // Event to change the image based on dropdown selection
        imageSelect.onchange = () => {
            imgEl.src = imageSelect.value;
        };

        costButton.onclick = () => {
            const costInput = costButton.previousElementSibling;
            const newCost = Number(costInput.value);
            if (!isNaN(newCost)) { // Check if the input is a valid number
                jobCost = newCost; // Set jobCost to the new value
                displayContent(); // Re-render to show updated cost
            } else {
                alert("Please enter a valid positive number for job cost.");
            }
        };

        clientTypeSelect.onchange = () => {
            clientType = clientTypeSelect.value;
            displayContent();
        }

        // Original event handling: change background color on hover
        jobDiv.onmouseover = () => jobDiv.style.backgroundColor = "#e0f7fa";
        jobDiv.onmouseout = () => jobDiv.style.backgroundColor = "";
    };

    // Initial rendering
    displayContent();

    return jobDiv;
}
