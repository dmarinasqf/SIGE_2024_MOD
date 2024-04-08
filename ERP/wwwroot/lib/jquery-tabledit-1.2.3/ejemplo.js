$('#tbllista').Tabledit({
    url: 'example.php',
    deleteButton: false,
    saveButton: true,
    autoFocus: true,
    buttons: {
        edit: {
            class: 'btn btn-sm btn-warning',
            html: '<span class="fas fa-edit"></span> &nbsp EDIT',
            action: 'edit'
        }, save: {
            class: 'btn btn-sm btn-primary',
            html: '<span class="fas fa-save"></span> &nbsp SAVE',
            action: 'save'
        },
    },
    columns: {
        identifier: [0, 'id'],
        editable: [[6, 'txtnumoperacion'], [12, 'txtobservacion']]
    }
});