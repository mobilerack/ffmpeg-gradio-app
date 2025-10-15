document.addEventListener('DOMContentLoaded', () => {
  const videoList = document.getElementById('video-list');
  const videoPlayer = videojs('my-video');

  // Videók listázása
  fetch('/api/videos')
    .then(response => response.json())
    .then(videos => {
      videos.forEach(video => {
        const li = document.createElement('li');
        li.textContent = video.name;
        li.dataset.fileId = video.id;
        li.addEventListener('click', () => {
          playVideo(video.id);
        });
        videoList.appendChild(li);
      });
    });

  // Videó lejátszása
  function playVideo(fileId) {
    videoPlayer.src({
      src: `/api/video/${fileId}`,
      type: 'video/mp4'
    });
    videoPlayer.play();
  }
});
