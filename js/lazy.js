let lazyMedias = ['img', 'video', 'iframe']
let observer_lazy = new IntersectionObserver(function(entries, observer_lazy) {
    /*
    entries.forEach(entry => {
    	if (entry.isIntersecting) {
    		entry.target.src = entry.target.dataset.src;
    		observer_lazy.unobserve(entry.target);
    	}
    });
    //*/
    for (var i in entries) {
        // console.log(entries, i);
        if (entries[i].isIntersecting) {
            // console.log(entries[i] + 'index : ' + lazyMedias.indexOf(entries[i].target.tagName.toLowerCase()));
            if (lazyMedias.indexOf(entries[i].target.tagName.toLowerCase()) == -1) {
                entries[i].target.style.background = entries[i].target.dataset.src
                    // console.log(entries[i].target.dataset.src);
                entries[i].target.style.backgroundSize = 'cover'
            } else {
                entries[i].target.src = entries[i].target.dataset.src;
            }
            observer_lazy.unobserve(entries[i].target);
        }
    }
}, {
    rootMargin: "100px"
});

// document.querySelectorAll('.lazy').forEach(o => { observer_lazy.observe(o) });

let lazys = document.querySelectorAll('.lazy')
for (var j in lazys) {
    observer_lazy.observe(lazys.item(j))
}