var request;

$("#foo").submit(function(event){
    if (request) {
        request.abort();
    }
    var $form = $(this);

    var $inputs = $form.find("input, select, button, textarea");

    var serializedData = $form.serialize();

    $inputs.prop("disabled", true);

    request = $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxubE9wDC4o422GK_8FutvdX1ReZMhw_Pf3tZbJ317LBcSPLZhu/exec",
        type: "post",
        data: serializedData
    });

    request.done(function (response, textStatus, jqXHR){
        console.log('Completed with response:',response);
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error("The following error occurred: ", textStatus, errorThrown);
    });

    request.always(function () {
        $inputs.prop("disabled", false);
    });
    
    event.preventDefault();
});
