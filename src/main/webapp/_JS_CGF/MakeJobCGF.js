"use strict";
function MakeJobCGF() {
    // Create a container for the job components
    const container = document.createElement("div");
    container.classList.add("job-list-container");

    
    const job1 = MakeJob({
        jobName: "Parking Lot Striping",
        clientName: "News Corp",
        jobCost: 1500,
        clientType: "Commercial",
        imgSrc: "pics/striping.jpg",
        imgObjList: [
            { display: "Striping Job", val: "pics/striping.jpg" },
            { display: "Epoxy Job", val: "pics/epoxy.jpg" },
            { display: "Crack Filling Job", val: "pics/crack.jpg" }
        ]
    });

    
    const job2 = MakeJob({
        jobName: "Epoxy Coating",
        clientName: "City Council",
        jobCost: 5000,
        clientType: "Municipal",
        imgSrc: "pics/epoxy.jpg",
        imgObjList: [
            { display: "Striping Job", val: "pics/striping.jpg" },
            { display: "Epoxy Job", val: "pics/epoxy.jpg" },
            { display: "Crack Filling Job", val: "pics/crack.jpg" }
        ]
    });

   
    const job3 = MakeJob({
        jobName: "Crack Filling",
        clientName: "Petroleum Plant",
        jobCost: 7000,
        clientType: "Industrial",
        imgSrc: "pics/crack.jpg",
        imgObjList: [
            { display: "Striping Job", val: "pics/striping.jpg" },
            { display: "Epoxy Job", val: "pics/epoxy.jpg" },
            { display: "Crack Filling", val: "pics/crack.jpg" }
        ]
    });

    // Append the three jobs to the container
    container.appendChild(job1);
    container.appendChild(job2);
    container.appendChild(job3);

    return container;
}
