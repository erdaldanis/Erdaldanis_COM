var busyIndicator = "<div class='busy-indicator'><i class='fa fa-cog fa-spin fa-3x fa-fw margin-bottom' style='font-size: 3em!important;line-height:30px!important;'></i></div>"

$(function () {
    initAsyncModal();
});
var initAsyncModal = function () {
    $('[data-toggle="asyncmodal"]').click(function (e) {
        e.preventDefault();
        showDialog(this);
    });
    asyncModalMousedownEvent();
};
var initAsyncModalByParent = function (parent) {
    $('[data-toggle="asyncmodal"]', parent).click(function (e) {
        e.preventDefault();
        showDialog(this);
    });
    asyncModalMousedownEvent();
};

var asyncModalMousedownEvent = function () {
    $('a[data-toggle="asyncmodal"]').mousedown(function (e) {
        if (e.which === 2) {
            e.preventDefault();
            showDialog(this);
        }
    });
};

function showDialog(element) {
    var size = $(element).data("asyncmodal-size");
    var reload = $(element).data("asyncmodal-reload");
    var beforeSend = $(element).data("asyncmodal-indicator");
    if (beforeSend === null) {
        beforeSend = true;
    }
    if (size !== null) {
        $('#asyncmodal-dialog').removeClass().addClass("modal-dialog modal-" + size);
    } else {
        $('#asyncmodal-dialog').removeClass().addClass("modal-dialog modal-md");
    }
    $('#asyncmodal-content').html(busyIndicator);
    $('#asyncmodal-container').modal("show");
    $('#asyncmodal-container').on('hidden.bs.modal', function (event) {
        if (event.target.id === 'asyncmodal-container') {
            $('#asyncmodal-content').empty();
        }
    });
    var url = $(element).attr('href');
    $('#asyncmodal-content').load(url, function (response, status, xhr) {
        var modalBody = $(this);
        if (status === "error") {
            if (xhr.responseText) {
                var json = $.parseJSON(xhr.responseText);
                $("#asyncmodal-content").html("<div class='alert alert-danger' style='margin:5px'>" + json.message + "</div>");
            } else {
                location.reload();
            }
        } else {
            var result;
            if (response.indexOf("<") >= 0) {
                result = response;
            } else {
                result = $.parseJSON(response);
            }
            processResult(result, reload, function () {
                bindForm(modalBody, reload, beforeSend);
            });
        }
    });
    return false;
}

function bindForm(dialog, reload, beforeSend) {
    if (typeof init === 'function') {
        init('#asyncmodal-content');
    }
    if ($.validator) {
        $.validator.unobtrusive.parse('form');
    }
    $('form', dialog).submit(function () {
        $.ajax({
            url: this.action,
            type: this.method,
            data: $(this).serialize(),
            beforeSend: function () {
                if (beforeSend) {
                    $('#asyncmodal-content').html(busyIndicator);
                }
            },
            success: function (result) {
                processResult(result, reload, function () {
                    $('#asyncmodal-content').html(result);
                    bindForm(dialog, reload, beforeSend);
                });
            }
        }).fail(function () {
            document.location = errorPage;
        });
        return false;
    });
}

function processResult(result, reload, errorAction) {
    if (result.success) {
        $('#asyncmodal-content').empty();
        $('#asyncmodal-container').modal('hide');
        if (result.function) {
            executeFunctionByName(result.function, result.args);
        } else if (result.redirectUrl) {
            document.location = result.redirectUrl;
        } else if (reload !== false) {
            location.reload(); //refresh
        }

    } else {
        if (result.message) {
            $("#asyncmodal-content").html("<div class='alert alert-danger' style='margin:5px'>" + result.message + "</div>");
        } else if (result.indexOf("<html") >= 0) {
            $('#asyncmodal-container').modal('hide');
            location.reload();
        } else if (errorAction) {
            errorAction();
        }
    }
}

function executeFunctionByName(functionName) {
    if (typeof functionName === 'undefined') { throw 'function name not specified'; }
    if (typeof eval(functionName) !== 'function') { throw functionName + ' is not a function'; }

    var context = window;
    var args = Array.prototype.slice.call(arguments, 1);

    return context[functionName].apply(context, args);
}