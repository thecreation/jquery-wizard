function emulateTransitionEnd($el, duration) {
    var called = false;

    $el.one(Support.transition.end, function () {
        called = true;
    });
    var callback = function () {
        if (!called) {
            $el.trigger( Support.transition.end );
        }
    }
    setTimeout(callback, duration);
    return this;
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
