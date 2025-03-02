function toggleSection(id) {
    let section = document.getElementById(id);
    
    // Close all sections first
    document.querySelectorAll('.content').forEach(content => {
        if (content.id !== id) {
            content.style.maxHeight = null;
        }
    });

    // Open or close the clicked section
    if (section.style.maxHeight) {
        section.style.maxHeight = null;
    } else {
        section.style.maxHeight = section.scrollHeight + "px";
    }
}
