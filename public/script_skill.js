function toggleSkillDetails(element) {
    // Get all logo elements
    const allLogos = document.querySelectorAll('.js-logo, .html-logo, .css-logo, .sql-logo'); // Add other logo class selectors as needed

    // Get the sibling 'js-details' container of the clicked logo
    const details = element.nextElementSibling;

    // If the clicked logo's details are currently hidden, show them and hide other logos
    if (details.style.opacity === "0" || details.style.opacity === "") {
        details.style.opacity = "1"; 
        details.style.visibility = "visible";
        details.style.position = "static"; // Reset to default position value

        // Hide other logos
        allLogos.forEach(logo => {
            if (logo !== element) {
                logo.style.display = 'none';
            }
        });
    } else {
        details.style.opacity = "0"; 
        details.style.visibility = "hidden";
        setTimeout(() => {
            details.style.position = "absolute"; // Delay the position change to after the fade out
        }, 500); // 500ms matches the transition duration

        // Show all logos
        allLogos.forEach(logo => {
            logo.style.display = 'block';
        });
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