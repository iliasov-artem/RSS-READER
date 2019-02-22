export default (title, description, id) => (`
  <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal-${id}">More</button>
  <div class="modal fade" id=myModal-${id}>
  <div class="modal-dialog">
    <div class="modal-content">
    
      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">${title}</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      
      <!-- Modal body -->
      <div class="modal-body">${description}</div>
      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
      </div>
      
    </div>
  </div>
</div>
`);
