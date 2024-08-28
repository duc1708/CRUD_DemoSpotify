var apiSongs = "http://localhost:3000/songs"

function start(){
    getSongs(renderSong)
    handleCreateSongs()
    handleNavigate()
}

start()

// Tạo function lấy dữ liệu từ API bằng fetch
// Cách 1 tạo hàm ngay trong then không sử dụng callBack
function getSongs(){
    fetch(apiSongs)
        .then(function(respone){
            return respone.json()
        })
        .then(function(songs){
            var rowDiv = document.querySelector(".row")
            var htmls = songs.map(function(song){
                return `
                    <div class="col-sm-3">
                        <div class="image-container">
                            <img src="${song.img}" alt="">
                        </div>
                        
                        <p>${song.name}<p>
                        <i>Giá bán: ${song.price}<i>
                        <audio controls>
                            <source src="${song.audio}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `
            })

            rowDiv.innerHTML = htmls.join('')
        })
}

// Cách 2 sử dụng callback thay vì dùng function trong promise
function getSongs(callback){
    fetch(apiSongs)
        .then(function(respone){
            return respone.json()
        })
        .then(callback)
}

// Tạo function renderData làm hàm callBack , để ra giao diện html
function renderSong(songs){
    var rowDiv = document.querySelector(".row")
    var htmls = songs.map(function(song){
        return `
            <div class="col-sm-3" >
                <div class="image-container">
                    <img onclick ="inforSong(${song.id})" src="${song.img}" alt="">
                </div>
                <h5 style="font-size:16px">${song.name}</h5>
                <i>${song.singer}</i><br/>
                <audio style="display:none" class="audio-element" src="${song.audioSong}"></audio>
                <div class="custom-audio-player">
                    <button class="play-pause">Play</button>
                    <input type="range" class="seek-bar" value="0">
                    <span class="current-time">0:00</span> / <span class="duration">${song.time}</span>
                </div>
                <button class="delete-song" onclick="deleteSong(${song.id})">Xóa bài hát</button>
            </div>
            
        `     
    })
    rowDiv.innerHTML = htmls.join('')
    addPlayPauseEvent(); // Thêm sự kiện vào các nút Play/Pause
    
}





// Tạo phương thức sử dụng fetch để post dữ liệu
function postSongs(data,callback){
    var options ={
        method: "POST",
        body: JSON.stringify(data)
    }
    fetch(apiSongs,options)
        .then(function(respone){
            return respone.json()
        })
        .then(callback)
}

// Tạo phương thức sử dụng fetch để xóa dữ liệu
function deleteSong(id){
    console.log(id)
    var options = {
        method : "DELETE"
    }
    fetch(apiSongs + "/" + id,options)
        .then(function(respone){
            return respone.json()
        })
        .then(function(){
            getSongs(renderSong)
        })
}

// Tạo function xử lý cái form
function handleCreateSongs(){
    var btnCreate = document.querySelector("#create")
    btnCreate.onclick = function(){
        
        var idSong =document.querySelector('input[name="id"]').value
        var nameSong =document.querySelector('input[name="name"]').value
        var imgSong =document.querySelector('input[name="img"]').value
        var singer =document.querySelector('input[name="singer"]').value
        var audioSong =document.querySelector('input[name="audio"]').value
        var timeSong =document.querySelector('input[name="time"]').value
        alert(idSong)
        var formData = {
            id:idSong,
            name:nameSong,
            img:imgSong,
            audioSong:audioSong,
            singer:singer,
            time:timeSong
        }
        postSongs(formData, function(){
            getSongs(renderSong)
        })
    }
}

// Show all music

function handleNavigate(){
    var showMusics = document.querySelector('#musics')
    var addSongs = document.querySelector('#addSongs')
    var aboutDiv = document.querySelector('.about')
    var formDiv = document.querySelector('.form')
    addSongs.onclick = function(){
        showMusics.style.opacity = "0.5"
        addSongs.style.opacity = "1"
        aboutDiv.style.display = "none"
        formDiv.style.display = "block"
    }

    showMusics.onclick = function(){
        addSongs.style.opacity = "0.5"
        showMusics.style.opacity = "1"
        aboutDiv.style.display = "block"
        formDiv.style.display = "none"
    }

}

// Tạo function khi click vào hình ảnh hiển thị thông tin bài hát
function renderSongById(songs){
    var inforDiv = document.querySelector('.infor');
    if (inforDiv) {
        var htmls = songs.map(function(song){
            return  `
                <div style="background-image: url('${song.img}');" class="infor-song">
                    <button onclick="outInfor()" style="float:right">Thoát</button>
                    <div class="top" style="display:inline-flex">
                        <div class="image-container">
                             <img src="${song.img}" alt="">
                        </div>
                        <div  style="margin-top:20px; margin-left:50px">
                            <h4 style="color:#fff" >${song.name}</h4>
                            <i style="color:#fff">${song.singer}</i><br/>
                        </div>
                    </div> <br/>
                    <audio style="display:none" class="audio-element" src="${song.audioSong}"></audio>
                    <div class="custom-audio-player">
                        <button class="play-pause">Play</button>
                        <input type="range" class="seek-bar" value="0">
                        <span class="current-time">0:00</span> / <span class="duration">${song.time}</span>
                    </div>
                </div>
            `;
        });
        inforDiv.innerHTML = htmls.join('');
        addPlayPauseEvent(); // Thêm sự kiện vào các nút Play/Pause

    } else {
        console.error("Không tìm thấy phần tử '.infor' trong tài liệu DOM.");
    }
}

function outInfor(){
    var header = document.querySelector('.header')
    var about = document.querySelector('.about')
    var inforDiv = document.querySelector('.infor');
    header.style.display = "block"
    about.style.display = "block"
    inforDiv.style.display = "none"

}

function inforSong(id){
    getSongs(function(songs){
        var inforsong = songs.filter(function(song){
            return song.id.includes(id);
        });
        renderSongById(inforsong);
    });

    var header = document.querySelector('.header')
    var about = document.querySelector('.about')
    var inforDiv = document.querySelector('.infor');
    header.style.display = "none"
    about.style.display = "none"
    inforDiv.style.display = "block"

}


function addPlayPauseEvent() {
    var playButtons = document.querySelectorAll('.play-pause');
    playButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var audio = this.parentElement.previousElementSibling; // Lấy phần tử audio tương ứng
            var seekBar = this.parentElement.querySelector('.seek-bar');
            var currentTimeSpan = this.parentElement.querySelector('.current-time');
            var durationSpan = this.parentElement.querySelector('.duration');

            // Cập nhật thời lượng của bài hát khi tải xong metadata
            audio.addEventListener('loadedmetadata', function () {
                seekBar.max = audio.duration;
                durationSpan.textContent = formatTime(audio.duration);
            });

            // Cập nhật thời gian hiện tại và vị trí của thanh trượt
            audio.addEventListener('timeupdate', function () {
                seekBar.value = audio.currentTime;
                currentTimeSpan.textContent = formatTime(audio.currentTime);
            });

            // Cho phép người dùng điều chỉnh thời gian phát bằng cách kéo thanh trượt
            seekBar.addEventListener('input', function () {
                audio.currentTime = seekBar.value;
            });

            if (audio.paused) {
                pauseAllAudios(); // Tạm dừng tất cả các audio khác
                audio.play();
                this.textContent = 'Pause';
            } else {
                audio.pause();
                this.textContent = 'Play';
            }
        });
    });
}

function pauseAllAudios() {
    var audios = document.querySelectorAll('.audio-element');
    audios.forEach(function (audio) {
        audio.pause();
        audio.nextElementSibling.querySelector('.play-pause').textContent = 'Play';
    });
}

// Hàm định dạng thời gian từ giây sang phút:giây
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}


