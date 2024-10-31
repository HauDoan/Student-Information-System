// var FormData = require('form-data');
// import { FormData } from './module.js';
let post;
window.addEventListener('load', () => {
    // console.log('Window load')
    $(document).ready(function () {
        var $j = jQuery.noConflict();
        // $j("#datepicker").datepicker();
        $j(".datepicker").datepicker({
            prevText: '<i class="fa fa-fw fa-angle-left"></i>',
            nextText: '<i class="fa fa-fw fa-angle-right"></i>'
        });

        
    });
  

        $('.home-nav-categoryMessage').click(function () {
            $('nav .home-nav-listMessage').toggleClass("show");
            $('.home-nav-categoryMessage').toggleClass("clicked");
            $('.home-nav-sidebarList .first').toggleClass("rotate");
        })

        $('.home-nav-infoMessage').click(function () {
            $('nav .home-nav-info_Message').toggleClass("show");
            $('.home-nav-sidebarList .second').toggleClass("rotate");
            $('.home-nav-infoMessage').toggleClass("clicked");
        })

        $('.donvi').click(function () {
            $('nav .home-nav-listMessage .donviList').toggleClass('show');
            $('.donvi').toggleClass("clicked");
            $('.home-nav-listMessage .first-donvi').toggleClass('rotate');
        })

        $('.khoa').click(function () {
            $('nav .khoaList').toggleClass("show");
            $('nav .third').toggleClass("rotate");
            $('.khoa').toggleClass('clicked');

        })

        $('.phongban').click(function () {
            $('nav .phongban').toggleClass("show");
            $('nav .fourth').toggleClass("rotate");
            $('.phongban').toggleClass('clicked');

        })
        $('.Chude').click(function () {
            $('nav .chudeShow').toggleClass("show");
            $('nav .second-chude').toggleClass("rotate");
            $('.Chude').toggleClass('clicked');

        })
        $('#image_file').change(function() {
            var i = $(this).prev('label').clone();
            var file = $('#image_file')[0].files[0].name;
            $(this).prev('label').text(file);
          });
        $('.home-header-nameProfile').click(function () {
            $('.right_area').toggleClass('show');
            $('.home-header-nameProfile').toggleClass('clicked')
        })

       
    $('.addImage-Post span').click(function ()
    {
        $('.addImage-Post span i').toggleClass('rotate');
        $('.shareBottom').toggleClass('show')
    })
    $(() => {
      
        const $form = $('#formCreate')
        // console.log($form.image)
        $form.on('submit', handleCreatePost)


        function loadPost(e) {

            let timeCreate = e.data.createdAt;
            // let timeCreate ='';
            const id =e.data._id
            let desc=e.data.description;
            let avatar=e.data.user.avatar;
            let name=e.data.user.name
            let image='';
            let video='';
            let content='';
            if (e.data.thumbnail!=='')
            {
                 image=`<div class="image-Post">

        

                <img src="`+e.data.thumbnail+`" alt="">

        
                </div>`;
                content = image;
                
            }
            else if(e.data.video!='')
           {
            video=`<div class="image-Post">

        

            <iframe width="775.18" height="400" src="https://www.youtube.com/embed/`+e.data.video+`"> title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


    
            </div>`;
            content = video;
           }
             post = `<div class="home-newFeed-container `+id+`" >
            <div class="home-newFeed">
                
                <div class="home-status">

                    <div class="home-nav-headerPost">

                                <div class="postTopLeft">
                                    <img class="img_userPost" src="`+avatar+`" alt="">

                                        <span class="name_userPost">`+name+`</span>

                                        <span class="postDate">`+ timeCreate + `</span>

                                   <span class="postSetting" data-id="`+id+`"><i class="fas fa-ellipsis-h"></i></span>
                                </div>

                                <div class="textSetting" id="`+id+`">
                                    
                                        <ul>
                                            <a href="#">
                                                <li><i class="fa fa-user" aria-hidden="true"></i>Lưu bài viết</li>
                                            </a>
                                            <a href="#">
                                                <li><i class="fa fa-users" aria-hidden="true"></i>Chỉnh sửa bài viết</li>
                                            </a>
                                            <a  class="deletePost" href="#" data-id="`+id+`">

                                                <li><i class="fa fa-inbox" aria-hidden="true"></i>Xóa bài viết</li>

                                            </a>
                                          
                                       </ul>

                
                                   
                                </div>
                    </div>

                    <div class="home-nav-contentPost">
                        
                        <div class="postText">
                            `+ desc + `
                        </div>
                        `+content
                        +`

                    </div>

                    <hr class="shareHr">




                    <div class="home-nav-userComment">

                        <a href="">
                            <span class="home-comment-post">
                                <img src="`+avatar+`" alt="">
                            </span>
                        </a>

                        <input type="text" class="content-userComment" size='60'
                            placeholder="What's on your mind, Nguyen?">
                    </div>

                </div>

            </div>
        </div>
        `;
      

            $('#description').val('')
            $('#image_file').val('')
            $('#labelImage').text("Thêm ảnh vào bài viết")
            $('.video').val('Thêm Link')
            $('.center').toggleClass('show');
            $('.changeNotify').toggleClass('show')
            const myTimeout = setTimeout(notifyCreatePost,2000);


        }
        $(document).on("click",".postSetting",function() {

            var idPost = $(this).data('id');
            $('.textSetting#'+idPost).toggleClass('show');

        })
        function handleCreatePost(e) {

            e.preventDefault()

            
            let file = document.getElementById("image_file").files[0];
            var description=document.forms['formCreate'].elements['description'].value
            var video=document.forms['formCreate'].elements['video'].value

            var form = new FormData();
            form.set('image',file)
            form.set('description',description)
            form.set('video',getId(video))
            let xhr=new XMLHttpRequest();
            xhr.open('POST','http://localhost:9090/api/posts',true)
            xhr.addEventListener('load',e=>
            {
                const json=JSON.parse(xhr.responseText)
                const id =json.data._id
                console.log(json.data._id)
                loadPost(json);
                var form1 = new FormData();

                let xhr1=new XMLHttpRequest();
                xhr1.open('POST','http://localhost:9090/api/posts/update/'+id,true)
                xhr1.addEventListener('load',e=>{
                    console.log(xhr.responseText)

                })
                xhr1.send(form1)
            })
            xhr.send(form)

        }

        function handleDeletePost(idPost)
        {
            const options={
                method: "DELETE",
                url: "/api/posts/"+idPost,
                // data: idUserPost,
            }
            $.ajax(options).done(response => {
                // loadPost(response);
                // console.log(response.post);
            })
        }

        $(document).on("click",'.deletePost',function(e)
        {
            e.preventDefault();
            var idPost = $(this).data('id');
            var idUserPost=$(this).data('user')
            $('.home-newFeed-container.'+idPost).remove();
            handleDeletePost(idPost,idUserPost)
        })
    })


}
)

function countChar(val) {
    val.style.height = "10px";
    val.style.height = (25 + val.scrollHeight) + "px";
};
// function showSettingPost($this)
// {
//     $(this).toggleClass('show');

// }
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login/google');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        console.log('Signed in as: ' + xhr.responseText);
        if (xhr.responseText==='success')
        {
            signOut();
            // console.log(xhr.user)
            location.assign('//index')
        }
        if (xhr.responseText==='Fail') 
        {
            signOut();
            location.assign('/login/?err=1')

        }
    };
    xhr.send(JSON.stringify({token: id_token}));
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
function notifyCreatePost()
{
    const setTime = setTimeout(notifySuccess,2000);
    $('.center').toggleClass('show');
    $('.timeline').prepend(post)
    $('#demo').toggleClass('show');
    if ($('div').hasClass('shareBottom show'))
    {
        $('.shareBottom').toggleClass('show')
    }
    $('.changeNotify').toggleClass('show')
    
}   
function notifySuccess()
{
    $('#demo').toggleClass('show');
}
function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
   