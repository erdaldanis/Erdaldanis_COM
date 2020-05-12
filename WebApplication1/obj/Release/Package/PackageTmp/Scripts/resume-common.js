var busyIndicator = "<div class='busy-indicator'><i class='fa fa-cog fa-spin fa-3x fa-fw margin-bottom' style='font-size: 3em!important;line-height:30px!important;'></i></div>"
var defaultPopoverOptions = {
    html: true,
    placement: 'bottom',
    animation: false,
    trigger: 'manual',
    container: 'body'
};
$('[data-original-title]').popover();
$('[data-networkuserid],[data-toggle="lesson-popover"],[data-toggle="popover"],[data-toggle="intellectualProperty-popover"]').popover(defaultPopoverOptions);
$('[data-networkuserid],[data-toggle="lesson-popover"],[data-toggle="popover"],[data-toggle="intellectualProperty-popover"]')
    .on('hide.bs.popover', function () {
        if ($(".popover:hover").length) {
            return false;
        }
    });
$(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
        }
    });
    if (e.target.getAttribute("data-networkuserid")) {
        if (!isMobile()) {
            window.open('/nr/' + e.target.getAttribute("data-networkuserid"), '_blank');
        }
    }
});
$('[data-toggle="lesson-popover"]').hover(function (e) {
    showLessonPopover(this);
}, function () {
    setTimeoutHidePopover(this);
});
$('[data-toggle="intellectualProperty-popover"]').hover(function (e) {
    showintellectualPropertyPopover(this);
}, function () {
    setTimeoutHidePopover(this);
});
$('[data-networkuserid]').hover(function (e) {
    showUserInformationDetail(this);
}, function () {
    setTimeoutHidePopover(this);
});
$('[data-toggle="popover"]').hover(function (e) {
    var dataContent = e.target.dataset.content;
    $(this).popover('show');
    if (dataContent === "") {
        var popover = $(this).data('bs.popover').tip();
        var popoverContent = $(popover[0]).find('.popover-content');
        $(popoverContent[0]).remove();
    }
}, function () {
    setTimeoutHidePopover(this);
});
$(document).on('mouseleave', '.popover', function (e) {
    setTimeoutHidePopover(this);
});
function setTimeoutHidePopover(element) {
    setTimeout(function () {
        if (!$(".popover:hover").length) {
            $(element).popover("hide");
        }
    }, 100);
}
$('body').on('mouseleave', '.popover', function () {
    $('.popover').popover('hide');
});
function showUserInformationDetail(element) {
    var networkUserId = $(element).data("networkuserid");
    var data = { networkUserId: networkUserId };
    $(element).data('bs.popover').options.content = preparePopoverData(element, "/User/Details", data);
    $(element).popover('show');
}
function showLessonPopover(element) {
    var dataLink = $(element).data("link");
    $(element).data('bs.popover').options.content = prepareLessonPopoverData(element, dataLink);
    $(element).popover('show');
}
function showintellectualPropertyPopover(element) {
    var dataLink = $(element).data("link");
    $(element).data('bs.popover').options.content = preparePopoverData(element, dataLink);
    $(element).popover('show');
}
function preparePopoverData(element, link, data = null) {
    $.ajax({
        url: link,
        data: data,
        datatype: "html",
        async: true,
        success: function (response) {
            if ($(element).data('bs.popover').tip().hasClass('in')) {
                $(element).data('bs.popover').options.content = response;
                $(element).popover('show');
            }
        }
    });
    return `<div class="content">${busyIndicator}</div>`;
}
function prepareLessonPopoverData(element, link, data = null) {
    $.ajax({
        url: link,
        data: data,
        datatype: "html",
        async: true,
        success: function (response) {
            if ($(element).data('bs.popover').tip().hasClass('in')) {
                var elements = $(response);
                var title = $('.custom-title', elements);
                var content = $('.lessonContent', elements);
                $(element).data('bs.popover').options.content = content;
                $(element).data('bs.popover').options.title = title;
                $(element).popover('show');
            }
        }
    });
    return `<div class="content">${busyIndicator}</div>`;
}