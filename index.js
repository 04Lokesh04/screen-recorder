const video=document.querySelector("video")
const recorderBtncont=document.querySelector('.recorder-cont')
const recorderBtn=document.querySelector('.record-btn')
const captureBtnCont=document.querySelector('.capture-cont')
const captureBtn=document.querySelector('.capture-btn')
const timerdisplay=document.querySelector('.timer')
let filter=document.querySelector('.filter-layer')
let allfilters=document.querySelectorAll('.filter')
let transparentcolor="transparent"
constraints={
    audio:true,
    video:true
}
let recorder
let chunks
let recordflag=false
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream

    recorder= new MediaRecorder(stream)

    recorder.addEventListener("start", (e)=>{
        chunks=[]
    })

    recorder.addEventListener('dataavailable', (e)=>{
        chunks.push(e.data)
    })

    recorder.addEventListener('stop', (e)=>{
        let blob=new Blob(chunks, {type:"video/mp4"})

        let videoUrl= URL.createObjectURL(blob)

        let a=document.createElement('a')
        a.href=videoUrl
        a.download="recording.mp4"
        a.click()
    })

    recorderBtncont.addEventListener("click", (e)=>{
        if (!recorder) return

        recordflag=!recordflag

        if (recordflag){
            recorder.start()
            recorderBtn.classList.add("scale-recorder")
            startTimer()
        }
        else{
            recorder.stop()
            recorderBtn.classList.remove("scale-recorder")
            stopTimer()
        }
    })
    
})

let timerId

let counter=0

function startTimer(){
    timerdisplay.style.display='block'

    function displaytime(){
        let total=counter

        let hours=Number.parseInt(total/3600)
        total=total%3600
        let minutes=Number.parseInt(total/60)
        total=total%60
        let seconds=total

        hours= hours<10 ? `0${hours}`:hours
        minutes=minutes<10? `0${minutes}`:minutes
        seconds=seconds<10?`0${seconds}`:seconds

        timerdisplay.innerText=`${hours}:${minutes}:${seconds}`
        counter++
    }

    timerId=setInterval(displaytime, 1000)
}

function stopTimer(){
    clearInterval(timerId)
    timerdisplay.innerText=""
    timerdisplay.style.display="none"
}

captureBtnCont.addEventListener("click", (e)=>{
    captureBtn.classList.add("scale-capture")

    let canvas=document.createElement('canvas')
    let tool=canvas.getContext('2d')
    canvas.height=video.videoHeight
    canvas.width=video.videoWidth
    tool.drawImage(video, 0, 0, canvas.width, canvas.height)
    tool.fillStyle=transparentcolor
    tool.fillRect(0,0, canvas.width, canvas.height)
    let imageUrl=canvas.toDataURL('image/jpeg')

    let a=document.createElement('a')
    a.href=imageUrl
    a.download='snapshot.jpeg'
    a.click()

    setTimeout(()=>{
        captureBtn.classList.remove('scale-capture')
    }, 500)

})


allfilters.forEach((each)=>{
    each.addEventListener('click',(e)=>{

        transparentcolor=getComputedStyle(each).getPropertyValue('background-color')
        filter.style.backgroundColor=transparentcolor
    })
})