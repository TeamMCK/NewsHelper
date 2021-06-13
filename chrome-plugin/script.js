//명령 자체가 popup에서 실행됨. 컨텐트페이지에서 읽지 않음
//크롬 확장의 기능중에 tabs과 관련된 기능 중에 컨텐트 페이지를 대상으로 아래와 같은 코르를 실행한다.

//var bodyText=document.querySelector('body').innerText;
function getParameterByName(queryString, name) {
    // Escape special RegExp characters
    name = name.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
    // Create Regular expression
    var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
    // Attempt to get a match
    var results = regex.exec(queryString);
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || '';
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    console.log(url)

    var naver=url.indexOf('news.naver.com')
    var daum=url.indexOf('news.v.daum.net')

    console.log(naver)
    console.log(daum)

    document.querySelector('#full_text').innerText='로딩중입니다.'
    if(naver!=-1){
      document.querySelector('#which_news').innerHTML='네이버 뉴스';
      var queryString = /^[^#?]*(\?[^#]+|)/.exec(tabs[0].url);
      if(getParameterByName(queryString, 'sid1')!=100){
        if(url.indexOf('https://news.naver.com/main/main.nhn')!=-1){

          document.querySelector('#which_news').innerHTML='뉴스 페이지가 아닙니다.';
          document.querySelector('#main_contents').style.display='none';
        }
        else{
          document.querySelector('#which_news').innerHTML='현재는 정치 기사만 서비스 중 입니다.';
          document.querySelector('#main_contents').style.display='none';
        }
      }
      else{
        chrome.tabs.executeScript({
        code:'document.querySelector(\'.tts_head\').innerText'
      },function(article_title){
      chrome.tabs.executeScript({
        code:'document.querySelector(\'.press_logo\').children[0].children[0].getAttribute(\'alt\')'
      },function(article_publisher){
      chrome.tabs.executeScript({
        code:'document.querySelector(\'.t11\').innerText;'
      },function(article_date){
      chrome.tabs.executeScript({
        code:'document.querySelector(\'._article_body_contents\').innerHTML;'
      },function(result_article_html){
        chrome.tabs.executeScript({
          code:'document.querySelector(\'.tts_head\').innerText; '
        },function(result_title){
          chrome.tabs.executeScript({
            code:'document.querySelector(\'._article_body_contents\').innerText;'
          },function(result_article){
            var article_date_parsed=article_date[0].slice(0,4)+article_date[0].slice(5,7)+article_date[0].slice(8,10)
            fetch("https://okb0u8spwi.execute-api.ap-northeast-2.amazonaws.com/dev/fulltext",{
              method: "POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({article:result_article[0],title:article_title[0],date:article_date_parsed,publisher:article_publisher[0]})
            }).then((response)=>response.json()).then((data)=>{

              var full_text_result='총 '+Object.keys(data).length+'개의 관련 기사가 있습니다. '
              full_text_result=full_text_result+'<br><br>'

              for(var i=0; i<Object.keys(data).length;i++){
                full_text_result=full_text_result+`<div width="230" ><button id="button${i}" style=font-size:17px; >${data[i]['title']}</button></div>`+'<br>'
              }

              //여기서 인제 만들어야함 list로 클릭가능한 것들을 만들고 클릭했을때 관련 기사로 넘어가기 -> 뒤로가기 키는 어떻게 만들징?

              document.querySelector('#full_text').innerHTML=full_text_result

              var number_of_article=Object.keys(data).length
              if(number_of_article>=1){
                document.getElementById('button0').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[0]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[0]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[0]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[0]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[0]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+' \n\n'+data[0]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=2) {
                document.getElementById('button1').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[1]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[1]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[1]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[1]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[1]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[1]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=3) {
                document.getElementById('button2').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[2]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[2]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[2]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[2]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[2]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[2]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=4) {
                document.getElementById('button3').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[3]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[3]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[3]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[3]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[3]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[3]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=5) {
                document.getElementById('button4').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[4]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[4]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[4]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[4]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[4]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[4]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=6) {
                document.getElementById('button5').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[5]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[5]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[5]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[5]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[5]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[5]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=7) {
                document.getElementById('button6').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[6]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[6]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[6]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[6]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[6]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[6]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=8) {
                document.getElementById('button7').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[7]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[7]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[7]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[7]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[7]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[7]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=9) {
                document.getElementById('button8').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[8]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[8]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[8]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[8]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[8]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[8]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }
              if (number_of_article>=10) {
                document.getElementById('button9').addEventListener('click',function(){
                  var full_text_output=''
                  if(Object.keys(data[9]['people']).length>0){
                    full_text_output='발화자는'
                  }
                  for (var num_of_speaker=0;num_of_speaker<Object.keys(data[9]['people']).length;num_of_speaker++){
                    full_text_output=full_text_output+' '+data[9]['people'][num_of_speaker]
                  }
                  if(Object.keys(data[9]['people']).length>0){
                    full_text_output=full_text_output+'입니다. (추정)\n'
                  }
                  for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[9]['paragraph']).length;num_of_paragraph++){
                    full_text_output=full_text_output+'\n\n'+data[9]['paragraph'][num_of_paragraph]['form']
                  }
                  document.querySelector('#full_text').innerText=full_text_output
                })
              }




            fetch('https://okb0u8spwi.execute-api.ap-northeast-2.amazonaws.com/dev/ambiguity',{
              method: "POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({article:result_article[0]})
            }).then((response2)=>response2.json()).then((result_ambiguity)=>{
              console.log(result_ambiguity)
              document.querySelector('#result').innerText=result_ambiguity['body']['percentage'].toFixed(2)+'%';
              var test_arr=[]
              for(var a=0; a<Object.keys(result_ambiguity['body']['sentence']).length;a++){
                test_arr.push(result_ambiguity['body']['sentence'][a]['sentence'].toString().replace(/(\r\n|\r|\n)/g,"").trim())
              }
              console.log(test_arr)


              var edited_article_html=result_article_html[0]
              chrome.storage.sync.get(['likesColor'], function(result) {
                chrome.storage.sync.get(['favoriteColor'], function(result2) {
                  for (var i=0; i<test_arr.length;i++){
                    var text=test_arr[i];
                    var count = 0;
                    var search_char=' ';
                    var pos=text.indexOf(search_char);

                    while(pos!= -1){
                      count++;
                      pos=text.indexOf(search_char,pos+1);
                    }
                    count++;
                    //단어 개수 세기 완료
                    var splited_text=text.split(" ");
                    if(result['likesColor']==false){
                      if(result2['favoriteColor']=='highlight_yellow'){
                        for(var j=0; j<count; j++){
                          if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                            edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"background-color: yellow;\"> "+splited_text.slice(j).join(' ')+" </span>")
                            console.log()
                            break;
                          }
                        }
                      }
                      else if(result2['favoriteColor']=='highlight_gray'){
                        for(var j=0; j<count; j++){
                          if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                            edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"background-color: gray;\"> "+splited_text.slice(j).join(' ')+" </span>")
                            console.log()
                            break;
                          }
                        }
                      }
                      else if(result2['favoriteColor']=='strike_through'){
                        for(var j=0; j<count; j++){
                          if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                            edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"text-decoration:line-through;\"> "+splited_text.slice(j).join(' ')+" </span>")
                            console.log()
                            break;
                          }
                        }
                      }
                      else if(result2['favoriteColor']=='font_gray'){
                        for(var j=0; j<count; j++){
                          if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                            edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"color:gray;\"> "+splited_text.slice(j).join(' ')+" </span>")
                            console.log()
                            break;
                          }
                        }
                      }
                    }

                  }
                  //HTML 실제로 바뀌는 부분 a
                  chrome.tabs.executeScript({
                    code:'document.querySelector(\'._article_body_contents\').innerHTML=\"'+`${edited_article_html.replace(/<!--(.*?)-->/gm, "").replace(/(\r\n|\r|\n)/g,"").replace(/"/g, '\\"').replace(/'/g, '\\')}`+'\"'
                  },function(editted){})
                })
              })


            })
            })

          })
        })
      })
    })
  })
})}


    }
    else if(daum!=-1){
      document.querySelector('#which_news').innerHTML='다음 뉴스';
      var queryString = /^[^#?]*(\?[^#]+|)/.exec(tabs[0].url);
      chrome.tabs.executeScript({
        code:'document.getElementById(\'kakaoBody\').innerText'
      },function(subject){
        if(subject!="정치"){
          document.querySelector('#which_news').innerHTML='현재는 정치 기사만 서비스 중 입니다.';
          document.querySelector('#main_contents').style.display='none';
        }
        else{
          chrome.tabs.executeScript({
            code:'document.querySelector(\'.tit_view\').innerText;'
          },function(article_title){
          chrome.tabs.executeScript({
            code:'document.querySelector(\'.link_cp\').children[0].getAttribute(\'alt\');'
          },function(article_publisher){
          chrome.tabs.executeScript({
            code:'document.querySelector(\'.num_date\').innerText;'
          },function(article_date){
          chrome.tabs.executeScript({
            code:'document.querySelector(\'.news_view\').innerHTML;'
          },function(result_article_html){
            chrome.tabs.executeScript({
              code:'document.querySelector(\'.tit_view\').innerText; '
            },function(result_title){
              chrome.tabs.executeScript({
                code:'document.querySelector(\'.news_view\').innerText;'
              },function(result_article){
                var article_date_parsed=article_date[0].slice(0,4)+article_date[0].slice(6,8)+article_date[0].slice(10,12)
                console.log(article_date_parsed)
                console.log(article_publisher[0])
                console.log(article_title[0])
                fetch("https://okb0u8spwi.execute-api.ap-northeast-2.amazonaws.com/dev/fulltext",{
                  method: "POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({article:result_article[0],title:article_title[0],date:article_date_parsed,publisher:article_publisher[0]})
                }).then((response)=>response.json()).then((data)=>{

                  var full_text_result='총 '+Object.keys(data).length+'개의 관련 기사가 있습니다. '
                  full_text_result=full_text_result+'<br><br>'

                  for(var i=0; i<Object.keys(data).length;i++){
                    full_text_result=full_text_result+`<div width="230" ><button id="button${i}" style=font-size:17px; >${data[i]['title']}</button></div>`+'<br>'
                  }

                  //여기서 인제 만들어야함 list로 클릭가능한 것들을 만들고 클릭했을때 관련 기사로 넘어가기 -> 뒤로가기 키는 어떻게 만들징?

                  document.querySelector('#full_text').innerHTML=full_text_result

                  var number_of_article=Object.keys(data).length
                  if(number_of_article>=1){
                    document.getElementById('button0').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[0]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[0]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[0]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[0]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[0]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+' \n\n'+data[0]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=2) {
                    document.getElementById('button1').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[1]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[1]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[1]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[1]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[1]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[1]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=3) {
                    document.getElementById('button2').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[2]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[2]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[2]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[2]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[2]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[2]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=4) {
                    document.getElementById('button3').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[3]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[3]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[3]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[3]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[3]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[3]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=5) {
                    document.getElementById('button4').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[4]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[4]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[4]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[4]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[4]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[4]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=6) {
                    document.getElementById('button5').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[5]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[5]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[5]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[5]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[5]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[5]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=7) {
                    document.getElementById('button6').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[6]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[6]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[6]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[6]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[6]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[6]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=8) {
                    document.getElementById('button7').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[7]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[7]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[7]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[7]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[7]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[7]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=9) {
                    document.getElementById('button8').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[8]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[8]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[8]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[8]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[8]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[8]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }
                  if (number_of_article>=10) {
                    document.getElementById('button9').addEventListener('click',function(){
                      var full_text_output=''
                      if(Object.keys(data[9]['people']).length>0){
                        full_text_output='발화자는'
                      }
                      for (var num_of_speaker=0;num_of_speaker<Object.keys(data[9]['people']).length;num_of_speaker++){
                        full_text_output=full_text_output+' '+data[9]['people'][num_of_speaker]
                      }
                      if(Object.keys(data[9]['people']).length>0){
                        full_text_output=full_text_output+'입니다. (추정)\n'
                      }
                      for (var num_of_paragraph=0;num_of_paragraph<Object.keys(data[9]['paragraph']).length;num_of_paragraph++){
                        full_text_output=full_text_output+'\n\n'+data[9]['paragraph'][num_of_paragraph]['form']
                      }
                      document.querySelector('#full_text').innerText=full_text_output
                    })
                  }




                fetch('https://okb0u8spwi.execute-api.ap-northeast-2.amazonaws.com/dev/ambiguity',{
                  method: "POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({article:result_article[0]})
                }).then((response2)=>response2.json()).then((result_ambiguity)=>{
                  console.log(result_ambiguity)
                  document.querySelector('#result').innerText=result_ambiguity['body']['percentage'].toFixed(2)+'%';
                  var test_arr=[]
                  for(var a=0; a<Object.keys(result_ambiguity['body']['sentence']).length;a++){
                    test_arr.push(result_ambiguity['body']['sentence'][a]['sentence'].toString().replace(/(\r\n|\r|\n)/g,"").trim())
                  }
                  console.log(test_arr)


                  var edited_article_html=result_article_html[0]
                  chrome.storage.sync.get(['likesColor'], function(result) {
                    chrome.storage.sync.get(['favoriteColor'], function(result2) {
                      for (var i=0; i<test_arr.length;i++){
                        var text=test_arr[i];
                        var count = 0;
                        var search_char=' ';
                        var pos=text.indexOf(search_char);

                        while(pos!= -1){
                          count++;
                          pos=text.indexOf(search_char,pos+1);
                        }
                        count++;
                        //단어 개수 세기 완료
                        var splited_text=text.split(" ");
                        if(result['likesColor']==false){
                          if(result2['favoriteColor']=='highlight_yellow'){
                            for(var j=0; j<count; j++){
                              if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                                edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"background-color: yellow;\"> "+splited_text.slice(j).join(' ')+" </span>")
                                console.log()
                                break;
                              }
                            }
                          }
                          else if(result2['favoriteColor']=='highlight_gray'){
                            for(var j=0; j<count; j++){
                              if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                                edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"background-color: gray;\"> "+splited_text.slice(j).join(' ')+" </span>")
                                console.log()
                                break;
                              }
                            }
                          }
                          else if(result2['favoriteColor']=='strike_through'){
                            for(var j=0; j<count; j++){
                              if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                                edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"text-decoration:line-through;\"> "+splited_text.slice(j).join(' ')+" </span>")
                                console.log()
                                break;
                              }
                            }
                          }
                          else if(result2['favoriteColor']=='font_gray'){
                            for(var j=0; j<count; j++){
                              if(result_article_html[0].indexOf(splited_text.slice(j).join(' '))!=-1){
                                edited_article_html=edited_article_html.replace(splited_text.slice(j).join(' '),"<span title=\""+result_ambiguity['body']['sentence'][i]['reason']+"\" style=\"color:gray;\"> "+splited_text.slice(j).join(' ')+" </span>")
                                console.log()
                                break;
                              }
                            }
                          }
                        }

                      }
                      //HTML 실제로 바뀌는 부분 a
                      chrome.tabs.executeScript({
                        code:'document.querySelector(\'.news_view\').innerHTML=\"'+`${edited_article_html.replace(/<!--(.*?)-->/gm, "").replace(/(\r\n|\r|\n)/g,"").replace(/"/g, '\\"').replace(/'/g, '\\')}`+'\"'
                      },function(editted){})
                    })
                  })


                })
                })

              })
            })
          })
        })
      })
    })
        }

})


    }
    else{
      document.querySelector('#which_news').innerHTML='뉴스 페이지가 아닙니다.';
      document.querySelector('#main_contents').style.display='none';
      console.log('뉴스 페이지가 아닙니다.')
    }
});
