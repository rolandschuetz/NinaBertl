let options = {
    className: {
        pageScrolled: "page--scrolled",
        pageLoaded: "page--loaded",
        headerMenuToggleActive: 'header__menu-toggle--active'
    },
    selector: {
        page: '.page',
        header: '.header',
        headerMenuToggle: '.header__menu-toggle'
    }
}

window.addEventListener('load', () => {
    let page = document.querySelector(options.selector.page);

    page.classList.add(options.className.pageLoaded);
});

window.addEventListener('scroll', () => {
    let page = document.querySelector(options.selector.page);
    let header = document.querySelector(options.selector.header);
    let headerHeight = header.getBoundingClientRect().height;

    if (window.scrollY > (headerHeight + 10)) {
        page.classList.add(options.className.pageScrolled);
    } else {
        if (page.classList.contains(options.className.pageScrolled)) page.classList.remove(options.className.pageScrolled);
    }
});

let headerMenuToggle = document.querySelector(options.selector.headerMenuToggle);
headerMenuToggle.addEventListener('click', () => {
    headerMenuToggle.classList.toggle(options.className.headerMenuToggleActive);
});

let paths = document.querySelectorAll('.path');
Array.prototype.forEach.call(paths, path => {
    let length = path.getTotalLength();
})