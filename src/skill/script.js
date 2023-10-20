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
