(function() {
  "use strict";
  var clicked = null;
  $(function() {
      document.addEventListener('contextmenu', (ev) => {
        console.log("context menu");
        if(ev.button == 2 && ev.shiftKey && ev.ctrlKey) {
	  $(".kaomanage-keyword").remove()
          ev.preventDefault(); ev.stopPropagation();
          $("*").removeClass("kaomanaged");
          $(ev.target).addClass('kaomanaged');
          //console.log("class kaomanaged added to",ev.target)
          chrome.storage.sync.get("user", (storage) => {
		let keywords = storage.user.keywords.map( (keyword) => {
			let kwd = $("<div class='kaomanage-keyword' data-keyword='"+keyword+"'>"+keyword+"</div>");
			kwd.css({
				borderBottom: '1px outset gray',
				marginLeft: '1em',
				marginRight: '0.5em'
			});	
			kwd.mousedown((ev) => {				
				insertKaomoji(keyword);
				$(".kaomanaged").removeClass("kaomanaged");
				$(".kaomanage-context").fadeOut(300, () => {
					$(".kaomanage-context").remove();
				});				
			});
			return kwd;
		})
		let container = $("<div class='kaomanage-context'></div>");
		_.each(keywords, (keyword) => $(container).append(keyword));
		$(container).css({
			display: 'none', 
			position: 'absolute',
			display: 'grid',
			backgroundColor: '#fafafa',
			borderStyle: '1px solid gray', 
			left: ev.clientX, 
			top: ev.clientY, 
			zIndex: 9001
			})
		console.log("container",container,"keywords",keywords);
		$("body").append(container);
		$(container).fadeIn(300);
	  })
         return false;
        }
      })
      document.addEventListener("mousedown", (ev) => {
        console.log("mousedowner");
        if(ev.button == 2) {
          //$("*").removeClass("kaomanaged");
          //$(ev.target).addClass('kaomanaged');
          //console.log("class kaomanaged added to",ev.target)
          return false;
        }
         
      });
      //do shit
      function insertKaomoji(keyword) {
        let target = $(".kaomanaged");
        chrome.storage.sync.get("user", (storage) => {
          let mojis = _.filter(storage.user.kaomoji, {keyword: keyword});
          console.log("mojis",mojis);
          let moji = _.sample(mojis).moji;
          console.log("moji",moji);
          console.log("target",target);
	  let text = !$(target).is("input,textarea");
	  let tmp = "";
	  if(text) {
		console.log("text element");
		tmp = $(target).html();
		console.log("tmp", tmp);
		$(target).html(tmp+" "+moji);	  
	  } else {
		console.log("input element");
		tmp = $(target).val();
		console.log("tmp", tmp);
		$(target).val(tmp+" "+moji);
	  }
        })
      }
    });
})();
