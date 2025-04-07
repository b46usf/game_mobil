export function checkOrientation() {
    const warning = document.getElementById('rotate-warning');
    const isPortrait = window.innerHeight > window.innerWidth;
  
    if (isPortrait) {
      warning.style.display = 'flex';
      // Optional: Pause game logic here
    } else {
      warning.style.display = 'none';
      // Optional: Resume game logic here
    }
  }
  
  export function listenOrientation() {
    checkOrientation(); // cek saat pertama kali
  
    // Dengarkan perubahan orientasi layar
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
  }  