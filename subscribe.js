$(document).ready(function () {
    $("#subscribe-button").click(function (e) {
        e.preventDefault(); // Prevent the default form submission

        var email = $("#emailsubscribe").val();

        $.ajax({
            type: "POST",
            url: "/subscribe/",
            data: {
                'email': email,
                'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
            },
            dataType: "json",
            success: function (data) {
                if (data.status === 'success') {
                    $("#response-message").html(data.message);
                } else if (data.status === 'info') {
                    $("#response-message").html(data.message);
                } else {
                    $("#response-message").html(data.message);
                }
                setTimeout(function () {
                    $("#response-message").fadeOut("slow");
                }, 5000);
            },
            error: function () {
                alert('An error occurred while processing your request.');
            }
        });
    });
});