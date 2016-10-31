$(document).ready(function () {
    LoadContacts();
});

function LoadContacts() {
    $('#update_panel').html('<img src="/Content/loader.gif" />&nbsp; Loading Data...');

    $.ajax({
        url: '/home/GetContacts',
        type: 'GET',
        dataType: 'json',
        success: function (d) {
            if (d, length > 0) {
                var $data = $('<table></table>').addClass('table table-bordered');
                var header = "<thead><tr><th>Contact Person</th><th>Contact No</th><th>Country</th><th>State</th></tr></thead>";
                $data.append(header);

                $.each(d, function (i, row) {
                    var $row = $('<tr/>');
                    $row.append($('<td />').html(row.ContactPerson));
                    $row.append($('<td />').html(row.ContactNo));
                    $row.append($('<td />').html(row.CountryName));
                    $row.append($('<td />').html(row.StateName));
                    $row.append($('<td />').html("<a href='/home/save/" + row.ContactID + "' class='btn btn-warning' data-toggle='modal' data-target='.popup' >Edit</a>&nbsp;|&nbsp;<a href='/home/Delete/" + row.ContactID + "' class='btn btn-danger' data-toggle='modal' data-target='.popup'>Delete</a>"));
                    $data.append($row);
                });

                $('#update_panel').html($data);
            } else {
                var $noData = $('<div/>').html('No Data Found!');
                $('#update_panel').html($noData);
            }
        },
        error: function () {
            alert('Error! Please try again.');
        }
    });
}