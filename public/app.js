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

// A playVideo funkció frissítése az app.js-ben
function playVideo(fileId) {
  videoPlayer.src({
    src: `/api/video/${fileId}`,
    type: 'video/mp4'
  });

  // Előző feliratok eltávolítása
  const oldTracks = videoPlayer.remoteTextTracks();
  for (let i = oldTracks.length - 1; i >= 0; i--) {
    videoPlayer.removeRemoteTextTrack(oldTracks[i]);
  }

  // Új felirat hozzáadása
  videoPlayer.addRemoteTextTrack({
    kind: 'subtitles',
    src: `/api/subtitle/${fileId}`,
    srclang: 'hu',
    label: 'Magyar'
  }, true);

  videoPlayer.play();
}
// Az app.js végére
const fontSizeInput = document.getElementById('font-size');
const fontColorInput = document.getElementById('font-color');
const positionSelect = document.getElementById('position');

fontSizeInput.addEventListener('change', updateSubtitleStyle);
fontColorInput.addEventListener('change', updateSubtitleStyle);
positionSelect.addEventListener('change', updateSubtitleStyle);

function updateSubtitleStyle() {
  const style = `
    .video-js .vjs-text-track-display div {
      font-size: ${fontSizeInput.value}px !important;
      color: ${fontColorInput.value} !important;
      top: ${positionSelect.value === 'top' ? '5%' : 'auto'} !important;
      bottom: ${positionSelect.value === 'bottom' ? '5%' : 'auto'} !important;
    }
  `;

  let styleElement = document.getElementById('subtitle-style');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'subtitle-style';
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = style;
}


