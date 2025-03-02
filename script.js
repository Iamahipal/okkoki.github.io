function toggleSection(id) {
    let section = document.getElementById(id);
    if (section.style.maxHeight) {
        section.style.maxHeight = null;
    } else {
        section.style.maxHeight = section.scrollHeight + "px";
    }
}
