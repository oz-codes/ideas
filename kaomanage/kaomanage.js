(function() {
  "use strict";
  var clicked = null;
  $(function() {
      //do shit
      chrome.runtime.onInstalled.addListener(function() {
          user = { keywords: [], kaomoji: [] };
          chrome.storage.sync.set({user: user}, () => {
            console.log("user object set");
            console.dir(user);
        });
      });
          chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
             chrome.declarativeContent.onPageChanged.addRules([{
               conditions: [new chrome.declarativeContent.PageStateMatcher({
                 pageUrl: {schemes: ['http', 'https']},
                           })
               ],
               actions: [new chrome.declarativeContent.ShowPageAction()]
             }]);
       });
      $('#add-keyword-form').submit((e) => {
        e.preventDefault();
        e.stopPropagation();
        let keyword = $("#add-keyword-form-keyword-input").val();
        addKeyword(keyword)
        $("#add-keyword-form-keyword-input").val("");
        return false;
      });
      $('#add-kaomoji-form').submit((e) => {
          let keyword = $("select option:selected").val();
          let moji = $("#add-kaomoji-body-form-kaomoji").val();
          addKaomoji(moji,keyword);
          $("#add-kaomoji-body-form-kaomoji").val("");
          return false;

      })
    function addKeyword(keyword) {
        chrome.storage.sync.get("user", (storage) => {
          storage.user.keywords.push(keyword);
          chrome.storage.sync.set(storage, () => {
            console.log("keyword added",keyword);
            domKeyword(keyword);
          });
        });
    }
    function domKeyword(keyword) {
        console.log("DOM DA KEY WORED");
        let kwd = $("<div class='entry keyword' id='kaomoji-list-body-keyword-"+keyword+"'>"+keyword+"</div>");
        let kmj = $("<div class='entry kaomoji' id='kaomoji-list-body-kaomoji-"+keyword+"'></div>");
        let row = $("<div class='row' id='kaomoji-list-body-row-"+keyword+"'></div>");
        let opt = $("<option value='"+keyword+"'>"+keyword+"</option>");

        $(row).append(kwd).append(kmj);
        $("#kaomoji-list-body").append(row);
        $("select.list").append(opt);
  }

    function addKaomoji(moji,keyword) {
        chrome.storage.sync.get("user", (storage) => {
          storage.user.kaomoji.push({moji: moji, keyword: keyword});
          chrome.storage.sync.set(storage, () => {
            console.log("kaomoji added",moji);
            domKaomoji(moji,keyword);
          });
        });
      }

      function domKaomoji(moji,keyword) {
          let kao = $("<div class='kaomoji-instance'>"+moji+"</div>");
          $(kao).mousedown((ev) => {
		console.log('kaomoji mousedown');
		if(ev.button == 0 && ev.ctrlKey && ev.shiftKey) {
			ev.preventDefault();
			ev.stopPropagation();
			console.log('rm kaomoji', moji);
			chrome.storage.sync.get("user", (storage) => {
				console.log('moji', moji, 'keyword', keyword);
				storage.user.kaomoji = storage.user.kaomoji.filter((e) => {
					if(e.moji == moji && e.keyword == keyword) {
						return false;
					} else {
						return true;
					}
				});
				console.log('new kaomoji', storage.user.kaomoji);
				chrome.storage.sync.set(storage, () => console.log("moji removed", moji, storage.user.kaomoji));
				$(kao).fadeOut(300, () => $(kao).remove());
			});
			return false;
		}
          });
          $("#kaomoji-list-body-kaomoji-"+keyword).append(kao);
      }

      chrome.storage.sync.get("user",(storage) => {
	  console.log("STORAGED! ",storage);
	  if(storage.user.kaomoji === undefined && storage.user.keywords === undefined) {
	          let user = { keywords: [], kaomoji: [] };
	          chrome.storage.sync.set({user: user}, () => {
	            console.log("user object set");
	            storage = user;
	            console.dir(user);
	          });
	  }
          /*chrome.contextMenus.create({
            title: "kaomanage",
            contexts: ["editable"],
            id: "kaomanage",
          });*/
          storage.user.keywords.forEach((e) => {
              domKeyword(e);
              /*chrome.contextMenus.create({
                title: e,
                contexts: ["editable"],
                id: "kaomanage-"+e,
                parentId: "kaomanage",
              })*/
              console.log(e);

          })
        /*chrome.contextMenus.onClicked.addListener((info, tab) => {
          console.log("info",info,"tab",tab);
          if(info.menuItemId == "kaomanage") {
            return false;
          } else {
            let target = info.menuItemId;
            console.log(target);
            let components = target.split(/-/);
            console.log(components);
            let keyword = components.pop();
            console.log(keyword);
	    insertKaomoji(keyword,tab);
          }


        })*/
          storage.user.kaomoji.forEach((e) => {
              domKaomoji(e.moji,e.keyword)
          })
      })
    function insertKaomoji(keyword,tab) {
      target = $(".kaomanage");
      chrome.storage.sync.get("user", (storage) => {
        let mojis = _.filter(storage.user.kaomoji, {keyword: keyword});
        console.log("mojis",mojis);
        let moji = _.sample(mojis).moji;
        console.log("moji",moji);
        console.log("target",target);
        let tmp = $(target).val();
        console.log('tmp',tmp);
        $(target).val(tmp+moji);
      })
    }
  });
})();
