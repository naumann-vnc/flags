$(function () {
    var countries = ["ZWE", "ZMB", "YEM", "ESH", "WLF", "VIR", "VNM", "VEN", "VAT", "VUT", "UZB", "USA", "URY", "UKR", "GBR", "UGA", "ARE", "TUV", "TCA", "TKM", "TUR", "TUN", "TTO", "TON", "TKL", "TGO", "THA", "TZA", "TJK", "TWN", "SYR", "CHE", "SWE", "SWZ", "SJM", "SUR", "SDN", "VCT", "SPM", "MAF", "LCA", "KNA", "SHN", "LKA", "ESP", "SSD", "KOR", "ZAF", "SOM", "SLB", "SVN", "SVK", "SXM", "SGP", "SLE", "SYC", "SRB", "SEN", "SAU", "STP", "SMR", "WSM", "BLM", "RWA", "RUS", "ROU", "REU", "QAT", "PRI", "PRT", "POL", "PCN", "PHL", "PER", "PRY", "PNG", "PAN", "PSE", "PLW", "PAK", "OMN", "NOR", "PRK", "MNP", "NIU", "NGA", "NER", "NIC", "NZL", "NCL", "NLD", "NPL", "NRU", "NAM", "MOZ", "MAR", "MSR", "MNE", "MNG", "MCO", "MDA", "FSM", "MEX", "MYT", "MUS", "MRT", "MHL", "MLT", "MLI", "MDV", "MYS", "MWI", "MDG", "MKD", "MAC", "LUX", "LTU", "LIE", "LBY", "LBR", "LSO", "LBN", "LVA", "LAO", "KGZ", "KWT", "KIR", "KEN", "KAZ", "JOR", "JEY", "JPN", "JAM", "CIV", "ITA", "ISR", "IMN", "IRL", "IRQ", "IRN", "IDN", "IND", "ISL", "HUN", "HKG", "HND", "HTI", "GUY", "GNB", "GIN", "GGY", "GTM", "GUM", "GRD", "GRL", "GRC", "GIB", "GHA", "DEU", "GEO", "GMB", "GAB", "PYF", "FRA", "FIN", "FJI", "FRO", "FLK", "ETH", "EST", "ERI", "GNQ", "SLV", "EGY", "ECU", "TLS", "DOM", "DMA", "DJI", "DNK", "CZE", "CYP", "CUW", "CUB", "HRV", "CRI", "COK", "COD", "COG", "COM", "COL", "CCK", "CXR", "CHN", "CHL", "TCD", "CAF", "CYM", "CPV", "CAN", "CMR", "KHM", "BDI", "MMR", "BFA", "BGR", "BRN", "VGB", "IOT", "BRA", "BWA", "BIH", "BOL", "BTN", "BMU", "BEN", "BLZ", "BEL", "BLR", "BRB", "BGD", "BHR", "BHS", "AZE", "AUT", "AUS", "ABW", "ARM", "ARG", "ATG", "ATA", "AIA", "AGO", "AND", "ASM", "DZA", "ALB", "AFG"]
    var randomCountry = countries[Math.floor(Math.random() * countries.length)];
    var correctCountryG = "";
    var score = 0;

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
        var fflag = "https://countryflagsapi.com/svg/" + randomCountry
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
                $('#btnYes').click(function() {
                    location.reload();
                });
            }
            obterDados();
        }
        function scorePoint(btn) {
            if (correctCountryG == $('#' + btn).attr('alt')) {
                //console.log($('#' + btn).attr('alt'));
                setProgress(+10);
            } else {
                setProgress(-10);
            }
            //console.log(score);
        }
    });
    obterDados();
});