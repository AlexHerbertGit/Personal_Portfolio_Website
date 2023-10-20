function toggleSkillDetails(element) {
    // Get the sibling 'js-details' container of the clicked logo
    const details = element.nextElementSibling;

    // Toggle the opacity, visibility, and position properties
    if (details.style.opacity === "0" || details.style.opacity === "") {
        details.style.opacity = "1"; 
        details.style.visibility = "visible";
        details.style.position = "static"; // Reset to default position value
    } else {
        details.style.opacity = "0"; 
        details.style.visibility = "hidden";
        setTimeout(() => {
            details.style.position = "absolute"; // Delay the position change to after the fade out
        }, 500); // 500ms matches the transition duration
    }
}

function toggleSkillContainerDirection() {
    // Get the .skill-container element
    const skillContainer = document.querySelector('.skill-container');

    // Check the current flex-direction and toggle it
    if (skillContainer.style.flexDirection === 'row' || skillContainer.style.flexDirection === '') {
        skillContainer.style.flexDirection = 'column';
    } else {
        skillContainer.style.flexDirection = 'row';
    }
}