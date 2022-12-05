$(function () {
    var countries = [ "af", "ax", "al", "dz", "as", "ad", "ao", "ai", "aq", "ag", "ar", "am", "aw", "au", "at", "az", "bs", "bh", "bd", "bb", "by", "be", "bz", "bj", "bm", "bt", "bo", "bq", "ba", "bw", "bv", "br", "io", "bn", "bg", "bf", "bi", "cv", "kh", "cm", "ca", "ky", "cf", "td", "cl", "cn", "cx", "cc", "co", "km", "cd", "cg", "ck", "cr", "ci", "hr", "cu", "cw", "cy", "cz", "dk", "dj", "dm", "do", "ec", "eg", "sv", "gq", "er", "ee", "sz", "et", "fk", "fo", "fj", "fi", "fr", "gf", "pf", "tf", "ga", "gm", "ge", "de", "gh", "gi", "gr", "gl", "gd", "gp", "gu", "gt", "gg", "gn", "gw", "gy", "ht", "hm", "va", "hn", "hk", "hu", "is", "in", "id", "ir", "iq", "ie", "im", "il", "it", "jm", "jp", "je", "jo", "kz", "ke", "ki", "kp", "kr", "kw", "kg", "la", "lv", "lb", "ls", "lr", "ly", "li", "lt", "lu", "mo", "mk", "mg", "mw", "my", "mv", "ml", "mt", "mh", "mq", "mr", "mu", "yt", "mx", "fm", "md", "mc", "mn", "me", "ms", "ma", "mz", "mm", "na", "nr", "np", "nl", "nc", "nz", "ni", "ne", "ng", "nu", "nf", "mp", "no", "om", "pk", "pw", "ps", "pa", "pg", "py", "pe", "ph", "pn", "pl", "pt", "pr", "qa", "re", "ro", "ru", "rw", "bl", "sh", "kn", "lc", "mf", "pm", "vc", "ws", "sm", "st", "sa", "sn", "rs", "sc", "sl", "sg", "sx", "sk", "si", "sb", "so", "za", "gs", "ss", "es", "lk", "sd", "sr", "sj", "se", "ch", "sy", "tw", "tj", "tz", "th", "tl", "tg", "tk", "to", "tt", "tn", "tr", "tm", "tc", "tv", "ug", "ua", "ae", "gb", "um", "us", "uy", "uz", "vu", "ve", "vn", "vg", "vi", "wf", "eh", "ye", "zm", "zw" ]
    var randomCountry = countries[Math.floor(Math.random() * countries.length)];
    var correctCountryG = "";
    var score = 0;
    var jsonData = {"email": getCookie('email'),"hit":0,"miss":0,"attempts":0};

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function apiCall(resource, method, body) {
        $.ajax('http://18.209.223.63:8090' + resource, {
            contentType: 'application/json',
            type: method,
            data: body,
            success: function (dados, textStatus, xhr) {
                console.log(xhr.status);

                //return xhr.status
                //if (xhr.status === '200') {
                //}
                //console.log(dados);
                //return -1;
            },
            complete: function () {
                //$('.loading').remove();
            }
        })
    }
    function obterDados() {
        function mostrarFlag(dados) {
            //console.log(dados);
            $("#flag").attr("src", dados);
        }
        function mostrarDados(dados, btnIndex, correctCountry, countryId) {
            var btnId = "#btn" + btnIndex
            $.each(dados, function (i, el) {
                //console.log(el.translations.por.common);
                //console.log(btnIndex);
                //console.log(btnId);
                if (correctCountry) {
                    //console.log("Correct country:" + correctCountry)
                    correctCountryG = correctCountry;
                }
                $(btnId).html(el.translations.por.common);
                $(btnId).attr('alt', countryId);
                //console.log($(btnId).attr('alt'));
            })
        }
        function getCountryInfo(randomCountry, btnIndex, correctCountry) {
            $.ajax('https://restcountries.com/v3.1/alpha/' + randomCountry, {
                type: 'GET',
                beforeSend: function () {
                    $('.table').after('<p class="loading"> carregando ... </p>')
                },
                error: function () {
                    $('.table').after('<p class="loading"> deu ruim </p>')
                },
                success: function (dados) {
                    mostrarDados(dados, btnIndex, correctCountry, randomCountry);
                },
                complete: function () {
                    $('.loading').remove();
                }
            })
        }
        var numRandoms = 5;
        var uniqueRandoms = [];
        //var fflag = "https://countryflagsapi.com/svg/" + randomCountry
        var fflag = "https://flagcdn.com/" + randomCountry + ".svg"
        for (let i = 1; i <= 4; i++) {
            if (!uniqueRandoms.length) {
                for (var j = 1; j < numRandoms; j++) {
                    uniqueRandoms.push(j);
                }
            }
            var index = Math.floor(Math.random() * uniqueRandoms.length);
            var val = uniqueRandoms[index];

            uniqueRandoms.splice(index, 1);
            if (i == 1) {
                mostrarFlag(fflag)
                getCountryInfo(randomCountry, val, randomCountry)
            } else {
                getCountryInfo(randomCountry, val)
            }
            randomCountry = countries[Math.floor(Math.random() * countries.length)];
        }
    }
    $(document).ready(function () {
        $("#btn1, #btn2, #btn3, #btn4").click(function () {
            scorePoint($(this).attr('id'));
        });
        console.log(getCookie('email'));

        function setProgress(value) {
            score += value;
            $("#progress-bar").css("width", score + '%');
            if (score <= 0) {
                //console.log("progress width < 0");
                score = 0;
                $("#progress-bar").css("width", score);
            }
            if (score == 100) {
                $('#myModal').modal('show');
                //console.log("!!!!!!!"+ JSON.stringify(jsonData));
                apiCall('/scores', 'POST', JSON.stringify(jsonData))
                $('#btnYes').click(function() {
                    location.reload();
                });
                $('#btnNo').click(function() {
                    window.location.href = "reports.html";
                });
            }
            obterDados();
        }
        function scorePoint(btn) {
            if (correctCountryG == $('#' + btn).attr('alt')) {
                //console.log($('#' + btn).attr('alt'));
                jsonData['hit'] += 1;
                jsonData['attempts'] += 1;
                setProgress(+10);
            } else {
                jsonData['miss'] += 1;
                jsonData['attempts'] += 1;
                setProgress(-10);
            }
        }
    });
    obterDados();
});