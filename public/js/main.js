$(() => {
    let urlRegEx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
    $("#shorten-url-btn").on("click", () => {
        if(!urlRegEx.test($("#url").val())){
            alert('Enter valid URL');
            return;
        }
        $.ajax({
            url: "/short",
            method: 'POST',
            dataType: "json",
            data: { url: $('#url').val() },
            success: (data) => {
                $("#short-url").fadeIn(function () {
                    $(this).find('a').attr('href', data.shortUrl).text(data.shortUrl);
                })
            }
        })
    })
})