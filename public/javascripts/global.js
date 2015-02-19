// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    //populateTable();

   $('#btnCarSearch').on('click', doCarSearch);


});

// Functions =============================================================

// Fill table with data
function populateTable(data) {

    // Empty content string
    var tableContent = '';

    $('#carResults table tbody tr').remove()
     var row = 0;
        $.each(data.results, function(index, solution){
            $.each(solution.pgoods, function(index, pgood) {
                    
                var tableContent = ""

                row++;
                var isOpaque = 'Y';
                if(pgood.isOpaque == false) {
                    isOpaque = 'N';
                }
                tableContent += '<tr class="item-' + row%2 + '">';
                tableContent += '<td>' + pgood.carType + '</td>';
                tableContent += '<td>' + pgood.isOpaque + '</td>';
                tableContent += '<td>' + pgood.price + '</td>';
                tableContent += '<td>' + pgood.depositType +'</td>';
                tableContent += '<td>' + pgood.carVendor +'</td>';
                tableContent += '<td>' + pgood.markupAllowed +'</td>'
                tableContent += '</tr>';
                $('#carResults table').last().append(tableContent);
            })
            $('#carResults table').last().append('<tr class="divider"><td> </td></tr>');
        })
};



function doCarSearch(event) {
    event.preventDefault();
    var ckb = $("#winnerselection").is(':checked');

    // If it is, compile all user info into one object
    var carSearchParams = {
        'destination': 'Houston,TX',
        'checkin': '3/1/2015',
        'checkout': '3/2/2015',
        'winnerselection' : ckb
    }

    var start = new Date().getTime();

    $.ajax({
        url : 'http://localhost:3001/car/results',
        type: "POST",
        data : carSearchParams,
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            var executionTime = new Date().getTime() - start;
            populateTable(data);
            $('#carResultsTime').text('Execution time (ms) = ' + data.executionTime);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
     
        }
    });
    
}




