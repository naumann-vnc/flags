$(function () {

    function apiCall(resource, method, body) {
        return Promise.resolve($.ajax('http://127.0.0.1:5000' + resource, {
            contentType: 'application/json',
            type: method,
            data: body,
            beforeSend: function () {
                //$('.table').after('<p class="loading"> carregando ... </p>')
            },
            error: function () {
                //$('.table').after('<p class="loading"> deu ruim </p>')
            },
            success: function (dados, textStatus, xhr) {
                //console.log(xhr.status);
                if (xhr.status === '200') {
                    //return dados;
                }
                //console.log(dados);
                //return -1;
            },
            complete: function () {
                //$('.loading').remove();
            }
        }))
    }

    //}
    async function logar(login_info) {
        let data = await apiCall("/login", "POST", login_info);
        try {
            console.log('Data:', data);
            test_string = String(data)
        } catch (error) {
            console.log('Error:', error);
        }
        const regex = /{access_token:(.*)'}/g;
        const found = String(data).match(regex);
        if (test_string.match(regex)) {
            
            console.log('found!!!:',found);
        }
        console.log(found);

    }
    $(document).ready(function () {

        $("#btn_login").click(function () {
            //console.log("teste");
            var $items = $('#login, #password')
            var obj = {}
            $items.each(function () {
                obj[this.id] = $(this).val();
            })

            var json = JSON.stringify(obj);
            console.log(json);
            logar(json);
            //scorePoint($(this).attr('id'));
        });

    });
    //execution();
});