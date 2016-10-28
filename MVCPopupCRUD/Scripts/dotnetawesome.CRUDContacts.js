
function LoadContacts() {
    $('#update_panel').html('Loading Data...');

    $.ajax({
        url: '/home/GetContacts',
        type: 'GET',
        dataType: 'json',
        success: function (d) {
            if(d,length > 0){
                var $data = $('<table></table>').addClass('table table-bordered');
                var header = "<thead><tr><th>Contact Person</th><th>Contact No</th><th>Country</th><th>State</th></tr></thead>";
                $data.append(header);

                $.each(d, function (i, row) {
                    var $row = $('<tr/>');
                    $row.append($('<td />').html(row.ContactPerson));
                    $row.append($('<td />').html(row.ContactNo));
                    $row.append($('<td />').html(row.CountryName));
                    $row.append($('<td />').html(row.StateName));
                    $row.append($('<td />').html("<a href='/home/save/'"+row.ContactID+"' class='btn btn'"));
                });
            }
        },
        error: function () {

        }
    });
}