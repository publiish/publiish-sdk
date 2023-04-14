(function($) {
	
	fetch('/api/auth/brands', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        
      })
        .then((response) => response.json())
        .then((data) => {
          

		  if (data.status === 200) {
            var html="";
			
		  		
				  data.brands.forEach(function(dataa, index) {
					var wp="";
					if(dataa.write_permission){
						wp+='<a data-id="'+dataa.id+'" data-coloumn="write_permission" data-action=false title="click here to Decline Permission." href="javascript:void(0);" class="btn btn-success action_button">Yes</a>';
					}else{
						wp+='<a data-id="'+dataa.id+'" data-coloumn="write_permission" data-action="true" title="click here to Assign Permission." href="javascript:void(0);" class="btn btn-danger action_button">No</a>';
					}
					var dp="";
					if(dataa.delete_permission){
						dp+='<a data-id="'+dataa.id+'" data-coloumn="delete_permission" data-action="false" title="click here to Decline Permission." href="javascript:void(0);" class="btn btn-success action_button">Yes</a>';
					}else{
						dp+='<a data-id="'+dataa.id+'" data-coloumn="delete_permission" data-action="true" title="click here to Assign Permission." href="javascript:void(0);" class="btn btn-danger action_button">No</a>';
					}
					html+='<tr id="roww'+dataa.id+'"><th scope="row">'+dataa.id+'</th><td>'+dataa.brand_name+'</td><td>'+dataa.email+'</td><td>'+wp+'</td><td>'+dp+'</td></tr>';
				  });
				$('#maintable').html(html);
          } else {
            alert('Something went wrong! ' + data.summary);
          }
        })
        .catch((err) => {
          alert('Something went wrong, ' + err.message);
        });
		$(document).on("click", ".action_button", function(){
		

			var id=parseInt($(this).attr('data-id'));
			var coloumn=$(this).attr('data-coloumn');
			var action=$(this).attr('data-action');
			var isTrueSet = (action === 'true');


			fetch('/api/auth/change_permission', {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, coloumn, action:isTrueSet }),
			  })
				.then((response) => response.json())
				.then((data) => {
				  if (data.status === 200 && data.success==="Y") {
					alert(data.Message);
					location.reload();
					
					//location.reload("#roww"+id);

				  } else {
					alert(data.Message);
				  }
				})
				.catch((err) => {
				  alert('Something went wrong, ' + err.message);
				});

			
		});

})(jQuery);

